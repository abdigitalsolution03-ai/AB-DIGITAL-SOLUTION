import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface Subscriber {
  id: string
  email: string
  date: string
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminSubscribers') || '[]')
    setSubscribers(data)
  }, [])

  const saveToLocal = (data: Subscriber[]) => {
    localStorage.setItem('adminSubscribers', JSON.stringify(data))
    setSubscribers(data)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(subscribers.filter((s) => s.id !== deleteId))
    setDeleteId(null)
  }

  const handleExport = () => {
    const emails = subscribers.map((s) => s.email).join('\n')
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Subscribers</h1>
          <p className="text-[#111]/60 text-sm mt-1">{subscribers.length} total subscribers</p>
        </div>
        <button
          onClick={handleExport}
          className="doodle-btn-accent px-5 py-2.5 text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? 'Copied!' : 'Export Emails'}
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">#</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Date Subscribed</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#111]/40 text-sm">No subscribers yet.</td>
                </tr>
              ) : (
                subscribers.map((sub, index) => (
                  <tr key={sub.id} className="border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/40">{index + 1}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#111]">{sub.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60">{sub.date}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setDeleteId(sub.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6 md:p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Subscriber</h3>
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

