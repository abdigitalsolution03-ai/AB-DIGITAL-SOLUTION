import { MongoClient, type Db, type MongoClientOptions } from 'mongodb'
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

const MONGODB_URI = process.env.MONGODB_URI ?? (isProduction ? prodFallbackEnv.MONGODB_URI : undefined)

const STORE_OP_DEADLINE_MS = 3500

function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`store operation exceeded ${ms}ms deadline`)), ms)
    promise.then(
      (value) => { clearTimeout(timer); resolve(value) },
      (err) => { clearTimeout(timer); reject(err) }
    )
  })
}

export function createMongoStore(uri: string, opts?: { lookup?: MongoClientOptions['lookup'] }): KeyValueLike {
  const clientOptions: MongoClientOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10_000,
    appName: 'ab-digital-solution',
    ...(uri.includes('mongodb.net') ? { tls: true } : {}),
    ...(opts?.lookup ? { lookup: opts.lookup } : {}),
  }

  let dbPromise: Promise<Db> | null = null

  const getDb = (): Promise<Db> => {
    if (!dbPromise) {
      dbPromise = (async () => {
        const client = new MongoClient(uri, clientOptions)
        await client.connect()
        const db = client.db()
        await db
          .collection('kv')
          .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
          .catch((err) => console.error('kv TTL index init failed:', err instanceof Error ? err.message : String(err)))
        return db
      })()
    }
    return dbPromise
  }

  const col = async () => (await getDb()).collection<{ _id: string; value: string; expiresAt?: Date | null }>('kv')

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
    const doc = await (await col()).findOne({
      _id: key,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    })
    return doc ? doc.value : null
  }

  async function set(key: string, value: string, opts?: { ex?: number }): Promise<unknown> {
    await (await col()).updateOne(
      { _id: key },
      {
        $set: {
          value,
          expiresAt: opts?.ex ? new Date(Date.now() + opts.ex * 1000) : null,
        },
      },
      { upsert: true }
    )
    return 'OK'
  }

  return {
    get,
    set,
    async del(...keys) {
      if (keys.length === 0) return 0
      const result = await (await col()).deleteMany({ _id: { $in: keys } })
      return result.deletedCount ?? 0
    },
    async incr(key) {
      const now = new Date()
      const doc = await (await col()).findOneAndUpdate(
        { _id: key },
        [
          {
            $set: {
              expiresAt: {
                $cond: [
                  { $and: [{ $ne: ['$expiresAt', null] }, { $lte: ['$expiresAt', now] }] },
                  null,
                  { $ifNull: ['$expiresAt', null] },
                ],
              },
              value: {
                $cond: [
                  { $and: [{ $ne: ['$expiresAt', null] }, { $lte: ['$expiresAt', now] }] },
                  '1',
                  { $toString: { $add: [1, { $toLong: { $ifNull: ['$value', '0'] } }] } },
                ],
              },
            },
          },
        ],
        { upsert: true, returnDocument: 'after' }
      )
      return Number(doc?.value)
    },
    async expire(key, seconds) {
      const now = new Date()
      const result = await (await col()).updateOne(
        { _id: key, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
        { $set: { expiresAt: new Date(now.getTime() + seconds * 1000) } }
      )
      return result.modifiedCount > 0 ? Math.max(1, seconds) : 0
    },
    async ttl(key) {
      const doc = await (await col()).findOne({ _id: key })
      if (!doc) return -2
      if (!doc.expiresAt) return -1
      const secs = Math.ceil((doc.expiresAt.getTime() - Date.now()) / 1000)
      return secs > 0 ? secs : -2
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
  if (!MONGODB_URI) return memory

  const mongoStore = createMongoStore(MONGODB_URI)
  let degraded = false

  const guard =
    (primary: (...args: any[]) => Promise<any>, fallback: (...args: any[]) => Promise<any>) =>
    async (...args: any[]) => {
      try {
        return await withDeadline(primary(...args), STORE_OP_DEADLINE_MS)
      } catch (err) {
        if (!degraded) {
          degraded = true
          console.error(
            'MongoDB store unreachable — falling back to in-memory store for this instance. ' +
              `Cause: ${err instanceof Error ? err.message : String(err)}`
          )
        }
        return fallback(...args)
      }
    }

  return {
    get: guard((k: string) => mongoStore.get(k), (k: string) => memory.get(k)),
    set: guard((k: string, v: string, o?: { ex?: number }) => mongoStore.set(k, v, o), (k: string, v: string, o?: { ex?: number }) => memory.set(k, v, o)),
    del: guard((...ks: string[]) => mongoStore.del(...ks), (...ks: string[]) => memory.del(...ks)),
    incr: guard((k: string) => mongoStore.incr(k), (k: string) => memory.incr(k)),
    expire: guard((k: string, s: number) => mongoStore.expire(k, s), (k: string, s: number) => memory.expire(k, s)),
    ttl: guard((k: string) => mongoStore.ttl(k), (k: string) => memory.ttl(k)),
    lpush: guard((k: string, v: string) => mongoStore.lpush(k, v), (k: string, v: string) => memory.lpush(k, v)),
    lrange: guard((k: string, a: number, b: number) => mongoStore.lrange(k, a, b), (k: string, a: number, b: number) => memory.lrange(k, a, b)),
    ltrim: guard((k: string, a: number, b: number) => mongoStore.ltrim(k, a, b), (k: string, a: number, b: number) => memory.ltrim(k, a, b)),
  }
}

export function warnIfMemoryStore(): void {
  if (!MONGODB_URI) {
    console.warn(
      isProduction
        ? 'MONGODB_URI not set in production — data will be lost between invocations!'
        : 'Running with in-memory store (dev mode): set MONGODB_URI for persistent storage.'
    )
  }
}
