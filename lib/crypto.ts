import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const BCRYPT_ROUNDS = 12

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    return false
  }
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex')
}
