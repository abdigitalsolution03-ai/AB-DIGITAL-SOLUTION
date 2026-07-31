import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { requireAuth, revokeSession } from '../_lib/auth'
import { audit } from '../_lib/audit'
import { kv } from '../_lib/redis'
import { verifyRefreshToken } from '../_lib/jwt'
import { REFRESH_TOKEN_TTL_SEC } from '../_lib/config'

const schema = z.object({
  refreshToken: z.string().min(1).max(1024).optional(),
})

export default withApi(async (req: Request) => {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const { user, sessionId } = await requireAuth(req)
  await revokeSession(sessionId, REFRESH_TOKEN_TTL_SEC)
  await kv.del(`sess:${sessionId}`)

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
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
})
