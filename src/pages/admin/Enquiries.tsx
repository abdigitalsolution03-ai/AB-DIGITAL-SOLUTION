import { useState, useEffect } from 'react'
import { FiTrash2, FiDownload, FiMail } from 'react-icons/fi'
import { getAll, remove } from '@/services/cms'
import { Card, Button, Badge, EmptyState, ConfirmDialog } from '@/components/ui'

export default function AdminEnquiries() {
  const [items, setItems] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => { setItems(getAll('enquiries')) }, [])
  const refresh = () => setItems(getAll('enquiries'))

  const exportCSV = () => {
    const csv = 'Name,Email,Phone,Company,Message,Date\n' + items.map(s => `${s.name},${s.email},${s.phone||''},${s.company||''},"${(s.message||'').replace(/"/g,'""')}",${new Date(s.createdAt).toLocaleDateString()}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'enquiries.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Enquiries</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Contact form submissions</p>
        </div>
        {items.length > 0 && <Button variant="outline" size="sm" icon={<FiDownload />} onClick={exportCSV}>Export CSV</Button>}
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No enquiries" description="Contact form submissions will appear here" />
        ) : (
          <div className="space-y-2">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] group cursor-pointer" onClick={() => setSelected(item)}>
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0"><FiMail size={16} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.email} · {new Date(item.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-1">{item.message}</p>
                </div>
                <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }} className="text-red-500 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-secondary)] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{selected.name}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-[var(--text-primary)]">Email:</span> <span className="text-[var(--text-tertiary)]">{selected.email}</span></p>
              {selected.phone && <p><span className="font-medium text-[var(--text-primary)]">Phone:</span> <span className="text-[var(--text-tertiary)]">{selected.phone}</span></p>}
              {selected.company && <p><span className="font-medium text-[var(--text-primary)]">Company:</span> <span className="text-[var(--text-tertiary)]">{selected.company}</span></p>}
              <p><span className="font-medium text-[var(--text-primary)]">Date:</span> <span className="text-[var(--text-tertiary)]">{new Date(selected.createdAt).toLocaleString()}</span></p>
              <div className="pt-3 border-t border-[var(--border-primary)]">
                <p className="font-medium text-[var(--text-primary)] mb-1">Message:</p>
                <p className="text-[var(--text-tertiary)] leading-relaxed">{selected.message}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="mt-4 w-full px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] font-medium">Close</button>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('enquiries', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Enquiry?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
