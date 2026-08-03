export type Role = 'super_admin' | 'admin'

export interface User {
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

export interface Session {
  userId: string
  email: string
  name: string
  role: Role
  token: string
  expiresAt: string
}

export interface LoginResult {
  success: boolean
  requires2FA?: boolean
  pendingToken?: string
  user?: User
  error?: string
  retryAfterSec?: number
}

export class ApiError extends Error {
  status: number
  retryAfterSec?: number

  constructor(status: number, message: string, retryAfterSec?: number) {
    super(message)
    this.status = status
    this.retryAfterSec = retryAfterSec
  }
}

const API_BASE = '/api'
const REFRESH_KEY = 'ab_crm_refresh'
const PROFILE_KEY = 'ab_crm_session'
const IDLE_TIMEOUT_MS = 15 * 60 * 1000
const FETCH_TIMEOUT_MS = 15_000

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

function describeFetchError(err: unknown, status?: number): string {
  if (err instanceof ApiError) return err.message
  if (err instanceof DOMException && err.name === 'AbortError') {
    return 'The server took too long to respond. Please try again.'
  }
  if (typeof status === 'number') {
    if (status >= 500) return 'Server error. Please try again later.'
    if (status === 0 || status === undefined) return 'Cannot reach the server. Check your connection and try again.'
  }
  return 'Network error. Cannot reach the server. Please try again.'
}

let accessToken: string | null = null
let accessExpiresAt = 0
let refreshPromise: Promise<boolean> | null = null

function getProfile(): Session | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

function saveSession(user: { id: string; email: string; name: string; role: Role }, token: string, expiresAt: string): void {
  const session: Session = { userId: user.id, email: user.email, name: user.name, role: user.role, token, expiresAt }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  accessToken = null
  accessExpiresAt = 0
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

async function parseResponse(res: Response): Promise<any> {
  let body: any = {}
  try {
    body = await res.json()
  } catch {
    // non-JSON response
  }
  if (!res.ok) {
    const message = body?.error || describeFetchError(undefined, res.status)
    const retryAfterSec = typeof body?.retryAfterSec === 'number' ? body.retryAfterSec : undefined
    if (res.status === 401) throw new ApiError(401, message, retryAfterSec)
    throw new ApiError(res.status, message, retryAfterSec)
  }
  return body
}

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    const refresh = localStorage.getItem(REFRESH_KEY)
    if (!refresh) {
      clearSession()
      return false
    }
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      })
      const body = await parseResponse(res)
      accessToken = body.accessToken
      accessExpiresAt = Date.now() + 15 * 60 * 1000
      localStorage.setItem(REFRESH_KEY, body.refreshToken)
      saveSession(body.user, body.accessToken, new Date(accessExpiresAt).toISOString())
      return true
    } catch {
      clearSession()
      return false
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

export async function apiFetch<T = any>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (accessToken && Date.now() < accessExpiresAt) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let res = await fetchWithTimeout(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401 && retry && accessToken) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const retryHeaders = new Headers(headers)
      retryHeaders.set('Authorization', `Bearer ${accessToken}`)
      res = await fetchWithTimeout(`${API_BASE}${path}`, { ...options, headers: retryHeaders })
    }
  }

  return parseResponse(res)
}

export async function refreshSession(): Promise<boolean> {
  const profile = getProfile()
  if (!profile) return false
  if (accessToken && Date.now() < accessExpiresAt) return true
  if (accessToken) {
    try {
      const me = await apiFetch<{ user: User }>('/auth/me', { method: 'GET' })
      saveSession(me.user, accessToken, new Date(accessExpiresAt).toISOString())
      return true
    } catch {
      // fall through to full refresh
    }
  }
  return refreshAccessToken()
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const body = await apiFetch<{ accessToken?: string; refreshToken?: string; user?: User; requires2FA?: boolean; pendingToken?: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      false,
    )
    if (body.requires2FA) {
      return { success: false, requires2FA: true, pendingToken: body.pendingToken, error: undefined }
    }
    accessToken = body.accessToken!
    accessExpiresAt = Date.now() + 15 * 60 * 1000
    localStorage.setItem(REFRESH_KEY, body.refreshToken!)
    saveSession(body.user!, body.accessToken!, new Date(accessExpiresAt).toISOString())
    return { success: true, user: body.user }
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: err.message, retryAfterSec: err.retryAfterSec }
    }
    return { success: false, error: describeFetchError(err) }
  }
}

