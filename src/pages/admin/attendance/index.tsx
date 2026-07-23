import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiCheckCircle, FiX, FiCalendar, FiMapPin, FiMonitor } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, StatsCard, Avatar, EmptyState, LoadingSpinner } from '@/components/ui'

interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  breakStart: string
  breakEnd: string
  workingHours: number
  overtime: number
  status: 'present' | 'absent' | 'late' | 'half_day'
  geoLocation: string
  browserInfo: string
  deviceInfo: string
  notes: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  departmentId: string
  status: string
}

const SESSION_KEY = 'ab_attendance_session'

function getAttendanceSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

function saveAttendanceSession(data: any) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

function clearAttendanceSession() {
  localStorage.removeItem(SESSION_KEY)
}

export default function AttendanceDashboard() {
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))
  const [departments] = useState(() => store.getCollection<any>('departments'))
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>(() => store.getCollection<any>('attendance').map(mapAtt))
  const [loading, setLoading] = useState(false)
  const [session] = useState(() => getAttendanceSession())

  const today = new Date().toISOString().split('T')[0]
  const todayRecords = useMemo(() => allAttendance.filter(a => a.date === today), [allAttendance, today])

  function calcHours(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.round(diff / 3600000 * 100) / 100
  }

  function handleCheckIn() {
    const now = new Date().toISOString()
    const hour = new Date().getHours()
    const status = hour >= 10 ? 'late' : 'present'
    const record = {
      employeeId: 'current',
      date: today,
      checkIn: now,
      checkOut: '',
      breakStart: '',
      breakEnd: '',
      workingHours: 0,
      overtime: 0,
      status,
      geoLocation: '',
      browserInfo: navigator.userAgent,
      deviceInfo: navigator.platform,
      notes: '',
    }
    const created = store.create<any>('attendance', record)
    const newRecord = { ...record, id: created.id }
    saveAttendanceSession({ ...session, checkIn: now, checkOut: '', breakStart: '', breakEnd: '', status })
    setAllAttendance(prev => [...prev, newRecord])
  }

  function handleCheckOut() {
    if (!session?.checkIn) return
    const now = new Date().toISOString()
    const hours = calcHours(session.checkIn, now)
    const overtime = Math.max(0, hours - 9)
    const existingRecord = allAttendance.find(a => a.date === today && a.employeeId === 'current')
    if (existingRecord) {
      store.update('attendance', existingRecord.id, { checkOut: now, workingHours: hours, overtime })
      setAllAttendance(prev => prev.map(a => a.id === existingRecord.id ? { ...a, checkOut: now, workingHours: hours, overtime } : a))
    }
    saveAttendanceSession({ ...session, checkOut: now, status: hours >= 9 ? 'present' : session.status })
  }

  function handleBreakStart() {
    const now = new Date().toISOString()
    saveAttendanceSession({ ...session, breakStart: now })
  }

  function handleBreakEnd() {
    const now = new Date().toISOString()
    if (session?.breakStart && session?.checkIn) {
      const breakHours = calcHours(session.breakStart, now)
      const workHours = calcHours(session.checkIn, now) - breakHours
      const existingRecord = allAttendance.find(a => a.date === today && a.employeeId === 'current')
      if (existingRecord) {
        store.update('attendance', existingRecord.id, { breakEnd: now, breakStart: session.breakStart, workingHours: workHours })
        setAllAttendance(prev => prev.map(a => a.id === existingRecord.id ? { ...a, breakEnd: now, breakStart: session.breakStart, workingHours: workHours } : a))
      }
    }
    saveAttendanceSession({ ...session, breakEnd: now })
  }

  const hoursWorked = session?.checkIn
    ? session?.checkOut
      ? calcHours(session.checkIn, session.checkOut)
      : session?.breakStart
        ? calcHours(session.checkIn, new Date().toISOString()) - calcHours(session.breakStart, session.breakEnd || new Date().toISOString())
        : calcHours(session.checkIn, new Date().toISOString())
    : 0

  const canCheckIn = !session?.checkIn
  const canCheckOut = session?.checkIn && !session?.checkOut
  const canBreakStart = canCheckOut && !session?.breakStart
  const canBreakEnd = session?.breakStart && !session?.breakEnd

  const stats = {
    present: todayRecords.filter(a => a.status === 'present' || a.status === 'late').length,
    absent: todayRecords.filter(a => a.status === 'absent').length,
    late: todayRecords.filter(a => a.status === 'late').length,
    onLeave: employees.length - todayRecords.length,
  }

  function getDeptName(id: string): string {
    return departments.find((d: any) => d.id === id)?.name || id
  }

  function fullName(e: Employee): string {
    return `${e.firstName} ${e.lastName}`
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Attendance Dashboard</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Badge variant="info" size="lg" dot>Live</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FiCheckCircle />} value={stats.present} label="Present Today" color="green" />
        <StatsCard icon={<FiCalendar />} value={stats.onLeave} label="On Leave" color="gold" />
        <StatsCard icon={<FiClock />} value={stats.late} label="Late" color="warning" />
        <StatsCard icon={<FiX />} value={stats.absent} label="Absent" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="space-y-3">
            <Button
              variant={canCheckIn ? 'primary' : 'ghost'}
              className="w-full"
              size="lg"
              icon={<FiClock />}
              onClick={handleCheckIn}
              disabled={!canCheckIn}
            >
              {canCheckIn ? 'Check In' : 'Checked In ✓'}
            </Button>
            <Button
              variant={canCheckOut ? 'danger' : 'ghost'}
              className="w-full"
              size="lg"
              icon={<FiCheckCircle />}
              onClick={handleCheckOut}
              disabled={!canCheckOut}
            >
              {canCheckOut ? 'Check Out' : session?.checkOut ? 'Checked Out ✓' : 'Check in first'}
            </Button>
            <Button
              variant={canBreakStart ? 'gold' : 'ghost'}
              className="w-full"
              size="lg"
              icon={<FiClock />}
              onClick={handleBreakStart}
              disabled={!canBreakStart}
            >
              {canBreakStart ? 'Break Start' : session?.breakStart ? 'On Break...' : 'Check in first'}
            </Button>
            <Button
              variant={canBreakEnd ? 'primary' : 'ghost'}
              className="w-full"
              size="lg"
              icon={<FiCheckCircle />}
              onClick={handleBreakEnd}
              disabled={!canBreakEnd}
            >
              Break End
            </Button>
          </div>
        </Card>

        <Card title="Today's Session" subtitle="Your attendance info" className="lg:col-span-2">
          {!session?.checkIn ? (
            <EmptyState title="Not checked in" description="Click 'Check In' to start your day" icon={<FiClock />} />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {session?.checkIn ? new Date(session.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">Check In</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {session?.checkOut ? new Date(session.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)]">Check Out</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <p className="text-2xl font-bold text-[var(--royal-blue)]">{hoursWorked.toFixed(1)}h</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Hours Worked</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-center">
                  <Badge variant={session?.status === 'late' ? 'warning' : session?.checkOut ? 'success' : 'info'} size="md" dot>
                    {session?.checkOut ? 'Completed' : session?.status === 'late' ? 'Late' : 'Active'}
                  </Badge>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">Status</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card title="Today's Attendance" subtitle="All employees">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const record = todayRecords.find(a => a.employeeId === emp.id)
                return (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={fullName(emp)} size="sm" />
                        <span className="font-medium text-[var(--text-primary)]">{fullName(emp)}</span>
                      </div>
                    </td>
                    <td className="text-[var(--text-secondary)]">{getDeptName(emp.departmentId)}</td>
                    <td>{record?.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>{record?.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="font-medium">{record?.workingHours ? `${record.workingHours.toFixed(1)}h` : '-'}</td>
                    <td>
                      {!record ? (
                        <Badge variant="default" size="sm">No Data</Badge>
                      ) : (
                        <Badge
                          variant={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : record.status === 'half_day' ? 'info' : 'danger'}
                          size="sm"
                        >
                          {record.status}
                        </Badge>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {employees.length === 0 && (
          <EmptyState title="No employees found" description="Add employees to track attendance" />
        )}
      </Card>
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
    departmentId: raw.departmentId || raw.department || '',
    status: raw.status || 'active',
  }
}

function mapAtt(raw: any): AttendanceRecord {
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    date: raw.date,
    checkIn: raw.checkIn || '',
    checkOut: raw.checkOut || '',
    breakStart: raw.breakStart || '',
    breakEnd: raw.breakEnd || '',
    workingHours: raw.workingHours || raw.hoursWorked || 0,
    overtime: raw.overtime || 0,
    status: raw.status || 'absent',
    geoLocation: raw.geoLocation || '',
    browserInfo: raw.browserInfo || '',
    deviceInfo: raw.deviceInfo || '',
    notes: raw.notes || '',
  }
}
