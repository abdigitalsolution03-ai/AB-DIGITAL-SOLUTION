const DB_PREFIX = 'cms_'

function db(): Record<string, any> {
  try { return JSON.parse(localStorage.getItem(DB_PREFIX + 'db') || '{}') }
  catch { return {} }
}

function save(data: Record<string, any>): void {
  localStorage.setItem(DB_PREFIX + 'db', JSON.stringify(data))
}

const serverCollections = new Set([
  'pages', 'header', 'footer', 'media', 'blog', 'seo', 'theme', 'branding',
  'testimonials', 'faqs', 'homepageSections', 'enquiries', 'subscribers', 'leads',
  'careers', 'jobs', 'popups', 'banners', 'team', 'gallery', 'portfolio',
  'clients', 'services', 'settings', 'pageData',
])

export async function pullCMS(): Promise<boolean> {
  try {
    const res = await fetch('/api/cms', { headers: { Accept: 'application/json' } })
    if (!res.ok) return false
    const body = await res.json()
    const collections = body?.collections
    if (!collections || typeof collections !== 'object') return false
    const data = db()
    let changed = false
    for (const [name, items] of Object.entries(collections)) {
      if (serverCollections.has(name) && Array.isArray(items)) {
        data[name] = items
        changed = true
      }
    }
    if (changed) save(data)
    return true
  } catch {
    return false
  }
}

async function pushCollection(name: string, items: any[]): Promise<void> {
  if (!serverCollections.has(name)) return
  try {
    const { apiFetch } = await import('./auth')
    await apiFetch('/admin/cms', {
      method: 'POST',
      body: JSON.stringify({ name, items }),
    })
  } catch {
    // server unreachable or not signed in — local-only changes stay in browser
  }
}

function collection<T = any>(name: string): T[] {
  const data = db()
  return (data[name] || []) as T[]
}

function saveCollection(name: string, items: any[]): void {
  const data = db()
  data[name] = items
  save(data)
  void pushCollection(name, items)
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function now(): string {
  return new Date().toISOString()
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  sections: any[]
  seo?: { title?: string; description?: string; keywords?: string }
  status: 'draft' | 'published'
  order: number
  createdAt: string
  updatedAt: string
}

export interface NavItem {
  id: string
  label: string
  url: string
  children: NavItem[]
  order: number
}

export interface HeaderSettings {
  logo: string
  logoAlt: string
  sticky: boolean
  ctaText: string
  ctaUrl: string
  announcementBar: { enabled: boolean; text: string; url: string }
  navItems: NavItem[]
}

export interface FooterSettings {
  logo: string
  description: string
  copyright: string
  socialLinks: { platform: string; url: string; icon: string }[]
  contact: { email: string; phone: string; address: string }
  columns: { title: string; links: { label: string; url: string }[] }[]
  paymentIcons: string[]
  newsletterEnabled: boolean
}

export interface Media {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'pdf' | 'icon' | 'document'
  alt: string
  size: number
  folder: string
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  categories: string[]
  tags: string[]
  author: string
  status: 'draft' | 'published' | 'scheduled'
  scheduledAt?: string
  seo?: { title?: string; description?: string; keywords?: string; ogImage?: string }
  createdAt: string
  updatedAt: string
}

export interface SEOSettings {
  globalTitle: string
  globalDescription: string
  keywords: string
  ogImage: string
  twitterHandle: string
  googleAnalytics: string
  googleVerification: string
  facebookPixel: string
  customHead: string
}

export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  borderRadius: number
  animationEnabled: boolean
  darkModeEnabled: boolean
  customCss: string
}

