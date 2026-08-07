import { withApi, ok, methodNotAllowed } from '../lib/http.js'
import { getAllCollections, getCollection, CMS_COLLECTIONS } from '../lib/cms-store.js'

export default withApi(async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') return methodNotAllowed(['GET'])
  const url = new URL(req.url)
  const name = url.searchParams.get('collection')
  if (name) {
    if (!CMS_COLLECTIONS.includes(name)) return ok({ items: [] })
    const items = await getCollection(name)
    return ok({ collection: name, items })
  }
  const collections = await getAllCollections()
  return ok({ collections })
})