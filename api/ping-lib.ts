import { isProduction } from '../lib/config.js'

export default function pingLib(): Response {
  return new Response(JSON.stringify({ isProduction, ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
