import { withApi, ok, methodNotAllowed, HttpError } from '../_lib/http'
import { requireAuth } from '../_lib/auth'
import { getAuditLog } from '../_lib/audit'

export default withApi(async (req: Request) => {
  if (req.method !== 'GET') return methodNotAllowed(['GET'])
  const { user } = await requireAuth(req, 'super_admin')

  const limit = Number(new URL(req.url).searchParams.get('limit') ?? 200)
  const entries = await getAuditLog(Math.min(Math.max(limit, 1), 500))

  return ok({ entries })
})
