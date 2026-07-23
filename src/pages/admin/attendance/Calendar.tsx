import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Avatar, Modal, EmptyState } from '@/components/ui'

interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: string
  checkIn: string
  checkOut: string
  workingHours: number
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const statusColors: Record<string, string> = {
  present: 'bg-emerald-500',
  late: 'bg-amber-400',
  absent: 'bg-red-500',
  half_day: 'bg-blue-400',
}

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  half_day: 'info',
}

export default function AttendanceCalendar() {
  const [attendance] = useState<AttendanceRecord[]>(() => store.getCollection<any>('attendance').map(mapAtt))
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const today = new Date().toISOString().split('T')[0]

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [daysInMonth, firstDayOfWeek])

  function getDateStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function getDayStatus(day: number): { status: string; count: number } | null {
    const dateStr = getDateStr(day)
    const records = attendance.filter(a => a.date === dateStr)
    if (records.length === 0) return null
    const statusCounts: Record<string, number> = {}
    records.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1 })
    const dominant = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]
    return { status: dominant[0], count: records.length }
  }

  function getDayDetail(day: number) {
    const dateStr = getDateStr(day)
    return attendance.filter(a => a.date === dateStr)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  function fullName(e: Employee): string {
    return `${e.firstName} ${e.lastName}`
  }

  const selectedRecords = selectedDay ? getDayDetail(parseInt(selectedDay)) : []

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Attendance Calendar</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Monthly view</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FiChevronLeft />} onClick={prevMonth} />
          <span className="text-sm font-semibold text-[var(--text-primary)] min-w-[160px] text-center">{monthName}</span>
          <Button variant="ghost" size="sm" icon={<FiChevronRight />} onClick={nextMonth} />
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present</span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Late</span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Absent</span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Half Day</span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-600" /> No Data</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-[var(--text-tertiary)] py-2">{day}</div>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />
            const dateStr = getDateStr(day)
            const statusInfo = getDayStatus(day)
            const isToday = dateStr === today
            const isSelected = selectedDay === String(day)
            const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6

            return (
              <motion.button
                key={dateStr}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                onClick={() => setSelectedDay(isSelected ? null : String(day))}
                className={`relative p-2 rounded-xl text-sm transition-all min-h-[70px] flex flex-col items-center justify-center ${
                  isSelected ? 'ring-2 ring-[var(--royal-blue)] bg-[var(--bg-secondary)]' : 'hover:bg-[var(--bg-secondary)]'
                } ${isToday ? 'font-bold' : ''}`}
              >
                <span className={`${isToday ? 'text-[var(--royal-blue)]' : 'text-[var(--text-primary)]'}`}>{day}</span>
                {isWeekend && !statusInfo && (
                  <span className="text-[10px] text-[var(--text-tertiary)] mt-0.5">Weekend</span>
                )}
                {statusInfo && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${statusColors[statusInfo.status] || 'bg-gray-300'}`} />
                    <span className="text-[10px] text-[var(--text-tertiary)]">{statusInfo.count}</span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </Card>

      <Modal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? `Attendance for ${selectedDay} ${monthName}` : ''}
        size="md"
      >
        {selectedRecords.length === 0 ? (
          <EmptyState title="No records" description="No attendance data for this day" icon={<FiCalendar />} />
        ) : (
          <div className="space-y-2">
            {selectedRecords.map((rec, i) => {
              const emp = employees.find(e => e.id === rec.employeeId)
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]"
                >
                  <Avatar name={emp ? fullName(emp) : 'Unknown'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{emp ? fullName(emp) : 'Unknown'}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                      {rec.checkIn && <span>In: {new Date(rec.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
                      {rec.checkOut && <span>Out: {new Date(rec.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
                      {rec.workingHours > 0 && <span>{rec.workingHours.toFixed(1)}h</span>}
                    </div>
                  </div>
                  <Badge variant={statusVariants[rec.status] || 'default'} size="sm">{rec.status}</Badge>
                </motion.div>
              )
            })}
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}

function mapEmp(raw: any): Employee {
  if (raw.firstName) return raw
  const parts = (raw.name || '').split(' ')
  return {
    id: raw.id,
    firstName: parts.slice(0, -1).join(' ') || parts[0] || '',
    lastName: parts.slice(-1).join('') || '',
  }
}

function mapAtt(raw: any): AttendanceRecord {
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    date: raw.date,
    status: raw.status || 'absent',
    checkIn: raw.checkIn || '',
    checkOut: raw.checkOut || '',
    workingHours: raw.workingHours || raw.hoursWorked || 0,
  }
}
