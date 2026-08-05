import { z } from 'zod'
import { createHash, timingSafeEqual } from 'node:crypto'
import { withApi, ok, created, json, methodNotAllowed, readJson, HttpError, getClientIp } from '../lib/http.js'
import { createUser, countUsers, getUserByEmail, getUserById, updateUser, type Role } from '../lib/store.js'
import { audit } from '../lib/audit.js'
import { PASSWORD_MIN_LENGTH, REFRESH_TOKEN_TTL_SEC, appUrl, masterAccessCode } from '../lib/config.js'
import { verifyPassword, hashPassword } from '../lib/crypto.js'
import { signAccessToken, signRefreshToken, signPending2FA, verifyPending2FA, verifyRefreshToken } from '../lib/jwt.js'
import { verifyTotp, generateTotpSecret, otpauthUri } from '../lib/totp.js'
import { kv } from '../lib/redis.js'
import { checkLoginRate, getLockoutRemaining, recordFailedLogin, clearFailedLogins, newSessionId } from '../lib/ratelimit.js'
import { requireAuth, revokeSession } from '../lib/auth.js'
import { prodFallbackEnv } from '../lib/prod-env.js'
import { isProduction } from '../lib/config.js'

const bootstrapSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(128),
  role: z.enum(['super_admin', 'admin']).optional(),
})

const loginSchema = z
  .object({
    email: z.string().trim().email().max(254).optional(),
    password: z.string().min(1).max(128).optional(),
    masterCode: z.string().min(1).max(128).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.password && !data.masterCode) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Password or access code is required' })
    }
  })

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

const verify2faSchema = z.object({
  pendingToken: z.string().min(1).max(512),
  code: z.string().min(6).max(6),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(1).max(1024),
})

const logoutSchema = z.object({
  refreshToken: z.string().min(1).max(1024).optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).max(128),
})

const totpEnableSchema = z.object({
  code: z.string().min(6).max(6),
})

const totpDisableSchema = z.object({
  password: z.string().min(1).max(128),
})

function envBootstrapAccount(): { name: string; email: string; password: string } | null {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL ?? (isProduction ? prodFallbackEnv.BOOTSTRAP_ADMIN_EMAIL : undefined)
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? (isProduction ? prodFallbackEnv.BOOTSTRAP_ADMIN_PASSWORD : undefined)
  if (!email || !password) return null
  const name = process.env.BOOTSTRAP_ADMIN_NAME ?? (isProduction ? prodFallbackEnv.BOOTSTRAP_ADMIN_NAME : undefined) ?? 'Super Admin'
  if (!bootstrapSchema.safeParse({ name, email, password }).success) {
    console.error('BOOTSTRAP_ADMIN_* env vars are invalid — ignoring them')
    return null
  }
  return { name, email, password }
}

async function ensureEnvBootstrap(ip: string): Promise<boolean> {
  if ((await countUsers()) > 0) return false
  const account = envBootstrapAccount()
  if (!account) return false
  const existing = await getUserByEmail(account.email)
  if (existing) return false
  await createUser({ ...account, role: 'super_admin' })
  await audit({ actor: account.email, action: 'auth.bootstrap', detail: 'Created first admin from environment', ip })
  return true
}

async function bootstrap(req: Request): Promise<Response> {
  const ip = getClientIp(req)

  if (req.method === 'GET') {
    await ensureEnvBootstrap(ip)
    const exists = (await countUsers()) > 0
    return ok({
      needsBootstrap: !exists,
      passwordPolicy: { minLength: PASSWORD_MIN_LENGTH },
    })
  }

  if (req.method !== 'POST') return methodNotAllowed(['GET', 'POST'])

  const body = await readJson(req)
  const parsed = bootstrapSchema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  if ((await countUsers()) > 0) throw new HttpError(409, 'Admin already exists — bootstrap is closed')

  const existing = await getUserByEmail(parsed.data.email)
  if (existing) throw new HttpError(409, 'An admin with this email already exists')

  const role: Role = parsed.data.role ?? 'super_admin'
  const user = await createUser({ ...parsed.data, role })
  await audit({ actor: user.email, action: 'auth.bootstrap', detail: 'Created first admin', ip })

  return created({ user })
}

