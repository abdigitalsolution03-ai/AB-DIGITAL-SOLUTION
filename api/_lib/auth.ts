import { verifyAccessToken } from './jwt'
import { getUserById, type AdminUser } from './store'
import { HttpError } from './http'
import { kv } from './redis'

export interface AuthContext {
  user: AdminUser
  sessionId: string
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7).trim()
}

export async function requireAuth(req: Request, role?: 'super_admin' | 'admin'): Promise<AuthContext> {
  const token = getBearerToken(req)
  if (!token) throw new HttpError(401, 'Missing access token')

  let claims
  try {
    claims = await verifyAccessToken(token)
  } catch {
    throw new HttpError(401, 'Invalid or expired access token')
  }

  if (await kv.get(`sess:revoked:${claims.jti}`)) {
    throw new HttpError(401, 'Session has been revoked')
  }

  const user = await getUserById(claims.sub)
  if (!user) throw new HttpError(401, 'Account no longer exists')
  if (!user.isActive) throw new HttpError(403, 'Account is deactivated')

  if (role && user.role !== role && !(role === 'admin' && user.role === 'super_admin')) {
    throw new HttpError(403, 'Insufficient permissions')
  }

  return { user, sessionId: claims.jti }
}

export async function revokeSession(sessionId: string, ttlSec: number): Promise<void> {
  await kv.set(`sess:revoked:${sessionId}`, '1', { ex: ttlSec })
}
