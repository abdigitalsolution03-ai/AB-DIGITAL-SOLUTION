import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price: string
  slug: string
}

export default function Services() {
  const [items, setItems] = useState<ServiceItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cms_services')
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch {}
    }
  }, [])

  if (items.length === 0) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">Services section — add services from the admin panel.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Our Services</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Comprehensive digital solutions to grow your business.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg mb-4">
                {service.icon || '○'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
              {service.features?.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {service.features.map((f, j) => (
                    <li key={j} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              )}
              {service.price && (
                <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">{service.price}</p>
              )}
              <Link to={`/services/${service.slug || '#'}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
