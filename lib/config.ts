import { z } from 'zod'
import { prodFallbackEnv } from './prod-env'

const envSchema = z.object({
  JWT_SECRET: z.string().min(32).optional(),
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().min(1).optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  APP_URL: z.string().url().optional(),
  NODE_ENV: z.string().optional(),
})

export const config = envSchema.parse(process.env)
export const isProduction = config.NODE_ENV === 'production'

function secret(name: string, fallback: string): string {
  const value = process.env[name] ?? (isProduction ? prodFallbackEnv[name] : undefined)
  if (!value) {
    if (isProduction) throw new Error(`Missing required env var: ${name}`)
    return fallback
  }
  if (isProduction && process.env[name] !== value) {
    console.warn(`Using committed fallback for ${name} — set it as a Vercel env var to override`)
  }
  return value
}

export const jwtSecret = secret('JWT_SECRET', 'dev-only-insecure-secret-do-not-use-in-prod-0123456789')
export const appUrl = secret('APP_URL', 'http://localhost:3000')

export const allowedOrigins: string[] = (
  process.env.ALLOWED_ORIGINS ?? (isProduction ? prodFallbackEnv.ALLOWED_ORIGINS : 'http://localhost:3000')
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export const ACCESS_TOKEN_TTL_SEC = 15 * 60
export const REFRESH_TOKEN_TTL_SEC = 30 * 24 * 60 * 60
export const PENDING_2FA_TTL_SEC = 5 * 60
export const PASSWORD_MIN_LENGTH = 8

export const LOGIN_MAX_ATTEMPTS = 5
export const LOGIN_LOCKOUT_SEC = 15 * 60
export const LOGIN_RATE_LIMIT = { limit: 10, windowSec: 60 }
export const CONTACT_RATE_LIMIT = { limit: 3, windowSec: 10 * 60 }
export const API_RATE_LIMIT = { limit: 120, windowSec: 60 }

export const AUDIT_LOG_MAX = 2000
export const ENQUIRIES_MAX = 1000
