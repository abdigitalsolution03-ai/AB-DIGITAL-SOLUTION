import { kv } from './redis.js'
import { allowedOrigins } from './config.js'

function applyCors(headers: Headers, origin: string | null): void {
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
    headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Max-Age', '86400')
  }
}

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export function ok(body: unknown): Response {
  return json(200, body)
}

export function created(body: unknown): Response {
  return json(201, body)
}

export class HttpError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

function errorPayload(err: unknown): { status: number; body: Record<string, unknown> } {
  if (err instanceof HttpError) {
    return { status: err.status, body: { error: err.message, details: err.details } }
  }
  console.error('Unhandled API error:', err)
  return { status: 500, body: { error: 'Internal server error' } }
}

export function fail(err: unknown): Response {
  const { status, body } = errorPayload(err)
  return json(status, body)
}

export function methodNotAllowed(allowed: string[]): Response {
  return json(405, { error: 'Method not allowed', allowed })
}

export async function readJson(req: Request): Promise<unknown> {
  const text = await req.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, 'Invalid JSON body')
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function storeGetJson(key: string): Promise<any[]> {
  const raw = await kv.get(key)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function storeSetJson(key: string, value: unknown): Promise<void> {
  await kv.set(key, JSON.stringify(value))
}

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cache-Control': 'no-store',
}

async function toWebRequest(input: unknown): Promise<Request> {
  const raw = input as {
    method?: string
    url?: string
    headers?: Record<string, string | string[] | undefined>
    on?: (event: string, cb: (chunk: Buffer) => void) => unknown
  }
  const headers = new Headers()
  for (const [key, value] of Object.entries(raw.headers ?? {})) {
    if (value === undefined) continue
    if (Array.isArray(value)) for (const v of value) headers.append(key, v)
    else headers.set(key, String(value))
  }
  let body: string | undefined
  const method = (raw.method ?? 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD' && typeof raw.on === 'function') {
    const on = raw.on
    body = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []
      on('data', (chunk: Buffer) => chunks.push(chunk))
      on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      on('error', reject)
    })
  }
  const host = headers.get('x-forwarded-host') ?? headers.get('host') ?? 'localhost'
  const proto = headers.get('x-forwarded-proto')?.split(',')[0].trim() ?? 'http'
  return new Request(new URL(raw.url ?? '/', `${proto}://${host}`).toString(), { method, headers, body })
}

export function withApi(handler: (req: Request) => Promise<Response> | Response) {
  return async (input: unknown): Promise<Response> => {
    const req: Request =
      typeof (input as Request)?.headers?.get === 'function' ? (input as Request) : await toWebRequest(input)
    try {
      if (req.method === 'OPTIONS') {
        const headers = new Headers(SECURITY_HEADERS)
        applyCors(headers, req.headers.get('origin'))
        return new Response(null, { status: 204, headers })
      }
      const res = await handler(req)
      const body = await res.text()
      const headers = new Headers(res.headers)
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(key)) headers.set(key, value)
      }
      applyCors(headers, req.headers.get('origin'))
      return new Response(body, { status: res.status, headers })
    } catch (err) {
      const { status, body } = errorPayload(err)
      const headers = new Headers(SECURITY_HEADERS)
      applyCors(headers, req.headers.get('origin'))
      headers.set('Content-Type', 'application/json; charset=utf-8')
      return new Response(JSON.stringify(body), { status, headers })
    }
  }
}
