import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiTrash2, FiFile, FiCopy, FiSearch, FiFolder, FiPlus, FiLink, FiX, FiCheck } from 'react-icons/fi'
import { getAll, create, remove, type Media } from '@/services/cms'
import { Card, Button, Modal, EmptyState, ConfirmDialog } from '@/components/ui'

type Filter = 'all' | 'image' | 'pdf' | 'document'

export default function AdminMedia() {
  const [items, setItems] = useState<Media[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [preview, setPreview] = useState<Media | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [activeFolder, setActiveFolder] = useState('root')
  const [folders, setFolders] = useState<string[]>(['root'])
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const media = getAll<Media>('media')
    setItems(media)
    setFolders(['root', ...new Set(media.map(m => m.folder).filter(f => f && f !== 'root'))])
  }, [])

  const refresh = () => {
    const media = getAll<Media>('media')
    setItems(media)
    setFolders(['root', ...new Set(media.map(m => m.folder).filter(f => f && f !== 'root'))])
  }

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const type = file.type.startsWith('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document'
    if (file.type.startsWith('image')) {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        const MAX = 1600
        let { width, height } = img
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        URL.revokeObjectURL(objectUrl)
        if (!ctx) {
          saveFromFile(file, type)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        saveMedia(file.name, canvas.toDataURL('image/jpeg', 0.82), type)
      }
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        saveFromFile(file, type)
      }
      img.src = objectUrl
    } else {
      saveFromFile(file, type)
    }
  }

  function saveFromFile(file: File, type: string): void {
    const r = new FileReader()
    r.onload = () => saveMedia(file.name, r.result as string, type)
    r.readAsDataURL(file)
  }

  function saveMedia(name: string, url: string, type: string): void {
    try {
      create('media', { name, url, type, alt: '', size: url.length, folder: activeFolder })
      refresh()
      notify(`Uploaded to "${activeFolder === 'root' ? 'Library' : activeFolder}"`)
    } catch {
      notify('Upload failed — storage quota exceeded. Delete some files and retry.')
    }
  }

  const addFolder = () => {
    const name = newFolderName.trim().toLowerCase().replace(/\s+/g, '-')
    if (!name) return
    if (folders.includes(name)) { notify('Folder already exists'); return }
    setFolders(prev => [...prev, name])
    setActiveFolder(name)
    setNewFolderName('')
    setShowNewFolder(false)
    notify(`Folder "${name}" created`)
  }

  const addFromUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    const name = url.split('/').pop()?.split('?')[0] || 'from-url'
    const type = /\.(jpe?g|png|gif|webp|svg)$/i.test(url) ? 'image' : /\.pdf$/i.test(url) ? 'pdf' : 'image'
    try {
      create('media', { name, url, type, alt: '', size: 0, folder: activeFolder })
      refresh()
      setUrlInput('')
      setShowUrlModal(false)
      notify(`Added "${name}"`)
    } catch {
      notify('Could not add media')
    }
  }

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
      notify('URL copied')
    } catch {
      notify('Copy failed')
    }
  }

  const filtered = useMemo(() => {
    let list = items
    if (filter !== 'all') list = list.filter(m => m.type === filter)
    if (activeFolder !== 'root') list = list.filter(m => m.folder === activeFolder)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(m => m.name.toLowerCase().includes(q) || (m.alt || '').toLowerCase().includes(q))
    }
    return list
  }, [items, filter, activeFolder, query])

  const counts = useMemo(() => ({
    all: items.length,
    image: items.filter(m => m.type === 'image').length,
    pdf: items.filter(m => m.type === 'pdf').length,
    document: items.filter(m => m.type === 'document').length,
  }), [items])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Media Library</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">{counts.all} files · {folders.length} folders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<FiLink />} onClick={() => setShowUrlModal(true)}>Add by URL</Button>
          <Button variant="primary" size="sm" icon={<FiUpload />} onClick={() => fileRef.current?.click()}>Upload</Button>
          <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(e) => { handleUpload(e); e.target.value = '' }} />
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] shadow-lg flex items-center gap-2">
          <FiCheck size={14} className="text-green-500" /> {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none focus:border-blue-500 placeholder:text-[var(--text-tertiary)]"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'image', 'pdf', 'document'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                filter === f
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
              }`}
            >
              {f} {f !== 'all' && `(${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <FiFolder size={14} className="text-[var(--text-tertiary)]" />
        {folders.map(folder => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              activeFolder === folder
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
            }`}
          >
            {folder === 'root' ? 'All Media' : folder}
            <span className="ml-1.5 text-[10px] opacity-70">{folder === 'root' ? items.length : items.filter(m => m.folder === folder).length}</span>
          </button>
        ))}
        {showNewFolder ? (
          <span className="flex items-center gap-1.5">
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addFolder(); if (e.key === 'Escape') setShowNewFolder(false) }}
              placeholder="Folder name"
              className="w-32 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-blue-500 text-xs text-[var(--text-primary)] outline-none"
            />
            <button onClick={addFolder} className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"><FiCheck size={12} /></button>
            <button onClick={() => setShowNewFolder(false)} className="w-6 h-6 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] flex items-center justify-center hover:text-[var(--text-primary)]"><FiX size={12} /></button>
          </span>
        ) : (
          <button onClick={() => setShowNewFolder(true)} className="px-2.5 py-1 rounded-lg text-xs font-medium border border-dashed border-[var(--border-primary)] text-[var(--text-tertiary)] hover:text-blue-500 hover:border-blue-400 transition-all flex items-center gap-1">
            <FiPlus size={12} /> New Folder
          </button>
        )}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            title={items.length === 0 ? 'No media' : 'Nothing found'}
            description={items.length === 0 ? 'Upload your first file to get started' : 'Try a different search or folder'}
            action={items.length === 0 ? <Button variant="primary" size="sm" icon={<FiUpload />} onClick={() => fileRef.current?.click()}>Upload</Button> : undefined}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence>
              {filtered.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group relative rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)] cursor-pointer" onClick={() => setPreview(item)}>
                  <div className="aspect-square flex items-center justify-center bg-[var(--bg-tertiary)]">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <FiFile size={32} className="text-[var(--text-tertiary)]" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-[var(--text-primary)] truncate">{item.name}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] capitalize">{item.type}{item.folder && item.folder !== 'root' ? ` · ${item.folder}` : ''}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); copyUrl(item.url, item.id) }} className="w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70" aria-label="Copy URL">
                      {copiedId === item.id ? <FiCheck size={12} /> : <FiCopy size={12} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }} className="w-7 h-7 rounded-lg bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500" aria-label="Delete">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                  {item.folder && item.folder !== 'root' && (
                    <span className="absolute bottom-10 left-2 px-1.5 py-0.5 rounded bg-black/50 text-[9px] text-white">{item.folder}</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name || ''}>
        {preview?.type === 'image' && <img src={preview.url} alt={preview.name} className="w-full rounded-xl" />}
        <p className="text-sm text-[var(--text-tertiary)] mt-2">
          Type: {preview?.type} · Size: {preview?.size ? Math.round(preview.size / 1024) + 'KB' : 'N/A'} · Folder: {preview?.folder || 'root'}
        </p>
        <div className="flex gap-2 mt-3">
          <Button variant="primary" size="sm" onClick={() => { if (preview) copyUrl(preview.url, preview.id) }}>Copy URL</Button>
          <Button variant="outline" size="sm" onClick={() => { if (preview) window.open(preview.url, '_blank') }}>Open</Button>
        </div>
      </Modal>

      <Modal open={showUrlModal} onClose={() => setShowUrlModal(false)} title="Add Media by URL">
        <p className="text-sm text-[var(--text-tertiary)] mb-3">Paste a direct link to an image or PDF file.</p>
        <input
          autoFocus
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addFromUrl() }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={() => setShowUrlModal(false)}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<FiLink />} onClick={addFromUrl}>Add to {activeFolder === 'root' ? 'Library' : activeFolder}</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('media', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Media?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}