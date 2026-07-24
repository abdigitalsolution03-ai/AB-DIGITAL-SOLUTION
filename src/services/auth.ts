import { store } from './store'

export type Role = 'super_admin' | 'admin'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Session {
  userId: string
  email: string
  name: string
  role: Role
  token: string
  expiresAt: string
}

const SESSION_KEY = 'ab_crm_session'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

function getUsers(): User[] {
  return store.getCollection<User>('users')
}

function saveUsers(users: User[]): void {
  localStorage.setItem('ab_users', JSON.stringify(users))
}

function getDefaultUsers(): User[] {
  return [
    {
      id: 'usr_001',
      email: 'admin@abdigitalsolution.com',
      password: 'Admin@123456',
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ]
}

export function initializeUsers(): void {
  if (!store.hasCollection('users')) {
    saveUsers(getDefaultUsers())
  }
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { success: false, error: 'Invalid email or password' }
  if (!user.isActive) return { success: false, error: 'Account is deactivated. Contact administrator.' }
  if (user.password !== password) return { success: false, error: 'Invalid email or password' }

  user.lastLogin = new Date().toISOString()
  saveUsers(users.map(u => u.id === user.id ? user : u))

  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { success: true, user }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): Session | null {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null
    const session: Session = JSON.parse(data)
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function getCurrentUser(): User | undefined {
  const session = getSession()
  if (!session) return undefined
  return getUsers().find(u => u.id === session.userId)
}

export function isSuperAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'super_admin'
}
