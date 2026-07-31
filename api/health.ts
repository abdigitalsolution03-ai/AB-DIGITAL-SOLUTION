import { withApi, ok, methodNotAllowed } from './_lib/http'
export default withApi(async (req: Request) => {
  if (req.method !== 'GET') return methodNotAllowed(['GET'])
  return ok({
    status: 'ok',
    service: 'ab-digital-solution',
    time: new Date().toISOString(),
  })
})
