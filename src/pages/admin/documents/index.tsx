import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFolder, FiFile, FiImage, FiFileText, FiSearch, FiUpload, FiPlus, FiDownload, FiTrash2, FiChevronRight, FiGrid, FiList, FiX } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, SearchInput, EmptyState, Badge, Avatar } from '@/components/ui'

const FILE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FiFileText className="text-red-500" size={24} />,
  doc: <FiFileText className="text-blue-500" size={24} />,
  docx: <FiFileText className="text-blue-500" size={24} />,
  xls: <FiFileText className="text-green-500" size={24} />,
  xlsx: <FiFileText className="text-green-500" size={24} />,
  png: <FiImage className="text-purple-500" size={24} />,
  jpg: <FiImage className="text-purple-500" size={24} />,
  jpeg: <FiImage className="text-purple-500" size={24} />,
  gif: <FiImage className="text-purple-500" size={24} />,
  svg: <FiImage className="text-purple-500" size={24} />,
}

function getFileIcon(type: string) {
  return FILE_ICONS[type.toLowerCase()] || <FiFile className="text-[var(--text-tertiary)]" size={24} />
}

function formatSize(bytes: number) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

export default function DocumentsPage() {
  const documents = store.getCollection<any>('documents')
  const users = store.getCollection<any>('users')

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [uploadForm, setUploadForm] = useState({ name: '', description: '', category: '' })
  const [folderName, setFolderName] = useState('')

  const folders = useMemo(() => documents.filter((d: any) => d.type === 'folder' && !d.parentId), [documents])

  const currentItems = useMemo(() => {
    let items = documents.filter((d: any) => d.parentId === currentFolderId)
    if (search) {
      items = items.filter((d: any) => d.name?.toLowerCase().includes(search.toLowerCase()))
    }
    return items
  }, [documents, currentFolderId, search])

  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'All Documents' }]
    if (currentFolderId) {
      let current = documents.find((d: any) => d.id === currentFolderId)
      while (current) {
        crumbs.push({ id: current.id, name: current.name })
        current = current.parentId ? documents.find((d: any) => d.id === current.parentId) : undefined
      }
    }
    return crumbs
  }, [currentFolderId, documents])

  const navigateFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId)
    setSearch('')
  }

  const handleUpload = () => {
    if (!uploadForm.name) return
    store.create('documents', {
      name: uploadForm.name,
      type: uploadForm.name.split('.').pop() || 'other',
      size: Math.floor(Math.random() * 5000000),
      category: uploadForm.category || 'general',
      uploadedBy: store.getCollection<any>('users')[0]?.id || '',
      uploadedByName: store.getCollection<any>('users')[0]?.name || 'Unknown',
      url: '#',
      description: uploadForm.description,
      parentId: currentFolderId,
      version: 1,
    })
    setUploadForm({ name: '', description: '', category: '' })
    setShowUpload(false)
  }

  const handleNewFolder = () => {
    if (!folderName) return
    store.create('documents', {
      name: folderName,
      type: 'folder',
      size: 0,
      category: '',
      uploadedBy: store.getCollection<any>('users')[0]?.id || '',
      uploadedByName: store.getCollection<any>('users')[0]?.name || 'Unknown',
      url: '',
      description: '',
      parentId: currentFolderId,
    })
    setFolderName('')
    setShowNewFolder(false)
  }

  const handleDelete = (id: string) => {
    const children = documents.filter((d: any) => d.parentId === id)
    children.forEach((c: any) => store.delete('documents', c.id))
    store.delete('documents', id)
  }

  const handleDownload = (doc: any) => {
    alert(`Downloading ${doc.name}`)
  }

  const getUserAvatar = (userId: string) => {
    const user = users.find((u: any) => u.id === userId)
    return user?.name?.charAt(0) || '?'
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Documents</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your files and folders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<FiPlus />} onClick={() => setShowNewFolder(true)}>New Folder</Button>
          <Button size="sm" icon={<FiUpload />} onClick={() => setShowUpload(true)}>Upload</Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-[250px] flex-shrink-0">
          <Card padding="none">
            <div className="p-4">
              <button onClick={() => navigateFolder(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !currentFolderId ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}>
                <div className="flex items-center gap-2">
                  <FiFolder size={16} className="text-[var(--royal-blue)]" />
                  All Documents
                </div>
              </button>
            </div>
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Folders</p>
              <div className="space-y-1">
                {folders.map((folder: any) => (
                  <button key={folder.id} onClick={() => navigateFolder(folder.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      currentFolderId === folder.id ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]'
                    }`}>
                    <FiFolder size={16} className="text-gold-500" />
                    {folder.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.id} className="flex items-center gap-1">
                    {i > 0 && <FiChevronRight size={14} />}
                    <button onClick={() => navigateFolder(crumb.id)}
                      className={`hover:text-[var(--text-primary)] transition-colors ${i === breadcrumbs.length - 1 ? 'text-[var(--text-primary)] font-medium' : ''}`}>
                      {crumb.name}
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <SearchInput value={search} onChange={setSearch} placeholder="Search files..." className="w-48" />
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'} transition-colors`}>
                  <FiGrid size={16} />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'} transition-colors`}>
                  <FiList size={16} />
                </button>
              </div>
            </div>

            {currentItems.length === 0 ? (
              <EmptyState title="No files found" description={search ? 'Try a different search term' : 'Upload files or create a folder'} />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {currentItems.map((doc: any, i: number) => (
                  <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                    className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors group">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3">
                        {doc.type === 'folder' ? (
                          <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                            <FiFolder className="text-gold-500" size={28} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                            {getFileIcon(doc.type)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate w-full">{doc.name}</p>
                      {doc.type !== 'folder' && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">{formatSize(doc.size)}</p>
                      )}
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{store.formatDate(doc.createdAt)}</p>
                      {doc.type !== 'folder' && (
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDownload(doc)} className="p-1.5 rounded-lg bg-[var(--royal-blue)]/10 text-[var(--royal-blue)] hover:bg-[var(--royal-blue)]/20">
                            <FiDownload size={12} />
                          </button>
                          <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      )}
                      {doc.type === 'folder' && (
                        <button onClick={() => navigateFolder(doc.id)} className="mt-2 text-xs text-[var(--royal-blue)] hover:underline">
                          Open
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {currentItems.map((doc: any, i: number) => (
                  <motion.div key={doc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                    {doc.type === 'folder' ? (
                      <FiFolder className="text-gold-500" size={20} />
                    ) : (
                      getFileIcon(doc.type)
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{doc.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{store.formatDate(doc.createdAt)}{doc.type !== 'folder' ? ` · ${formatSize(doc.size)}` : ''}</p>
                    </div>
                    {doc.uploadedByName && (
                      <Avatar src="" alt={doc.uploadedByName} size="sm" />
                    )}
                    {doc.type !== 'folder' && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDownload(doc)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--royal-blue)]">
                          <FiDownload size={14} />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}
                    {doc.type === 'folder' && (
                      <button onClick={() => navigateFolder(doc.id)} className="text-sm text-[var(--royal-blue)] hover:underline">Open</button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowUpload(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md premium-card p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Upload File</h2>
                <button onClick={() => setShowUpload(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                  <FiX size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">File Name</label>
                  <input value={uploadForm.name} onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="document.pdf" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
                  <textarea value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none min-h-[80px]" placeholder="Optional description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Category</label>
                  <select value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                    <option value="">Select category</option>
                    <option value="hr">HR</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="engineering">Engineering</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <Button className="w-full" onClick={handleUpload} disabled={!uploadForm.name}>Upload File</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewFolder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowNewFolder(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm premium-card p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Folder</h2>
                <button onClick={() => setShowNewFolder(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                  <FiX size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Folder Name</label>
                  <input value={folderName} onChange={e => setFolderName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="New folder" />
                </div>
                <Button className="w-full" onClick={handleNewFolder} disabled={!folderName}>Create Folder</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
