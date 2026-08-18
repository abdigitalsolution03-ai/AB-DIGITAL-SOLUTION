import { useState, useEffect, useMemo } from 'react'
import { FiMessageSquare, FiMail, FiUsers, FiTrendingUp } from 'react-icons/fi'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts'
import { getAll } from '@/services/cms'
import { getEnquiries } from '@/services/auth'
import { Card, StatsCard, EmptyState } from '@/components/ui'

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']

export default function AdminAnalytics() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const list = await getEnquiries()
        setEnquiries(list)
      } catch {
        setEnquiries(getAll<any>('enquiries'))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const subscribers = useMemo(() => getAll<any>('subscribers').length, [])

  const stats = useMemo(() => ({
    total: enquiries.length,
    unread: enquiries.filter(e => !e.read).length,
    new: enquiries.filter(e => (e.status || 'new') === 'new').length,
    won: enquiries.filter(e => e.status === 'won').length,
  }), [enquiries])

  const byDay = useMemo(() => {
    const days = new Map<string, number>()
    for (const e of enquiries) {
      const d = e.createdAt ? new Date(e.createdAt) : new Date()
      const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      days.set(key, (days.get(key) || 0) + 1)
    }
    return [...days.entries()].sort((a, b) => new Date(a[0] + ', 2026').getTime() - new Date(b[0] + ', 2026').getTime()).map(([name, count]) => ({ name, count }))
  }, [enquiries])

  const byService = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of enquiries) {
      const s = e.service || 'General'
      map.set(s, (map.get(s) || 0) + 1)
    }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6)
  }, [enquiries])

  const byStatus = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of enquiries) {
      const s = e.status || 'new'
      map.set(s, (map.get(s) || 0) + 1)
    }
    return [...map.entries()].map(([name, value]) => ({ name, value }))
  }, [enquiries])

  const statusLabel: Record<string, string> = { new: 'New', contacted: 'Contacted', won: 'Won', lost: 'Lost' }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Website lead performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<FiMessageSquare />} label="Total Leads" value={stats.total} color="blue" />
        <StatsCard icon={<FiTrendingUp />} label="New Leads" value={stats.new} color="purple" />
        <StatsCard icon={<FiMail />} label="Unread" value={stats.unread} color="yellow" />
        <StatsCard icon={<FiUsers />} label="Subscribers" value={subscribers} color="green" />
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-tertiary)] py-8 text-center">Loading analytics…</p>
      ) : enquiries.length === 0 ? (
        <EmptyState title="No data yet" description="Leads will appear here once visitors submit the contact form" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card title="Leads per Day">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byDay} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'var(--bg-tertiary)', opacity: 0.4 }} contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Leads by Service">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byService} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                      {byService.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-tertiary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Leads by Status">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={byStatus.map(s => ({ ...s, label: statusLabel[s.name] || s.name }))}>
                    <defs>
                      <linearGradient id="statusGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }} />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#statusGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Conversion Summary">
              <div className="space-y-3">
                {byStatus.map((s, i) => {
                  const pct = stats.total ? Math.round((s.value / stats.total) * 100) : 0
                  return (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="text-[var(--text-secondary)]">{statusLabel[s.name] || s.name}</span>
                        <span className="text-[var(--text-primary)] font-medium">{s.value} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      </div>
                    </div>
                  )
                })}
                {stats.total > 0 && (
                  <p className="text-xs text-[var(--text-tertiary)] pt-2">
                    {stats.won} of {stats.total} leads won ({stats.total ? Math.round((stats.won / stats.total) * 100) : 0}% win rate)
                  </p>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}