export async function verify2FA(pendingToken: string, code: string): Promise<LoginResult> {
  try {
    const body = await apiFetch<{ accessToken: string; refreshToken: string; user: User }>(
      '/auth/verify-2fa',
      { method: 'POST', body: JSON.stringify({ pendingToken, code }) },
      false,
    )
    accessToken = body.accessToken
    accessExpiresAt = Date.now() + 15 * 60 * 1000
    localStorage.setItem(REFRESH_KEY, body.refreshToken)
    saveSession(body.user, body.accessToken, new Date(accessExpiresAt).toISOString())
    return { success: true, user: body.user }
  } catch (err) {
    if (err instanceof ApiError) return { success: false, error: err.message }
    return { success: false, error: describeFetchError(err) }
  }
}

export async function logout(): Promise<void> {
  const refresh = localStorage.getItem(REFRESH_KEY)
  try {
    if (accessToken) {
      await apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: refresh }) }, false)
    }
  } catch {
    // best-effort revocation
  } finally {
    clearSession()
  }
}

export function getSession(): Session | null {
  const profile = getProfile()
  if (!profile) return null
  return { ...profile, token: accessToken ?? '' }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function getCurrentUser(): User | undefined {
  const profile = getSession()
  if (!profile) return undefined
  return {
    id: profile.userId,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    isActive: true,
    totpEnabled: false,
    createdAt: '',
    updatedAt: '',
  }
}

export function isSuperAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'super_admin'
}

export function initializeUsers(): void {
  // No-op: users are managed server-side. Kept for API compatibility.
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })
  clearSession()
}

export async function getTOTPStatus(): Promise<{ enabled: boolean }> {
  return apiFetch('/auth/totp', { method: 'GET' })
}

export async function setupTOTP(): Promise<{ enabled: boolean; secret: string; otpauthUri: string; setupUrl: string }> {
  return apiFetch('/auth/totp', { method: 'GET' })
}

export async function confirmTOTP(code: string): Promise<{ enabled: boolean }> {
  return apiFetch('/auth/totp', { method: 'POST', body: JSON.stringify({ code }) })
}

export async function disableTOTP(password: string): Promise<{ enabled: boolean }> {
  return apiFetch('/auth/totp', { method: 'DELETE', body: JSON.stringify({ password }) })
}

export interface AuditEntry {
  ts: string
  actor: string
  action: string
  detail?: string
  ip?: string
}

export async function getAuditLog(limit = 200): Promise<AuditEntry[]> {
  const body = await apiFetch<{ entries: AuditEntry[] }>(`/admin/audit?limit=${limit}`)
  return body.entries
}

export async function getUsers(): Promise<User[]> {
  const body = await apiFetch<{ users: User[] }>('/admin/users')
  return body.users
}

export async function createAdminUser(input: { name: string; email: string; password: string; role: Role }): Promise<User> {
  const body = await apiFetch<{ user: User }>('/admin/users', { method: 'POST', body: JSON.stringify(input) })
  return body.user
}

export async function updateAdminUser(id: string, patch: { name?: string; role?: Role; isActive?: boolean }): Promise<User> {
  const body = await apiFetch<{ user: User }>(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
  return body.user
}

export async function deleteAdminUser(id: string): Promise<void> {
  await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
}

export async function getEnquiries(): Promise<any[]> {
  const body = await apiFetch<{ enquiries: any[] }>('/admin/enquiries')
  return body.enquiries
}

export async function removeEnquiry(id: string): Promise<void> {
  await apiFetch('/admin/enquiries', { method: 'DELETE', body: JSON.stringify({ id }) })
}

export async function getBootstrapStatus(): Promise<{ needsBootstrap: boolean }> {
  return apiFetch('/auth/bootstrap', { method: 'GET' }, false)
}

export async function bootstrapAdmin(input: { name: string; email: string; password: string }): Promise<void> {
  await apiFetch('/auth/bootstrap', { method: 'POST', body: JSON.stringify(input) }, false)
}

export async function submitContact(input: { name: string; email: string; phone?: string; service?: string; message: string }): Promise<void> {
  await apiFetch('/contact', { method: 'POST', body: JSON.stringify(input) }, false)
}

export function setupIdleLogout(onLogout: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  const reset = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      logout().finally(() => onLogout())
    }, IDLE_TIMEOUT_MS)
  }

  const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
  events.forEach((event) => window.addEventListener(event, reset))
  reset()

  return () => {
    if (timer) clearTimeout(timer)
    events.forEach((event) => window.removeEventListener(event, reset))
  }
}

export const PASSWORD_POLICY = { minLength: 8 }
