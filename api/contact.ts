import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../lib/http'
import { addEnquiry } from '../lib/store'
import { rateLimit, ipKey } from '../lib/ratelimit'
import { CONTACT_RATE_LIMIT } from '../lib/config'
import { validateEmail, validatePhone, sanitize } from '../lib/sanitize'

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(20).optional(),
  service: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10).max(4000),
})

export default withApi(async (req: Request) => {
  if (req.method !== 'POST') return methodNotAllowed(['POST'])
  const ip = getClientIp(req)

  const rate = await rateLimit(ipKey(ip, 'contact'), CONTACT_RATE_LIMIT.limit, CONTACT_RATE_LIMIT.windowSec)
  if (!rate.ok) {
    throw new HttpError(429, 'Too many messages. Please try again later.', { retryAfterSec: rate.retryAfterSec })
  }

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  const data = parsed.data
  if (!validateEmail(data.email)) throw new HttpError(400, 'Invalid email address')
  if (data.phone && !validatePhone(data.phone)) throw new HttpError(400, 'Invalid phone number')

  const enquiry = await addEnquiry({
    name: sanitize(data.name).slice(0, 100),
    email: sanitize(data.email).toLowerCase().slice(0, 254),
    phone: data.phone ? sanitize(data.phone).slice(0, 20) : undefined,
    service: data.service ? sanitize(data.service).slice(0, 100) : undefined,
    message: sanitize(data.message).slice(0, 4000),
    ip,
  })

  return ok({ success: true, id: enquiry.id })
})
