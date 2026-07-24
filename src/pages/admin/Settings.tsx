import { useState, useEffect } from 'react'
import { FiRefreshCw, FiDownload, FiUpload } from 'react-icons/fi'
import { get, updateSingle, setSetting, getSetting } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

export default function AdminSettings() {
  const [maintenance, setMaintenance] = useState(false)
  const [customJs, setCustomJs] = useState('')
  const [customHtml, setCustomHtml] = useState('')
  const [exportData, setExportData] = useState('')

  useEffect(() => {
    setMaintenance(getSetting('maintenanceMode') || false)
    setCustomJs(getSetting('customJs') || '')
    setCustomHtml(getSetting('customHtml') || '')
  }, [])

  const saveMaintenance = () => setSetting('maintenanceMode', maintenance)
  const saveJs = () => setSetting('customJs', customJs)
  const saveHtml = () => setSetting('customHtml', customHtml)

  const handleExport = () => {
    const data: Record<string, any> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('cms_')) {
        try { data[key] = JSON.parse(localStorage.getItem(key) || '') } catch { data[key] = localStorage.getItem(key) }
      }
    }
    setExportData(JSON.stringify(data, null, 2))
  }

  const handleImport = () => {
    try {
      const data = JSON.parse(exportData)
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      alert('Data imported successfully. Reloading...')
      window.location.reload()
    } catch {
      alert('Invalid JSON format')
    }
  }

  const handleClearCache = () => {
    localStorage.removeItem('cms_db')
    window.location.reload()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Website configuration</p>
      </div>
      <div className="space-y-6">
        <Card title="Maintenance Mode">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={maintenance} onChange={e => { setMaintenance(e.target.checked); setSetting('maintenanceMode', e.target.checked) }} className="rounded" />
            <span className="text-sm text-[var(--text-primary)]">Enable maintenance mode</span>
          </label>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Visitors will see a maintenance page while you update your site.</p>
        </Card>
        <Card title="Custom Code">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Custom JavaScript</label>
            <textarea value={customJs} onChange={e => { setCustomJs(e.target.value); setSetting('customJs', e.target.value) }} rows={5} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="// Your custom JavaScript" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Custom HTML (head/footer)</label>
            <textarea value={customHtml} onChange={e => { setCustomHtml(e.target.value); setSetting('customHtml', e.target.value) }} rows={5} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="<!-- Custom HTML -->" />
          </div>
        </Card>
        <Card title="Backup & Restore">
          <div className="flex gap-2 mb-4">
            <Button variant="primary" size="sm" icon={<FiDownload />} onClick={handleExport}>Export All Data</Button>
            <Button variant="outline" size="sm" icon={<FiRefreshCw />} onClick={handleClearCache}>Reset Cache</Button>
          </div>
          {exportData && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Exported JSON</label>
              <textarea value={exportData} readOnly rows={8} className="w-full mb-3 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm font-mono" />
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Import JSON</label>
              <textarea value={exportData} onChange={e => setExportData(e.target.value)} rows={8} className="w-full mb-3 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm font-mono" placeholder="Paste your backup JSON here" />
              <Button variant="primary" size="sm" icon={<FiUpload />} onClick={handleImport}>Import Data</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
