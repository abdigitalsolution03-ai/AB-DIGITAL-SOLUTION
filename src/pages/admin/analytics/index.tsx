import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiCalendar, FiTrendingUp, FiBarChart2 } from 'react-icons/fi'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, StatsCard } from '@/components/ui'

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6']

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('6months')

  const leads = store.getCollection<any>('leads')
  const deals = store.getCollection<any>('deals')

  const leadFunnel = useMemo(() => {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won']
    return stages.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: leads.filter((l: any) => l.stage === stage).length,
    }))
  }, [leads])

  const leadSourceData = useMemo(() => {
    const sources: Record<string, number> = {}
    leads.forEach((l: any) => {
      const s = l.source || 'Direct'
      sources[s] = (sources[s] || 0) + 1
    })
    return Object.entries(sources).map(([name, value]) => ({ name, value }))
  }, [leads])

  const dealsByStage = useMemo(() => {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']
    return stages.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: deals.filter((d: any) => d.stage === stage).length,
    }))
  }, [deals])

  const totalDealValue = deals
    .filter((d: any) => d.stage === 'won')
    .reduce((sum: number, d: any) => sum + (d.value || 0), 0)

  const conversionRate = leads.length > 0
    ? ((deals.filter((d: any) => d.stage === 'won').length / leads.length) * 100).toFixed(1)
    : '0'

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: <FiTrendingUp size={18} />, color: 'royal' },
    { label: 'Active Deals', value: deals.filter((d: any) => d.stage !== 'won' && d.stage !== 'lost').length, icon: <FiBarChart2 size={18} />, color: 'gold' },
    { label: 'Won Deals', value: deals.filter((d: any) => d.stage === 'won').length, icon: <FiTrendingUp size={18} />, color: 'green' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: <FiTrendingUp size={18} />, color: 'purple' },
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">Track your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" icon={<FiCalendar />}>Last 6 Months</Button>
          <Button size="sm" variant="ghost" icon={<FiDownload />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <StatsCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} color={stat.color as any} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Lead Funnel" subtitle="Leads by stage">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadFunnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Lead Sources" subtitle="Where leads come from">
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {leadSourceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Deal Stages" subtitle="Deals distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealsByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Total Deal Value" subtitle="Won deals revenue">
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--text-primary)]">${totalDealValue.toLocaleString()}</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-2">Total revenue from won deals</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-500">{deals.filter((d: any) => d.stage === 'won').length}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Won</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-red-500">{deals.filter((d: any) => d.stage === 'lost').length}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Lost</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{deals.length}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Total</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}
