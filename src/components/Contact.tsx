import { useState } from 'react'
import { motion } from 'framer-motion'
import { create } from '@/services/cms'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    create('enquiries', { ...form, status: 'new' })
    setSent(true)
    setForm({ name: '', email: '', phone: '', company: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Get In Touch</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Have a project in mind? Let's talk about it.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" required className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 text-sm" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your Email" required className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 text-sm" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 text-sm" />
              <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 text-sm" />
            </div>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Your Message" required className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 text-sm" />
            <button type="submit" className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm">
              Send Message
            </button>
          </form>
          {sent && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-green-600 dark:text-green-400 text-center font-medium">
              Message sent successfully! We'll get back to you soon.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
