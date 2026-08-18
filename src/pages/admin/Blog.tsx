import { useState, useEffect, useMemo } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiClock, FiCalendar } from 'react-icons/fi'
import { getAll, create, update, remove, type BlogPost } from '@/services/cms'
import { Card, Button, Modal, Input, Badge, EmptyState, ConfirmDialog } from '@/components/ui'

const STATUS_COLOR: Record<string, any> = { published: 'success', scheduled: 'warning', draft: 'default' }

function wordCount(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text ? text.split(' ').length : 0
}

function readTime(html: string) {
  return Math.max(1, Math.round(wordCount(html) / 200))
}

function seoScore(post: BlogPost): number {
  let score = 0
  if (post.title && post.title.length >= 30) score++
  if (post.seo?.title) score++
  if (post.seo?.description && post.seo.description.length >= 50) score++
  if (post.seo?.keywords) score++
  if (post.featuredImage) score++
  if (post.categories.length) score++
  if (post.tags.length) score++
  return score
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', featuredImage: '',
    categories: '', tags: '', author: '', status: 'draft' as const,
    scheduledAt: '', seo: { title: '', description: '', keywords: '', ogImage: '' },
  })

  useEffect(() => { setPosts(getAll('blog')) }, [])

  const refresh = () => setPosts(getAll('blog'))

  const allCategories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach(p => p.categories.forEach(c => set.add(c)))
    return [...set]
  }, [posts])

  const filtered = useMemo(() => {
    let list = posts
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
    if (categoryFilter !== 'all') list = list.filter(p => p.categories.includes(categoryFilter))
    return list
  }, [posts, statusFilter, categoryFilter])

  const counts = useMemo(() => ({
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
  }), [posts])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', categories: '', tags: '', author: '', status: 'draft', scheduledAt: '', seo: { title: '', description: '', keywords: '', ogImage: '' } })
    setShowModal(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
      featuredImage: post.featuredImage, categories: post.categories.join(', '), tags: post.tags.join(', '),
      author: post.author, status: post.status, scheduledAt: post.scheduledAt || '',
      seo: post.seo || { title: '', description: '', keywords: '', ogImage: '' },
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const data: Partial<BlogPost> = {
      title: form.title, slug, excerpt: form.excerpt, content: form.content,
      featuredImage: form.featuredImage,
      categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: form.author, status: form.status,
      scheduledAt: form.scheduledAt || undefined,
      seo: {
        title: form.seo.title, description: form.seo.description,
        keywords: form.seo.keywords, ogImage: form.seo.ogImage,
      },
    }
    if (editing) {
      update('blog', editing.id, data)
    } else {
      create('blog', data)
    }
    setShowModal(false)
    refresh()
  }

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return iso }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Blog & SEO</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">{posts.length} posts · {counts.published} published · {counts.draft} drafts · {counts.scheduled} scheduled</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Post</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'published', 'draft', 'scheduled'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              statusFilter === s
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
            }`}
          >
            {s} {s !== 'all' && `(${counts[s]})`}
          </button>
        ))}
        {allCategories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--border-primary)] text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] outline-none focus:border-blue-500 ml-auto"
          >
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title={posts.length === 0 ? 'No posts' : 'Nothing found'} description="Create your first blog post" action={<Button variant="primary" size="sm" onClick={openCreate}>Create Post</Button>} />
        ) : (
          <div className="space-y-2">
            {filtered.map(post => {
              const score = seoScore(post)
              const words = wordCount(post.content)
              return (
                <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] text-xs shrink-0">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{post.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">/{post.slug} · {post.author || 'Unknown'} · {fmtDate(post.createdAt)}</p>
                    {words > 0 && <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{words} words · {readTime(post.content)} min read</p>}
                  </div>
                  <div className="hidden md:flex items-center gap-1 shrink-0" title={`SEO score ${score}/6`}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <span key={i} className={`w-1.5 h-4 rounded-full ${i <= score ? 'bg-green-500' : 'bg-[var(--bg-tertiary)]'}`} />
                    ))}
                  </div>
                  <Badge variant={STATUS_COLOR[post.status] || 'default'}>{post.status}</Badge>
                  {post.status === 'scheduled' && post.scheduledAt && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] shrink-0"><FiCalendar size={10} /> {fmtDate(post.scheduledAt)}</span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {post.status === 'published' && <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => window.open('/blog/' + post.slug, '_blank')} />}
                    <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(post)} />
                    <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(post.id)} className="text-red-500" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Post' : 'New Post'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Title" value={form.title} onChange={v => { setForm(prev => ({ ...prev, title: v, slug: !editing ? v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug })) }} />
          <Input label="URL Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Content (HTML)</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="<p>Write your post…</p>" />
            {form.content && <p className="text-xs text-[var(--text-tertiary)] mt-1">{wordCount(form.content)} words · {readTime(form.content)} min read</p>}
          </div>
          <Input label="Featured Image URL" value={form.featuredImage} onChange={v => setForm({ ...form, featuredImage: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Categories (comma separated)" value={form.categories} onChange={v => setForm({ ...form, categories: v })} />
            <Input label="Tags (comma separated)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} />
          </div>
          <Input label="Author" value={form.author} onChange={v => setForm({ ...form, author: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            {form.status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center gap-1"><FiClock size={12} /> Publish At</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
              </div>
            )}
          </div>
          <div className="border-t border-[var(--border-primary)] pt-4">
            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">SEO Suite</p>
            <Input label="Meta Title" value={form.seo.title || ''} onChange={v => setForm({ ...form, seo: { ...form.seo, title: v } })} />
            <div className="mt-3">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Meta Description</label>
              <textarea value={form.seo.description || ''} onChange={e => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
              <p className={`text-xs mt-1 ${(form.seo.description || '').length >= 50 ? 'text-green-500' : 'text-[var(--text-tertiary)]'}`}>{form.seo.description?.length || 0}/160 characters (recommended 50–160)</p>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Focus Keywords" value={form.seo.keywords || ''} onChange={v => setForm({ ...form, seo: { ...form.seo, keywords: v } })} />
              <Input label="OG Image URL" value={form.seo.ogImage || ''} onChange={v => setForm({ ...form, seo: { ...form.seo, ogImage: v } })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('blog', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Post?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}