import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface SEOData {
  siteTitle: string
  metaDescription: string
  keywords: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: string
  robotsMeta: string
  schemaJson: string
}

const defaultSEO: SEOData = {
  siteTitle: '',
  metaDescription: '',
  keywords: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary_large_image',
  robotsMeta: 'index, follow',
  schemaJson: '',
}

const twitterCardOptions = ['summary', 'summary_large_image', 'app', 'player']

export default function AdminSEO() {
  const [seo, setSeo] = useState<SEOData>(defaultSEO)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<SEOData>(defaultSEO)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminSEO') || 'null')
    if (data) {
      setSeo(data)
      setForm(data)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('adminSEO', JSON.stringify(form))
    setSeo(form)
    setEditing(false)
  }

  const handleEdit = () => {
    setForm(seo)
    setEditing(true)
  }

  const handleCancel = () => {
    setForm(seo)
    setEditing(false)
  }

  const generateRobotsTxt = () => {
    const rules = seo.robotsMeta || 'index, follow'
    const allow = rules.includes('index') ? 'Allow: /' : 'Disallow: /'
    return `User-agent: *
${allow}

Sitemap: ${seo.canonicalUrl ? seo.canonicalUrl.replace(/\/?$/, '') + '/sitemap.xml' : 'https://example.com/sitemap.xml'}`
  }

  const generateSitemapXml = () => {
    const pages = ['/', '/about', '/services', '/portfolio', '/blog', '/contact', '/testimonials', '/faqs']
    const baseUrl = seo.canonicalUrl || 'https://example.com'
    const urls = pages.map((p) => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
  }

  const validateJson = (json: string) => {
    try {
      if (!json.trim()) return { valid: true, error: null }
      JSON.parse(json)
      return { valid: true, error: null }
    } catch (e: any) {
      return { valid: false, error: e.message }
    }
  }

  const jsonValidation = validateJson(form.schemaJson)

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">SEO Management</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage search engine optimization settings</p>
        </div>
        {!editing && (
          <div className="flex items-center gap-3">
            {seo.siteTitle && (
              <button onClick={handleEdit} className="doodle-btn-accent px-5 py-2.5 text-sm">
                Edit Settings
              </button>
            )}
          </div>
        )}
      </div>

      {!editing && !seo.siteTitle ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="doodle-card p-12 text-center">
          <div className="w-16 h-16 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
            <svg className="w-8 h-8 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-[#111] mb-2">No SEO Settings Yet</h2>
          <p className="text-[#111]/60 text-sm mb-6">Configure your SEO settings to improve search engine visibility.</p>
          <button onClick={handleEdit} className="doodle-btn-accent px-6 py-3 text-sm">
            Configure SEO
          </button>
        </motion.div>
      ) : editing ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">Basic SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Site Title</label>
                  <input type="text" value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="AB DIGITAL SOLUTION" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Description for search engines..." />
                  <p className="text-xs text-[#111]/40 mt-1">{form.metaDescription.length} characters</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Keywords (comma separated)</label>
                  <input type="text" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="web design, seo, digital marketing" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Canonical URL</label>
                  <input type="url" value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="https://abdigitalsolution.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Robots Meta</label>
                  <select value={form.robotsMeta} onChange={(e) => setForm({ ...form, robotsMeta: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none">
                    <option value="index, follow">index, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">Open Graph</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">OG Title</label>
                  <input type="text" value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="AB DIGITAL SOLUTION" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">OG Description</label>
                  <textarea value={form.ogDescription} onChange={(e) => setForm({ ...form, ogDescription: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Description for social shares..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">OG Image URL</label>
                  <input type="url" value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="https://example.com/og-image.jpg" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">Twitter Card</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Twitter Card Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {twitterCardOptions.map((card) => (
                      <button key={card} onClick={() => setForm({ ...form, twitterCard: card })} className={`px-4 py-3 border-3 border-[#111] text-sm font-bold text-left transition-all ${form.twitterCard === card ? 'bg-[#FFD400] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#FFD400]/20'}`}>
                        {card.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">Structured Data / Schema (JSON-LD)</h2>
              <div>
                <textarea value={form.schemaJson} onChange={(e) => setForm({ ...form, schemaJson: e.target.value })} rows={10} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none font-mono text-sm resize-none" placeholder='{"@context": "https://schema.org", "@type": "Organization", "name": "AB DIGITAL SOLUTION", "url": "https://abdigitalsolution.com"}' />
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${jsonValidation.valid ? 'bg-green-500' : 'bg-[#FF4D4D]'}`} />
                  <span className={`text-xs ${jsonValidation.valid ? 'text-green-600' : 'text-[#FF4D4D]'}`}>
                    {jsonValidation.valid ? (form.schemaJson.trim() ? 'Valid JSON' : 'Empty') : jsonValidation.error}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-end gap-3">
              <button onClick={handleCancel} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
              <button onClick={handleSave} className="doodle-btn-accent px-5 py-2.5 text-sm">Save SEO Settings</button>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">robots.txt Preview</h2>
              <pre className="p-4 bg-white border-3 border-[#111] text-[#111] text-xs font-mono overflow-x-auto whitespace-pre-wrap">{generateRobotsTxt()}</pre>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">sitemap.xml Preview</h2>
              <pre className="p-4 bg-white border-3 border-[#111] text-[#111] text-xs font-mono overflow-x-auto whitespace-pre-wrap">{generateSitemapXml()}</pre>
            </motion.div>

            {form.schemaJson.trim() && jsonValidation.valid && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="doodle-card p-6">
                <h2 className="text-lg font-black text-[#111] mb-4">Formatted Schema</h2>
                <pre className="p-4 bg-white border-3 border-[#111] text-[#111] text-xs font-mono overflow-x-auto whitespace-pre-wrap">{JSON.stringify(JSON.parse(form.schemaJson), null, 2)}</pre>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">Google Preview</h2>
              <div className="p-4 bg-white border-3 border-[#111] max-w-[600px]">
                <p className="text-xs text-green-700 mb-1">{form.canonicalUrl || 'https://abdigitalsolution.com'}</p>
                <p className="text-sm text-blue-700 font-bold mb-1">{form.siteTitle || 'AB DIGITAL SOLUTION'}</p>
                <p className="text-xs text-[#111]/70">{form.metaDescription || 'Your meta description will appear here...'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="doodle-card p-6">
            <h2 className="text-lg font-black text-[#111] mb-4">Current SEO Settings</h2>
            <dl className="space-y-4">
              {[
                { label: 'Site Title', value: seo.siteTitle },
                { label: 'Meta Description', value: seo.metaDescription },
                { label: 'Keywords', value: seo.keywords },
                { label: 'Canonical URL', value: seo.canonicalUrl },
                { label: 'Robots Meta', value: seo.robotsMeta },
                { label: 'OG Title', value: seo.ogTitle },
                { label: 'OG Description', value: seo.ogDescription },
                { label: 'OG Image', value: seo.ogImage },
                { label: 'Twitter Card Type', value: seo.twitterCard },
              ].map(({ label, value }) => (
                <div key={label} className="border-b border-[#111]/10 pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs font-bold text-[#111]/40 uppercase tracking-wider">{label}</dt>
                  <dd className="text-sm font-bold text-[#111] mt-0.5">{value || <span className="text-[#111]/30 italic">Not set</span>}</dd>
                </div>
              ))}
            </dl>
            <button onClick={handleEdit} className="mt-6 doodle-btn-accent px-5 py-2.5 text-sm w-full">
              Edit Settings
            </button>
          </motion.div>

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">robots.txt</h2>
              <pre className="p-4 bg-white border-3 border-[#111] text-[#111] text-xs font-mono overflow-x-auto whitespace-pre-wrap">{generateRobotsTxt()}</pre>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="doodle-card p-6">
              <h2 className="text-lg font-black text-[#111] mb-4">sitemap.xml</h2>
              <pre className="p-4 bg-white border-3 border-[#111] text-[#111] text-xs font-mono overflow-x-auto whitespace-pre-wrap">{generateSitemapXml()}</pre>
            </motion.div>

            {seo.schemaJson.trim() && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="doodle-card p-6">
                <h2 className="text-lg font-black text-[#111] mb-4">Schema (JSON-LD)</h2>
                <pre className="p-4 bg-white border-3 border-[#111] text-[#111] text-xs font-mono overflow-x-auto whitespace-pre-wrap">{seo.schemaJson}</pre>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </PageTransition>
  )
}
