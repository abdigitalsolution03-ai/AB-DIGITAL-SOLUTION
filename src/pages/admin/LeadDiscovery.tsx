import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'
import { getSession } from '@/services/auth'
import {
  generateLeads, getSavedLeads, saveLead, deleteSavedLead,
  updateLeadStatus, addLeadNote, tagLead, removeLeadTag,
  assignLead, scheduleFollowUp,
  getSearchHistory, saveSearch, deleteSearch,
  getLists, createList, addToList, deleteList,
  downloadCSV, downloadExcel, downloadPDF,
  type Lead, type LeadSearchConfig, type LeadStatus,
  type SearchHistory, type LeadList
} from '@/services/leadDiscovery'

const defaultConfig: LeadSearchConfig = {
  country: '', state: '', city: '', multipleCities: '', radius: 25, zip: '',
  category: '', industry: '', keywords: '', companySize: '',
  rating: 0, minReviews: 0,
  websiteRequired: false, emailRequired: false, phoneRequired: false,
  socialMediaRequired: false, verifiedOnly: false, openNow: false,
  advancedFilters: [],
}

const advancedFilterOptions = [
  'Recently Added', 'High Review Count', 'Newly Opened', 'Without Website',
  'Without Social Media', 'Needing SEO', 'Running Google Ads', 'Poor Website',
  'Slow Websites', 'No SSL', 'Weak SEO',
]

const companySizes = ['', '1-10', '11-50', '51-200', '201-500', '500+']

const statusColors: Record<LeadStatus, string> = {
  'New': '#4D7AFF', 'Contacted': '#60A5FA', 'Qualified': '#8B5CF6',
  'Proposal Sent': '#EC4899', 'Negotiation': '#F59E0B', 'Won': '#10B981',
  'Lost': '#FF4D4D', 'Archived': '#6B7280',
}

const industryOptions = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Real Estate',
  'E-commerce', 'Food & Beverage', 'Travel', 'Automotive', 'Construction',
  'Legal', 'Marketing', 'Manufacturing', 'Retail', 'Fitness',
  'Beauty & Wellness', 'Home Services', 'Logistics', 'Energy', 'Media',
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-[#60A5FA]' : 'text-[#111]/20'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function PriorityBadge({ priority }: { priority: Lead['leadPriority'] }) {
  const colors = { Hot: 'bg-[#FF4D4D]', Warm: 'bg-[#60A5FA] text-[#111]', Cold: 'bg-[#4D7AFF]' }
  return (
    <span className={`px-2 py-0.5 text-[10px] font-black border-2 border-[#111] ${colors[priority]} text-white`}>
      {priority}
    </span>
  )
}

