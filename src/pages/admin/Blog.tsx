import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { getAll, create, update, remove, type BlogPost } from '@/services/cms'
import { Card, Button, Modal, Input, Badge, EmptyState, ConfirmDialog } from '@/components/ui'

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', categories: '', tags: '', author: '', status: 'draft' as const, seo: { title: '', description: '', keywords: '' } })

  useEffect(() => { setPosts(getAll('blog')) }, [])

  const refresh = () => setPosts(getAll('blog'))

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', categories: '', tags: '', author: '', status: 'draft', seo: { title: '', description: '', keywords: '' } })
    setShowModal(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, featuredImage: post.featuredImage, categories: post.categories.join(', '), tags: post.tags.join(', '), author: post.author, status: post.status, seo: post.seo || { title: '', description: '', keywords: '' } })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const data = {
      title: form.title, slug, excerpt: form.excerpt, content: form.content,
      featuredImage: form.featuredImage,
      categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: form.author, status: form.status, seo: form.seo,
    }
    if (editing) {
      update('blog', editing.id, data)
    } else {
      create('blog', data)
    }
    setShowModal(false)
    refresh()
  }

  const statusColor = (s: string) => s === 'published' ? 'success' : s === 'scheduled' ? 'warning' : 'default'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Blog</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage blog posts</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Post</Button>
      </div>
      <Card>
        {posts.length === 0 ? (
          <EmptyState title="No posts" description="Create your first blog post" action={<Button variant="primary" size="sm" onClick={openCreate}>Create Post</Button>} />
        ) : (
          <div className="space-y-2">
            {posts.map(post => (
              <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                {post.featuredImage && <img src={post.featuredImage} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{post.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">/{post.slug} · {post.author || 'Unknown'}</p>
                </div>
                <Badge variant={statusColor(post.status) as any}>{post.status}</Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {post.status === 'published' && <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => window.open('/blog/' + post.slug, '_blank')} />}
                  <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(post)} />
                  <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(post.id)} className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Post' : 'New Post'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Title" value={form.title} onChange={v => { setForm({ ...form, title: v }); if (!editing) setForm(prev => ({ ...prev, title: v, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })) }} />
          <Input label="URL Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="HTML content" />
          </div>
          <Input label="Featured Image URL" value={form.featuredImage} onChange={v => setForm({ ...form, featuredImage: v })} />
          <Input label="Categories (comma separated)" value={form.categories} onChange={v => setForm({ ...form, categories: v })} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} />
          <Input label="Author" value={form.author} onChange={v => setForm({ ...form, author: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
          <div className="border-t border-[var(--border-primary)] pt-4">
            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">SEO</p>
            <Input label="Meta Title" value={form.seo.title || ''} onChange={v => setForm({ ...form, seo: { ...form.seo, title: v } })} />
            <div className="mt-3">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Meta Description</label>
              <textarea value={form.seo.description || ''} onChange={e => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
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
