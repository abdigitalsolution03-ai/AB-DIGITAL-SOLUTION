export default function ping(): Response {
  return new Response(JSON.stringify({ pong: true }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
