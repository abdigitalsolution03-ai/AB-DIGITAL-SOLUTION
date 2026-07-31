import { withApi, ok, methodNotAllowed, HttpError } from '../_lib/http'
import { requireAuth } from '../_lib/auth'
import { audit } from '../_lib/audit'
import { getClientIp } from '../_lib/http'

export default withApi(async (req: Request) => {
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
})
