import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { requireAuth, revokeSession } from '../_lib/auth'
import { updateUser } from '../_lib/store'
import { hashPassword, verifyPassword } from '../_lib/crypto'
import { audit } from '../_lib/audit'
import { kv } from '../_lib/redis'
import { REFRESH_TOKEN_TTL_SEC, PASSWORD_MIN_LENGTH } from '../_lib/config'

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).max(128),
})

export default withApi(async (req: Request) => {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const { user, sessionId } = await requireAuth(req)

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
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
})
