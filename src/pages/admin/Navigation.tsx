import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface NavItem {
  id: string
  label: string
  path: string
  order: number
  status: boolean
  openInNewTab: boolean
}

const pageOptions = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Blog', path: '/blog' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Team', path: '/team' },
  { label: 'Clients', path: '/clients' },
  { label: 'Awards', path: '/awards' },
  { label: 'Careers', path: '/careers' },
  { label: 'Contact', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms', path: '/terms' },
]

export default function AdminNavigation() {
  const [items, setItems] = useState<NavItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<NavItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ label: '', path: '/', openInNewTab: false })
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminNavigation') || '[]')
    setItems(data)
  }, [])

  const saveToLocal = (data: NavItem[]) => {
    localStorage.setItem('adminNavigation', JSON.stringify(data))
    setItems(data)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ label: '', path: '/', openInNewTab: false })
    setShowModal(true)
  }

  const openEdit = (item: NavItem) => {
    setEditing(item)
    setForm({ label: item.label, path: item.path, openInNewTab: item.openInNewTab })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.label.trim()) return
    let updated: NavItem[]
    if (editing) {
      updated = items.map((i) =>
        i.id === editing.id ? { ...i, label: form.label, path: form.path, openInNewTab: form.openInNewTab } : i
      )
    } else {
      const newItem: NavItem = {
        id: Date.now().toString(),
        label: form.label,
        path: form.path,
        order: items.length,
        status: true,
        openInNewTab: form.openInNewTab,
      }
      updated = [...items, newItem]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
  }

  const toggleStatus = (id: string) => {
    const updated = items.map((i) => (i.id === id ? { ...i, status: !i.status } : i))
    saveToLocal(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...items]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    updated.forEach((item, i) => (item.order = i))
    saveToLocal(updated)
  }

  const moveDown = (index: number) => {
    if (index === items.length - 1) return
    const updated = [...items]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    updated.forEach((item, i) => (item.order = i))
    saveToLocal(updated)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    const updated = items.filter((i) => i.id !== deleteId)
    updated.forEach((item, i) => (item.order = i))
    saveToLocal(updated)
    setDeleteId(null)
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const updated = [...items]
    const [moved] = updated.splice(dragIndex, 1)
    updated.splice(index, 0, moved)
    updated.forEach((item, i) => (item.order = i))
    saveToLocal(updated)
    setDragIndex(index)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Navigation Manager</h1>
          <p className="text-[#111]/60 text-sm mt-1">{items.length} menu items</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="doodle-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-3 border-[#111]">
                    <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-4 py-4 w-12">#</th>
                    <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-4 py-4">Label</th>
                    <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-4 py-4">Path</th>
                    <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-4 py-4">Status</th>
                    <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-4 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-[#111]/40 text-sm">No menu items. Click "Add Item" to create one.</td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors cursor-grab active:cursor-grabbing ${dragIndex === index ? 'opacity-50 bg-[#60A5FA]/20' : ''}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#111]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                            <span className="text-sm text-[#111]/40 font-mono">{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-[#111]">{item.label}</p>
                        </td>
                        <td className="px-4 py-4">
                          <code className="text-xs px-2 py-1 bg-[#60A5FA]/20 border-2 border-[#111] text-[#111]">{item.path}</code>
                          {item.openInNewTab && <span className="ml-2 text-[10px] text-[#111]/40 font-bold">[New Tab]</span>}
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => toggleStatus(item.id)} className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 border-[#111] text-xs font-bold transition-all ${item.status ? 'bg-[#4D7AFF] text-white' : 'bg-[#60A5FA] text-[#111]'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.status ? 'bg-white' : 'bg-[#111]'}`} />
                            {item.status ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button onClick={() => moveDown(index)} disabled={index === items.length - 1} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button onClick={() => openEdit(item)} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteId(item.id)} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="doodle-card p-6">
            <h2 className="text-lg font-black text-[#111] mb-4">Preview</h2>
            <div className="bg-white border-3 border-[#111] overflow-hidden">
              <div className="bg-[#60A5FA] border-b-3 border-[#111] px-4 py-2">
                <p className="text-xs font-black text-[#111]">AB <span className="opacity-60">DIGITAL</span></p>
              </div>
              <div className="p-3 space-y-1">
                {items.filter((i) => i.status).length === 0 ? (
                  <p className="text-xs text-[#111]/40 text-center py-4">No active items</p>
                ) : (
                  items.filter((i) => i.status).map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2 px-3 py-2 border-2 border-[#111] bg-white text-sm font-bold text-[#111]">
                      <span className="w-1.5 h-1.5 bg-[#60A5FA] border border-[#111]" />
                      <span>{item.label}</span>
                      {item.openInNewTab && (
                        <svg className="w-3 h-3 text-[#111]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <p className="text-[10px] text-[#111]/40 mt-3 text-center">Drag items to reorder</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-md doodle-card p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Label</label>
                  <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Menu label" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Path</label>
                  <select value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none">
                    {pageOptions.map((opt) => <option key={opt.path} value={opt.path}>{opt.label} ({opt.path})</option>)}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.openInNewTab} onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })} className="w-4 h-4 accent-[#60A5FA]" />
                    <span className="text-sm font-bold text-[#111]/60">Open in new tab</span>
                  </label>
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
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Menu Item</h3>
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

