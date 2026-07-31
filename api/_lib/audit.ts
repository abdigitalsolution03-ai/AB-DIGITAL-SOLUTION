import { kv } from './redis'
import { AUDIT_LOG_MAX } from './config'

export interface AuditEntry {
  ts: string
  actor: string
  action: string
  detail?: string
  ip?: string
}

export async function audit(entry: Omit<AuditEntry, 'ts'>): Promise<void> {
  const record: AuditEntry = { ...entry, ts: new Date().toISOString() }
  await kv.lpush('audit:log', JSON.stringify(record))
  await kv.ltrim('audit:log', 0, AUDIT_LOG_MAX - 1)
}

export async function getAuditLog(limit = 200): Promise<AuditEntry[]> {
  const raw = await kv.lrange('audit:log', 0, limit - 1)
  return raw
    .map((line) => {
      try {
        return JSON.parse(line) as AuditEntry
      } catch {
        return null
      }
    })
    .filter((e): e is AuditEntry => e !== null)
}
