export interface LeadSearchConfig {
  country: string
  state: string
  city: string
  multipleCities: string
  radius: number
  zip: string
  category: string
  industry: string
  keywords: string
  companySize: string
  rating: number
  minReviews: number
  websiteRequired: boolean
  emailRequired: boolean
  phoneRequired: boolean
  socialMediaRequired: boolean
  verifiedOnly: boolean
  openNow: boolean
  advancedFilters: string[]
}

export interface Lead {
  id: string
  businessName: string
  category: string
  ownerName: string
  designation: string
  email: string
  phone: string
  website: string
  googleBusinessUrl: string
  googleMapsUrl: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  lat: number
  lng: number
  rating: number
  reviewCount: number
  openingHours: string
  businessStatus: string
  yearsInBusiness: number
  socialMedia: { platform: string; url: string }[]
  websiteTechnology: string[]
  seoScore: number
  websiteQualityScore: number
  mobileFriendliness: number
  pageSpeed: string
  gbpCompleteness: number
  marketingOpportunity: number
  opportunityScore: number
  suggestedServices: string[]
  leadPriority: 'Hot' | 'Warm' | 'Cold'
  conversionProbability: number
  aiAnalysis: string
  recommendedServices: string[]
  dateDiscovered: string
  saved: boolean
  status: LeadStatus
  tags: string[]
  notes: Note[]
  assignedTo: string
  followUpDate: string | null
  callHistory: CallRecord[]
  emailHistory: EmailRecord[]
  whatsappHistory: WhatsAppRecord[]
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost' | 'Archived'

export interface Note {
  id: string
  text: string
  createdAt: string
  createdBy: string
}

export interface CallRecord {
  id: string
  date: string
  duration: string
  notes: string
  outcome: string
}

export interface EmailRecord {
  id: string
  date: string
  subject: string
  status: 'Sent' | 'Opened' | 'Replied' | 'Bounced'
}

export interface WhatsAppRecord {
  id: string
  date: string
  message: string
  status: 'Sent' | 'Delivered' | 'Read' | 'Replied'
}

export interface SearchHistory {
  id: string
  name: string
  config: LeadSearchConfig
  resultCount: number
  createdAt: string
}

export interface LeadList {
  id: string
  name: string
  description: string
  leadIds: string[]
  createdAt: string
}

const businesses = [
  { name: 'TechVista Solutions', cat: 'Software Development', emp: '50-200' },
  { name: 'GreenLeaf Organics', cat: 'Organic Food', emp: '10-50' },
  { name: 'Pinnacle Realty', cat: 'Real Estate', emp: '20-100' },
  { name: 'Swift Logistics', cat: 'Logistics', emp: '100-500' },
  { name: 'Bloom Aesthetics', cat: 'Beauty & Wellness', emp: '5-20' },
  { name: 'Prime Healthcare', cat: 'Healthcare', emp: '50-200' },
  { name: 'EduSpark Academy', cat: 'Education', emp: '20-100' },
  { name: 'UrbanDine Restaurants', cat: 'Restaurant', emp: '50-200' },
  { name: 'Apex Financial Services', cat: 'Finance', emp: '20-100' },
  { name: 'Craft & Co.', cat: 'E-commerce', emp: '5-20' },
  { name: 'BuildRight Construction', cat: 'Construction', emp: '100-500' },
  { name: 'CloudBase IT', cat: 'IT Services', emp: '10-50' },
  { name: 'FreshCart Grocery', cat: 'Retail', emp: '10-50' },
  { name: 'ZenFit Gym', cat: 'Fitness', emp: '5-20' },
  { name: 'PetVet Clinics', cat: 'Veterinary', emp: '5-20' },
  { name: 'SolarGrid Energy', cat: 'Renewable Energy', emp: '20-100' },
  { name: 'TravelEase Holidays', cat: 'Travel', emp: '10-50' },
  { name: 'LegalEagle Associates', cat: 'Legal Services', emp: '20-100' },
  { name: 'PrintMaster Studios', cat: 'Printing', emp: '5-20' },
  { name: 'AutoCare Hub', cat: 'Automotive', emp: '10-50' },
  { name: 'DesignCraft Interiors', cat: 'Interior Design', emp: '5-20' },
  { name: 'Digital Wave Agency', cat: 'Digital Marketing', emp: '10-50' },
  { name: 'PureGlow Skin Clinic', cat: 'Skincare', emp: '2-10' },
  { name: 'Farm2Table Foods', cat: 'Food & Beverage', emp: '20-100' },
  { name: 'SecureShield Services', cat: 'Security Services', emp: '100-500' },
  { name: 'BrightPath Learning', cat: 'Education Technology', emp: '10-50' },
  { name: 'Elite Auto Detailing', cat: 'Automotive Services', emp: '2-10' },
  { name: 'Harmony Music Academy', cat: 'Music Education', emp: '2-10' },
  { name: 'Precision Dental Care', cat: 'Dental', emp: '5-20' },
  { name: 'Urban Fit Studio', cat: 'Fitness Studio', emp: '2-10' },
  { name: 'Crystal Clear Windows', cat: 'Home Services', emp: '5-20' },
  { name: 'Golden Harvest Bakery', cat: 'Bakery', emp: '5-20' },
  { name: 'NextGen Software', cat: 'Software', emp: '50-200' },
  { name: 'EcoClean Services', cat: 'Cleaning Services', emp: '20-100' },
  { name: 'Royal Tandoori', cat: 'Restaurant', emp: '10-50' },
  { name: 'Smart Tech Repair', cat: 'Electronics Repair', emp: '2-10' },
  { name: 'Vivid Photography', cat: 'Photography', emp: '2-10' },
  { name: 'Grand Wedding Planners', cat: 'Event Planning', emp: '5-20' },
  { name: 'SteelCraft Industries', cat: 'Manufacturing', emp: '100-500' },
  { name: 'Oceanic Aquariums', cat: 'Pet Supplies', emp: '2-10' },
  { name: 'Summit Adventure Tours', cat: 'Adventure Tourism', emp: '5-20' },
  { name: 'Coastal Properties', cat: 'Real Estate', emp: '10-50' },
  { name: 'ByteSize Learning', cat: 'E-learning', emp: '10-50' },
  { name: 'The Artisan Loft', cat: 'Handicrafts', emp: '2-10' },
  { name: 'PrimeSource Recruitment', cat: 'Recruitment', emp: '10-50' },
  { name: 'FreshBrew Café', cat: 'Café', emp: '5-20' },
  { name: 'Total Health Pharmacy', cat: 'Pharmacy', emp: '5-20' },
  { name: 'Stellar Media Group', cat: 'Media Production', emp: '10-50' },
  { name: 'Green Thumb Nursery', cat: 'Gardening', emp: '5-20' },
  { name: 'ProActive Fitness', cat: 'Fitness', emp: '10-50' },
]

export function generateLeads(config: LeadSearchConfig, count: number = 25): Lead[] {
  const keywords = config.keywords ? config.keywords.split(',').map(k => k.trim().toLowerCase()) : []
  const filtered = businesses.filter(b => {
    if (keywords.length > 0) return keywords.some(k => b.name.toLowerCase().includes(k) || b.cat.toLowerCase().includes(k))
    return true
  })

  const selected = filtered.sort(() => Math.random() - 0.5).slice(0, count)
  if (selected.length < count) {
    while (selected.length < count) {
      const copy = [...businesses].sort(() => Math.random() - 0.5)
      selected.push(copy[0])
    }
  }

  const cities = config.multipleCities ? config.multipleCities.split(',').map(c => c.trim()) : config.city ? [config.city] : ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow']
  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh']
  const domains = ['.com', '.in', '.co.in', '.org', '.net']
  const techs = ['WordPress', 'Shopify', 'Custom PHP', 'React', 'Next.js', 'Laravel', 'Django', 'Wix', 'Squarespace', 'Magento', 'WooCommerce', 'HTML/CSS']

  function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
  function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)] }

  return selected.map((biz, i) => {
    const city = pick(cities)
    const state = pick(states)
    const country = config.country || 'India'
    const socialPlatforms = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'YouTube']
    const socialCount = rand(1, 3)
    const socialMedia = socialPlatforms.sort(() => Math.random() - 0.5).slice(0, socialCount).map(p => ({
      platform: p,
      url: `https://${p.toLowerCase()}.com/${biz.name.toLowerCase().replace(/\s+/g, '')}`
    }))

    const hasWebsite = config.websiteRequired ? true : Math.random() > 0.2
    const hasEmail = config.emailRequired ? true : Math.random() > 0.25
    const hasPhone = config.phoneRequired ? true : Math.random() > 0.1

    const rating = config.rating > 0 ? Math.max(config.rating, Math.round((3 + Math.random() * 2) * 10) / 10) : Math.round((3 + Math.random() * 2) * 10) / 10
    const reviewCount = Math.max(config.minReviews, rand(5, 500))
    const hasWebsiteBool = hasWebsite
    const seoScore = rand(15, 95)
    const websiteQuality = hasWebsiteBool ? rand(20, 90) : 0
    const mobileScore = hasWebsiteBool ? rand(15, 95) : 0
    const gbpScore = rand(30, 100)

    const needsSEO = seoScore < 50
    const needsWebsite = !hasWebsiteBool
    const needsAds = rand(0, 1) === 1
    const needsSocial = socialCount < 2
    const needsSSL = hasWebsiteBool && rand(0, 1) === 1

    const suggested: string[] = []
    if (needsWebsite) suggested.push('Website Development')
    if (needsSEO) suggested.push('SEO Optimization')
    if (needsAds) suggested.push('Google Ads')
    if (needsSocial) suggested.push('Social Media Marketing')
    if (rating < 4) suggested.push('Branding')
    if (websiteQuality < 50 && hasWebsiteBool) suggested.push('Website Redesign')
    if (seoScore < 40) suggested.push('Content Marketing')
    if (suggested.length === 0) suggested.push('Lead Generation')

    const opportunityScore = rand(40, 99)
    const priority: 'Hot' | 'Warm' | 'Cold' = opportunityScore > 75 ? 'Hot' : opportunityScore > 55 ? 'Warm' : 'Cold'

    const aiReasons: string[] = []
    if (needsWebsite) aiReasons.push('No website — high redesign opportunity')
    if (needsSEO) aiReasons.push(`Weak SEO (score: ${seoScore}/100)`)
    if (websiteQuality < 50 && hasWebsiteBool) aiReasons.push(`Poor website quality (${websiteQuality}/100)`)
    if (mobileScore < 50 && hasWebsiteBool) aiReasons.push('Not mobile-friendly')
    if (rating < 4) aiReasons.push(`Below-avg rating (${rating}) — needs brand uplift`)
    if (reviewCount < 50) aiReasons.push(`Low review count (${reviewCount}) — needs GBP optimization`)
    if (socialCount < 2) aiReasons.push('Weak social media presence')
    if (aiReasons.length === 0) aiReasons.push('Good digital foundation — upsell opportunity for advanced services')

    return {
      id: Date.now().toString() + i + rand(0, 9999),
      businessName: biz.name,
      category: biz.cat,
      ownerName: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Reddy', 'Ananya Gupta', 'Siddharth Jain', 'Kavita Mehta'][rand(0, 7)],
      designation: ['Owner', 'CEO', 'Director', 'Founder', 'Managing Partner', 'Proprietor'][rand(0, 5)],
      email: hasEmail ? `info@${biz.name.toLowerCase().replace(/[^a-z0-9]/g, '')}${pick(domains)}` : '',
      phone: hasPhone ? `+91 ${rand(70000, 99999)} ${rand(10000, 99999)}` : '',
      website: hasWebsiteBool ? `https://${biz.name.toLowerCase().replace(/[^a-z0-9]/g, '')}${pick(domains)}` : '',
      googleBusinessUrl: `https://www.google.com/maps?q=${encodeURIComponent(biz.name + ' ' + city)}`,
      googleMapsUrl: `https://www.google.com/maps/place/${encodeURIComponent(biz.name + ' ' + city)}`,
      address: `${rand(1, 999)}, ${pick(['Main St', 'Park Ave', 'Sector', 'MG Road', 'Linking Rd', 'Ring Rd'])}${rand(1, 99) > 50 ? ', ' + pick(['Block A', 'Phase 2', 'Industrial Area']) : ''}`,
      city, state, country,
      postalCode: `${rand(100000, 999999)}`,
      lat: 20 + Math.random() * 10,
      lng: 72 + Math.random() * 10,
      rating, reviewCount,
      openingHours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      businessStatus: ['Open', 'Open', 'Open', 'Closed'][rand(0, 3)],
      yearsInBusiness: rand(1, 25),
      socialMedia,
      websiteTechnology: hasWebsiteBool ? [pick(techs), pick(techs)].filter((v, idx, a) => a.indexOf(v) === idx) : [],
      seoScore, websiteQualityScore: websiteQuality,
      mobileFriendliness: mobileScore,
      pageSpeed: pick(['Fast (under 2s)', 'Moderate (2-4s)', 'Slow (4-6s)', 'Very Slow (6s+)']),
      gbpCompleteness: gbpScore,
      marketingOpportunity: opportunityScore,
      opportunityScore,
      suggestedServices: suggested.slice(0, 3),
      leadPriority: priority,
      conversionProbability: rand(20, 95),
      aiAnalysis: aiReasons.join('. ') + '.',
      recommendedServices: suggested.slice(0, 4),
      dateDiscovered: new Date().toISOString(),
      saved: false,
      status: 'New',
      tags: [],
      notes: [],
      assignedTo: '',
      followUpDate: null,
      callHistory: [],
      emailHistory: [],
      whatsappHistory: [],
    }
  })
}

