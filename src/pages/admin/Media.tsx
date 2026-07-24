import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiTrash2, FiImage, FiFile, FiCopy } from 'react-icons/fi'
import { getAll, create, remove, type Media } from '@/services/cms'
import { Card, Button, Modal, EmptyState, ConfirmDialog } from '@/components/ui'

export default function AdminMedia() {
  const [items, setItems] = useState<Media[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [preview, setPreview] = useState<Media | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setItems(getAll('media')) }, [])

  const refresh = () => setItems(getAll('media'))

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const type = file.type.startsWith('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'document'
      create('media', {
        name: file.name, url: reader.result, type,
        alt: '', size: file.size, folder: 'root',
      })
      refresh()
    }
    reader.readAsDataURL(file)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard?.writeText(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Media Library</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Upload and manage media files</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiUpload />} onClick={() => fileRef.current?.click()}>Upload</Button>
        <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No media" description="Upload your first file" action={<Button variant="primary" size="sm" icon={<FiUpload />} onClick={() => fileRef.current?.click()}>Upload</Button>} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map(item => (
              <motion.div key={item.id} layout className="group relative rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)] cursor-pointer" onClick={() => setPreview(item)}>
                <div className="aspect-square flex items-center justify-center bg-[var(--bg-tertiary)]">
                  {item.type === 'image' ? (
                    <img src={item.url} alt={item.alt || item.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiFile size={32} className="text-[var(--text-tertiary)]" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-[var(--text-primary)] truncate">{item.name}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)]">{item.type}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); copyUrl(item.url) }} className="w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><FiCopy size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }} className="w-7 h-7 rounded-lg bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500"><FiTrash2 size={12} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name || ''}>
        {preview?.type === 'image' && <img src={preview.url} alt={preview.name} className="w-full rounded-xl" />}
        <p className="text-sm text-[var(--text-tertiary)] mt-2">Type: {preview?.type} · Size: {preview?.size ? Math.round(preview.size / 1024) + 'KB' : 'N/A'}</p>
        <Button variant="primary" size="sm" className="mt-3" onClick={() => { if (preview) copyUrl(preview.url) }}>Copy URL</Button>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('media', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Media?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
