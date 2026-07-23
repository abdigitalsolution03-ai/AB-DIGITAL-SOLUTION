import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiCalendar, FiX } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Badge, Button, EmptyState } from '@/components/ui'

const EVENT_COLORS: Record<string, string> = {
  birthday: 'bg-pink-500',
  holiday: 'bg-green-500',
  leave: 'bg-orange-500',
  meeting: 'bg-blue-500',
  deadline: 'bg-red-500',
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const holidays = store.getCollection<any>('holidays')
  const leaveRequests = store.getCollection<any>('leaveRequests')
  const employees = store.getCollection<any>('employees')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const events = useMemo(() => {
    const evts: Record<string, { type: string; label: string; details: string }[]> = {}

    holidays.forEach((h: any) => {
      const d = h.date?.slice(0, 10)
      if (d) {
        if (!evts[d]) evts[d] = []
        evts[d].push({ type: 'holiday', label: h.name, details: h.description || '' })
      }
    })

    leaveRequests.forEach((l: any) => {
      const start = l.startDate?.slice(0, 10)
      const end = l.endDate?.slice(0, 10)
      if (start && end) {
        const s = new Date(start)
        const e = new Date(end)
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
          const ds = d.toISOString().slice(0, 10)
          if (!evts[ds]) evts[ds] = []
          evts[ds].push({ type: 'leave', label: `${l.employeeName || 'Someone'} - ${l.type}`, details: l.reason || '' })
        }
      }
    })

    employees.forEach((emp: any) => {
      if (emp.dateOfJoining) {
        const d = new Date(emp.dateOfJoining)
        if (d.getMonth() === month) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          if (!evts[dateStr]) evts[dateStr] = []
          evts[dateStr].push({ type: 'birthday', label: `${emp.name}'s Birthday`, details: `Joining anniversary: ${emp.designation}` })
        }
      }
    })

    return evts
  }, [holidays, leaveRequests, employees, year, month])

  const selectedEvents = selectedDate ? events[selectedDate] || [] : []

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const isToday = (d: number) => {
    const today = new Date()
    return today.getDate() === d && today.getMonth() === month && today.getFullYear() === year
  }

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [firstDayOfWeek, daysInMonth])

  const getDateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendar</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">View events, holidays, leaves and more</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                <FiChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{MONTHS[month]} {year}</h3>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                <FiChevronRight size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-[var(--text-tertiary)] py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((d, i) => {
                  if (d === null) return <div key={`empty-${i}`} className="min-h-[90px]" />
                  const dateStr = getDateStr(d)
                  const dayEvents = events[dateStr] || []
                  return (
                    <button key={d} onClick={() => setSelectedDate(dateStr)}
                      className={`min-h-[90px] p-1.5 rounded-xl border transition-colors text-left ${
                        isToday(d) ? 'border-[var(--royal-blue)] bg-[var(--royal-blue)]/5' : 'border-transparent hover:bg-[var(--bg-secondary)]'
                      } ${selectedDate === dateStr ? 'ring-2 ring-[var(--royal-blue)]' : ''}`}>
                      <span className={`text-sm font-medium ${isToday(d) ? 'text-[var(--royal-blue)]' : 'text-[var(--text-primary)]'}`}>
                        {d}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 3).map((evt, ei) => (
                          <div key={ei} className={`w-full h-1.5 rounded-full ${EVENT_COLORS[evt.type] || 'bg-gray-500'}`} title={evt.label} />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-[var(--text-tertiary)]">+{dayEvents.length - 3} more</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Birthdays</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Holidays</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Leaves</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Meetings</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Deadlines</span>
          </div>
        </div>

        <div>
          <Card title="Events" subtitle={selectedDate ? store.formatDate(selectedDate) : 'Select a date'}>
            {selectedDate ? (
              selectedEvents.length === 0 ? (
                <EmptyState title="No events" description="No events scheduled for this day" />
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((evt, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${EVENT_COLORS[evt.type] || 'bg-gray-500'}`} />
                        <Badge variant={evt.type === 'holiday' ? 'success' : evt.type === 'birthday' ? 'default' : evt.type === 'leave' ? 'warning' : 'info'} size="sm">
                          {evt.type}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{evt.label}</p>
                      {evt.details && <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{evt.details}</p>}
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              <EmptyState icon={<FiCalendar size={40} />} title="Select a date" description="Click on a date to see its events" />
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