const SAVED_LEADS_KEY = 'ab_discovery_saved_leads'
const SEARCH_HISTORY_KEY = 'ab_discovery_search_history'
const LISTS_KEY = 'ab_discovery_lists'

export function getSavedLeads(): Lead[] {
  try { return JSON.parse(localStorage.getItem(SAVED_LEADS_KEY) || '[]') } catch { return [] }
}

export function saveLead(lead: Lead): void {
  const leads = getSavedLeads()
  const existing = leads.findIndex(l => l.id === lead.id)
  if (existing >= 0) leads[existing] = { ...lead, saved: true }
  else leads.unshift({ ...lead, saved: true })
  localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads))
}

export function deleteSavedLead(id: string): void {
  localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(getSavedLeads().filter(l => l.id !== id)))
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const leads = getSavedLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) { leads[idx].status = status; localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads)) }
}

export function addLeadNote(id: string, text: string, user: string): void {
  const leads = getSavedLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) {
    leads[idx].notes.push({ id: Date.now().toString(), text, createdAt: new Date().toISOString(), createdBy: user })
    localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads))
  }
}

export function tagLead(id: string, tag: string): void {
  const leads = getSavedLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) {
    if (!leads[idx].tags.includes(tag)) leads[idx].tags.push(tag)
    localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads))
  }
}

