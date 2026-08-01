import { SignJWT, jwtVerify } from 'jose'
import { jwtSecret, ACCESS_TOKEN_TTL_SEC, REFRESH_TOKEN_TTL_SEC, PENDING_2FA_TTL_SEC } from './config.js'

const secretKey = new TextEncoder().encode(jwtSecret)
const accessAlg = 'HS256'

export interface AccessClaims {
  sub: string
  role: string
  jti: string
  type: 'access'
}

export interface RefreshClaims {
  sub: string
  jti: string
  type: 'refresh'
}

export interface Pending2FAClaims {
  sub: string
  type: 'pending-2fa'
}

async function sign(claims: Record<string, unknown>, ttlSec: number): Promise<string> {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: accessAlg })
    .setIssuedAt()
    .setExpirationTime(`${ttlSec}s`)
    .sign(secretKey)
}

export function signAccessToken(userId: string, role: string, jti: string): Promise<string> {
  return sign({ sub: userId, role, jti, type: 'access' }, ACCESS_TOKEN_TTL_SEC)
}

export function signRefreshToken(userId: string, jti: string): Promise<string> {
  return sign({ sub: userId, jti, type: 'refresh' }, REFRESH_TOKEN_TTL_SEC)
}

export function signPending2FA(userId: string): Promise<string> {
  return sign({ sub: userId, type: 'pending-2fa' }, PENDING_2FA_TTL_SEC)
}

export async function verifyAccessToken(token: string): Promise<AccessClaims> {
  const { payload } = await jwtVerify(token, secretKey)
  if (payload.type !== 'access') throw new Error('Unexpected token type')
  return payload as unknown as AccessClaims
}

export async function verifyRefreshToken(token: string): Promise<RefreshClaims> {
  const { payload } = await jwtVerify(token, secretKey)
  if (payload.type !== 'refresh') throw new Error('Unexpected token type')
  return payload as unknown as RefreshClaims
}

export async function verifyPending2FA(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, secretKey)
  if (payload.type !== 'pending-2fa') throw new Error('Unexpected token type')
  return String(payload.sub)
}
