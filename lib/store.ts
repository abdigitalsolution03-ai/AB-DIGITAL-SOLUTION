import { kv } from './redis'
import { randomToken } from './crypto'
import { hashPassword } from './crypto'
import { ENQUIRIES_MAX } from './config'

export type Role = 'super_admin' | 'admin'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  passwordHash: string
  totpSecret?: string
  totpEnabled: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface PublicUser {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  totpEnabled: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

const USERS_KEY = 'users:all'
const ENQUIRIES_KEY = 'enquiries:list'

function toPublic(user: AdminUser): PublicUser {
  const { passwordHash, totpSecret, ...pub } = user
  return pub
}

export async function listUsers(): Promise<AdminUser[]> {
  const raw = await kv.get(USERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as AdminUser[]
  } catch {
    return []
  }
}

async function saveUsers(users: AdminUser[]): Promise<void> {
  await kv.set(USERS_KEY, JSON.stringify(users))
}

export async function getUserByEmail(email: string): Promise<AdminUser | undefined> {
  const users = await listUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export async function getUserById(id: string): Promise<AdminUser | undefined> {
  const users = await listUsers()
  return users.find((u) => u.id === id)
}

export async function countUsers(): Promise<number> {
  return (await listUsers()).length
}

export async function createUser(input: {
  name: string
  email: string
  password: string
  role?: Role
}): Promise<PublicUser> {
  const users = await listUsers()
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('An admin with this email already exists')
  }
  const user: AdminUser = {
    id: 'usr_' + randomToken(16),
    email: input.email.toLowerCase(),
    name: input.name,
    role: input.role ?? 'admin',
    isActive: true,
    passwordHash: await hashPassword(input.password),
    totpEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  users.push(user)
  await saveUsers(users)
  return toPublic(user)
}

export async function updateUser(id: string, patch: Partial<Pick<AdminUser, 'name' | 'role' | 'isActive' | 'totpEnabled' | 'totpSecret' | 'lastLoginAt' | 'passwordHash'>>): Promise<PublicUser | undefined> {
  const users = await listUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return undefined
  users[idx] = { ...users[idx], ...patch, updatedAt: new Date().toISOString() }
  await saveUsers(users)
  return toPublic(users[idx])
}

export async function deleteUser(id: string): Promise<boolean> {
  const users = await listUsers()
  const next = users.filter((u) => u.id !== id)
  if (next.length === users.length) return false
  await saveUsers(next)
  return true
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  service?: string
  message: string
  createdAt: string
  ip: string
}

export async function addEnquiry(input: Omit<Enquiry, 'id' | 'createdAt'>): Promise<Enquiry> {
  const enquiry: Enquiry = {
    ...input,
    id: 'enq_' + randomToken(12),
    createdAt: new Date().toISOString(),
  }
  await kv.lpush(ENQUIRIES_KEY, JSON.stringify(enquiry))
  await kv.ltrim(ENQUIRIES_KEY, 0, ENQUIRIES_MAX - 1)
  return enquiry
}

export async function listEnquiries(limit = 100): Promise<Enquiry[]> {
  const raw = await kv.lrange(ENQUIRIES_KEY, 0, limit - 1)
  return raw
    .map((line) => {
      try {
        return JSON.parse(line) as Enquiry
      } catch {
        return null
      }
    })
    .filter((e): e is Enquiry => e !== null)
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const all = await listEnquiries(ENQUIRIES_MAX)
  const next = all.filter((e) => e.id !== id)
  if (next.length === all.length) return false
  await kv.del(ENQUIRIES_KEY)
  for (const e of next) {
    await kv.lpush(ENQUIRIES_KEY, JSON.stringify(e))
  }
  return true
}
