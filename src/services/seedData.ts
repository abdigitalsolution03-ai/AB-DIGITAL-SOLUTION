import { store } from './store'
import { initializeUsers } from './auth'

export function seedAllData(): void {
  initializeUsers()

  if (store.hasCollection('leads')) return

  const now = new Date()

  const leads = [
    { id: 'lead_001', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@techvista.in', phone: '+91 98765 43210', company: 'TechVista Solutions', jobTitle: 'CTO', source: 'Website', stage: 'new', status: 'new', score: 85, assignedTo: 'usr_003', notes: 'Interested in enterprise CRM solution', createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 5).toISOString() },
    { id: 'lead_002', firstName: 'Priya', lastName: 'Sharma', email: 'priya@greenearth.in', phone: '+91 99887 76655', company: 'GreenEarth Industries', jobTitle: 'Marketing Head', source: 'LinkedIn', stage: 'contacted', status: 'contacted', score: 72, assignedTo: 'usr_004', notes: 'Looking for digital marketing services', followUpDate: new Date(now.getTime() + 86400000 * 3).toISOString(), createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString() },
    { id: 'lead_003', firstName: 'Amit', lastName: 'Patel', email: 'amit@medicare.in', phone: '+91 88776 65544', company: 'MediCare Health Systems', jobTitle: 'CEO', source: 'Referral', stage: 'qualified', status: 'qualified', score: 91, assignedTo: 'usr_003', notes: 'Need complete digital transformation', followUpDate: new Date(now.getTime() + 86400000 * 7).toISOString(), createdAt: new Date(now.getTime() - 86400000 * 20).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 1).toISOString() },
    { id: 'lead_004', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@finedge.in', phone: '+91 77665 54433', company: 'FinEdge Capital', jobTitle: 'VP Operations', source: 'Google Ads', stage: 'proposal', status: 'proposal', score: 88, assignedTo: 'usr_004', notes: 'Proposal sent for enterprise software suite', followUpDate: new Date(now.getTime() + 86400000 * 5).toISOString(), createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString() },
    { id: 'lead_005', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@eduprime.in', phone: '+91 66554 43322', company: 'EduPrime Learning', jobTitle: 'Director', source: 'Conference', stage: 'negotiation', status: 'negotiation', score: 94, assignedTo: 'usr_003', notes: 'Finalizing deal for learning management system', followUpDate: new Date(now.getTime() + 86400000 * 2).toISOString(), createdAt: new Date(now.getTime() - 86400000 * 45).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 1).toISOString() },
    { id: 'lead_006', firstName: 'Ananya', lastName: 'Gupta', email: 'ananya@retailmart.in', phone: '+91 99881 12233', company: 'RetailMart India', jobTitle: 'Digital Head', source: 'Website', stage: 'won', status: 'won', score: 96, assignedTo: 'usr_003', notes: 'Signed contract for full digital transformation', dealValue: 15000000, closedDate: new Date(now.getTime() - 86400000 * 5).toISOString(), createdAt: new Date(now.getTime() - 86400000 * 60).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 5).toISOString() },
    { id: 'lead_007', firstName: 'Rahul', lastName: 'Mehta', email: 'rahul@aerospace.in', phone: '+91 88997 76655', company: 'AeroSpace Dynamics', jobTitle: 'Engineering Head', source: 'Email Campaign', stage: 'lost', status: 'lost', score: 45, assignedTo: 'usr_004', notes: 'Chose competitor solution', createdAt: new Date(now.getTime() - 86400000 * 50).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 10).toISOString() },
    { id: 'lead_008', firstName: 'Neha', lastName: 'Joshi', email: 'neha@foodieexpress.in', phone: '+91 77661 12233', company: 'FoodieExpress Logistics', jobTitle: 'COO', source: 'Referral', stage: 'contacted', status: 'contacted', score: 68, assignedTo: 'usr_004', notes: 'Interested in fleet management software', followUpDate: new Date(now.getTime() + 86400000 * 10).toISOString(), createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 3).toISOString() },
  ]

  const contacts = [
    { id: 'cont_001', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@techvista.in', phone: '+91 98765 43210', company: 'techvista', companyId: 'comp_001', jobTitle: 'CTO', type: 'decision_maker', status: 'active', source: 'Website', notes: 'Primary decision maker for tech purchases', createdAt: new Date(now.getTime() - 86400000 * 90).toISOString(), updatedAt: now.toISOString() },
    { id: 'cont_002', firstName: 'Sunita', lastName: 'Verma', email: 'sunita@techvista.in', phone: '+91 88776 65544', company: 'techvista', companyId: 'comp_001', jobTitle: 'Procurement Manager', type: 'influencer', status: 'active', source: 'Referral', notes: 'Handles vendor evaluation', createdAt: new Date(now.getTime() - 86400000 * 60).toISOString(), updatedAt: now.toISOString() },
    { id: 'cont_003', firstName: 'Priya', lastName: 'Sharma', email: 'priya@greenearth.in', phone: '+91 99887 76655', company: 'greenearth', companyId: 'comp_002', jobTitle: 'Marketing Head', type: 'decision_maker', status: 'active', source: 'LinkedIn', notes: 'Drives marketing initiatives', createdAt: new Date(now.getTime() - 86400000 * 120).toISOString(), updatedAt: now.toISOString() },
  ]

  const companies = [
    { id: 'comp_001', name: 'TechVista Solutions', industry: 'Technology', website: 'https://techvista.in', phone: '+91 22 4123 4567', email: 'contact@techvista.in', address: 'Bandra Kurla Complex, Mumbai', status: 'active', createdAt: '2024-06-01', notes: 'Key client for web development' },
    { id: 'comp_002', name: 'GreenEarth Industries', industry: 'Manufacturing', website: 'https://greenearth.in', phone: '+91 33 4123 4567', email: 'info@greenearth.in', address: 'Salt Lake, Kolkata', status: 'active', createdAt: '2024-07-15', notes: 'Interested in digital transformation' },
    { id: 'comp_003', name: 'MediCare Health Systems', industry: 'Healthcare', website: 'https://medicare.in', phone: '+91 44 4123 4567', email: 'hello@medicare.in', address: 'T Nagar, Chennai', status: 'active', createdAt: '2024-08-20', notes: 'Needs CRM implementation' },
    { id: 'comp_004', name: 'FinEdge Capital', industry: 'Finance', website: 'https://finedge.in', phone: '+91 22 5123 4567', email: 'connect@finedge.in', address: 'Lower Parel, Mumbai', status: 'active', createdAt: '2024-09-10', notes: 'High-value prospect' },
    { id: 'comp_005', name: 'EduPrime Learning', industry: 'Education', website: 'https://eduprime.in', phone: '+91 80 4123 4567', email: 'team@eduprime.in', address: 'Indiranagar, Bangalore', status: 'active', createdAt: '2024-10-05', notes: 'Need learning management system' },
    { id: 'comp_006', name: 'RetailMart India', industry: 'Retail', website: 'https://retailmart.in', phone: '+91 11 4123 4567', email: 'info@retailmart.in', address: 'Connaught Place, Delhi', status: 'active', createdAt: '2024-11-01', notes: 'Major retail chain' },
    { id: 'comp_007', name: 'AeroSpace Dynamics', industry: 'Aerospace', website: 'https://aerospace.in', phone: '+91 80 5123 4567', email: 'contact@aerospace.in', address: 'Whitefield, Bangalore', status: 'active', createdAt: '2024-12-01', notes: 'Requires custom solutions' },
    { id: 'comp_008', name: 'FoodieExpress Logistics', industry: 'Logistics', website: 'https://foodieexpress.in', phone: '+91 22 6123 4567', email: 'hello@foodieexpress.in', address: 'Andheri East, Mumbai', status: 'active', createdAt: '2025-01-15', notes: 'Need logistics software' },
  ]

  const deals = [
    { id: 'deal_001', title: 'Enterprise CRM Suite', company: 'TechVista Solutions', companyId: 'comp_001', contactId: 'cont_001', value: 12000000, stage: 'qualified', probability: 40, expectedCloseDate: new Date(now.getTime() + 86400000 * 45).toISOString(), assignedTo: 'usr_003', notes: 'Initial demo completed, technical evaluation in progress', createdAt: new Date(now.getTime() - 86400000 * 15).toISOString(), updatedAt: now.toISOString() },
    { id: 'deal_002', title: 'Digital Marketing Package', company: 'GreenEarth Industries', companyId: 'comp_002', contactId: 'cont_003', value: 3500000, stage: 'proposal', probability: 60, expectedCloseDate: new Date(now.getTime() + 86400000 * 20).toISOString(), assignedTo: 'usr_004', notes: 'Proposal sent, awaiting feedback', createdAt: new Date(now.getTime() - 86400000 * 10).toISOString(), updatedAt: now.toISOString() },
    { id: 'deal_003', title: 'Full Digital Transformation', company: 'MediCare Health Systems', companyId: 'comp_003', value: 25000000, stage: 'negotiation', probability: 75, expectedCloseDate: new Date(now.getTime() + 86400000 * 15).toISOString(), assignedTo: 'usr_003', notes: 'Negotiating final terms', createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'deal_004', title: 'Enterprise Software Suite', company: 'FinEdge Capital', companyId: 'comp_004', value: 18000000, stage: 'proposal', probability: 55, expectedCloseDate: new Date(now.getTime() + 86400000 * 30).toISOString(), assignedTo: 'usr_004', notes: 'Technical demo scheduled', createdAt: new Date(now.getTime() - 86400000 * 20).toISOString(), updatedAt: now.toISOString() },
    { id: 'deal_005', title: 'Learning Management System', company: 'EduPrime Learning', companyId: 'comp_005', value: 8500000, stage: 'negotiation', probability: 80, expectedCloseDate: new Date(now.getTime() + 86400000 * 10).toISOString(), assignedTo: 'usr_003', notes: 'Contract review in progress', createdAt: new Date(now.getTime() - 86400000 * 25).toISOString(), updatedAt: now.toISOString() },
    { id: 'deal_006', title: 'Full Digital Transformation', company: 'RetailMart India', companyId: 'comp_006', value: 15000000, stage: 'won', probability: 100, expectedCloseDate: new Date(now.getTime() - 86400000 * 5).toISOString(), assignedTo: 'usr_003', notes: 'Contract signed', createdAt: new Date(now.getTime() - 86400000 * 60).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 5).toISOString() },
    { id: 'deal_007', title: 'Custom Software Development', company: 'AeroSpace Dynamics', companyId: 'comp_007', value: 22000000, stage: 'lost', probability: 0, expectedCloseDate: new Date(now.getTime() - 86400000 * 10).toISOString(), assignedTo: 'usr_004', notes: 'Lost to competitor', createdAt: new Date(now.getTime() - 86400000 * 50).toISOString(), updatedAt: new Date(now.getTime() - 86400000 * 10).toISOString() },
  ]

  const announcements = [
    { id: 'ann_001', title: 'New Website Launch', content: 'Our new website is now live! Check out the improved design and features.', category: 'updates', priority: 'high', postedBy: 'usr_001', postedByName: 'Super Admin', createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(), expiresAt: new Date(now.getTime() + 86400000 * 30).toISOString(), pinned: true, status: 'published' },
    { id: 'ann_002', title: 'Team Outing', content: 'Annual team outing scheduled for next month. Stay tuned for details.', category: 'events', priority: 'medium', postedBy: 'usr_001', postedByName: 'Super Admin', createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(), expiresAt: new Date(now.getTime() + 86400000 * 60).toISOString(), pinned: false, status: 'published' },
  ]

  const pages = [
    { id: 'page_001', title: 'About Us', slug: 'about', content: 'AB Digital Solution is a leading digital marketing agency...', status: 'published', sections: [], createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'page_002', title: 'Services', slug: 'services', content: 'We offer comprehensive digital marketing services...', status: 'published', sections: [], createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'page_003', title: 'Contact Us', slug: 'contact', content: 'Get in touch with us today...', status: 'published', sections: [], createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(), updatedAt: now.toISOString() },
  ]

  const subscribers = [
    { id: 'sub_001', email: 'john@example.com', name: 'John Doe', status: 'active', subscribedAt: new Date(now.getTime() - 86400000 * 45).toISOString() },
    { id: 'sub_002', email: 'jane@example.com', name: 'Jane Smith', status: 'active', subscribedAt: new Date(now.getTime() - 86400000 * 30).toISOString() },
    { id: 'sub_003', email: 'bob@example.com', name: 'Bob Wilson', status: 'unsubscribed', subscribedAt: new Date(now.getTime() - 86400000 * 60).toISOString() },
  ]

  store.getCollection('leads')
  leads.forEach(l => { const { id, ...rest } = l; store.create('leads', rest) })
  contacts.forEach(c => { const { id, ...rest } = c; store.create('contacts', rest) })
  companies.forEach(c => { const { id, ...rest } = c; store.create('companies', rest) })
  deals.forEach(d => { const { id, ...rest } = d; store.create('deals', rest) })
  announcements.forEach(a => { const { id, ...rest } = a; store.create('announcements', rest) })
  pages.forEach(p => { const { id, ...rest } = p; store.create('pages', rest) })
  subscribers.forEach(s => { const { id, ...rest } = s; store.create('subscribers', rest) })
}
