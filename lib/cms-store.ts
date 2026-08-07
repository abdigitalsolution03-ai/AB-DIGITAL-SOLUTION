import { kv } from './redis.js'

const PREFIX = 'cms:'

export const CMS_COLLECTIONS = [
  'pages',
  'header',
  'footer',
  'media',
  'blog',
  'seo',
  'theme',
  'branding',
  'testimonials',
  'faqs',
  'homepageSections',
  'enquiries',
  'subscribers',
  'leads',
  'careers',
  'jobs',
  'popups',
  'banners',
  'team',
  'gallery',
  'portfolio',
  'clients',
  'services',
  'settings',
  'pageData',
]

export async function getCollection(name: string): Promise<any[]> {
  if (!CMS_COLLECTIONS.includes(name)) return []
  try {
    const raw = await kv.get(PREFIX + name)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function setCollection(name: string, items: any[]): Promise<void> {
  if (!CMS_COLLECTIONS.includes(name)) return
  await kv.set(PREFIX + name, JSON.stringify(items))
}

export async function getAllCollections(): Promise<Record<string, any[]>> {
  const out: Record<string, any[]> = {}
  for (const name of CMS_COLLECTIONS) {
    out[name] = await getCollection(name)
  }
  return out
}