import { useState, useEffect } from 'react'
import { FiTrash2, FiDownload } from 'react-icons/fi'
import { getAll, remove } from '@/services/cms'
import { Card, Button, EmptyState, ConfirmDialog } from '@/components/ui'

export default function AdminSubscribers() {
  const [items, setItems] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { setItems(getAll('subscribers')) }, [])

  const refresh = () => setItems(getAll('subscribers'))

  const exportCSV = () => {
    const csv = 'Email,Date\n' + items.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Subscribers</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Newsletter subscribers</p>
        </div>
        {items.length > 0 && <Button variant="outline" size="sm" icon={<FiDownload />} onClick={exportCSV}>Export CSV</Button>}
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No subscribers" description="Subscribers will appear here when people sign up" />
        ) : (
          <div className="space-y-2">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.email}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(item.id)} className="text-red-500" />
              </div>
            ))}
          </div>
        )}
      </Card>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('subscribers', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Subscriber?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
