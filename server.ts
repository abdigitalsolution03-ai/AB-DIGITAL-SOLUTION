import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { Readable } from 'node:stream'

import authHandler from './api/auth.js'
import adminHandler from './api/admin.js'
import contactHandler from './api/contact.js'
import healthHandler from './api/health.js'
import pingHandler from './api/ping.js'

const PORT = Number(process.env.PORT ?? 3000)
const DIST = normalize(join(process.cwd(), 'dist'))

interface Route {
  match: (path: string) => boolean
  handler: (req: Request) => Promise<Response> | Response
}

const routes: Route[] = [
  { match: (p) => p.startsWith('/api/auth'), handler: authHandler },
  { match: (p) => p.startsWith('/api/admin'), handler: adminHandler },
  { match: (p) => p.startsWith('/api/contact'), handler: contactHandler },
  { match: (p) => p.startsWith('/api/health'), handler: healthHandler },
  { match: (p) => p.startsWith('/api/ping'), handler: pingHandler },
]

const MIME: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  js: 'text/javascript',
  css: 'text/css',
  json: 'application/json; charset=utf-8',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  txt: 'text/plain',
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost')

    if (url.pathname.startsWith('/api/')) {
      const route = routes.find((r) => r.match(url.pathname))
      if (!route) {
        res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ error: 'Not found' }))
        return
      }
      const request = new Request(url.href, {
        method: req.method ?? 'GET',
        headers: req.headers as unknown as HeadersInit,
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : (Readable.toWeb(req) as unknown as BodyInit),
        duplex: 'half' as unknown as undefined,
      })
      const response = await route.handler(request)
      const body = Buffer.from(await response.arrayBuffer())
      const headers: Record<string, string> = { 'X-Content-Type-Options': 'nosniff' }
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      res.writeHead(response.status, headers)
      res.end(body)
      return
    }

    const requested = url.pathname === '/' ? '/index.html' : url.pathname
    const file = normalize(join(DIST, requested))
    if (!file.startsWith(DIST)) {
      res.writeHead(403, { 'content-type': 'text/plain' })
      res.end('Forbidden')
      return
    }
    try {
      const info = await stat(file)
      if (info.isFile()) {
        const ext = extname(file).slice(1).toLowerCase()
        res.writeHead(200, {
          'content-type': MIME[ext] ?? 'application/octet-stream',
          'X-Content-Type-Options': 'nosniff',
        })
        res.end(await readFile(file))
        return
      }
    } catch {
      // fall through to SPA fallback
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(await readFile(join(DIST, 'index.html')))
  } catch (err) {
    console.error('server error:', err)
    res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: 'Internal server error' }))
  }
})

server.listen(PORT, () => {
  console.log(`AB Digital Solution server listening on http://localhost:${PORT}`)
})
