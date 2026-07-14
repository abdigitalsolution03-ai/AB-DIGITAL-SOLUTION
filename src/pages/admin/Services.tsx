import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

const defaultIcon = 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'

const iconOptions = [
  { label: 'Services', path: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { label: 'Code', path: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { label: 'Chart', path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'Globe', path: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { label: 'Lightning', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { label: 'Star', path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
]

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', icon: defaultIcon })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminServices') || '[]')
    setServices(data)
  }, [])

  const saveToLocal = (data: Service[]) => {
    localStorage.setItem('adminServices', JSON.stringify(data))
    setServices(data)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', description: '', icon: defaultIcon })
    setShowModal(true)
  }

  const openEdit = (service: Service) => {
    setEditing(service)
    setForm({ title: service.title, description: service.description, icon: service.icon })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    let updated: Service[]
    if (editing) {
      updated = services.map((s) =>
        s.id === editing.id ? { ...s, title: form.title, description: form.description, icon: form.icon } : s
      )
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        title: form.title,
        description: form.description,
        icon: form.icon,
        order: services.length}
      updated = [...services, newService]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    const updated = services.filter((s) => s.id !== deleteId)
    saveToLocal(updated)
    setDeleteId(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Services</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage your services</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          Add Service
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Icon</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Title</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Description</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#111]/40 text-sm">No services yet. Click "Add Service" to create one.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="border-b border-[#111]/10 hover:bg-[#FFD400]/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-9 h-9 bg-[#FFD400] border-2 border-[#111] flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#111]">{service.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60 truncate max-w-[300px]">{service.description}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(service)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FFD400] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(service.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
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
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Service title" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Service description" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((ico) => (
                      <button key={ico.label} onClick={() => setForm({ ...form, icon: ico.path })} className={`p-3 border-3 border-[#111] transition-all ${form.icon === ico.path ? 'bg-[#FFD400]' : 'bg-white hover:bg-[#FFD400]'}`} title={ico.label}>
                        <svg className="w-5 h-5 text-[#111] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={ico.path} />
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
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Service</h3>
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
