import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  message: string
  service: string
  read: boolean
  date: string
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewLead, setViewLead] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminLeads') || '[]')
    setLeads(data)
  }, [])

  const saveToLocal = (data: Lead[]) => {
    localStorage.setItem('adminLeads', JSON.stringify(data))
    setLeads(data)
  }

  const toggleRead = (id: string) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, read: !l.read } : l))
    saveToLocal(updated)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(leads.filter((l) => l.id !== deleteId))
    setDeleteId(null)
  }

  const filteredLeads = leads.filter((l) => {
    if (filter === 'read') return l.read
    if (filter === 'unread') return !l.read
    return true
  })

  const unreadCount = leads.filter((l) => !l.read).length

  const handleAddLead = () => {
    if (!addForm.name.trim() || !addForm.email.trim()) return
    const newLead: Lead = {
      id: Date.now().toString(),
      name: addForm.name,
      email: addForm.email,
      phone: addForm.phone,
      message: addForm.message,
      service: addForm.service,
      read: false,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    saveToLocal([newLead, ...leads])
    setAddForm({ name: '', email: '', phone: '', service: '', message: '' })
    setShowAdd(false)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Leads</h1>
          <p className="text-[#111]/60 text-sm mt-1">
            {leads.length} total {unreadCount > 0 && `- ${unreadCount} unread`}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="doodle-btn-accent px-5 py-2.5 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold transition-all border-3 border-[#111] ${
              filter === f ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#60A5FA]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-[#FF4D4D] text-white text-xs">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Name</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Service</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#111]/40 text-sm">No leads found.</td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className={`border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors ${!lead.read ? 'bg-[#60A5FA]/5' : ''}`}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleRead(lead.id)} className={`w-3 h-3 border-2 border-[#111] transition-all ${lead.read ? 'bg-white' : 'bg-[#60A5FA]'}`} title={lead.read ? 'Mark as unread' : 'Mark as read'} />
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setViewLead(lead)} className="text-sm font-bold text-[#111] hover:text-[#60A5FA] transition-colors text-left">
                        {lead.name}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60">{lead.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-xs font-bold">{lead.service || 'General'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/40">{lead.date}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewLead(lead)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(lead.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
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
        {viewLead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setViewLead(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-lg doodle-card p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-[#111]">Lead Details</h2>
                <button onClick={() => setViewLead(null)} className="p-1 text-[#111]/40 hover:text-[#111] transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#111]/40 uppercase tracking-wider font-bold mb-1">Name</p>
                    <p className="text-sm text-[#111] font-bold">{viewLead.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#111]/40 uppercase tracking-wider font-bold mb-1">Service</p>
                    <p className="text-sm text-[#111]">{viewLead.service || 'General'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#111]/40 uppercase tracking-wider font-bold mb-1">Email</p>
                    <p className="text-sm text-[#111]">{viewLead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#111]/40 uppercase tracking-wider font-bold mb-1">Phone</p>
                    <p className="text-sm text-[#111]">{viewLead.phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#111]/40 uppercase tracking-wider font-bold mb-1">Date</p>
                  <p className="text-sm text-[#111]">{viewLead.date}</p>
                </div>
                <div>
                  <p className="text-xs text-[#111]/40 uppercase tracking-wider font-bold mb-1">Message</p>
                  <p className="text-sm text-[#111]/80 mt-1 p-3 border-3 border-[#111] bg-white">{viewLead.message || 'No message'}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => { toggleRead(viewLead.id); setViewLead(null) }} className="px-5 py-2.5 border-3 border-[#111] text-[#111] text-sm font-bold hover:bg-[#60A5FA] transition-all">
                  {viewLead.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <button onClick={() => setViewLead(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-lg doodle-card p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-[#111]">Add Lead</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 text-[#111]/40 hover:text-[#111] transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Name *</label>
                  <input type="text" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Email *</label>
                  <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Phone</label>
                  <input type="text" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Service</label>
                  <select value={addForm.service} onChange={(e) => setAddForm({ ...addForm, service: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm">
                    <option value="">General</option>
                    <option value="Website Development">Website Development</option>
                    <option value="SEO">SEO</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Social Media Marketing">Social Media Marketing</option>
                    <option value="Content Marketing">Content Marketing</option>
                    <option value="Branding">Branding</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Lead Generation">Lead Generation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Message</label>
                  <textarea value={addForm.message} onChange={(e) => setAddForm({ ...addForm, message: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" rows={3} placeholder="Lead message..." />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Cancel</button>
                <button onClick={handleAddLead} disabled={!addForm.name.trim() || !addForm.email.trim()} className="doodle-btn-accent px-5 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Add Lead</button>
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
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Lead</h3>
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

