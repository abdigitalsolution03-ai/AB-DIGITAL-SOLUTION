import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { get } from '@/services/cms'
import type { HeaderSettings } from '@/services/cms'

export default function Header() {
  const [settings, setSettings] = useState<HeaderSettings>({
    logo: '', logoAlt: '', sticky: true, ctaText: 'Get Started', ctaUrl: '/contact',
    announcementBar: { enabled: false, text: '', url: '' },
    navItems: [],
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const data = get<HeaderSettings>('header')
    if (data) setSettings(data)

    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [location])

  return (
    <>
      {settings.announcementBar?.enabled && (
        <div className="bg-blue-600 text-white text-center text-xs py-2 px-4">
          <a href={settings.announcementBar.url || '#'} className="hover:underline">
            {settings.announcementBar.text}
          </a>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || settings.sticky
            ? 'bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
        } ${settings.announcementBar?.enabled ? 'mt-8' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.logoAlt || 'Logo'} className="h-8 lg:h-10 w-auto" />
              ) : (
                <span className="text-xl font-bold text-[#111] dark:text-white">Logo</span>
              )}
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {settings.navItems?.map(item => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.url
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {settings.ctaText && (
                <Link to={settings.ctaUrl} className="ml-3 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                  {settings.ctaText}
                </Link>
              )}
            </nav>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0A0A0A]"
            >
              <div className="px-4 py-4 space-y-1">
                {settings.navItems?.map(item => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.url
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {settings.ctaText && (
                  <Link to={settings.ctaUrl} className="block mt-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold text-center hover:bg-blue-700">
                    {settings.ctaText}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
