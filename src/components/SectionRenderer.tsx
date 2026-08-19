import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '@/services/cms'
import { sectionDefinitions, type SectionType } from '@/services/pageRegistry'
import AnimatedSection from './AnimatedSection'
import { iconByName } from './ServiceIcon'

interface SectionRendererProps {
  type: SectionType
  data: Record<string, any>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function SectionRenderer({ type, data }: SectionRendererProps) {
  if (!data) return null

  switch (type) {
    case 'hero': {
      return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {data.background === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          )}
          {data.background === 'solid' && <div className="absolute inset-0 bg-gray-900" />}
          {data.background === 'light' && <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900" />}
          {data.image && (
            <div className="absolute inset-0">
              <img src={getMediaUrl(data.image)} alt="" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
            </div>
          )}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                {data.subtitle && (
                  <motion.span variants={itemVariants} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {data.subtitle}
                  </motion.span>
                )}
                <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {data.title}
                </motion.h1>
                {data.description && (
                  <motion.p variants={itemVariants} className="text-lg text-gray-300 max-w-xl">
                    {data.description}
                  </motion.p>
                )}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  {data.ctaUrl && (
                    <Link to={data.ctaUrl} className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm">
                      {data.ctaText || 'Get Started'}
                    </Link>
                  )}
                  {data.secondaryCtaUrl && (
                    <Link to={data.secondaryCtaUrl} className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-white/5 font-medium transition-colors text-sm">
                      {data.secondaryCtaText || 'Learn More'}
                    </Link>
                  )}
                </motion.div>
              </div>
              {data.image && (
                <motion.div variants={itemVariants} className="hidden lg:block">
                  <img src={getMediaUrl(data.image)} alt="" className="w-full rounded-2xl shadow-2xl" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )
    }

    case 'services': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(data.title || data.subtitle) && (
              <div className="text-center mb-12">
                {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{data.title}</h2>}
                {data.subtitle && <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">{data.subtitle}</p>}
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-blue-500/30 hover:shadow-lg transition-all"
                >
                  {item.icon && <div className="text-3xl mb-4">{iconByName(item.icon)}</div>}
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  {item.description && <p className="text-sm text-[var(--text-tertiary)] mb-4">{item.description}</p>}
                  {item.features && (
                    <ul className="space-y-1.5 mb-4">
                      {item.features.split('\n').filter((f: string) => f.trim()).map((f: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--text-tertiary)]">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.price && <p className="text-xl font-bold text-blue-500 mb-4">{item.price}</p>}
                  {item.slug && (
                    <Link to={`/services/${item.slug}`} className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400">
                      Learn More →
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'testimonials': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(data.title || data.subtitle) && (
              <div className="text-center mb-12">
                {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{data.title}</h2>}
                {data.subtitle && <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">{data.subtitle}</p>}
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className={`w-4 h-4 ${j < (item.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)] mb-4">"{item.content}"</p>
                  <div className="flex items-center gap-3">
                    {item.avatar && <img src={getMediaUrl(item.avatar)} alt="" className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                      {(item.role || item.company) && (
                        <p className="text-xs text-[var(--text-tertiary)]">{item.role}{item.role && item.company ? ', ' : ''}{item.company}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'faq': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {(data.title || data.subtitle) && (
              <div className="text-center mb-12">
                {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{data.title}</h2>}
                {data.subtitle && <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">{data.subtitle}</p>}
              </div>
            )}
            <div className="space-y-3">
              {items.map((item: any, i: number) => (
                <details key={i} className="group rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-[var(--bg-tertiary)]">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.question}</span>
                    <svg className="w-5 h-5 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-4 pt-0 border-t border-[var(--border-primary)]">
                    <p className="text-sm text-[var(--text-tertiary)]">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'about': {
      const stats = data.stats || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {data.image && (
                <div className="relative">
                  <img src={getMediaUrl(data.image)} alt="" className="w-full rounded-2xl shadow-xl" />
                </div>
              )}
              <div className="space-y-6">
                {data.subtitle && <span className="text-sm font-medium text-blue-500">{data.subtitle}</span>}
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">{data.title || 'About Us'}</h2>
                {data.description && <p className="text-[var(--text-tertiary)] leading-relaxed">{data.description}</p>}
                {stats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                    {stats.map((s: any, i: number) => (
                      <div key={i}>
                        <p className="text-2xl font-bold text-blue-500">{s.value}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'team': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(data.title || data.subtitle) && (
              <div className="text-center mb-12">
                {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{data.title}</h2>}
                {data.subtitle && <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">{data.subtitle}</p>}
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-[var(--bg-tertiary)]">
                    {item.image ? <img src={getMediaUrl(item.image)} alt="" className="w-full h-full object-cover" /> : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-[var(--text-tertiary)]">
                        {item.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{item.name}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">{item.role}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mb-3">{item.bio}</p>
                  {item.socialLinks && (
                    <div className="flex justify-center gap-2">
                      {item.socialLinks.split('\n').filter((l: string) => l.trim()).map((link: string, j: number) => {
                        const [platform, url] = link.split(':')
                        return (
                          <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-blue-500 text-xs">
                            {platform}
                          </a>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'pricing': {
      const plans = data.plans || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(data.title || data.subtitle) && (
              <div className="text-center mb-12">
                {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">{data.title}</h2>}
                {data.subtitle && <p className="text-lg text-[var(--text-tertiary)] max-w-2xl mx-auto">{data.subtitle}</p>}
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative p-6 rounded-2xl border-2 ${
                    plan.popular
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/5'
                      : 'border-[var(--border-primary)] bg-[var(--bg-secondary)]'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                      Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-blue-500 mb-2">{plan.price === 'Custom' ? 'Custom' : `₹${String(plan.price).replace(/^[^0-9]/, '')}`}</p>
                  <p className="text-sm text-[var(--text-tertiary)] mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features?.split('\n').filter((f: string) => f.trim()).map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    plan.popular ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)]'
                  }`}>
                    {plan.cta || 'Get Started'}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'process': {
      const steps = data.steps || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(data.title) && (
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">{data.title}</h2>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center p-6"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl">
                    {step.icon || i + 1}
                  </div>
                  <div className="absolute top-8 left-[60%] hidden lg:block">
                    {i < steps.length - 1 && <div className="w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent" />}
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-tertiary)]">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'stats': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center text-white"
                >
                  <p className="text-4xl font-bold">{item.value}{item.suffix || '+'}</p>
                  <p className="text-sm text-blue-200 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'gallery': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-12">{data.title}</h2>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="relative group rounded-xl overflow-hidden">
                  <img src={getMediaUrl(item.image)} alt={item.title || ''} className="w-full h-48 object-cover" />
                  {item.title && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'cta': {
      return (
        <AnimatedSection className="py-20 relative overflow-hidden">
          {data.background && <img src={getMediaUrl(data.background)} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{data.title || 'Ready to Get Started?'}</h2>
            {data.description && <p className="text-lg text-blue-100 mb-8">{data.description}</p>}
            <Link to={data.buttonUrl || '/contact'} className="inline-flex px-8 py-3 rounded-xl bg-white text-blue-700 font-medium hover:bg-blue-50 transition-colors text-sm">
              {data.buttonText || 'Contact Us'}
            </Link>
          </div>
        </AnimatedSection>
      )
    }

    case 'features':
    case 'why-choose-us': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">{data.title}</h2>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-blue-500/30 transition-all"
                >
                  {item.icon && <div className="text-3xl mb-4">{iconByName(item.icon)}</div>}
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  {item.description && <p className="text-sm text-[var(--text-tertiary)]">{item.description}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'awards': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">{data.title}</h2>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-start gap-4"
                >
                  {item.image && <img src={getMediaUrl(item.image)} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                    <p className="text-xs text-blue-500 font-medium mb-2">{item.year}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'portfolio': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">{data.title}</h2>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative rounded-xl overflow-hidden"
                >
                  <img src={getMediaUrl(item.image)} alt={item.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="text-white font-medium text-sm">{item.title}</h3>
                      {item.category && <p className="text-xs text-gray-300">{item.category}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'clients': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">{data.title}</h2>}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {items.map((item: any, i: number) => (
                item.logo ? <img key={i} src={getMediaUrl(item.logo)} alt={item.name} className="h-12" /> : <span key={i} className="text-lg font-bold text-[var(--text-tertiary)]">{item.name}</span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'newsletter': {
      return (
        <section className="py-16" style={{ backgroundColor: data.background || '#3B82F6' }}>
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{data.title || 'Stay Updated'}</h3>
            {data.description && <p className="text-blue-100 text-sm mb-6">{data.description}</p>}
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input type="email" required className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none" placeholder="Enter your email" />
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-white text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors">
                {data.buttonText || 'Subscribe'}
              </button>
            </form>
          </div>
        </section>
      )
    }

    case 'content': {
      return data.html ? (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: data.html }} />
        </AnimatedSection>
      ) : null
    }

    case 'custom-html': {
      return data.html ? (
        <div dangerouslySetInnerHTML={{ __html: data.html }} />
      ) : null
    }

    case 'contact-form': {
      const formFields = data.fields || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-4">{data.title}</h2>}
            {data.description && <p className="text-lg text-[var(--text-tertiary)] text-center mb-8">{data.description}</p>}
            <form onSubmit={e => e.preventDefault()} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {formFields.map((field: any, i: number) => (
                  <div key={i} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    {field.type === 'textarea' ? (
                      <textarea placeholder={field.label} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
                    ) : (
                      <input type={field.type || 'text'} placeholder={field.label} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button type="submit" className="px-8 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors text-sm">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      )
    }

    case 'blog-posts': {
      return null
    }

    case 'careers': {
      const jobs = data.jobs || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-primary)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-4">{data.title}</h2>}
            {data.description && <p className="text-lg text-[var(--text-tertiary)] text-center mb-12">{data.description}</p>}
            <div className="space-y-4">
              {jobs.map((job: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{job.title}</h3>
                      <div className="flex gap-3 text-xs text-[var(--text-tertiary)] mt-1">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors">
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)] mb-3">{job.description}</p>
                  {job.requirements && (
                    <ul className="space-y-1">
                      {job.requirements.split('\n').filter((r: string) => r.trim()).map((r: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--text-tertiary)]">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    case 'case-studies': {
      const items = data.items || []
      return (
        <AnimatedSection className="py-20 bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {data.title && <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-12">{data.title}</h2>}
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)]"
                >
                  <div className="flex items-start gap-4">
                    {item.image && <img src={getMediaUrl(item.image)} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />}
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                      <p className="text-xs text-blue-500 font-medium mb-2">{item.client}</p>
                      <p className="text-sm text-[var(--text-tertiary)] mb-3">{item.description}</p>
                      {item.results && (
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/5">
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Results</p>
                          <p className="text-sm text-blue-600 dark:text-blue-300">{item.results}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )
    }

    default:
      return null
  }
}
