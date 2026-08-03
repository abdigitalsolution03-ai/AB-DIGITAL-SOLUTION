import postgres from 'postgres'
import { isProduction } from './config.js'
import { prodFallbackEnv } from './prod-env.js'

interface KeyValueLike {
  get(key: string): Promise<string | null>
  set(key: string, value: string, opts?: { ex?: number }): Promise<unknown>
  del(...keys: string[]): Promise<number>
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<number>
  ttl(key: string): Promise<number>
  lpush(key: string, value: string): Promise<number>
  lrange(key: string, start: number, stop: number): Promise<string[]>
  ltrim(key: string, start: number, stop: number): Promise<unknown>
}

function createInMemoryStore(): KeyValueLike {
  const map = new Map<string, { value: string; expiresAt?: number }>()

  const now = () => Date.now()
  const alive = (key: string) => {
    const entry = map.get(key)
    if (!entry) return false
    if (entry.expiresAt && entry.expiresAt <= now()) {
      map.delete(key)
      return false
    }
    return true
  }

  return {
    async get(key) {
      return alive(key) ? map.get(key)!.value : null
    },
    async set(key, value, opts) {
      map.set(key, { value, expiresAt: opts?.ex ? now() + opts.ex * 1000 : undefined })
      return 'OK'
    },
    async del(...keys) {
      let removed = 0
      for (const key of keys) if (map.delete(key)) removed++
      return removed
    },
    async incr(key) {
      const next = (alive(key) ? Number(map.get(key)!.value) : 0) + 1
      map.set(key, { value: String(next) })
      return next
    },
    async expire(key, seconds) {
      if (!alive(key)) return 0
      const entry = map.get(key)!
      entry.expiresAt = now() + seconds * 1000
      return Math.max(1, Math.round((entry.expiresAt - now()) / 1000))
    },
    async ttl(key) {
      if (!alive(key)) return -2
      const entry = map.get(key)!
      if (!entry.expiresAt) return -1
      return Math.max(1, Math.round((entry.expiresAt - now()) / 1000))
    },
    async lpush(key, value) {
      const list = alive(key) ? JSON.parse(map.get(key)!.value) : []
      list.unshift(value)
      map.set(key, { value: JSON.stringify(list) })
      return list.length
    },
    async lrange(key, start, stop) {
      if (!alive(key)) return []
      const list = JSON.parse(map.get(key)!.value)
      const from = start < 0 ? Math.max(list.length + start, 0) : start
      const to = stop < 0 ? list.length + stop : Math.min(stop, list.length - 1)
      return list.slice(from, to + 1)
    },
    async ltrim(key, start, stop) {
      if (!alive(key)) return 'OK'
      const list = JSON.parse(map.get(key)!.value)
      const from = start < 0 ? Math.max(list.length + start, 0) : start
      const to = stop < 0 ? list.length + stop : Math.min(stop, list.length - 1)
      map.set(key, { value: JSON.stringify(list.slice(from, to + 1)) })
      return 'OK'
    },
  }
}

const DATABASE_URL = process.env.DATABASE_URL ?? (isProduction ? prodFallbackEnv.DATABASE_URL : undefined)

