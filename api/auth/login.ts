import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { getUserByEmail, updateUser } from '../_lib/store'
import { verifyPassword } from '../_lib/crypto'
import { signAccessToken, signRefreshToken, signPending2FA } from '../_lib/jwt'
import { verifyTotp } from '../_lib/totp'
import { audit } from '../_lib/audit'
import { kv } from '../_lib/redis'
import { checkLoginRate, getLockoutRemaining, recordFailedLogin, clearFailedLogins, newSessionId } from '../_lib/ratelimit'
import { REFRESH_TOKEN_TTL_SEC } from '../_lib/config'

const schema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
})

export default withApi(async (req: Request) => {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const rate = await checkLoginRate(ip)
  if (!rate.ok) throw new HttpError(429, 'Too many login attempts. Try again later.', { retryAfterSec: rate.retryAfterSec })

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  const { email, password } = parsed.data

  const lockout = await getLockoutRemaining(email)
  if (lockout > 0) {
    await audit({ actor: email, action: 'auth.login_blocked', detail: 'Account locked after repeated failures', ip })
    throw new HttpError(423, 'Account temporarily locked due to failed attempts.', { retryAfterSec: lockout })
  }

  const user = await getUserByEmail(email)
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    const { locked, retryAfterSec } = await recordFailedLogin(email)
    await audit({
      actor: email,
      action: 'auth.login_failed',
      detail: locked ? `Locked out (${retryAfterSec}s)` : 'Invalid credentials',
      ip,
    })
    if (locked) throw new HttpError(423, 'Account temporarily locked due to failed attempts.', { retryAfterSec })
    throw new HttpError(401, 'Invalid email or password')
  }

  if (!user.isActive) {
    await audit({ actor: email, action: 'auth.login_blocked', detail: 'Deactivated account attempted login', ip })
    throw new HttpError(403, 'Account is deactivated. Contact administrator.')
  }

  await clearFailedLogins(email)
  await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
  await audit({ actor: user.email, action: 'auth.login', detail: user.totpEnabled ? 'Password OK — 2FA required' : 'Logged in', ip })

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
})
