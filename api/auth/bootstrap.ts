import { z } from 'zod'
import { withApi, ok, created, methodNotAllowed, readJson, HttpError, getClientIp } from '../_lib/http'
import { createUser, countUsers, getUserByEmail, type Role } from '../_lib/store'
import { audit } from '../_lib/audit'
import { PASSWORD_MIN_LENGTH } from '../_lib/config'

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(128),
  role: z.enum(['super_admin', 'admin']).optional(),
})

function envBootstrapAccount(): { name: string; email: string; password: string } | null {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD
  if (!email || !password) return null
  if (!schema.safeParse({ name: process.env.BOOTSTRAP_ADMIN_NAME || 'Super Admin', email, password }).success) {
    console.error('BOOTSTRAP_ADMIN_* env vars are invalid — ignoring them')
    return null
  }
  return { name: process.env.BOOTSTRAP_ADMIN_NAME || 'Super Admin', email, password }
}

async function ensureEnvBootstrap(ip: string): Promise<boolean> {
  if ((await countUsers()) > 0) return false
  const account = envBootstrapAccount()
  if (!account) return false
  const existing = await getUserByEmail(account.email)
  if (existing) return false
  await createUser({ ...account, role: 'super_admin' })
  await audit({ actor: account.email, action: 'auth.bootstrap', detail: 'Created first admin from environment', ip })
  return true
}

export default withApi(async (req: Request) => {
  const ip = getClientIp(req)

  if (req.method === 'GET') {
    await ensureEnvBootstrap(ip)
    const exists = (await countUsers()) > 0
    return ok({
      needsBootstrap: !exists,
      passwordPolicy: { minLength: PASSWORD_MIN_LENGTH },
    })
  }

  if (req.method !== 'POST') return methodNotAllowed(['GET', 'POST'])

  const body = await readJson(req)
  const parsed = schema.safeParse(body)
  if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

  if ((await countUsers()) > 0) throw new HttpError(409, 'Admin already exists — bootstrap is closed')

  const existing = await getUserByEmail(parsed.data.email)
  if (existing) throw new HttpError(409, 'An admin with this email already exists')

  const role: Role = parsed.data.role ?? 'super_admin'
  const user = await createUser({ ...parsed.data, role })
  await audit({ actor: user.email, action: 'auth.bootstrap', detail: 'Created first admin', ip })

  return created({ user })
})
