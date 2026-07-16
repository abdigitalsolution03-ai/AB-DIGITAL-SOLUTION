import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ question: '', answer: '' })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminFAQs') || '[]')
    setFaqs(data)
  }, [])

  const saveToLocal = (data: FAQ[]) => {
    localStorage.setItem('adminFAQs', JSON.stringify(data))
    setFaqs(data)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ question: '', answer: '' })
    setShowModal(true)
  }

  const openEdit = (faq: FAQ) => {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) return
    let updated: FAQ[]
    if (editing) {
      updated = faqs.map((f) =>
        f.id === editing.id ? { ...f, question: form.question, answer: form.answer } : f
      )
    } else {
      const newFaq: FAQ = { id: Date.now().toString(), question: form.question, answer: form.answer }
      updated = [...faqs, newFaq]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(faqs.filter((f) => f.id !== deleteId))
    setDeleteId(null)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...faqs]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    saveToLocal(updated)
  }

  const moveDown = (index: number) => {
    if (index === faqs.length - 1) return
    const updated = [...faqs]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    saveToLocal(updated)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">FAQs</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage frequently asked questions</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          Add FAQ
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">#</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Question</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Answer</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Reorder</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#111]/40 text-sm">No FAQs yet. Click "Add FAQ" to create one.</td>
                </tr>
              ) : (
                faqs.map((faq, index) => (
                  <tr key={faq.id} className="border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-xs font-bold">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#111] max-w-[250px] truncate">{faq.question}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60 truncate max-w-[300px]">{faq.answer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button onClick={() => moveDown(index)} disabled={index === faqs.length - 1} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(faq)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(faq.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
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
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Question</label>
                  <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="What is your question?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Answer</label>
                  <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={5} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none" placeholder="Your answer..." />
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
              <h3 className="text-lg font-black text-[#111] mb-2">Delete FAQ</h3>
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

