import { withApi, ok, methodNotAllowed, HttpError } from '../_lib/http'
import { requireAuth } from '../_lib/auth'
import { listEnquiries, deleteEnquiry } from '../_lib/store'
import { audit } from '../_lib/audit'
import { getClientIp, readJson } from '../_lib/http'
import { z } from 'zod'

const deleteSchema = z.object({
  id: z.string().min(1).max(64),
})

export default withApi(async (req: Request) => {
  const ip = getClientIp(req)
  const { user } = await requireAuth(req, 'admin')

  if (req.method === 'GET') {
    const limit = Number(new URL(req.url).searchParams.get('limit') ?? 100)
    const enquiries = await listEnquiries(Math.min(Math.max(limit, 1), 500))
    return ok({ enquiries })
  }

  if (req.method === 'DELETE') {
    const body = await readJson(req)
    const parsed = deleteSchema.safeParse(body)
    if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())
    const removed = await deleteEnquiry(parsed.data.id)
    if (!removed) throw new HttpError(404, 'Enquiry not found')
    await audit({ actor: user.email, action: 'enquiries.delete', detail: parsed.data.id, ip })
    return ok({ success: true })
  }

  return methodNotAllowed(['GET', 'DELETE'])
})
