import { Redis } from '@upstash/redis'
import { isProduction } from './config.js'

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

const hasKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

export const kv: KeyValueLike = hasKV
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : createInMemoryStore()

export function warnIfMemoryStore(): void {
  if (!hasKV) {
    console.warn(
      isProduction
        ? 'KV_REST_API_URL/KV_REST_API_TOKEN not set in production — data will be lost between invocations!'
        : 'Running with in-memory store (dev mode): set KV_REST_API_URL and KV_REST_API_TOKEN for persistent storage.'
    )
  }
}
