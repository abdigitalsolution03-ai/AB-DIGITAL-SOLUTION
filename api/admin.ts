import { z } from 'zod'
import { withApi, ok, created, json, methodNotAllowed, readJson, HttpError, getClientIp } from '../lib/http'
import { requireAuth } from '../lib/auth'
import { listUsers, createUser, updateUser, deleteUser, getUserById, listEnquiries, deleteEnquiry, type Role } from '../lib/store'
import { audit, getAuditLog } from '../lib/audit'
import { PASSWORD_MIN_LENGTH } from '../lib/config'

const createSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(128),
  role: z.enum(['super_admin', 'admin']),
})

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  role: z.enum(['super_admin', 'admin']).optional(),
  isActive: z.boolean().optional(),
})

const deleteSchema = z.object({
  id: z.string().min(1).max(64),
})

function toPublicUser(u: {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  totpEnabled: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    totpEnabled: u.totpEnabled,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    lastLoginAt: u.lastLoginAt,
  }
}

async function users(req: Request): Promise<Response> {
  const ip = getClientIp(req)
  const { user: actor } = await requireAuth(req, 'super_admin')

  if (req.method === 'GET') {
    const users = await listUsers()
    return ok({ users: users.map((u) => toPublicUser(u)) })
  }

  if (req.method === 'POST') {
    const body = await readJson(req)
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())
    try {
      const user = await createUser(parsed.data)
      await audit({ actor: actor.email, action: 'users.create', detail: `${user.email} (${user.role})`, ip })
      return created({ user })
    } catch (err) {
      throw new HttpError(409, err instanceof Error ? err.message : 'Could not create user')
    }
  }

  if (req.method === 'PATCH') {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    if (!id) throw new HttpError(400, 'Missing user id')
    const body = await readJson(req)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) throw new HttpError(400, 'Invalid input', parsed.error.flatten())

    const target = await getUserById(id)
    if (!target) throw new HttpError(404, 'User not found')

    if (target.role === 'super_admin' && (parsed.data.role === 'admin' || parsed.data.isActive === false)) {
      const superAdmins = (await listUsers()).filter((u) => u.role === 'super_admin')
      if (superAdmins.length <= 1) {
        throw new HttpError(400, 'Cannot demote or deactivate the last super admin')
      }
    }

    const updated = await updateUser(id, parsed.data)
    await audit({ actor: actor.email, action: 'users.update', detail: `${target.email}: ${JSON.stringify(parsed.data)}`, ip })
    return ok({ user: updated ? toPublicUser(updated) : null })
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    if (!id) throw new HttpError(400, 'Missing user id')

    const target = await getUserById(id)
    if (!target) throw new HttpError(404, 'User not found')
    if (target.id === actor.id) throw new HttpError(400, 'You cannot delete your own account')
    if (target.role === 'super_admin') {
      const superAdmins = (await listUsers()).filter((u) => u.role === 'super_admin')
      if (superAdmins.length <= 1) {
        throw new HttpError(400, 'Cannot delete the last super admin')
      }
    }

    await deleteUser(id)
    await audit({ actor: actor.email, action: 'users.delete', detail: target.email, ip })
    return ok({ success: true })
  }

  return methodNotAllowed(['GET', 'POST', 'PATCH', 'DELETE'])
}

async function enquiries(req: Request): Promise<Response> {
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
}

async function auditLog(req: Request): Promise<Response> {
  if (req.method !== 'GET') return methodNotAllowed(['GET'])
  const { user } = await requireAuth(req, 'super_admin')

  const limit = Number(new URL(req.url).searchParams.get('limit') ?? 200)
  const entries = await getAuditLog(Math.min(Math.max(limit, 1), 500))

  return ok({ entries })
}

const ADMIN_ROUTES = ['users', 'enquiries', 'audit']

const handlers: Record<string, (req: Request) => Promise<Response> | Response> = {
  users,
  enquiries,
  audit: auditLog,
}

function routeName(url: string): string | null {
  const parts = new URL(url, 'http://localhost').pathname.split('/').filter(Boolean)
  for (let i = parts.length - 1; i >= 0; i--) {
    if (ADMIN_ROUTES.includes(parts[i])) return parts[i]
  }
  return null
}

export default withApi(async (req: Request): Promise<Response> => {
  const route = routeName(req.url)
  const handler = route ? handlers[route] : undefined
  if (!handler) return json(404, { error: 'Not found' })
  return handler(req)
})
