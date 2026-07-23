import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiDatabase, FiClock, FiBell, FiShield, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Input, Badge } from '@/components/ui'

const TABS = ['General', 'Departments', 'Notifications', 'Security', 'Backup']

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
      workingHoursStart: '09:00',
      workingHoursEnd: '18:00',
      timezone: 'Asia/Kolkata',
      emailNotifications: true,
      pushNotifications: true,
      passwordMinLength: 8,
      requireSpecialChars: true,
    }
  })
  const [departments, setDepartments] = useState(() => store.getCollection<any>('departments'))
  const [newDept, setNewDept] = useState('')
  const [lastBackup, setLastBackup] = useState(localStorage.getItem('ab_last_backup') || 'Never')
  const [toast, setToast] = useState('')

  useEffect(() => {
    const s = store.getCollection<any>('settings')[0]
    if (s) setSettings(s)
    setDepartments(store.getCollection<any>('departments'))
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

  const addDepartment = () => {
    if (!newDept.trim()) return
    const exists = store.getCollection<any>('departments')
    store.create('departments', {
      name: newDept.trim(),
      code: newDept.trim().slice(0, 3).toUpperCase(),
      headCount: 0,
      budget: 0,
      color: '#3B82F6',
      description: '',
    })
    setNewDept('')
    setDepartments(store.getCollection<any>('departments'))
    showToast('Department added')
  }

  const removeDepartment = (id: string) => {
    store.delete('departments', id)
    setDepartments(store.getCollection<any>('departments'))
    showToast('Department removed')
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
                    {i === 1 && <FiDatabase size={16} />}
                    {i === 2 && <FiBell size={16} />}
                    {i === 3 && <FiShield size={16} />}
                    {i === 4 && <FiSave size={16} />}
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
                <Input label="Working Hours Start" type="time" value={settings.workingHoursStart || '09:00'} onChange={v => updateField('workingHoursStart', v)} />
                <Input label="Working Hours End" type="time" value={settings.workingHoursEnd || '18:00'} onChange={v => updateField('workingHoursEnd', v)} />
              </div>
            </Card>
          )}

          {activeTab === 1 && (
            <Card title="Departments" action={<Button size="sm" icon={<FiSave />} onClick={() => handleSave('Departments')}>Save</Button>}>
              <div className="flex gap-2 mb-4">
                <input value={newDept} onChange={e => setNewDept(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none text-sm"
                  placeholder="New department name" onKeyDown={e => e.key === 'Enter' && addDepartment()} />
                <Button size="sm" icon={<FiPlus />} onClick={addDepartment} disabled={!newDept.trim()}>Add</Button>
              </div>
              <div className="space-y-2">
                {departments.map((dept: any) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color || '#3B82F6' }} />
                      <span className="text-sm font-medium text-[var(--text-primary)]">{dept.name}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">({dept.code})</span>
                    </div>
                    <button onClick={() => removeDepartment(dept.id)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 2 && (
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

          {activeTab === 3 && (
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

          {activeTab === 4 && (
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