async function login(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const rate = await checkLoginRate(ip)
  if (!rate.ok) throw new HttpError(429, 'Too many login attempts. Try again later.', { retryAfterSec: rate.retryAfterSec })

  const body = await readJson(req)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  const { email, password, masterCode } = parsed.data

  const masterCodeValid = masterCode !== undefined && masterAccessCode !== '' && safeEqual(masterCode, masterAccessCode)
  if (masterCodeValid) await ensureEnvBootstrap(ip)

  const resolvedEmail = email ?? envBootstrapAccount()?.email
  if (!resolvedEmail) throw new HttpError(400, 'Invalid input')

  const lockout = await getLockoutRemaining(resolvedEmail)
  if (lockout > 0) {
    await audit({ actor: resolvedEmail, action: 'auth.login_blocked', detail: 'Account locked after repeated failures', ip })
    throw new HttpError(423, 'Account temporarily locked due to failed attempts.', { retryAfterSec: lockout })
  }

  const user = await getUserByEmail(resolvedEmail)

  let authenticated = false
  let authMethod: 'password' | 'master_code' = 'password'
  if (user && password && (await verifyPassword(password, user.passwordHash))) {
    authenticated = true
  }
  if (!authenticated && masterCodeValid && user?.role === 'super_admin') {
    authenticated = true
    authMethod = 'master_code'
  }

  if (!user || !authenticated) {
    const { locked, retryAfterSec } = await recordFailedLogin(resolvedEmail)
    await audit({
      actor: resolvedEmail,
      action: 'auth.login_failed',
      detail: locked ? `Locked out (${retryAfterSec}s)` : authMethod === 'master_code' ? 'Invalid access code' : 'Invalid credentials',
      ip,
    })
    if (locked) throw new HttpError(423, 'Account temporarily locked due to failed attempts.', { retryAfterSec })
    throw new HttpError(401, 'Invalid email or password')
  }

  if (!user.isActive) {
    await audit({ actor: resolvedEmail, action: 'auth.login_blocked', detail: 'Deactivated account attempted login', ip })
    throw new HttpError(403, 'Account is deactivated. Contact administrator.')
  }

  await clearFailedLogins(resolvedEmail)
  await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
  await audit({
    actor: user.email,
    action: 'auth.login',
    detail: user.totpEnabled ? 'Password OK — 2FA required' : authMethod === 'master_code' ? 'Logged in via master access code' : 'Logged in',
    ip,
  })

  if (user.totpEnabled) {
    return ok({
      requires2FA: true,
      pendingToken: await signPending2FA(user.id),
    })
  }

  const sessionId = newSessionId()
  await kv.set(`sess:${sessionId}`, user.id, { ex: REFRESH_TOKEN_TTL_SEC })
  return ok({
    accessToken: await signAccessToken(user.id, user.role, sessionId),
    refreshToken: await signRefreshToken(user.id, sessionId),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, totpEnabled: false },
  })
}

async function verify2fa(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const rate = await checkLoginRate(ip)
  if (!rate.ok) throw new HttpError(429, 'Too many attempts. Try again later.', { retryAfterSec: rate.retryAfterSec })

  const body = await readJson(req)
  const parsed = verify2faSchema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  let userId: string
  try {
    userId = await verifyPending2FA(parsed.data.pendingToken)
  } catch {
    throw new HttpError(401, 'Expired or invalid session. Please log in again.')
  }

  const user = await getUserById(userId)
  if (!user) throw new HttpError(401, 'Account no longer exists')
  if (!user.isActive) throw new HttpError(403, 'Account is deactivated')
  if (!user.totpSecret) throw new HttpError(400, '2FA is not enabled for this account')

  if (!verifyTotp(user.totpSecret, parsed.data.code)) {
    await audit({ actor: user.email, action: 'auth.2fa_failed', detail: 'Invalid TOTP code', ip })
    throw new HttpError(401, 'Invalid verification code')
  }

  const sessionId = newSessionId()
  await kv.set(`sess:${sessionId}`, user.id, { ex: REFRESH_TOKEN_TTL_SEC })
  await audit({ actor: user.email, action: 'auth.login', detail: 'Logged in (2FA verified)', ip })

  return ok({
    accessToken: await signAccessToken(user.id, user.role, sessionId),
    refreshToken: await signRefreshToken(user.id, sessionId),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, totpEnabled: true },
  })
}

async function refresh(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const body = await readJson(req)
  const parsed = refreshSchema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  let claims
  try {
    claims = await verifyRefreshToken(parsed.data.refreshToken)
  } catch {
    throw new HttpError(401, 'Invalid or expired refresh token')
  }

  if (await kv.get(`sess:revoked:${claims.jti}`)) {
    await audit({ actor: 'unknown', action: 'auth.refresh_blocked', detail: 'Replay of revoked refresh token', ip })
    throw new HttpError(401, 'Session has been revoked')
  }

  const sessionOwner = await kv.get(`sess:${claims.jti}`)
  if (sessionOwner !== claims.sub) {
    await audit({ actor: claims.sub, action: 'auth.refresh_blocked', detail: 'Refresh token mismatch', ip })
    throw new HttpError(401, 'Invalid session')
  }

  const user = await getUserById(claims.sub)
  if (!user) throw new HttpError(401, 'Account no longer exists')
  if (!user.isActive) throw new HttpError(403, 'Account is deactivated')

  await kv.del(`sess:${claims.jti}`)
  await kv.set(`sess:revoked:${claims.jti}`, '1', { ex: REFRESH_TOKEN_TTL_SEC })

  const nextSessionId = newSessionId()
  await kv.set(`sess:${nextSessionId}`, user.id, { ex: REFRESH_TOKEN_TTL_SEC })

  return ok({
    accessToken: await signAccessToken(user.id, user.role, nextSessionId),
    refreshToken: await signRefreshToken(user.id, nextSessionId),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, totpEnabled: user.totpEnabled },
  })
}

