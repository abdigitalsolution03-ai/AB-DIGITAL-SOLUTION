import { z } from 'zod'
import { withApi, ok, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { requireAuth } from '../_lib/auth'
import { updateUser } from '../_lib/store'
import { generateTotpSecret, verifyTotp, otpauthUri } from '../_lib/totp'
import { audit } from '../_lib/audit'
import { appUrl } from '../_lib/config'

const enableSchema = z.object({
  code: z.string().min(6).max(6),
})

const disableSchema = z.object({
  password: z.string().min(1).max(128),
})

export default withApi(async (req: Request) => {
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
    const parsed = enableSchema.safeParse(body)
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
    const parsed = disableSchema.safeParse(body)
    if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())
    await updateUser(user.id, { totpEnabled: false, totpSecret: undefined })
    await audit({ actor: user.email, action: 'auth.2fa_disabled', detail: '2FA disabled', ip })
    return ok({ enabled: false })
  }

  return methodNotAllowed(['GET', 'POST', 'DELETE'])
})
