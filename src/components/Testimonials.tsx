import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'

interface TestimonialItem {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

export default function TestimonialsSection() {
  const [items, setItems] = useState<TestimonialItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cms_db')
    if (stored) {
      try {
        const db = JSON.parse(stored)
        if (db.testimonials) setItems(db.testimonials.filter((t: any) => t.status === 'published'))
      } catch {}
    }
  }, [])

  if (items.length === 0) return null

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">What Our Clients Say</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Real feedback from real clients.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                {item.avatar ? (
                  <img src={item.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.role}{item.company ? ` · ${item.company}` : ''}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">&ldquo;{item.content}&rdquo;</p>
              {item.rating > 0 && (
                <div className="flex gap-0.5 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={14} className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
