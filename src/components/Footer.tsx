import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { get, create } from '@/services/cms'
import type { FooterSettings } from '@/services/cms'

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings>({
    logo: '', description: '', copyright: '© 2025 All rights reserved.',
    socialLinks: [], contact: { email: '', phone: '', address: '' },
    columns: [], paymentIcons: [], newsletterEnabled: true,
  })
  const [email, setEmail] = useState('')

  useEffect(() => {
    const data = get<FooterSettings>('footer')
    if (data) setSettings(data)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    create('subscribers', { email, subscribedAt: new Date().toISOString() })
    setEmail('')
    alert('Subscribed successfully!')
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="h-8 mb-4" />
            ) : (
              <p className="text-white font-bold text-lg mb-4">Footer</p>
            )}
            {settings.description && <p className="text-sm leading-relaxed text-gray-400">{settings.description}</p>}
            {settings.socialLinks?.length > 0 && (
              <div className="flex gap-3 mt-4">
                {settings.socialLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xs">
                    {link.platform?.charAt(0).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>

          {settings.columns?.map((col, i) => (
            <div key={i}>
              <h3 className="text-white font-semibold text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links?.map((link, j) => (
                  <li key={j}>
                    <Link to={link.url} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {settings.contact?.email && <li>{settings.contact.email}</li>}
              {settings.contact?.phone && <li>{settings.contact.phone}</li>}
              {settings.contact?.address && <li className="leading-relaxed">{settings.contact.address}</li>}
            </ul>
          </div>
        </div>

        {settings.newsletterEnabled && (
          <div className="mt-12 p-6 rounded-2xl bg-gray-800/50 border border-gray-700/50">
            <h3 className="text-white font-semibold text-sm mb-2">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-blue-500" />
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0">Subscribe</button>
            </form>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">{settings.copyright}</p>
          {settings.paymentIcons?.length > 0 && (
            <div className="flex gap-2">
              {settings.paymentIcons.map((icon, i) => (
                <span key={i} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{icon}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
