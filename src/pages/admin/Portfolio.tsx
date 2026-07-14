import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  color: string
}

const categories = ['Website', 'SEO', 'Ads', 'Branding']

const colorOptions = ['#FF4D4D', '#4D7AFF', '#8B5CF6', '#FFD400']

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', category: categories[0], description: '', image: '', color: colorOptions[0] })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminPortfolio') || '[]')
    setItems(data)
  }, [])

  const saveToLocal = (data: PortfolioItem[]) => {
    localStorage.setItem('adminPortfolio', JSON.stringify(data))
    setItems(data)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', category: categories[0], description: '', image: '', color: colorOptions[0] })
    setShowModal(true)
  }

  const openEdit = (item: PortfolioItem) => {
    setEditing(item)
    setForm({ title: item.title, category: item.category, description: item.description, image: item.image, color: item.color })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    let updated: PortfolioItem[]
    if (editing) {
      updated = items.map((i) =>
        i.id === editing.id ? { ...i, ...form } : i
      )
    } else {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        ...form}
      updated = [newItem, ...items]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(items.filter((i) => i.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Portfolio</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage your portfolio projects</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          Add Project
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Project</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Category</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Description</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#111]/40 text-sm">No projects yet. Click "Add Project" to create one.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-[#111]/10 hover:bg-[#FFD400]/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: item.color, border: '3px solid #111' }}>
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-[#111]">{item.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-[#FFD400] border-2 border-[#111] text-[#111] text-xs font-bold">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60 truncate max-w-[300px]">{item.description}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FFD400] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
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
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-lg doodle-card p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? 'Edit Project' : 'Add Project'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Project title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none">
                      {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Color</label>
                    <div className="flex gap-2">
                      {colorOptions.map((c) => (
                        <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-10 h-10 border-3 border-[#111] ${form.color === c ? 'ring-2 ring-[#FFD400]' : ''}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Project description" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Image URL</label>
                  <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
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
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Project</h3>
              <p className="text-[#111]/60 text-sm mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 bg-[#FF4D4D] border-3 border-[#111] text-white font-bold text-sm shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
