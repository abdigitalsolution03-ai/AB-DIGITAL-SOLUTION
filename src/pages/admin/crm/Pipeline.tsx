import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiUser, FiCalendar, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { getCollection, update, remove, formatCurrency } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, EmptyState, ConfirmDialog, Avatar } from '@/components/ui'

const stages = [
  { key: 'prospecting', label: 'Prospecting', color: '#6366F1' },
  { key: 'qualification', label: 'Qualification', color: '#8B5CF6' },
  { key: 'needs-analysis', label: 'Needs Analysis', color: '#EC4899' },
  { key: 'proposal', label: 'Proposal', color: '#F59E0B' },
  { key: 'negotiation', label: 'Negotiation', color: '#F97316' },
  { key: 'closed-won', label: 'Closed Won', color: '#10B981' },
  { key: 'closed-lost', label: 'Closed Lost', color: '#EF4444' },
]

const stageOptions = stages.map(s => ({ value: s.key, label: s.label }))

export default function CRMPipeline() {
  const [deals, setDeals] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [newStage, setNewStage] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const loadData = () => {
    setDeals(getCollection('deals'))
    setUsers(getCollection('users'))
    setCompanies(getCollection('companies'))
  }

  useEffect(loadData, [])

  const getDealsByStage = (stage: string) =>
    deals.filter(d => d.stage === stage)

  const getStageTotal = (stage: string) =>
    getDealsByStage(stage).reduce((sum, d) => sum + (d.amount || 0), 0)

  const openMoveModal = (deal: any) => {
    setSelectedDeal(deal)
    setNewStage(deal.stage)
    setModalOpen(true)
  }

  const handleMove = () => {
    if (selectedDeal && newStage) {
      update('deals', selectedDeal.id, { stage: newStage })
      setModalOpen(false)
      setSelectedDeal(null)
      loadData()
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('deals', deleteId)
      setDeleteId(null)
      loadData()
    }
  }

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggingId(dealId)
    e.dataTransfer.setData('text/plain', dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('text/plain')
    if (dealId) {
      update('deals', dealId, { stage })
      loadData()
    }
    setDraggingId(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pipeline</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Drag deals between stages to update their progress</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
          <span>{deals.length} deals</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {formatCurrency(deals.reduce((s, d) => s + (d.stage !== 'closed-lost' ? d.amount : 0), 0))}
          </span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
        {stages.map((stage, idx) => {
          const stageDeals = getDealsByStage(stage.key)
          const total = getStageTotal(stage.key)

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 w-72 flex flex-col rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="p-4 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{stage.label}</h3>
                  </div>
                  <Badge size="sm">{stageDeals.length}</Badge>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">{formatCurrency(total)}</p>
              </div>

              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[60vh]">
                {stageDeals.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-xs text-[var(--text-tertiary)]">
                    No deals
                  </div>
                ) : stageDeals.map((deal: any, i: number) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className={`p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group ${
                      draggingId === deal.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] flex-1 truncate">{deal.name}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openMoveModal(deal)} className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiEdit2 size={12} /></button>
                        <button onClick={() => setDeleteId(deal.id)} className="p-1 rounded hover:bg-red-50 text-[var(--text-tertiary)] hover:text-red-500"><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                    {deal.company && (
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">{deal.company}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{formatCurrency(deal.amount)}</span>
                      <div className="flex items-center gap-2">
                        {deal.expectedCloseDate && (
                          <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
                            <FiCalendar size={10} /> {new Date(deal.expectedCloseDate).toLocaleDateString()}
                          </span>
                        )}
                        {deal.owner && (
                          <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-medium text-[var(--text-primary)]" title={
                            users.find((u: any) => u.id === deal.owner)?.name || 'Unassigned'
                          }>
                            {(users.find((u: any) => u.id === deal.owner)?.name?.[0] || '?').toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 w-full h-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${deal.probability || 0}%`, backgroundColor: stage.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedDeal(null) }} title="Move Deal" size="sm">
        {selectedDeal && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium">{selectedDeal.name}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{selectedDeal.company} · {formatCurrency(selectedDeal.amount)}</p>
            </div>
            <Select
              label="Move to Stage"
              options={stageOptions}
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => { setModalOpen(false); setSelectedDeal(null) }}>Cancel</Button>
              <Button variant="primary" onClick={handleMove} disabled={newStage === selectedDeal.stage}>Move Deal</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message="Are you sure you want to delete this deal from the pipeline?"
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
