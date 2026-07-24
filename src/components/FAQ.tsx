import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export default function FAQSection() {
  const [items, setItems] = useState<FAQItem[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cms_db')
    if (stored) {
      try {
        const db = JSON.parse(stored)
        if (db.faqs) setItems(db.faqs.filter((f: any) => f.status === 'published'))
      } catch {}
    }
  }, [])

  if (items.length === 0) return null

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Find answers to common questions.</p>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
              <button onClick={() => setOpenId(openId === item.id ? null : item.id)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{item.question}</span>
                <FiChevronDown className={`shrink-0 text-gray-400 transition-transform ${openId === item.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