function LeadCard({ lead, onView, onSave, onDelete, saved }: { lead: Lead; onView: () => void; onSave: () => void; onDelete: () => void; saved: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="doodle-card p-4 md:p-5 group cursor-pointer"
      onClick={onView}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[#111] text-sm leading-tight truncate">{lead.businessName}</h3>
          <p className="text-xs text-[#111]/50 mt-0.5 truncate">{lead.category}</p>
        </div>
        <PriorityBadge priority={lead.leadPriority} />
      </div>

      <div className="flex items-center gap-2 text-xs text-[#111]/60 mb-2">
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{lead.city}, {lead.state}</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StarRating rating={lead.rating} />
          <span className="text-[10px] text-[#111]/40 font-medium">({lead.reviewCount})</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 border-2 border-[#111] ${
          lead.status === 'New' ? 'bg-[#4D7AFF] text-white' :
          lead.status === 'Contacted' ? 'bg-[#60A5FA] text-[#111]' :
          lead.status === 'Qualified' ? 'bg-[#8B5CF6] text-white' :
          lead.status === 'Won' ? 'bg-[#10B981] text-white' :
          lead.status === 'Lost' ? 'bg-[#FF4D4D] text-white' :
          'bg-white text-[#111]'
        }`}>{lead.status}</span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="font-bold text-[#111]/60">Opportunity</span>
          <span className="font-black text-[#111]">{lead.opportunityScore}%</span>
        </div>
        <div className="w-full h-2 border-2 border-[#111] bg-white overflow-hidden">
          <div className="h-full bg-[#60A5FA] transition-all duration-500" style={{ width: `${lead.opportunityScore}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {saved ? (
          <button onClick={onDelete} className="flex-1 px-3 py-1.5 border-3 border-[#111] text-[10px] font-bold text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white transition-all flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Unsave
          </button>
        ) : (
          <button onClick={onSave} className="flex-1 px-3 py-1.5 border-3 border-[#111] text-[10px] font-bold text-[#111] hover:bg-[#60A5FA] transition-all flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Save
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onView() }} className="px-3 py-1.5 border-3 border-[#111] text-[10px] font-bold text-[#111] hover:bg-[#60A5FA] transition-all flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
      </div>
    </motion.div>
  )
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? '#10B981' : value >= 50 ? '#60A5FA' : '#FF4D4D'
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-bold text-[#111]/70">{label}</span>
        <span className="font-black text-[#111]" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full h-2.5 border-2 border-[#111] bg-white overflow-hidden">
        <div className="h-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function FilterPanel({ config, setConfig, onGenerate, onSaveSearch, generating }: {
  config: LeadSearchConfig; setConfig: (c: LeadSearchConfig) => void;
  onGenerate: () => void; onSaveSearch: () => void; generating: boolean
}) {
  const update = (key: keyof LeadSearchConfig, value: any) => setConfig({ ...config, [key]: value })
  const toggleAdvanced = (filter: string) => {
    const exists = config.advancedFilters.includes(filter)
    update('advancedFilters', exists ? config.advancedFilters.filter(f => f !== filter) : [...config.advancedFilters, filter])
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-black text-[#111]/40 uppercase tracking-wider mb-3">Location</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Country</label>
            <input type="text" value={config.country} onChange={e => update('country', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="e.g. India" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">State</label>
            <input type="text" value={config.state} onChange={e => update('state', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="e.g. Karnataka" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">City</label>
            <input type="text" value={config.city} onChange={e => update('city', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="e.g. Bangalore" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">ZIP Code</label>
            <input type="text" value={config.zip} onChange={e => update('zip', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="e.g. 560001" />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Multiple Cities (comma separated)</label>
          <textarea value={config.multipleCities} onChange={e => update('multipleCities', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" rows={2} placeholder="Bangalore, Mumbai, Delhi" />
        </div>
        <div className="mt-3">
          <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Radius: {config.radius} km</label>
          <input type="range" min={5} max={500} value={config.radius} onChange={e => update('radius', Number(e.target.value))} className="w-full accent-[#60A5FA]" />
          <div className="flex items-center justify-between text-[10px] text-[#111]/40">
            <span>5 km</span>
            <span>500 km</span>
          </div>
        </div>
      </div>

      <div className="border-t-3 border-[#111]/10 pt-5">
        <h3 className="text-xs font-black text-[#111]/40 uppercase tracking-wider mb-3">Business</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Category</label>
            <input type="text" value={config.category} onChange={e => update('category', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="e.g. Restaurant" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Industry</label>
            <select value={config.industry} onChange={e => update('industry', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm">
              <option value="">All Industries</option>
              {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Keywords</label>
            <input type="text" value={config.keywords} onChange={e => update('keywords', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="digital marketing, web development, seo" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Company Size</label>
            <select value={config.companySize} onChange={e => update('companySize', e.target.value)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm">
              {companySizes.map(s => <option key={s} value={s}>{s || 'Any Size'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Min Reviews</label>
            <input type="number" min={0} value={config.minReviews} onChange={e => update('minReviews', Number(e.target.value))} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Minimum Rating: {config.rating}</label>
          <input type="range" min={0} max={5} step={0.5} value={config.rating} onChange={e => update('rating', Number(e.target.value))} className="w-full accent-[#60A5FA]" />
          <div className="flex items-center justify-between text-[10px] text-[#111]/40">
            <span>Any</span>
            <span>5</span>
          </div>
        </div>
      </div>

      <div className="border-t-3 border-[#111]/10 pt-5">
        <h3 className="text-xs font-black text-[#111]/40 uppercase tracking-wider mb-3">Requirements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {([
            { key: 'websiteRequired', label: 'Website Required' },
            { key: 'emailRequired', label: 'Email Required' },
            { key: 'phoneRequired', label: 'Phone Required' },
            { key: 'socialMediaRequired', label: 'Social Media' },
            { key: 'verifiedOnly', label: 'Verified Only' },
            { key: 'openNow', label: 'Open Now' },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 px-3 py-2 border-3 border-[#111] bg-white cursor-pointer hover:bg-[#60A5FA]/10 transition-all text-[11px] font-bold text-[#111]">
              <input type="checkbox" checked={config[key] as boolean} onChange={e => update(key, e.target.checked)} className="w-3.5 h-3.5 accent-[#60A5FA]" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="border-t-3 border-[#111]/10 pt-5">
        <h3 className="text-xs font-black text-[#111]/40 uppercase tracking-wider mb-3">Advanced Filters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {advancedFilterOptions.map(filter => (
            <label key={filter} className={`flex items-center gap-2 px-3 py-2 border-3 border-[#111] cursor-pointer transition-all text-[11px] font-bold text-[#111] ${config.advancedFilters.includes(filter) ? 'bg-[#60A5FA]' : 'bg-white hover:bg-[#60A5FA]/10'}`}>
              <input type="checkbox" checked={config.advancedFilters.includes(filter)} onChange={() => toggleAdvanced(filter)} className="w-3.5 h-3.5 accent-[#60A5FA]" />
              {filter}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t-3 border-[#111]/10">
        <button onClick={onGenerate} disabled={generating} className="doodle-btn-accent flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {generating ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          Generate Leads
        </button>
        <button onClick={onSaveSearch} className="doodle-btn-outline flex-1 text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Search
        </button>
      </div>
    </div>
  )
}

function LeadDetailModal({ lead, onClose, onRefresh }: { lead: Lead; onClose: () => void; onRefresh: () => void }) {
  const session = getSession()
  const currentUser = session?.name || 'Unknown'
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [tagInput, setTagInput] = useState('')
  const [assigneeInput, setAssigneeInput] = useState(lead.assignedTo || '')
  const [followUp, setFollowUp] = useState(lead.followUpDate || '')
  const [noteText, setNoteText] = useState('')
  const [activeTab, setActiveTab] = useState<'notes' | 'calls' | 'emails' | 'whatsapp'>('notes')

  useEffect(() => { setStatus(lead.status); setAssigneeInput(lead.assignedTo || ''); setFollowUp(lead.followUpDate || '') }, [lead])

  const handleStatusChange = (s: LeadStatus) => {
    setStatus(s)
    updateLeadStatus(lead.id, s)
    onRefresh()
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    tagLead(lead.id, tagInput.trim())
    setTagInput('')
    onRefresh()
  }

  const handleRemoveTag = (tag: string) => {
    removeLeadTag(lead.id, tag)
    onRefresh()
  }

  const handleAssign = () => {
    assignLead(lead.id, assigneeInput)
    onRefresh()
  }

  const handleFollowUp = () => {
    scheduleFollowUp(lead.id, followUp)
    onRefresh()
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addLeadNote(lead.id, noteText.trim(), currentUser)
    setNoteText('')
    onRefresh()
  }

  const infoRow = (label: string, value: string | number) => (
    <div className="flex items-start gap-2 py-2 border-b border-[#111]/10">
      <span className="text-[11px] font-bold text-[#111]/40 w-28 shrink-0">{label}</span>
      <span className="text-sm font-medium text-[#111]">{value || 'N/A'}</span>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto pt-10 pb-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl doodle-card p-6 md:p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-[#111]">{lead.businessName}</h2>
              <PriorityBadge priority={lead.leadPriority} />
              <span className={`text-[10px] font-bold px-2 py-0.5 border-2 border-[#111] ${statusColors[status]} ${status === 'Contacted' || status === 'New' ? 'text-white' : status === 'Contacted' ? 'text-[#111]' : 'text-white'}`} style={{ backgroundColor: statusColors[status] }}>{status}</span>
            </div>
            <p className="text-sm text-[#111]/50">{lead.category} &middot; {lead.city}, {lead.state}</p>
          </div>
          <button onClick={onClose} className="p-1 text-[#111]/40 hover:text-[#111] transition-all shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">Basic Information</h3>
              {infoRow('Owner', lead.ownerName)}
              {infoRow('Designation', lead.designation)}
              {infoRow('Years in Business', lead.yearsInBusiness)}
              {infoRow('Business Status', lead.businessStatus)}
              {infoRow('Opening Hours', lead.openingHours)}
              {infoRow('Date Discovered', new Date(lead.dateDiscovered).toLocaleDateString())}
            </div>

            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">Contact Information</h3>
              <div className="space-y-2">
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-[#4D7AFF] font-bold hover:underline">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {lead.email}
                  </a>
                )}
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-[#10B981] font-bold hover:underline">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {lead.phone}
                  </a>
                )}
                {lead.website && (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#8B5CF6] font-bold hover:underline">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {lead.website}
                  </a>
                )}
                {lead.googleBusinessUrl && (
                  <a href={lead.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#60A5FA] font-bold hover:underline">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Google Business Profile
                  </a>
                )}
              </div>
            </div>

            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">Location</h3>
              {infoRow('Address', lead.address)}
              {infoRow('City', lead.city)}
              {infoRow('State', lead.state)}
              {infoRow('Country', lead.country)}
              {infoRow('Postal Code', lead.postalCode)}
              {lead.googleMapsUrl && (
                <a href={lead.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#4D7AFF] font-bold hover:underline mt-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Open in Google Maps
                </a>
              )}
            </div>

            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">Online Presence</h3>
              {lead.socialMedia.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#111]/40 mb-2">Social Media</p>
                  <div className="flex flex-wrap gap-2">
                    {lead.socialMedia.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border-3 border-[#111] text-[10px] font-bold text-[#111] hover:bg-[#60A5FA] transition-all">
                        {s.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {lead.websiteTechnology.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-[#111]/40 mb-2">Website Technology</p>
                  <div className="flex flex-wrap gap-2">
                    {lead.websiteTechnology.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-[#111]/5 border-2 border-[#111] text-[10px] font-bold text-[#111]">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">AI Analysis</h3>
              <ProgressBar label="SEO Score" value={lead.seoScore} />
              <div className="mt-3"><ProgressBar label="Website Quality" value={lead.websiteQualityScore} /></div>
              <div className="mt-3"><ProgressBar label="Mobile Friendliness" value={lead.mobileFriendliness} /></div>
              <div className="mt-3"><ProgressBar label="GBP Completeness" value={lead.gbpCompleteness} /></div>
              <div className="mt-3"><ProgressBar label="Opportunity Score" value={lead.opportunityScore} /></div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#111]/70">Page Speed</span>
                  <span className="font-black text-[#111]">{lead.pageSpeed}</span>
                </div>
              </div>
            </div>

            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">Priority & Conversion</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#111]/40 mb-1">Priority</p>
                  <PriorityBadge priority={lead.leadPriority} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#111]/40 mb-1">Conversion Probability</p>
                  <span className="text-lg font-black text-[#111]">{lead.conversionProbability}%</span>
                </div>
              </div>
              {lead.suggestedServices.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-[#111]/40 mb-2">Suggested Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.suggestedServices.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#60A5FA] border-2 border-[#111] text-[9px] font-bold text-[#111]">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {lead.aiAnalysis && (
                <div>
                  <p className="text-[10px] font-bold text-[#111]/40 mb-1">AI Recommendation</p>
                  <p className="text-xs text-[#111]/80 p-3 border-3 border-[#111] bg-white leading-relaxed">{lead.aiAnalysis}</p>
                </div>
              )}
            </div>

            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <h3 className="text-sm font-black text-[#111] mb-4">CRM Actions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Lead Status</label>
                  <select value={status} onChange={e => handleStatusChange(e.target.value as LeadStatus)} className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm">
                    {(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Archived'] as LeadStatus[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Tags</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTag()} className="flex-1 px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="Add tag..." />
                    <button onClick={handleAddTag} className="px-3 py-2 bg-[#60A5FA] border-3 border-[#111] text-[#111] font-bold text-xs hover:shadow-[2px_2px_0_#111] transition-all">Add</button>
                  </div>
                  {lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {lead.tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#111]/5 border-2 border-[#111] text-[10px] font-bold text-[#111]">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="text-[#FF4D4D] hover:text-[#111]">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Assign To</label>
                  <div className="flex items-center gap-2">
                    <input type="text" value={assigneeInput} onChange={e => setAssigneeInput(e.target.value)} className="flex-1 px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="Team member name..." />
                    <button onClick={handleAssign} className="px-3 py-2 bg-[#4D7AFF] border-3 border-[#111] text-white font-bold text-xs hover:shadow-[2px_2px_0_#111] transition-all">Assign</button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#111]/60 mb-1">Schedule Follow-up</label>
                  <div className="flex items-center gap-2">
                    <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} className="flex-1 px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" />
                    <button onClick={handleFollowUp} className="px-3 py-2 bg-[#10B981] border-3 border-[#111] text-white font-bold text-xs hover:shadow-[2px_2px_0_#111] transition-all">Set</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="doodle-card p-5 hover:translate-x-0 hover:translate-y-0">
              <div className="flex items-center gap-1 border-b-3 border-[#111] mb-4">
                {(['notes', 'calls', 'emails', 'whatsapp'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all border-b-3 -mb-[3px] ${activeTab === tab ? 'border-[#60A5FA] text-[#111]' : 'border-transparent text-[#111]/30 hover:text-[#111]/60'}`}>
                    {tab === 'notes' ? 'Notes' : tab === 'calls' ? 'Call History' : tab === 'emails' ? 'Email History' : 'WhatsApp History'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'notes' && (
                  <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()} className="flex-1 px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" placeholder="Write a note..." />
                      <button onClick={handleAddNote} className="doodle-btn-accent px-4 py-2 text-xs shrink-0">Add</button>
                    </div>
                    {lead.notes.length === 0 ? (
                      <p className="text-xs text-[#111]/40 text-center py-4">No notes yet</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {[...lead.notes].reverse().map(note => (
                          <div key={note.id} className="p-3 border-3 border-[#111] bg-white">
                            <p className="text-xs text-[#111]/80">{note.text}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] font-bold text-[#111]/40">{note.createdBy}</span>
                              <span className="text-[10px] text-[#111]/30">{new Date(note.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'calls' && (
                  <motion.div key="calls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {lead.callHistory.length === 0 ? (
                      <p className="text-xs text-[#111]/40 text-center py-4">No call history</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {[...lead.callHistory].reverse().map(call => (
                          <div key={call.id} className="p-3 border-3 border-[#111] bg-white">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-[#111]">{new Date(call.date).toLocaleDateString()}</span>
                              <span className="text-[10px] text-[#111]/40">{call.duration}</span>
                            </div>
                            <p className="text-xs text-[#111]/70">{call.notes}</p>
                            <span className="text-[10px] font-bold text-[#111]/40 mt-1 block">Outcome: {call.outcome}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'emails' && (
                  <motion.div key="emails" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {lead.emailHistory.length === 0 ? (
                      <p className="text-xs text-[#111]/40 text-center py-4">No email history</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {[...lead.emailHistory].reverse().map(email => (
                          <div key={email.id} className="p-3 border-3 border-[#111] bg-white">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-[#111] truncate">{email.subject}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 border-2 border-[#111] ${
                                email.status === 'Sent' ? 'bg-[#4D7AFF] text-white' :
                                email.status === 'Opened' ? 'bg-[#60A5FA] text-[#111]' :
                                email.status === 'Replied' ? 'bg-[#10B981] text-white' :
                                'bg-[#FF4D4D] text-white'
                              }`}>{email.status}</span>
                            </div>
                            <span className="text-[10px] text-[#111]/30">{new Date(email.date).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'whatsapp' && (
                  <motion.div key="whatsapp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {lead.whatsappHistory.length === 0 ? (
                      <p className="text-xs text-[#111]/40 text-center py-4">No WhatsApp history</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {[...lead.whatsappHistory].reverse().map(msg => (
                          <div key={msg.id} className="p-3 border-3 border-[#111] bg-white">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-[#111]/30">{new Date(msg.date).toLocaleString()}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 border-2 border-[#111] ${
                                msg.status === 'Sent' ? 'bg-[#4D7AFF] text-white' :
                                msg.status === 'Delivered' ? 'bg-[#8B5CF6] text-white' :
                                msg.status === 'Read' ? 'bg-[#10B981] text-white' :
                                'bg-[#60A5FA] text-[#111]'
                              }`}>{msg.status}</span>
                            </div>
                            <p className="text-xs text-[#111]/80">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AddToListModal({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const [lists, setLists] = useState<LeadList[]>([])
  const [newListName, setNewListName] = useState('')
  const [newListDesc, setNewListDesc] = useState('')

  useEffect(() => { setLists(getLists()) }, [])

  const handleCreate = () => {
    if (!newListName.trim()) return
    createList(newListName.trim(), newListDesc.trim())
    setNewListName('')
    setNewListDesc('')
    setLists(getLists())
  }

  const handleAdd = (listId: string) => {
    addToList(listId, leadId)
    onClose()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md doodle-card p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-black text-[#111] mb-4">Add to List</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
          {lists.length === 0 ? (
            <p className="text-xs text-[#111]/40 text-center py-4">No lists yet. Create one below.</p>
          ) : (
            lists.map(list => (
              <button key={list.id} onClick={() => handleAdd(list.id)} className="w-full text-left p-3 border-3 border-[#111] bg-white hover:bg-[#60A5FA]/10 transition-all">
                <p className="text-sm font-bold text-[#111]">{list.name}</p>
                {list.description && <p className="text-[10px] text-[#111]/40 mt-0.5">{list.description}</p>}
                <p className="text-[10px] text-[#111]/30 mt-1">{list.leadIds.length} leads</p>
              </button>
            ))
          )}
        </div>
        <div className="border-t-3 border-[#111]/10 pt-4">
          <p className="text-xs font-bold text-[#111]/60 mb-2">Create New List</p>
          <div className="space-y-2">
            <input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="List name..." className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" />
            <input type="text" value={newListDesc} onChange={e => setNewListDesc(e.target.value)} placeholder="Description (optional)..." className="w-full px-3 py-2 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" />
            <button onClick={handleCreate} disabled={!newListName.trim()} className="doodle-btn-accent w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">Create & Add</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SaveSearchModal({ config, onClose, onSave }: { config: LeadSearchConfig; onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm doodle-card p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-black text-[#111] mb-2">Save Search</h3>
        <p className="text-xs text-[#111]/40 mb-4">Give this search a name to reuse later.</p>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bangalore Restaurants" className="w-full px-3 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm mb-4" autoFocus onKeyDown={e => e.key === 'Enter' && name.trim() && onSave(name.trim())} />
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="doodle-btn-outline flex-1 text-sm">Cancel</button>
          <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()} className="doodle-btn-accent flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LeadDiscovery() {
  const [config, setConfig] = useState<LeadSearchConfig>(defaultConfig)
  const [leads, setLeads] = useState<Lead[]>([])
  const [savedLeads, setSavedLeads] = useState<Lead[]>([])
  const [view, setView] = useState<'discovery' | 'saved'>('discovery')
  const [generating, setGenerating] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showSaveSearch, setShowSaveSearch] = useState(false)
  const [showAddToList, setShowAddToList] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [lists, setLists] = useState<LeadList[]>([])
  const [showLists, setShowLists] = useState(false)
  const [savedFilter, setSavedFilter] = useState<LeadStatus | 'all'>('all')
  const [savedSearch, setSavedSearch] = useState('')
  const [selectedSavedIds, setSelectedSavedIds] = useState<string[]>([])
  const [showNewListModal, setShowNewListModal] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDesc, setNewListDesc] = useState('')
  const [resultCount, setResultCount] = useState(0)

  const session = getSession()

  useEffect(() => {
    setSavedLeads(getSavedLeads())
    setSearchHistory(getSearchHistory())
    setLists(getLists())
  }, [])

  const refreshSaved = () => setSavedLeads(getSavedLeads())

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const results = generateLeads(config, 25)
      setLeads(results)
      setResultCount(results.length)
      setView('discovery')
      setGenerating(false)
    }, 800)
  }

  const handleSaveSearch = (name: string) => {
    saveSearch(name, config, resultCount)
    setSearchHistory(getSearchHistory())
    setShowSaveSearch(false)
  }

  const handleRerunSearch = (history: SearchHistory) => {
    setConfig(history.config)
    setGenerating(true)
    setTimeout(() => {
      const results = generateLeads(history.config, 25)
      setLeads(results)
      setResultCount(results.length)
      setView('discovery')
      setGenerating(false)
    }, 800)
  }

  const handleDeleteSearch = (id: string) => {
    deleteSearch(id)
    setSearchHistory(getSearchHistory())
  }

  const handleSaveLead = (lead: Lead) => {
    saveLead(lead)
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, saved: true } : l))
    refreshSaved()
  }

  const handleDeleteSaved = (id: string) => {
    deleteSavedLead(id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, saved: false } : l))
    refreshSaved()
  }

  const handleCreateList = () => {
    if (!newListName.trim()) return
    createList(newListName.trim(), newListDesc.trim())
    setNewListName('')
    setNewListDesc('')
    setLists(getLists())
    setShowNewListModal(false)
  }

  const filteredSavedLeads = useMemo(() => {
    let result = savedLeads
    if (savedFilter !== 'all') result = result.filter(l => l.status === savedFilter)
    if (savedSearch.trim()) {
      const q = savedSearch.toLowerCase()
      result = result.filter(l =>
        l.businessName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [savedLeads, savedFilter, savedSearch])

  const handleBulkStatusUpdate = (status: LeadStatus) => {
    selectedSavedIds.forEach(id => updateLeadStatus(id, status))
    setSelectedSavedIds([])
    refreshSaved()
  }

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    const exportLeads = view === 'saved' ? filteredSavedLeads : leads
    if (exportLeads.length === 0) return
    const filename = `leads-${new Date().toISOString().slice(0, 10)}`
    if (type === 'csv') downloadCSV(exportLeads, `${filename}.csv`)
    else if (type === 'excel') downloadExcel(exportLeads, `${filename}.xlsx`)
    else downloadPDF(exportLeads, `${filename}.pdf`)
  }

  return (
    <PageTransition>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#111]">AI Lead Discovery</h1>
            <p className="text-[#111]/60 text-sm mt-1">Discover, analyze, and manage business leads with AI-powered intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleExport('csv')} className="doodle-btn-outline px-3 py-2 text-xs flex items-center gap-1.5" disabled={leads.length === 0 && savedLeads.length === 0}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV
            </button>
            <button onClick={() => handleExport('excel')} className="doodle-btn-outline px-3 py-2 text-xs flex items-center gap-1.5" disabled={leads.length === 0 && savedLeads.length === 0}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <button onClick={() => handleExport('pdf')} className="doodle-btn-outline px-3 py-2 text-xs flex items-center gap-1.5" disabled={leads.length === 0 && savedLeads.length === 0}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <div className="w-px h-6 bg-[#111]/20 mx-1" />
            <div className="flex items-center border-3 border-[#111] overflow-hidden">
              <button onClick={() => setView('discovery')} className={`px-4 py-2 text-xs font-bold transition-all ${view === 'discovery' ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/50 hover:bg-[#60A5FA]/20'}`}>
                Search
              </button>
              <button onClick={() => setView('saved')} className={`px-4 py-2 text-xs font-bold transition-all ${view === 'saved' ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/50 hover:bg-[#60A5FA]/20'}`}>
                Saved ({savedLeads.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setShowHistory(!showHistory)} className={`px-4 py-2 border-3 border-[#111] text-xs font-bold transition-all flex items-center gap-2 ${showHistory ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/50 hover:bg-[#60A5FA]/20'}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Search History
        </button>
        <button onClick={() => setShowLists(!showLists)} className={`px-4 py-2 border-3 border-[#111] text-xs font-bold transition-all flex items-center gap-2 ${showLists ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/50 hover:bg-[#60A5FA]/20'}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h10M3 12h16M3 17h12" />
          </svg>
          Lists ({lists.length})
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:col-span-4"
          >
            <div className="doodle-card p-5">
              <h3 className="text-sm font-black text-[#111] mb-4">Search History</h3>
              {searchHistory.length === 0 ? (
                <p className="text-xs text-[#111]/40 text-center py-4">No searches yet</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchHistory.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-3 border-3 border-[#111] bg-white hover:bg-[#60A5FA]/5 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#111] truncate">{h.name}</p>
                        <p className="text-[10px] text-[#111]/40">{h.resultCount} leads &middot; {new Date(h.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleRerunSearch(h)} className="p-1.5 border-2 border-[#111] text-[#111]/50 hover:bg-[#60A5FA] hover:text-[#111] transition-all" title="Rerun search">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteSearch(h.id)} className="p-1.5 border-2 border-[#111] text-[#111]/50 hover:bg-[#FF4D4D] hover:text-white transition-all" title="Delete">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {showLists && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:col-span-4"
          >
            <div className="doodle-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[#111]">Lead Lists</h3>
                <button onClick={() => setShowNewListModal(true)} className="doodle-btn-accent px-4 py-1.5 text-xs flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New List
                </button>
              </div>
              {lists.length === 0 ? (
                <p className="text-xs text-[#111]/40 text-center py-4">No lists created yet</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lists.map(list => (
                    <div key={list.id} className="p-4 border-3 border-[#111] bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-black text-[#111]">{list.name}</h4>
                        <button onClick={() => { deleteList(list.id); setLists(getLists()) }} className="p-1 text-[#111]/30 hover:text-[#FF4D4D] transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {list.description && <p className="text-[10px] text-[#111]/40 mb-1">{list.description}</p>}
                      <p className="text-[11px] font-bold text-[#111]/60">{list.leadIds.length} leads</p>
                      <p className="text-[10px] text-[#111]/30 mt-1">Created {new Date(list.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {view === 'discovery' ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="doodle-card p-5 xl:sticky xl:top-24"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-[#111]">Filters</h2>
                <button onClick={() => setConfig(defaultConfig)} className="text-[10px] font-bold text-[#111]/40 hover:text-[#111] transition-all">Reset</button>
              </div>
              <FilterPanel config={config} setConfig={setConfig} onGenerate={handleGenerate} onSaveSearch={() => setShowSaveSearch(true)} generating={generating} />
            </motion.div>
          </div>

          <div className="xl:col-span-3">
            {leads.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="doodle-card p-12 text-center"
              >
                <div className="w-16 h-16 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0_#111]">
                  <svg className="w-8 h-8 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-[#111] mb-2">No Leads Yet</h3>
                <p className="text-sm text-[#111]/50 max-w-md mx-auto">Configure your search filters and click "Generate Leads" to discover new business opportunities powered by AI.</p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-[#111]/60">
                    <span className="font-black text-[#111]">{leads.length}</span> leads found
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={handleGenerate} disabled={generating} className="doodle-btn-accent px-4 py-2 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {leads.map(lead => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        saved={lead.saved}
                        onView={() => setSelectedLead(lead)}
                        onSave={() => handleSaveLead(lead)}
                        onDelete={() => handleDeleteSaved(lead.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={savedSearch}
                onChange={e => setSavedSearch(e.target.value)}
                placeholder="Search saved leads..."
                className="px-4 py-2.5 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm w-full sm:w-64"
              />
              <div className="flex items-center gap-1">
                {(['all', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Archived'] as const).map(f => (
                  <button key={f} onClick={() => setSavedFilter(f)} className={`px-2.5 py-1.5 border-3 border-[#111] text-[10px] font-bold transition-all ${savedFilter === f ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/40 hover:bg-[#60A5FA]/20'}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedSavedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#111]/60">{selectedSavedIds.length} selected</span>
                  <select
                    onChange={e => handleBulkStatusUpdate(e.target.value as LeadStatus)}
                    className="px-3 py-2 border-3 border-[#111] bg-white text-xs font-bold text-[#111] focus:outline-none"
                  >
                    <option value="">Set Status</option>
                    {(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Archived'] as LeadStatus[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => {
                    selectedSavedIds.forEach(id => deleteSavedLead(id))
                    setSelectedSavedIds([])
                    refreshSaved()
                  }} className="px-3 py-2 bg-[#FF4D4D] border-3 border-[#111] text-white text-xs font-bold hover:shadow-[2px_2px_0_#111] transition-all">
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredSavedLeads.length === 0 ? (
            <div className="doodle-card p-12 text-center">
              <div className="w-16 h-16 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0_#111]">
                <svg className="w-8 h-8 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">No Saved Leads</h3>
              <p className="text-sm text-[#111]/50">Save leads from the Discovery tab to manage them here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="doodle-card overflow-hidden hover:translate-x-0 hover:translate-y-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-3 border-[#111] bg-[#60A5FA]/10">
                      <th className="w-10 px-4 py-3">
                        <input type="checkbox" checked={selectedSavedIds.length === filteredSavedLeads.length} onChange={e => setSelectedSavedIds(e.target.checked ? filteredSavedLeads.map(l => l.id) : [])} className="w-4 h-4 accent-[#60A5FA]" />
                      </th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Business</th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Contact</th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Location</th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Rating</th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Priority</th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Score</th>
                      <th className="text-right text-[10px] font-black text-[#111]/50 uppercase tracking-wider px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredSavedLeads.map(lead => (
                        <motion.tr key={lead.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`border-b border-[#111]/10 hover:bg-[#60A5FA]/5 transition-colors ${selectedSavedIds.includes(lead.id) ? 'bg-[#60A5FA]/10' : ''}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={selectedSavedIds.includes(lead.id)} onChange={e => setSelectedSavedIds(prev => e.target.checked ? [...prev, lead.id] : prev.filter(id => id !== lead.id))} className="w-4 h-4 accent-[#60A5FA]" />
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelectedLead(lead)} className="text-sm font-bold text-[#111] hover:text-[#60A5FA] transition-colors text-left">{lead.businessName}</button>
                            <p className="text-[10px] text-[#111]/40">{lead.category}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-[#111]/80">{lead.email || 'N/A'}</p>
                            <p className="text-[10px] text-[#111]/40">{lead.phone || 'N/A'}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-[#111]/80">{lead.city}</p>
                            <p className="text-[10px] text-[#111]/40">{lead.state}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <StarRating rating={lead.rating} />
                              <span className="text-[10px] text-[#111]/40">({lead.reviewCount})</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <PriorityBadge priority={lead.leadPriority} />
                          </td>
                          <td className="px-4 py-3">
                            <select value={lead.status} onChange={e => { updateLeadStatus(lead.id, e.target.value as LeadStatus); refreshSaved() }} className="px-2 py-1 border-2 border-[#111] text-[10px] font-bold bg-white focus:outline-none">
                              {(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Archived'] as LeadStatus[]).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 border-2 border-[#111] bg-white overflow-hidden">
                                <div className="h-full bg-[#60A5FA]" style={{ width: `${lead.opportunityScore}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-[#111]">{lead.opportunityScore}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => setSelectedLead(lead)} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] hover:text-[#111] transition-all" title="View">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button onClick={() => setShowAddToList(lead.id)} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] hover:text-[#111] transition-all" title="Add to list">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                              <button onClick={() => { deleteSavedLead(lead.id); refreshSaved(); setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, saved: false } : l)) }} className="p-1.5 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all" title="Delete">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-[#111]/40 mt-3">{filteredSavedLeads.length} of {savedLeads.length} saved leads</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedLead && (
          <LeadDetailModal key={selectedLead.id} lead={selectedLead} onClose={() => setSelectedLead(null)} onRefresh={() => { refreshSaved(); setLeads(prev => prev.map(l => l.id === selectedLead.id ? getSavedLeads().find(sl => sl.id === selectedLead.id) || l : l)) }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaveSearch && (
          <SaveSearchModal config={config} onClose={() => setShowSaveSearch(false)} onSave={handleSaveSearch} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddToList && (
          <AddToListModal leadId={showAddToList} onClose={() => setShowAddToList(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewListModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowNewListModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm doodle-card p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-black text-[#111] mb-4">Create New List</h3>
              <div className="space-y-3">
                <input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="List name..." className="w-full px-3 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" />
                <input type="text" value={newListDesc} onChange={e => setNewListDesc(e.target.value)} placeholder="Description (optional)..." className="w-full px-3 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm" />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button onClick={() => setShowNewListModal(false)} className="doodle-btn-outline flex-1 text-sm">Cancel</button>
                <button onClick={handleCreateList} disabled={!newListName.trim()} className="doodle-btn-accent flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Create</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

