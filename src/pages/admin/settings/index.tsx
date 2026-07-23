import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiDatabase, FiClock, FiBell, FiShield } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Input } from '@/components/ui'

const TABS = ['General', 'Notifications', 'Security', 'Backup']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [settings, setSettings] = useState<any>(() => {
    const existing = store.getCollection<any>('settings')[0]
    return existing || {
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      logo: '',
      timezone: 'Asia/Kolkata',
      emailNotifications: true,
      pushNotifications: true,
      passwordMinLength: 8,
      requireSpecialChars: true,
    }
  })
  const [lastBackup, setLastBackup] = useState(localStorage.getItem('ab_last_backup') || 'Never')
  const [toast, setToast] = useState('')

  useEffect(() => {
    const s = store.getCollection<any>('settings')[0]
    if (s) setSettings(s)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSave = (section: string) => {
    const existing = store.getCollection<any>('settings')[0]
    if (existing) {
      store.update('settings', existing.id, settings)
    } else {
      store.create('settings', settings)
    }
    showToast(`${section} settings saved`)
  }

  const updateField = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleBackup = () => {
    const data: Record<string, any> = {}
    const keys = Object.keys(localStorage)
    keys.filter(k => k.startsWith('ab_')).forEach(k => {
      data[k] = localStorage.getItem(k)
    })
    data._backupDate = new Date().toISOString()
    localStorage.setItem('ab_last_backup_data', JSON.stringify(data))
    localStorage.setItem('ab_last_backup', new Date().toISOString())
    setLastBackup(new Date().toISOString())
    showToast('Backup completed successfully')
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Configure system settings</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-[200px] flex-shrink-0">
          <Card padding="none">
            <div className="p-2">
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === i ? 'bg-[var(--royal-blue)]/10 text-[var(--royal-blue)]' : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <div className="flex items-center gap-2">
                    {i === 0 && <FiClock size={16} />}
                    {i === 1 && <FiBell size={16} />}
                    {i === 2 && <FiShield size={16} />}
                    {i === 3 && <FiSave size={16} />}
                    {tab}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 0 && (
            <Card title="General Settings" action={<Button size="sm" icon={<FiSave />} onClick={() => handleSave('General')}>Save</Button>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company Name" value={settings.companyName || ''} onChange={v => updateField('companyName', v)} placeholder="AB Digital Solution" />
                <Input label="Company Email" value={settings.companyEmail || ''} onChange={v => updateField('companyEmail', v)} placeholder="info@abdigital.com" />
                <Input label="Company Phone" value={settings.companyPhone || ''} onChange={v => updateField('companyPhone', v)} placeholder="+91 22 4123 4567" />
                <Input label="Company Address" value={settings.companyAddress || ''} onChange={v => updateField('companyAddress', v)} placeholder="42, Business Tower, Mumbai" />
                <Input label="Logo URL" value={settings.logo || ''} onChange={v => updateField('logo', v)} placeholder="https://example.com/logo.png" />
                <Input label="Timezone" value={settings.timezone || 'Asia/Kolkata'} onChange={v => updateField('timezone', v)} placeholder="Asia/Kolkata" />
              </div>
            </Card>
          )}

          {activeTab === 1 && (
            <Card title="Notification Settings" action={<Button size="sm" icon={<FiSave />} onClick={() => handleSave('Notifications')}>Save</Button>}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Email Notifications</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Receive email notifications for important updates</p>
                  </div>
                  <button onClick={() => updateField('emailNotifications', !settings.emailNotifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-[var(--royal-blue)]' : 'bg-[var(--bg-tertiary)]'} relative`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.emailNotifications ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Push Notifications</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Receive push notifications in browser</p>
                  </div>
                  <button onClick={() => updateField('pushNotifications', !settings.pushNotifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${settings.pushNotifications ? 'bg-[var(--royal-blue)]' : 'bg-[var(--bg-tertiary)]'} relative`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.pushNotifications ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 2 && (
            <Card title="Security Settings" action={<Button size="sm" icon={<FiSave />} onClick={() => handleSave('Security')}>Save</Button>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password Min Length</label>
                  <input type="number" value={settings.passwordMinLength || 8} onChange={e => updateField('passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Require Special Characters</label>
                  <select value={settings.requireSpecialChars ? 'true' : 'false'} onChange={e => updateField('requireSpecialChars', e.target.value === 'true')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 3 && (
            <Card title="Backup" subtitle="Backup your data">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                  <p className="text-sm text-[var(--text-primary)]">Last backup: <span className="font-semibold">{lastBackup === 'Never' ? 'Never' : store.formatDate(lastBackup)}</span></p>
                </div>
                <Button icon={<FiDatabase />} onClick={handleBackup}>Backup Now</Button>
                <p className="text-xs text-[var(--text-tertiary)]">Creates a complete backup of all data stored in localStorage.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl bg-[var(--royal-blue)] text-white text-sm font-medium shadow-lg">
          {toast}
        </motion.div>
      )}
    </PageTransition>
  )
}