export function removeLeadTag(id: string, tag: string): void {
  const leads = getSavedLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) {
    leads[idx].tags = leads[idx].tags.filter(t => t !== tag)
    localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads))
  }
}

export function assignLead(id: string, assignee: string): void {
  const leads = getSavedLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) { leads[idx].assignedTo = assignee; localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads)) }
}

export function scheduleFollowUp(id: string, date: string): void {
  const leads = getSavedLeads()
  const idx = leads.findIndex(l => l.id === id)
  if (idx >= 0) { leads[idx].followUpDate = date; localStorage.setItem(SAVED_LEADS_KEY, JSON.stringify(leads)) }
}

export function getSearchHistory(): SearchHistory[] {
  try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]') } catch { return [] }
}

export function saveSearch(name: string, config: LeadSearchConfig, resultCount: number): void {
  const history = getSearchHistory()
  history.unshift({ id: Date.now().toString(), name, config, resultCount, createdAt: new Date().toISOString() })
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
}

export function deleteSearch(id: string): void {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(getSearchHistory().filter(s => s.id !== id)))
}

export function getLists(): LeadList[] {
  try { return JSON.parse(localStorage.getItem(LISTS_KEY) || '[]') } catch { return [] }
}

export function createList(name: string, description: string): void {
  const lists = getLists()
  lists.unshift({ id: Date.now().toString(), name, description, leadIds: [], createdAt: new Date().toISOString() })
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
}

