import { createHmac, randomBytes } from 'crypto'
import { kv } from './redis'
import { LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_SEC, LOGIN_RATE_LIMIT, API_RATE_LIMIT } from './config'

export interface RateResult {
  ok: boolean
  remaining: number
  retryAfterSec: number
}

export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateResult> {
  const count = await kv.incr(key)
  if (count === 1) await kv.expire(key, windowSec)
  const ttl = await kv.expire(key, windowSec)
  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSec: ttl,
  }
}

export function ipKey(ip: string, scope: string): string {
  return `rl:${scope}:${ip}`
}

export function userKey(userId: string, scope: string): string {
  return `rl:${scope}:u:${userId}`
}

export async function checkLoginRate(ip: string): Promise<RateResult> {
  return rateLimit(ipKey(ip, 'login'), LOGIN_RATE_LIMIT.limit, LOGIN_RATE_LIMIT.windowSec)
}

export async function checkApiRate(ip: string): Promise<RateResult> {
  return rateLimit(ipKey(ip, 'api'), API_RATE_LIMIT.limit, API_RATE_LIMIT.windowSec)
}

export async function getLockoutRemaining(email: string): Promise<number> {
  return kv.get(`lockout:${email.toLowerCase()}`).then((v) => Number(v ?? 0))
}

export async function recordFailedLogin(email: string): Promise<{ locked: boolean; retryAfterSec: number }> {
  const key = `lockout:${email.toLowerCase()}`
  const attempts = await kv.incr(key)
  if (attempts === 1) await kv.expire(key, LOGIN_LOCKOUT_SEC)
  await kv.expire(key, LOGIN_LOCKOUT_SEC)
  if (attempts >= LOGIN_MAX_ATTEMPTS) return { locked: true, retryAfterSec: await kv.expire(key, LOGIN_LOCKOUT_SEC) }
  return { locked: false, retryAfterSec: 0 }
}

export async function clearFailedLogins(email: string): Promise<void> {
  await kv.del(`lockout:${email.toLowerCase()}`)
}

export function newSessionId(): string {
  return randomBytes(24).toString('hex')
}
