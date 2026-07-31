import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { getUserById, updateUser } from '../_lib/store'
import { signAccessToken, signRefreshToken, verifyPending2FA } from '../_lib/jwt'
import { verifyTotp } from '../_lib/totp'
import { audit } from '../_lib/audit'
import { kv } from '../_lib/redis'
import { checkLoginRate, newSessionId } from '../_lib/ratelimit'
import { REFRESH_TOKEN_TTL_SEC } from '../_lib/config'

const schema = z.object({
  pendingToken: z.string().min(1).max(512),
  code: z.string().min(6).max(6),
})

export default withApi(async (req: Request) => {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const rate = await checkLoginRate(ip)
  if (!rate.ok) throw new HttpError(429, 'Too many attempts. Try again later.', { retryAfterSec: rate.retryAfterSec })

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
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
})