export interface Branding {
  logo: string
  logoDark: string
  favicon: string
  companyName: string
  email: string
  phone: string
  address: string
  socialLinks: { platform: string; url: string }[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
  status: 'draft' | 'published'
  createdAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  status: 'draft' | 'published'
  createdAt: string
}

export interface HomepageSection {
  id: string
  type: string
  title: string
  subtitle: string
  content: any
  order: number
  status: 'visible' | 'hidden'
}

export interface Setting {
  key: string
  value: any
}

const defaults: Record<string, any[]> = {
  pages: [
    {
      id: 'page_home', title: 'Home', slug: '', content: '', sections: [],
      seo: { title: '', description: '', keywords: '' }, status: 'published', order: 0,
      createdAt: now(), updatedAt: now(),
    },
  ],
  header: [{
    logo: '', logoAlt: '', sticky: true, ctaText: 'Get Started', ctaUrl: '/contact',
    announcementBar: { enabled: false, text: '', url: '' },
    navItems: [
      { id: 'nav_1', label: 'Home', url: '/', children: [], order: 0 },
      { id: 'nav_2', label: 'Services', url: '/services', children: [], order: 1 },
      { id: 'nav_3', label: 'About', url: '/about', children: [], order: 2 },
      { id: 'nav_4', label: 'Contact', url: '/contact', children: [], order: 3 },
    ],
  }],
  footer: [{
    logo: '', description: '', copyright: '© 2025 All rights reserved.',
    socialLinks: [], contact: { email: '', phone: '', address: '' },
    columns: [], paymentIcons: [], newsletterEnabled: true,
  }],
  media: [],
  blog: [],
  seo: [{
    globalTitle: '', globalDescription: '', keywords: '', ogImage: '',
    twitterHandle: '', googleAnalytics: '', googleVerification: '', facebookPixel: '', customHead: '',
  }],
  theme: [{
    primaryColor: '#3B82F6', secondaryColor: '#1E293B', accentColor: '#F59E0B',
    fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 8,
    animationEnabled: true, darkModeEnabled: true, customCss: '',
  }],
  branding: [{
    logo: '', logoDark: '', favicon: '', companyName: 'My Company',
    email: '', phone: '', address: '',
    socialLinks: [],
  }],
  testimonials: [],
  faqs: [],
  homepageSections: [],
  enquiries: [],
  subscribers: [],
  leads: [],
  careers: [],
  jobs: [],
  popups: [],
  banners: [],
  team: [],
  gallery: [],
  portfolio: [],
  clients: [],
  services: [],
  settings: [],
}

export function initCMS(): void {
  const data = db()
  let changed = false
  for (const [key, value] of Object.entries(defaults)) {
    if (!data[key]) {
      data[key] = JSON.parse(JSON.stringify(value))
      changed = true
    }
  }
  if (changed) save(data)
}

export function get<T = any>(name: string): T {
  const items = collection(name)
  return items[0] as T
}

export function getAll<T = any>(name: string): T[] {
  return collection(name)
}

export function getById<T = any>(name: string, id: string): T | undefined {
  return collection(name).find((item: any) => item.id === id) as T | undefined
}

export function create(name: string, data: any): any {
  const items = collection(name)
  const item = { ...data, id: generateId(), createdAt: now(), updatedAt: now() }
  items.push(item)
  saveCollection(name, items)
  return item
}

export function update(name: string, id: string, data: any): any | undefined {
  const items = collection(name)
  const idx = items.findIndex((item: any) => item.id === id)
  if (idx === -1) return undefined
  items[idx] = { ...items[idx], ...data, updatedAt: now() }
  saveCollection(name, items)
  return items[idx]
}

export function updateSingle(name: string, data: any): any {
  saveCollection(name, [data])
  return data
}

export function remove(name: string, id: string): boolean {
  const items = collection(name)
  const filtered = items.filter((item: any) => item.id !== id)
  if (filtered.length === items.length) return false
  saveCollection(name, filtered)
  return true
}

export function getHomepageSections(): HomepageSection[] {
  return collection('homepageSections')
}

export function saveHomepageSections(sections: HomepageSection[]): void {
  saveCollection('homepageSections', sections)
}

export function getSetting(key: string): any {
  const settings = collection('settings') as Setting[]
  return settings.find(s => s.key === key)?.value
}

export function setSetting(key: string, value: any): void {
  const settings = collection('settings') as Setting[]
  const idx = settings.findIndex(s => s.key === key)
  if (idx >= 0) settings[idx].value = value
  else settings.push({ key, value })
  saveCollection('settings', settings)
}

export function getMediaUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return path
}

// Page & Section Data
import { pageRegistry, getDefaultSectionContent, type SectionType, type PageRegistration } from './pageRegistry'

export interface PageData {
  route: string
  slug: string
  name: string
  sections: Record<string, any>
  seo: { title: string; description: string; keywords: string; ogImage: string; canonicalUrl: string; schema: string }
  status: 'published' | 'draft'
  updatedAt: string
  revisions: { data: string; timestamp: string; label: string }[]
}

export function initAllPages(): void {
  const existing = getAll<PageData>('pageData')
  for (const reg of pageRegistry) {
    if (!existing.find((p: PageData) => p.route === reg.route)) {
      const sections: Record<string, any> = {}
      for (const sec of reg.sections) {
        sections[sec.type] = getDefaultSectionContent(sec.type)
      }
      const pageData: PageData = {
        route: reg.route,
        slug: reg.slug,
        name: reg.name,
        sections,
        seo: { title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '', schema: '' },
        status: 'published',
        updatedAt: now(),
        revisions: [],
      }
      existing.push(pageData)
    }
  }
  saveCollection('pageData', existing)
}

export function getPageData(route: string): PageData | undefined {
  return getAll<PageData>('pageData').find((p: PageData) => p.route === route)
}

export function savePageSections(route: string, sections: Record<string, any>): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  all[idx].sections = sections
  all[idx].updatedAt = now()
  saveCollection('pageData', all)
}

export function savePageSEO(route: string, seo: PageData['seo']): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  all[idx].seo = seo
  all[idx].updatedAt = now()
  saveCollection('pageData', all)
}

export function savePageStatus(route: string, status: 'published' | 'draft'): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  all[idx].status = status
  all[idx].updatedAt = now()
  saveCollection('pageData', all)
}

export function addRevision(route: string, label: string): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  const rev = { data: JSON.stringify(all[idx].sections), timestamp: now(), label }
  all[idx].revisions.unshift(rev)
  if (all[idx].revisions.length > 20) all[idx].revisions.length = 20
  saveCollection('pageData', all)
}

export function getAllPageData(): PageData[] {
  return getAll<PageData>('pageData')
}

export function duplicatePageData(route: string): boolean {
  const all = getAll<PageData>('pageData')
  const src = all.find((p: PageData) => p.route === route)
  if (!src) return false
  const dup: PageData = {
    ...src,
    route: route + '-copy',
    slug: src.slug + '-copy',
    name: src.name + ' (Copy)',
    revisions: [],
    updatedAt: now(),
  }
  all.push(dup)
  saveCollection('pageData', all)
  return true
}
