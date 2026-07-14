import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminTestimonials') || '[]')
    setTestimonials(data)
  }, [])

  const saveToLocal = (data: Testimonial[]) => {
    localStorage.setItem('adminTestimonials', JSON.stringify(data))
    setTestimonials(data)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', role: '', content: '', rating: 5 })
    setShowModal(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({ name: item.name, role: item.role, content: item.content, rating: item.rating })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim()) return
    let updated: Testimonial[]
    if (editing) {
      updated = testimonials.map((t) =>
        t.id === editing.id ? { ...t, ...form } : t
      )
    } else {
      const newItem: Testimonial = { id: Date.now().toString(), ...form }
      updated = [...testimonials, newItem]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(testimonials.filter((t) => t.id !== deleteId))
    setDeleteId(null)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-[#FFD400]' : 'text-[#111]/20'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ))
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Testimonials</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage client testimonials</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          Add Testimonial
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Role</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Content</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Rating</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#111]/40 text-sm">No testimonials yet. Click "Add Testimonial" to create one.</td>
                </tr>
              ) : (
                testimonials.map((item) => (
                  <tr key={item.id} className="border-b border-[#111]/10 hover:bg-[#FFD400]/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#111]">{item.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60">{item.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60 truncate max-w-[300px]">{item.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">{renderStars(item.rating)}</div>
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
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Client name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Role / Company</label>
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="CEO, Company Inc." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Content</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Testimonial content" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="transition-all hover:scale-110">
                        <svg className={`w-6 h-6 ${star <= form.rating ? 'text-[#FFD400]' : 'text-[#111]/20'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    ))}
                  </div>
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
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Testimonial</h3>
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