function createPostgresStore(url: string): KeyValueLike {
  const sql = postgres(url, {
    max: 2,
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 55,
    prepare: false,
  })

  void sql`
    CREATE TABLE IF NOT EXISTS kv (
      key text PRIMARY KEY,
      value text NOT NULL,
      expires_at timestamptz
    )
  `.catch((err) => console.error('kv table init failed:', err))

  const loadList = async (key: string): Promise<string[]> => {
    const value = await get(key)
    if (value === null) return []
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  const storeList = async (key: string, list: string[]): Promise<number> => {
    await set(key, JSON.stringify(list))
    return list.length
  }

  async function get(key: string): Promise<string | null> {
    const rows = await sql<{ value: string }[]>`
      SELECT value FROM kv
      WHERE key = ${key} AND (expires_at IS NULL OR expires_at > now())
    `
    return rows.length > 0 ? rows[0].value : null
  }

  async function set(key: string, value: string, opts?: { ex?: number }): Promise<unknown> {
    await sql`
      INSERT INTO kv (key, value, expires_at)
      VALUES (${key}, ${value}, ${opts?.ex ? sql`now() + ${opts.ex} * interval '1 second'` : null})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, expires_at = EXCLUDED.expires_at
    `
    return 'OK'
  }

  return {
    get,
    set,
    async del(...keys) {
      if (keys.length === 0) return 0
      const result = await sql`
        DELETE FROM kv WHERE key IN ${sql(keys)}
      `
      return Number(result.count)
    },
    async incr(key) {
      const rows = await sql<{ value: string }[]>`
        INSERT INTO kv (key, value) VALUES (${key}, '1')
        ON CONFLICT (key) DO UPDATE SET value =
          CASE WHEN kv.expires_at IS NOT NULL AND kv.expires_at <= now() THEN '1'
               ELSE (COALESCE(NULLIF(kv.value, '')::bigint, 0) + 1)::text
          END
        RETURNING value
      `
      return Number(rows[0].value)
    },
    async expire(key, seconds) {
      const rows = await sql<{ secs: string }[]>`
        WITH upd AS (
          UPDATE kv SET expires_at = now() + ${seconds} * interval '1 second'
          WHERE key = ${key} AND (expires_at IS NULL OR expires_at > now())
          RETURNING expires_at
        )
        SELECT CASE WHEN count(*) = 0 THEN '0'
                    ELSE GREATEST(1::bigint, ceil(extract(epoch FROM (expires_at - now())))::bigint)::text
               END AS secs
        FROM upd
      `
      return Number(rows[0].secs)
    },
    async ttl(key) {
      const rows = await sql<{ secs: string | null }[]>`
        SELECT CASE WHEN expires_at IS NULL THEN '-1'
                    ELSE GREATEST(0::bigint, ceil(extract(epoch FROM (expires_at - now())))::bigint)::text
               END AS secs
        FROM kv
        WHERE key = ${key} AND (expires_at IS NULL OR expires_at > now())
      `
      return rows.length > 0 ? Number(rows[0].secs) : -2
    },
    async lpush(key, value) {
      const list = await loadList(key)
      list.unshift(value)
      return storeList(key, list)
    },
    async lrange(key, start, stop) {
      const list = await loadList(key)
      const from = start < 0 ? Math.max(list.length + start, 0) : start
      const to = stop < 0 ? list.length + stop : Math.min(stop, list.length - 1)
      return list.slice(from, to + 1)
    },
    async ltrim(key, start, stop) {
      const list = await loadList(key)
      const from = start < 0 ? Math.max(list.length + start, 0) : start
      const to = stop < 0 ? list.length + stop : Math.min(stop, list.length - 1)
      await storeList(key, list.slice(from, to + 1))
      return 'OK'
    },
  }
}

export const kv: KeyValueLike = buildStore()

function buildStore(): KeyValueLike {
  const memory = createInMemoryStore()
  if (!DATABASE_URL) return memory

  const postgresStore = createPostgresStore(DATABASE_URL)
  let degraded = false

  const guard =
    (primary: (...args: any[]) => Promise<any>, fallback: (...args: any[]) => Promise<any>) =>
    async (...args: any[]) => {
      try {
        return await primary(...args)
      } catch (err) {
        if (!degraded) {
          degraded = true
          console.error(
            'Supabase store unreachable — falling back to in-memory store for this instance. ' +
              `Cause: ${err instanceof Error ? err.message : String(err)}`
          )
        }
        return fallback(...args)
      }
    }

  return {
    get: guard((k: string) => postgresStore.get(k), (k: string) => memory.get(k)),
    set: guard((k: string, v: string, o?: { ex?: number }) => postgresStore.set(k, v, o), (k: string, v: string, o?: { ex?: number }) => memory.set(k, v, o)),
    del: guard((...ks: string[]) => postgresStore.del(...ks), (...ks: string[]) => memory.del(...ks)),
    incr: guard((k: string) => postgresStore.incr(k), (k: string) => memory.incr(k)),
    expire: guard((k: string, s: number) => postgresStore.expire(k, s), (k: string, s: number) => memory.expire(k, s)),
    ttl: guard((k: string) => postgresStore.ttl(k), (k: string) => memory.ttl(k)),
    lpush: guard((k: string, v: string) => postgresStore.lpush(k, v), (k: string, v: string) => memory.lpush(k, v)),
    lrange: guard((k: string, a: number, b: number) => postgresStore.lrange(k, a, b), (k: string, a: number, b: number) => memory.lrange(k, a, b)),
    ltrim: guard((k: string, a: number, b: number) => postgresStore.ltrim(k, a, b), (k: string, a: number, b: number) => memory.ltrim(k, a, b)),
  }
}

export function warnIfMemoryStore(): void {
  if (!DATABASE_URL) {
    console.warn(
      isProduction
        ? 'DATABASE_URL not set in production — data will be lost between invocations!'
        : 'Running with in-memory store (dev mode): set DATABASE_URL for persistent storage.'
    )
  }
}