export function addToList(listId: string, leadId: string): void {
  const lists = getLists()
  const idx = lists.findIndex(l => l.id === listId)
  if (idx >= 0 && !lists[idx].leadIds.includes(leadId)) { lists[idx].leadIds.push(leadId); localStorage.setItem(LISTS_KEY, JSON.stringify(lists)) }
}

export function deleteList(id: string): void {
  localStorage.setItem(LISTS_KEY, JSON.stringify(getLists().filter(l => l.id !== id)))
}

export function exportToCSV(leads: Lead[]): string {
  const headers = ['Business Name', 'Category', 'Owner', 'Email', 'Phone', 'Website', 'City', 'State', 'Country', 'Rating', 'Reviews', 'Status', 'Priority', 'SEO Score', 'Website Quality', 'Opportunity Score', 'AI Analysis']
  const rows = leads.map(l => [
    `"${l.businessName}"`, `"${l.category}"`, `"${l.ownerName}"`, `"${l.email}"`, `"${l.phone}"`, `"${l.website}"`,
    `"${l.city}"`, `"${l.state}"`, `"${l.country}"`, l.rating, l.reviewCount, `"${l.businessStatus}"`, `"${l.leadPriority}"`,
    l.seoScore, l.websiteQualityScore, l.opportunityScore, `"${l.aiAnalysis.replace(/"/g, '""')}"`
  ])
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

export function downloadCSV(leads: Lead[], filename: string = 'leads.csv'): void {
  const csv = exportToCSV(leads)
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function downloadExcel(leads: Lead[], filename: string = 'leads.xlsx'): void {
  const XLSX = (window as any).XLSX
  if (!XLSX) {
    downloadCSV(leads, filename.replace('.xlsx', '.csv'))
    return
  }
  const data = leads.map(l => ({
    'Business Name': l.businessName, 'Category': l.category, 'Owner': l.ownerName,
    'Email': l.email, 'Phone': l.phone, 'Website': l.website,
    'City': l.city, 'State': l.state, 'Country': l.country,
    'Rating': l.rating, 'Reviews': l.reviewCount, 'Status': l.businessStatus,
    'Priority': l.leadPriority, 'SEO Score': l.seoScore,
    'Website Quality': l.websiteQualityScore, 'Opportunity Score': l.opportunityScore,
    'AI Analysis': l.aiAnalysis
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Leads')
  XLSX.writeFile(wb, filename)
}

export function downloadPDF(leads: Lead[], filename: string = 'leads.pdf'): void {
  const { jsPDF } = window as any
  if (!jsPDF) { alert('PDF export requires jsPDF library'); return }
  const doc = new jsPDF()
  doc.setFontSize(16); doc.text('Lead Discovery Report', 105, 15, { align: 'center' })
  doc.setFontSize(8); doc.text(`Generated: ${new Date().toLocaleDateString()} | Total: ${leads.length} leads`, 105, 22, { align: 'center' })
  let y = 30
  leads.slice(0, 50).forEach((l, i) => {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.setFontSize(10); doc.text(`${i + 1}. ${l.businessName}`, 10, y)
    doc.setFontSize(7); doc.text(`${l.category} | ${l.city}, ${l.state} | Rating: ${l.rating}/5 | Priority: ${l.leadPriority}`, 10, y + 5)
    doc.setFontSize(6); doc.text(`SEO: ${l.seoScore}/100 | Website: ${l.websiteQualityScore}/100 | Opportunity: ${l.opportunityScore}/100`, 10, y + 10)
    y += 16
  })
  doc.save(filename)
}
