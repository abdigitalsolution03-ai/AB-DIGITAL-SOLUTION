import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiCalendar, FiTrash2, FiEdit2 } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, EmptyState, ConfirmDialog } from '@/components/ui'

interface Holiday {
  id: string
  name: string
  date: string
  type: string
  year: string
}

const initialForm = { name: '', date: '', type: 'public', year: '' }

const holidayTypes = [
  { value: 'public', label: 'Public' },
  { value: 'company', label: 'Company' },
  { value: 'optional', label: 'Optional' },
  { value: 'national', label: 'National' },
  { value: 'festival', label: 'Festival' },
  { value: 'religious', label: 'Religious' },
]

const typeColors: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  public: 'info',
  national: 'info',
  company: 'success',
  festival: 'warning',
  religious: 'default',
  optional: 'default',
}

export default function Holidays() {
  const currentYear = new Date().getFullYear().toString()
  const [holidays, setHolidays] = useState<Holiday[]>(() => store.getCollection<any>('holidays').map(mapHol))
  const [yearFilter, setYearFilter] = useState(currentYear)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const filtered = useMemo(() => {
    return holidays.filter(h => {
      const hYear = h.date ? h.date.slice(0, 4) : h.year
      return hYear === yearFilter
    })
  }, [holidays, yearFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => a.date.localeCompare(b.date))
  }, [filtered])

  const yearOptions = []
  const y = parseInt(currentYear)
  for (let i = -1; i <= 2; i++) {
    const val = String(y + i)
    yearOptions.push({ value: val, label: val })
  }

  function openAdd() {
    setForm({ name: '', date: '', type: 'public', year: yearFilter })
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(holiday: Holiday) {
    setForm({ name: holiday.name, date: holiday.date, type: holiday.type, year: holiday.year })
    setEditingId(holiday.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.name || !form.date) return
    if (editingId) {
      store.update('holidays', editingId, form)
      setHolidays(prev => prev.map(h => h.id === editingId ? { ...h, ...form } : h))
    } else {
      const created = store.create<any>('holidays', form)
      setHolidays(prev => [...prev, { ...form, id: created.id }])
    }
    setShowModal(false)
    setForm(initialForm)
  }

  function handleDelete() {
    if (!deleteTarget) return
    store.delete('holidays', deleteTarget.id)
    setHolidays(prev => prev.filter(h => h.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const calendarDays = useMemo(() => {
    const days: { date: string; day: number; holidays: Holiday[] }[] = []
    const month = new Date().getMonth()
    const daysInMonth = new Date(parseInt(yearFilter), month + 1, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${yearFilter}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayHolidays = sorted.filter(h => h.date === dateStr)
      days.push({ date: dateStr, day: d, holidays: dayHolidays })
    }
    return days
  }, [sorted, yearFilter])

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Holidays</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage company holidays</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32">
            <Select
              options={yearOptions}
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
            />
          </div>
          <div className="flex rounded-lg border border-[var(--border-color)] overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-[var(--royal-blue)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'calendar' ? 'bg-[var(--royal-blue)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}
            >
              Calendar
            </button>
          </div>
          <Button icon={<FiPlus />} onClick={openAdd}>Add Holiday</Button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiCalendar size={36} />}
            title="No holidays"
            description={`No holidays found for ${yearFilter}`}
            action={{ label: 'Add Holiday', onClick: openAdd }}
          />
        </Card>
      ) : viewMode === 'list' ? (
        <Card>
          <div className="divide-y divide-[var(--border-color)]">
            {sorted.map((holiday, i) => (
              <motion.div
                key={holiday.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold text-[var(--royal-blue)]">{new Date(holiday.date).getDate()}</span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{holiday.name}</h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={typeColors[holiday.type] || 'default'} size="sm">{holiday.type}</Badge>
                  <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => openEdit(holiday)} />
                  <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => setDeleteTarget(holiday)} className="text-red-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-[var(--text-tertiary)] py-2">{day}</div>
            ))}
            {Array.from({ length: new Date(parseInt(yearFilter), new Date().getMonth(), 1).getDay() }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {calendarDays.map(({ date, day, holidays: dayHolidays }, i) => {
              const isToday = date === new Date().toISOString().split('T')[0]
              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={`relative p-2 rounded-xl text-sm min-h-[70px] ${
                    isToday ? 'bg-[var(--bg-secondary)] ring-1 ring-[var(--royal-blue)]' : 'hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <span className={`text-xs ${isToday ? 'text-[var(--royal-blue)] font-bold' : 'text-[var(--text-primary)]'}`}>{day}</span>
                  {dayHolidays.map(h => (
                    <div key={h.id} className="mt-0.5">
                      <Badge variant={typeColors[h.type] || 'default'} size="sm" className="text-[8px] px-1 py-0 leading-tight truncate block max-w-full">
                        {h.name}
                      </Badge>
                    </div>
                  ))}
                </motion.div>
              )
            })}
          </div>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Holiday' : 'Add Holiday'} size="md">
        <div className="space-y-4">
          <Input label="Holiday Name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} required />
          <Select
            label="Type"
            options={holidayTypes}
            value={form.type}
            onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
          />
          <Input label="Year" type="number" value={form.year || yearFilter} onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Add'} Holiday</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Holiday"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}

function mapHol(raw: any): Holiday {
  return {
    id: raw.id,
    name: raw.name || '',
    date: raw.date || '',
    type: raw.type || 'public',
    year: raw.year || (raw.date ? raw.date.slice(0, 4) : new Date().getFullYear().toString()),
  }
}
