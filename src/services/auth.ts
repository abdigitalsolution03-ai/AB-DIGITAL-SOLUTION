import { store } from './store'

export type Role = 'super_admin' | 'admin' | 'editor' | 'marketing'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: Role
  phone?: string
  avatar?: string
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

export interface AdminUser extends User {
  isActive: boolean
}

export interface AuditLog {
  id: string
  action: string
  resource: string
  details: string
  user: string
  userName: string
  timestamp: string
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
      phone: '+91 98765 43210',
      isActive: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ]
}

export function initializeUsers(): void {
  if (!store.hasCollection('users')) {
    saveUsers(getDefaultUsers())
    addAuditLog('System', 'System', 'Users initialized with default accounts')
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
  addAuditLog(user.email, user.name, `Login successful`)

  return { success: true, user }
}

export function logout(): void {
  const session = getSession()
  if (session) addAuditLog(session.email, session.name, 'Logout')
  localStorage.removeItem(SESSION_KEY)
}

export function checkFirstLogin(): boolean {
  const session = getSession()
  if (!session) return false
  const user = getCurrentUser()
  return user?.lastLogin === undefined || user?.lastLogin === null
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

export function hasRole(...roles: Role[]): boolean {
  const session = getSession()
  if (!session) return false
  return roles.includes(session.role)
}

export function getUsersList(): User[] {
  return getUsers()
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id)
}

export function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): { success: boolean; error?: string } {
  if (!hasRole('super_admin')) return { success: false, error: 'Unauthorized' }
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'Email already exists' }
  }
  const now = new Date().toISOString()
  const newUser: User = {
    ...data,
    id: store.generateId(),
    createdAt: now,
    updatedAt: now,
  }
  saveUsers([...users, newUser])
  const session = getSession()
  addAuditLog(session?.email || 'unknown', session?.name || 'Unknown', `Created user: ${data.email}`)
  return { success: true }
}

export function updateUser(id: string, data: Partial<User>): { success: boolean; error?: string } {
  if (!hasRole('super_admin')) return { success: false, error: 'Unauthorized' }
  const users = getUsers()
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return { success: false, error: 'User not found' }
  users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() }
  saveUsers(users)
  return { success: true }
}

export function deleteUser(id: string): { success: boolean; error?: string } {
  if (!hasRole('super_admin')) return { success: false, error: 'Unauthorized' }
  const users = getUsers()
  const user = users.find(u => u.id === id)
  if (!user) return { success: false, error: 'User not found' }
  if (user.role === 'super_admin') return { success: false, error: 'Cannot delete super admin' }
  saveUsers(users.filter(u => u.id !== id))
  return { success: true }
}

export function register(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role' | 'isActive'> & { role?: Role }): { success: boolean; error?: string } {
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'Email already exists' }
  }
  const now = new Date().toISOString()
  const newUser: User = {
    ...data,
    role: data.role || 'editor',
    isActive: true,
    id: store.generateId(),
    createdAt: now,
    updatedAt: now,
  }
  saveUsers([...users, newUser])
  return { success: true }
}

export function updateProfile(data: Partial<User>): { success: boolean; error?: string } {
  const session = getSession()
  if (!session) return { success: false, error: 'Not authenticated' }
  const users = getUsers()
  const index = users.findIndex(u => u.id === session.userId)
  if (index === -1) return { success: false, error: 'User not found' }
  users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() }
  saveUsers(users)
  return { success: true }
}

export function changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const session = getSession()
  if (!session) return { success: false, error: 'Not authenticated' }
  const users = getUsers()
  const user = users.find(u => u.id === session.userId)
  if (!user) return { success: false, error: 'User not found' }
  if (user.password !== oldPassword) return { success: false, error: 'Current password is incorrect' }
  user.password = newPassword
  user.updatedAt = new Date().toISOString()
  saveUsers(users.map(u => u.id === user.id ? user : u))
  return { success: true }
}

export function addAuditLog(user: string, userName: string, action: string, resource: string = 'System', details: string = ''): void {
  const logs = getAuditLogs()
  logs.unshift({
    id: store.generateId(),
    action,
    resource,
    details: details || action,
    user,
    userName,
    timestamp: new Date().toISOString(),
  })
  localStorage.setItem('ab_audit_logs', JSON.stringify(logs.slice(0, 1000)))
}

export function getAuditLogs(): AuditLog[] {
  try {
    return JSON.parse(localStorage.getItem('ab_audit_logs') || '[]')
  } catch {
    return []
  }
}

export function clearAuditLogs(): void {
  if (!hasRole('super_admin')) return
  localStorage.setItem('ab_audit_logs', '[]')
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

export function getAdminUrl(): string {
  return localStorage.getItem('ab_admin_url') || '/admin'
}

export function setAdminUrl(url: string): void {
  localStorage.setItem('ab_admin_url', url)
  addAuditLog('System', 'System', 'Changed admin URL', 'Security', `New URL: ${url}`)
}

export function getAdminSettings(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem('ab_admin_settings') || '{}')
  } catch { return {} }
}

export function saveAdminSettings(settings: Record<string, any>): void {
  localStorage.setItem('ab_admin_settings', JSON.stringify(settings))
}

export function getBackups(): any[] {
  try {
    return JSON.parse(localStorage.getItem('ab_backups') || '[]')
  } catch { return [] }
}

export function createBackup(): { success: boolean; error?: string } {
  try {
    const backups = getBackups()
    const data: Record<string, any> = {}
    Object.keys(localStorage).filter(k => k.startsWith('ab_')).forEach(k => {
      try { data[k] = JSON.parse(localStorage.getItem(k) || '') } catch { data[k] = localStorage.getItem(k) }
    })
    const backup = {
      id: Date.now().toString(36),
      name: `Backup ${new Date().toLocaleDateString()}`,
      data,
      createdAt: new Date().toISOString(),
      size: new Blob([JSON.stringify(data)]).size,
    }
    backups.unshift(backup)
    const MAX_BACKUPS = 20
    if (backups.length > MAX_BACKUPS) backups.length = MAX_BACKUPS
    localStorage.setItem('ab_backups', JSON.stringify(backups))
    addAuditLog('System', 'System', 'Created backup', 'Backup', `Backup #${backup.id}`)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export function restoreBackup(id: string): { success: boolean; error?: string } {
  try {
    const backups = getBackups()
    const backup = backups.find((b: any) => b.id === id)
    if (!backup) return { success: false, error: 'Backup not found' }
    Object.entries(backup.data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value))
    })
    addAuditLog('System', 'System', 'Restored backup', 'Backup', `Restored backup #${id}`)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}
