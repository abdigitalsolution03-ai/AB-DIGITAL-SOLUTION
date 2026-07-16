import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  image: string
  published: boolean
  date: string
}

const categories = ['SEO', 'Web Development', 'Marketing', 'Design', 'Business', 'Technology']

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: categories[0], image: '', published: true })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]')
    setPosts(data)
  }, [])

  const saveToLocal = (data: BlogPost[]) => {
    localStorage.setItem('adminBlogPosts', JSON.stringify(data))
    setPosts(data)
  }

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', content: '', excerpt: '', category: categories[0], image: '', published: true })
    setShowModal(true)
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    setForm({ title: post.title, content: post.content, excerpt: post.excerpt, category: post.category, image: post.image, published: post.published })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    let updated: BlogPost[]
    if (editing) {
      updated = posts.map((p) =>
        p.id === editing.id
          ? { ...p, title: form.title, slug: slugify(form.title), content: form.content, excerpt: form.excerpt, category: form.category, image: form.image, published: form.published }
          : p
      )
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: form.title,
        slug: slugify(form.title),
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        image: form.image,
        published: form.published,
        date: new Date().toISOString().split('T')[0]}
      updated = [newPost, ...posts]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
  }

  const togglePublish = (id: string) => {
    const updated = posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    saveToLocal(updated)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(posts.filter((p) => p.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Blog Posts</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage your blog content</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          New Post
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Title</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Category</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#111]/40 text-sm">No blog posts yet. Click "New Post" to create one.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#111]">{post.title}</p>
                      {post.excerpt && <p className="text-xs text-[#111]/40 mt-0.5 truncate max-w-[250px]">{post.excerpt}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-xs font-bold">{post.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60">{post.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePublish(post.id)} className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 border-[#111] text-xs font-bold transition-all ${post.published ? 'bg-[#4D7AFF] text-white' : 'bg-[#60A5FA] text-[#111]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-white' : 'bg-[#111]'}`} />
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(post)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(post.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-2xl doodle-card p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? 'Edit Post' : 'New Post'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Post title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none">
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Status</label>
                    <select value={form.published ? 'published' : 'draft'} onChange={(e) => setForm({ ...form, published: e.target.value === 'published' })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Brief excerpt" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Content</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Post content (markdown supported)" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Cancel</button>
                <button onClick={handleSave} className="doodle-btn-accent px-5 py-2.5 text-sm">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6 md:p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Post</h3>
              <p className="text-[#111]/60 text-sm mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 bg-[#FF4D4D] border-3 border-[#111] text-white font-bold text-sm shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

