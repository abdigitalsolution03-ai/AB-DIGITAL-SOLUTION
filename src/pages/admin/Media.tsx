import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface MediaItem {
  id: string
  name: string
  data: string
  size: number
  folder: string
  date: string
}

interface MediaFolder {
  id: string
  name: string
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([{ id: 'root', name: 'All Media' }])
  const [activeFolder, setActiveFolder] = useState('root')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [moveId, setMoveId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedMedia = JSON.parse(localStorage.getItem('adminMedia') || '[]')
    const savedFolders = JSON.parse(localStorage.getItem('adminMediaFolders') || '[]')
    setMedia(savedMedia)
    if (savedFolders.length) setFolders(savedFolders)
  }, [])

  const saveMedia = (data: MediaItem[]) => {
    localStorage.setItem('adminMedia', JSON.stringify(data))
    setMedia(data)
  }

  const saveFolders = (data: MediaFolder[]) => {
    localStorage.setItem('adminMediaFolders', JSON.stringify(data))
    setFolders(data)
  }

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const newItem: MediaItem = {
        id: Date.now().toString(),
        name: file.name,
        data: reader.result as string,
        size: file.size,
        folder: activeFolder === 'root' ? '' : activeFolder,
        date: new Date().toISOString().split('T')[0],
      }
      saveMedia([newItem, ...media])
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(handleUpload)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (!files) return
    Array.from(files).forEach(handleUpload)
  }, [media, activeFolder])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveMedia(media.filter((m) => m.id !== deleteId))
    setDeleteId(null)
  }

  const addFolder = () => {
    if (!newFolderName.trim()) return
    const folder: MediaFolder = { id: Date.now().toString(), name: newFolderName.trim() }
    saveFolders([...folders, folder])
    setNewFolderName('')
    setShowFolderModal(false)
  }

  const moveToFolder = (id: string, folderId: string) => {
    const updated = media.map((m) => (m.id === id ? { ...m, folder: folderId === 'root' ? '' : folderId } : m))
    saveMedia(updated)
    setMoveId(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const filtered = media.filter((m) => {
    const inFolder = activeFolder === 'root' ? true : m.folder === activeFolder
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return inFolder && matchesSearch
  })

  const getFolderName = (folderId: string) => {
    if (folderId === 'root' || !folderId) return 'All Media'
    const folder = folders.find((f) => f.id === folderId)
    return folder ? folder.name : 'Unknown'
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Media Manager</h1>
          <p className="text-[#111]/60 text-sm mt-1">{media.length} files total</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFolderModal(true)} className="px-4 py-2.5 border-3 border-[#111] text-[#111] text-sm font-bold hover:bg-[#FFD400] transition-all">
            New Folder
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="doodle-btn-accent px-5 py-2.5 text-sm">
            Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            className={`px-4 py-2 text-sm font-bold transition-all border-3 border-[#111] ${
              activeFolder === folder.id ? 'bg-[#FFD400] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#FFD400]'
            }`}
          >
            {folder.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-[#111] text-[#111] text-sm focus:outline-none"
            placeholder="Search media..."
          />
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        className={`doodle-card p-8 mb-6 text-center transition-all ${dragOver ? 'bg-[#FFD400]' : ''}`}
      >
        {dragOver ? (
          <p className="text-lg font-bold text-[#111]">Drop files here</p>
        ) : (
          <div>
            <svg className="w-12 h-12 text-[#FFD400] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-[#111]/60 text-sm">Drag and drop images here, or click Upload</p>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="doodle-card p-12 text-center">
          <p className="text-[#111]/40 text-sm">{search ? 'No media matches your search.' : 'No media in this folder. Upload something!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="doodle-card overflow-hidden group"
            >
              <div className="relative aspect-square bg-[#f8f8f8] border-b-3 border-[#111] overflow-hidden">
                <img src={item.data} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setMoveId(item.id)} className="p-2 bg-white border-2 border-[#111] text-[#111] hover:bg-[#FFD400] transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 bg-white border-2 border-[#111] text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#111] truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[#111]/40">{formatSize(item.size)}</p>
                  <p className="text-[10px] text-[#111]/40">{getFolderName(item.folder)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showFolderModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowFolderModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-black text-[#111] mb-6">New Folder</h2>
              <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Folder name" onKeyDown={(e) => e.key === 'Enter' && addFolder()} />
              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowFolderModal(false)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
                <button onClick={addFolder} className="doodle-btn-accent px-5 py-2.5 text-sm">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {moveId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setMoveId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-black text-[#111] mb-6">Move to Folder</h2>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => moveToFolder(moveId, folder.id)}
                    className="w-full text-left px-4 py-3 border-3 border-[#111] text-sm font-bold text-[#111] hover:bg-[#FFD400] transition-all"
                  >
                    {folder.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-end mt-6">
                <button onClick={() => setMoveId(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6 md:p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Media</h3>
              <p className="text-[#111]/60 text-sm mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 bg-[#FF4D4D] border-3 border-[#111] text-white font-bold text-sm shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
