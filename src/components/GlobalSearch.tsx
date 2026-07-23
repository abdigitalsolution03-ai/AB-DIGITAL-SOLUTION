import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX, FiBriefcase, FiArrowRight } from 'react-icons/fi'
import { store } from '@/services/store'

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: string
  link: string
  icon: React.ReactNode
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
  }, [isOpen])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const results: SearchResult[] = []

    const leads = store.getCollection<any>('leads')
    leads.forEach(lead => {
      if (lead.firstName?.toLowerCase().includes(q) || lead.lastName?.toLowerCase().includes(q) || lead.company?.toLowerCase().includes(q)) {
        results.push({ id: lead.id, title: `${lead.firstName} ${lead.lastName}`, subtitle: `${lead.company || ''}  ${lead.stage || ''}`, category: 'Leads', link: `/admin/crm/leads`, icon: <FiBriefcase size={16} /> })
      }
    })

    return results.slice(0, 20)
  }, [query])

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach(r => {
      if (!groups[r.category]) groups[r.category] = []
      groups[r.category].push(r)
    })
    return groups
  }, [results])

  const flatResults = useMemo(() => results, [results])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      window.location.href = flatResults[selectedIndex].link
      setIsOpen(false)
    }
  }, [flatResults, selectedIndex])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-primary)]">
                <FiSearch className="text-[var(--text-tertiary)] shrink-0" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search leads..."
                  className="flex-1 bg-transparent border-none outline-none text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                  <FiX size={18} />
                </button>
              </div>

              <div ref={resultsRef} className="max-h-96 overflow-y-auto p-2">
                {query.trim() && flatResults.length === 0 && (
                  <div className="py-8 text-center text-sm text-[var(--text-tertiary)]">
                    No results found for "{query}"
                  </div>
                )}

                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-3 py-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((item, idx) => {
                      const globalIdx = flatResults.indexOf(item)
                      return (
                        <a
                          key={item.id}
                          href={item.link}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            globalIdx === selectedIndex
                              ? 'bg-[var(--royal-50)] text-[var(--royal-700)]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <span className="text-[var(--text-tertiary)]">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${globalIdx === selectedIndex ? 'text-[var(--royal-700)]' : 'text-[var(--text-primary)]'}`}>
                              {item.title}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] truncate">{item.subtitle}</p>
                          </div>
                          <FiArrowRight className="text-[var(--text-tertiary)] shrink-0" size={14} />
                        </a>
                      )
                    })}
                  </div>
                ))}

                {query.trim() && flatResults.length > 0 && (
                  <div className="px-3 py-2 mt-1 border-t border-[var(--border-primary)]">
                    <p className="text-[10px] text-[var(--text-tertiary)]">
                      <kbd className="px-1 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">↑↓</kbd> Navigate{' '}
                      <kbd className="px-1 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">Enter</kbd> Open{' '}
                      <kbd className="px-1 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono">Esc</kbd> Close
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
