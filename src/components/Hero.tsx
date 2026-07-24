import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { get } from '@/services/cms'

interface HeroContent {
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaUrl: string
  secondaryCtaText: string
  secondaryCtaUrl: string
  image: string
  background: string
}

export default function Hero() {
  const [content, setContent] = useState<HeroContent>({
    title: 'Welcome',
    subtitle: 'Your Digital Partner',
    description: 'We help businesses grow with modern digital solutions.',
    ctaText: 'Get Started',
    ctaUrl: '/contact',
    secondaryCtaText: 'Learn More',
    secondaryCtaUrl: '/about',
    image: '',
    background: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('cms_hero')
    if (stored) {
      try { setContent(JSON.parse(stored)) } catch {}
    }
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {content.subtitle && (
              <span className="inline-block text-xs font-semibold text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full mb-4">
                {content.subtitle}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {content.title}
            </h1>
            {content.description && (
              <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-lg">
                {content.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-8">
              {content.ctaText && (
                <Link to={content.ctaUrl} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm">
                  {content.ctaText}
                </Link>
              )}
              {content.secondaryCtaText && (
                <Link to={content.secondaryCtaUrl} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition-colors text-sm">
                  {content.secondaryCtaText}
                </Link>
              )}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden lg:block">
            {content.image && (
              <img src={content.image} alt="Hero" className="w-full rounded-2xl shadow-2xl" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
