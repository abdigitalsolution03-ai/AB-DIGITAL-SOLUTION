import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiPlus, FiThumbsUp, FiEye, FiX, FiTag, FiBookOpen } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, SearchInput, EmptyState, Avatar } from '@/components/ui'

const stagger = {
  initial: { opacity: 0, y: 15 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState(() => store.getCollection<any>('knowledgeBase'))
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [readingArticle, setReadingArticle] = useState<any | null>(null)
  const [showNewArticle, setShowNewArticle] = useState(false)
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, boolean>>({})
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: '', tags: '', status: 'draft' })

  const users = store.getCollection<any>('users')

  const categories = useMemo(() => {
    const cats = new Set<string>()
    articles.forEach((a: any) => { if (a.category) cats.add(a.category) })
    return Array.from(cats)
  }, [articles])

  const filteredArticles = useMemo(() => {
    let items = [...articles].filter((a: any) => a.status === 'published' || a.status === 'draft')
    if (selectedCategory) items = items.filter(a => a.category === selectedCategory)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(a => a.title?.toLowerCase().includes(q) || a.tags?.some((t: string) => t.toLowerCase().includes(q)))
    }
    return items
  }, [articles, selectedCategory, search])

  const refreshArticles = () => setArticles([...store.getCollection<any>('knowledgeBase')])

  const handleNewArticle = () => {
    if (!newArticle.title) return
    store.create('knowledgeBase', {
      title: newArticle.title,
      content: newArticle.content,
      category: newArticle.category || 'General',
      tags: newArticle.tags ? newArticle.tags.split(',').map((t: string) => t.trim()) : [],
      views: 0,
      helpful: 0,
      createdBy: users[0]?.id || '',
      status: newArticle.status,
    })
    setNewArticle({ title: '', content: '', category: '', tags: '', status: 'draft' })
    setShowNewArticle(false)
    refreshArticles()
  }

  const handleReadArticle = (article: any) => {
    setReadingArticle(article)
    store.update('knowledgeBase', article.id, { views: (article.views || 0) + 1 })
    refreshArticles()
  }

  const handleHelpful = (articleId: string, isHelpful: boolean) => {
    setHelpfulFeedback({ ...helpfulFeedback, [articleId]: isHelpful })
    const article = articles.find((a: any) => a.id === articleId)
    if (article && isHelpful) {
      store.update('knowledgeBase', articleId, { helpful: (article.helpful || 0) + 1 })
      refreshArticles()
    }
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Knowledge Base</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Documentation and guides</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setShowNewArticle(true)}>New Article</Button>
      </div>

      <div className="flex gap-6">
        <div className="w-[220px] flex-shrink-0">
          <Card padding="none">
            <div className="p-4">
              <button onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedCategory ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}>
                <div className="flex items-center gap-2">
                  <FiBookOpen size={16} />
                  All Articles
                </div>
              </button>
            </div>
            <div className="px-4 pb-4">
              <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Categories</p>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Search articles by title or tags..." className="w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredArticles.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3">
                <EmptyState title="No articles found" description="Create your first knowledge base article" />
              </div>
            ) : filteredArticles.map((article: any, i: number) => (
              <motion.div key={article.id} custom={i} variants={stagger} initial="initial" animate="animate"
                className="premium-card p-4 cursor-pointer hover:border-[var(--royal-blue)]/30 transition-colors"
                onClick={() => handleReadArticle(article)}>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="default" size="sm">{article.category}</Badge>
                  {article.status === 'draft' && <Badge variant="warning" size="sm">Draft</Badge>}
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-[var(--text-tertiary)] mb-3 line-clamp-2">{article.content?.slice(0, 120)}...</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(article.tags || []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                  <span className="flex items-center gap-1"><FiEye size={12} /> {article.views || 0}</span>
                  <span className="flex items-center gap-1"><FiThumbsUp size={12} /> {article.helpful || 0}</span>
                  <span>{article.views ? `${Math.round(((article.helpful || 0) / article.views) * 100)}%` : '0%'} helpful</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {readingArticle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setReadingArticle(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl premium-card max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[var(--bg-card)] z-10 flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{readingArticle.title}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-tertiary)]">
                    <Badge variant="default" size="sm">{readingArticle.category}</Badge>
                    <span className="flex items-center gap-1"><FiEye size={14} /> {readingArticle.views || 0} views</span>
                    <span className="flex items-center gap-1"><FiThumbsUp size={14} /> {readingArticle.helpful || 0} found helpful</span>
                  </div>
                </div>
                <button onClick={() => setReadingArticle(null)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-[var(--text-primary)] whitespace-pre-wrap">{readingArticle.content}</div>
                <div className="flex flex-wrap gap-1 mt-4">
                  {(readingArticle.tags || []).map((tag: string) => (
                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                      <FiTag size={10} /> {tag}
                    </span>
                  ))}
                </div>
                {!helpfulFeedback[readingArticle.id] && (
                  <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Was this article helpful?</p>
                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" icon={<FiThumbsUp />} onClick={() => handleHelpful(readingArticle.id, true)}>Yes</Button>
                      <Button size="sm" variant="outline" onClick={() => handleHelpful(readingArticle.id, false)}>No</Button>
                    </div>
                  </div>
                )}
                {helpfulFeedback[readingArticle.id] && (
                  <div className="mt-6 p-4 rounded-xl bg-green-500/10 text-green-500 text-sm font-medium text-center">
                    Thank you for your feedback!
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewArticle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowNewArticle(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl premium-card" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Article</h2>
                <button onClick={() => setShowNewArticle(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Title</label>
                  <input value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="Article title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Content</label>
                  <textarea value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none min-h-[200px]" placeholder="Write your article content..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Category</label>
                    <select value={newArticle.category} onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="">Select category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      <option value="General">General</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="FAQ">FAQ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
                    <select value={newArticle.status} onChange={e => setNewArticle({ ...newArticle, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tags (comma separated)</label>
                  <input value={newArticle.tags} onChange={e => setNewArticle({ ...newArticle, tags: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="crm, leads, guide" />
                </div>
                <Button className="w-full" onClick={handleNewArticle} disabled={!newArticle.title}>Create Article</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