async function logout(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const { user, sessionId } = await requireAuth(req)
  await revokeSession(sessionId, REFRESH_TOKEN_TTL_SEC)
  await kv.del(`sess:${sessionId}`)

  const body = await readJson(req)
  const parsed = logoutSchema.safeParse(body)
  if (parsed.success && parsed.data.refreshToken) {
    try {
      const claims = await verifyRefreshToken(parsed.data.refreshToken)
      if (claims.sub === user.id) {
        await revokeSession(claims.jti, REFRESH_TOKEN_TTL_SEC)
        await kv.del(`sess:${claims.jti}`)
      }
    } catch {
      // ignore invalid refresh token — access token already revoked
    }
  }

  await audit({ actor: user.email, action: 'auth.logout', detail: 'Session ended', ip })
  return ok({ success: true })
}

async function me(req: Request): Promise<Response> {
  if (req.method !== 'GET') return methodNotAllowed(['GET'])
  const ip = getClientIp(req)
  const { user } = await requireAuth(req)

  return ok({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      totpEnabled: user.totpEnabled,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    },
    passwordPolicy: { minLength: 8 },
  })
}

async function changePassword(req: Request): Promise<Response> {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const { user, sessionId } = await requireAuth(req)

  const body = await readJson(req)
  const parsed = changePasswordSchema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  if (parsed.data.newPassword === parsed.data.currentPassword) {
    throw new HttpError(400, 'New password must be different from the current password')
  }

  if (!(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    await audit({ actor: user.email, action: 'auth.change_password_failed', detail: 'Incorrect current password', ip })
    throw new HttpError(401, 'Current password is incorrect')
  }

  await updateUser(user.id, { passwordHash: await hashPassword(parsed.data.newPassword) })

  await revokeSession(sessionId, REFRESH_TOKEN_TTL_SEC)
  await kv.del(`sess:${sessionId}`)
  await audit({ actor: user.email, action: 'auth.password_changed', detail: 'Password changed; all sessions revoked', ip })

  return ok({ success: true, message: 'Password changed. Please log in again with your new password.' })
}

async function totp(req: Request): Promise<Response> {
  const ip = getClientIp(req)
  const { user } = await requireAuth(req)

  if (req.method === 'GET') {
    if (user.totpEnabled) {
      return ok({ enabled: true })
    }
    const secret = generateTotpSecret()
    const uri = otpauthUri(secret, user.email)
    await updateUser(user.id, { totpSecret: secret, totpEnabled: false })
    return ok({
      enabled: false,
      secret,
      otpauthUri: uri,
      setupUrl: `https://chart.googleapis.com/chart?chs=220x220&chld=M|0&cht=qr&chl=${encodeURIComponent(uri)}`,
      appUrl,
    })
  }

  if (req.method === 'POST') {
    if (!user.totpSecret) throw new HttpError(400, 'No pending 2FA setup found. Request a new code first.')
    const body = await readJson(req)
    const parsed = totpEnableSchema.safeParse(body)
    if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())
    if (!verifyTotp(user.totpSecret, parsed.data.code)) {
      throw new HttpError(401, 'Invalid verification code')
    }
    await updateUser(user.id, { totpEnabled: true })
    await audit({ actor: user.email, action: 'auth.2fa_enabled', ip })
    return ok({ enabled: true })
  }

  if (req.method === 'DELETE') {
    const body = await readJson(req)
    const parsed = totpDisableSchema.safeParse(body)
    if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())
    await updateUser(user.id, { totpEnabled: false, totpSecret: undefined })
    await audit({ actor: user.email, action: 'auth.2fa_disabled', detail: '2FA disabled', ip })
    return ok({ enabled: false })
  }

  return methodNotAllowed(['GET', 'POST', 'DELETE'])
}

const AUTH_ROUTES = ['bootstrap', 'login', 'verify-2fa', 'refresh', 'logout', 'me', 'change-password', 'totp']

const handlers: Record<string, (req: Request) => Promise<Response> | Response> = {
  bootstrap,
  login,
  'verify-2fa': verify2fa,
  refresh,
  logout,
  me,
  'change-password': changePassword,
  totp,
}

function routeName(url: string): string | null {
  const parts = new URL(url, 'http://localhost').pathname.split('/').filter(Boolean)
  for (let i = parts.length - 1; i >= 0; i--) {
    if (AUTH_ROUTES.includes(parts[i])) return parts[i]
  }
  return null
}

export default withApi(async (req: Request): Promise<Response> => {
  const route = routeName(req.url)
  const handler = route ? handlers[route] : undefined
  if (!handler) return json(404, { error: 'Not found' })
  return handler(req)
})
