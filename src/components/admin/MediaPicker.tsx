import { useState, useEffect, useRef, useMemo } from 'react'
import { FiX, FiUpload, FiSearch, FiFile, FiCheck } from 'react-icons/fi'
import { getAll, create, type Media } from '@/services/cms'
import { Button } from '@/components/ui'

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [items, setItems] = useState<Media[]>([])
  const [query, setQuery] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setItems(getAll('media'))
      setQuery('')
      setSelectedUrl(null)
    }
  }, [open])

  const filtered = useMemo(() => {
    let list = items
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(m => m.name.toLowerCase().includes(q) || (m.alt || '').toLowerCase().includes(q))
    }
    return list
  }, [items, query])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const type = file.type.startsWith('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document'
    const r = new FileReader()
    r.onload = () => {
      try {
        create('media', { name: file.name, url: r.result as string, type, alt: '', size: (r.result as string).length, folder: 'root' })
        setItems(getAll('media'))
      } catch { /* quota */ }
      setUploading(false)
    }
    r.readAsDataURL(file)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">Select Media</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{items.length} files in library</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<FiUpload />} onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"><FiX size={16} /></button>
          </div>
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => { handleUpload(e); e.target.value = '' }} />
        </div>

        <div className="px-5 py-3 border-b border-[var(--border-primary)]">
          <div className="relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search media…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none focus:border-blue-500 placeholder:text-[var(--text-tertiary)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-10">No media found. Upload a file to get started.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedUrl(item.url)}
                  className={`group relative rounded-xl overflow-hidden border-2 bg-[var(--bg-secondary)] transition-all ${
                    selectedUrl === item.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent hover:border-blue-300'
                  }`}
                >
                  <div className="aspect-square flex items-center justify-center bg-[var(--bg-tertiary)]">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <FiFile size={24} className="text-[var(--text-tertiary)]" />
                    )}
                  </div>
                  <p className="px-1.5 py-1 text-[10px] text-[var(--text-primary)] truncate">{item.name}</p>
                  {selectedUrl === item.url && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center"><FiCheck size={11} /></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--border-primary)]">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!selectedUrl}
            onClick={() => { if (selectedUrl) onSelect(selectedUrl) }}
          >
            Use Selected
          </Button>
        </div>
      </div>
    </div>
  )
}