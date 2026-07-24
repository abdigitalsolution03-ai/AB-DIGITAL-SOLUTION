import { useState } from 'react'
import { create } from '@/services/cms'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    create('subscribers', { email })
    setEmail('')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Stay Updated</h2>
        <p className="text-blue-200 text-sm mb-6">Subscribe to our newsletter for the latest updates.</p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 text-sm outline-none focus:border-white/40" />
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors shrink-0">Subscribe</button>
        </form>
        {sent && <p className="text-sm text-blue-200 mt-3">Thank you for subscribing!</p>}
      </div>
    </section>
  )
}
