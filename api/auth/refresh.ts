import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { getUserById } from '../_lib/store'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../_lib/jwt'
import { audit } from '../_lib/audit'
import { kv } from '../_lib/redis'
import { newSessionId } from '../_lib/ratelimit'
import { REFRESH_TOKEN_TTL_SEC } from '../_lib/config'

const schema = z.object({
  refreshToken: z.string().min(1).max(1024),
})

export default withApi(async (req: Request) => {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
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
})
