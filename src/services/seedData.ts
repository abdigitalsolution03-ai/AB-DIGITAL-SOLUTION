import { store } from './store'
import { initializeUsers } from './auth'

function generateEmployeeId(index: number): string {
  return `EMP${String(index).padStart(3, '0')}`
}

export function seedAllData(): void {
  initializeUsers()

  if (store.hasCollection('departments') && store.hasCollection('employees')) return

  const departments = [
    { id: 'dept_001', name: 'Engineering', code: 'ENG', headCount: 5, budget: 5000000, color: '#3B82F6', description: 'Software development and infrastructure' },
    { id: 'dept_002', name: 'Sales & Marketing', code: 'S&M', headCount: 4, budget: 3000000, color: '#F59E0B', description: 'Revenue generation and brand growth' },
    { id: 'dept_003', name: 'Human Resources', code: 'HR', headCount: 3, budget: 1500000, color: '#10B981', description: 'Talent management and culture' },
    { id: 'dept_004', name: 'Finance', code: 'FIN', headCount: 2, budget: 2000000, color: '#8B5CF6', description: 'Financial planning and accounting' },
    { id: 'dept_005', name: 'Design', code: 'DSG', headCount: 3, budget: 1800000, color: '#EC4899', description: 'UI/UX and brand design' },
    { id: 'dept_006', name: 'Operations', code: 'OPS', headCount: 2, budget: 1200000, color: '#6366F1', description: 'Business operations and logistics' },
  ]

  const designations = [
    { id: 'des_001', title: 'Chief Executive Officer', level: 'Executive', minSalary: 3000000, maxSalary: 5000000, department: 'Management' },
    { id: 'des_002', title: 'Tech Lead', level: 'Senior', minSalary: 1800000, maxSalary: 2800000, department: 'Engineering' },
    { id: 'des_003', title: 'Senior Software Engineer', level: 'Senior', minSalary: 1200000, maxSalary: 2000000, department: 'Engineering' },
    { id: 'des_004', title: 'Software Engineer', level: 'Mid', minSalary: 600000, maxSalary: 1200000, department: 'Engineering' },
    { id: 'des_005', title: 'HR Manager', level: 'Senior', minSalary: 800000, maxSalary: 1500000, department: 'Human Resources' },
    { id: 'des_006', title: 'Senior Sales Executive', level: 'Senior', minSalary: 600000, maxSalary: 1200000, department: 'Sales & Marketing' },
    { id: 'des_007', title: 'Sales Executive', level: 'Mid', minSalary: 400000, maxSalary: 800000, department: 'Sales & Marketing' },
    { id: 'des_008', title: 'UI/UX Designer', level: 'Mid', minSalary: 500000, maxSalary: 1000000, department: 'Design' },
    { id: 'des_009', title: 'Finance Manager', level: 'Senior', minSalary: 1000000, maxSalary: 1800000, department: 'Finance' },
    { id: 'des_010', title: 'Operations Manager', level: 'Senior', minSalary: 800000, maxSalary: 1500000, department: 'Operations' },
    { id: 'des_011', title: 'Junior Software Engineer', level: 'Junior', minSalary: 300000, maxSalary: 600000, department: 'Engineering' },
    { id: 'des_012', title: 'Marketing Executive', level: 'Mid', minSalary: 400000, maxSalary: 800000, department: 'Sales & Marketing' },
    { id: 'des_013', title: 'Graphic Designer', level: 'Junior', minSalary: 300000, maxSalary: 600000, department: 'Design' },
    { id: 'des_014', title: 'Accountant', level: 'Mid', minSalary: 350000, maxSalary: 700000, department: 'Finance' },
    { id: 'des_015', title: 'HR Executive', level: 'Junior', minSalary: 300000, maxSalary: 550000, department: 'Human Resources' },
  ]

  const employees = [
    { id: 'emp_001', userId: 'usr_001', name: 'Super Admin', email: 'admin@abdigital.com', phone: '+91 98765 43210', department: 'Management', designation: 'Chief Executive Officer', employeeId: 'EMP001', dateOfJoining: '2020-01-15', salary: 3500000, status: 'active', bloodGroup: 'O+', address: '42, Business Tower, Andheri East, Mumbai - 400093', emergencyContact: '+91 98765 43200', workType: 'remote' },
    { id: 'emp_002', userId: 'usr_002', name: 'Priya Sharma', email: 'hr@abdigital.com', phone: '+91 98765 43211', department: 'Human Resources', designation: 'HR Manager', employeeId: 'EMP002', dateOfJoining: '2020-03-01', salary: 1200000, status: 'active', bloodGroup: 'B+', address: '15, Garden Residency, Whitefield, Bangalore - 560066', emergencyContact: '+91 98765 43201', workType: 'hybrid' },
    { id: 'emp_003', userId: 'usr_003', name: 'Rahul Verma', email: 'leader@abdigital.com', phone: '+91 98765 43212', department: 'Engineering', designation: 'Tech Lead', employeeId: 'EMP003', dateOfJoining: '2021-06-15', salary: 2200000, status: 'active', bloodGroup: 'A+', address: '78, Green Hills Apartments, Hinjewadi, Pune - 411057', emergencyContact: '+91 98765 43202', workType: 'remote' },
    { id: 'emp_004', userId: 'usr_004', name: 'Amit Patel', email: 'sales@abdigital.com', phone: '+91 98765 43213', department: 'Sales & Marketing', designation: 'Senior Sales Executive', employeeId: 'EMP004', dateOfJoining: '2021-09-01', salary: 900000, status: 'active', bloodGroup: 'AB+', address: '23, Lake View Complex, Sector 62, Noida - 201309', emergencyContact: '+91 98765 43203', workType: 'office' },
    { id: 'emp_005', userId: 'usr_005', name: 'Sneha Gupta', email: 'employee@abdigital.com', phone: '+91 98765 43214', department: 'Design', designation: 'UI/UX Designer', employeeId: 'EMP005', dateOfJoining: '2022-01-10', salary: 750000, status: 'active', bloodGroup: 'O-', address: '56, Royal Palm Estate, Electronic City, Bangalore - 560100', emergencyContact: '+91 98765 43204', workType: 'hybrid' },
    { id: 'emp_006', userId: '', name: 'Vikram Singh', email: 'vikram@abdigital.com', phone: '+91 98765 43215', department: 'Engineering', designation: 'Senior Software Engineer', employeeId: 'EMP006', dateOfJoining: '2021-04-01', salary: 1600000, status: 'active', bloodGroup: 'B-', address: '12, Tech Park Residency, Kharadi, Pune - 411014', emergencyContact: '+91 98765 43205', workType: 'remote' },
    { id: 'emp_007', userId: '', name: 'Ananya Reddy', email: 'ananya@abdigital.com', phone: '+91 98765 43216', department: 'Engineering', designation: 'Software Engineer', employeeId: 'EMP007', dateOfJoining: '2022-07-01', salary: 850000, status: 'active', bloodGroup: 'A-', address: '34, Cyber City Apartments, Gachibowli, Hyderabad - 500032', emergencyContact: '+91 98765 43206', workType: 'office' },
    { id: 'emp_008', userId: '', name: 'Rohit Joshi', email: 'rohit@abdigital.com', phone: '+91 98765 43217', department: 'Sales & Marketing', designation: 'Marketing Executive', employeeId: 'EMP008', dateOfJoining: '2022-10-15', salary: 550000, status: 'active', bloodGroup: 'O+', address: '89, Market Lane, Malad West, Mumbai - 400064', emergencyContact: '+91 98765 43207', workType: 'office' },
    { id: 'emp_009', userId: '', name: 'Neha Kapoor', email: 'neha@abdigital.com', phone: '+91 98765 43218', department: 'Human Resources', designation: 'HR Executive', employeeId: 'EMP009', dateOfJoining: '2023-01-20', salary: 450000, status: 'active', bloodGroup: 'AB-', address: '67, Lake Gardens, Salt Lake, Kolkata - 700064', emergencyContact: '+91 98765 43208', workType: 'hybrid' },
    { id: 'emp_010', userId: '', name: 'Arun Nair', email: 'arun@abdigital.com', phone: '+91 98765 43219', department: 'Finance', designation: 'Finance Manager', employeeId: 'EMP010', dateOfJoining: '2021-02-01', salary: 1400000, status: 'active', bloodGroup: 'A+', address: '5, Diamond Residency, Marine Drive, Kochi - 682031', emergencyContact: '+91 98765 43209', workType: 'office' },
    { id: 'emp_011', userId: '', name: 'Deepa Iyer', email: 'deepa@abdigital.com', phone: '+91 98765 43220', department: 'Design', designation: 'Graphic Designer', employeeId: 'EMP011', dateOfJoining: '2023-03-15', salary: 450000, status: 'active', bloodGroup: 'O+', address: '22, Art District, Koregaon Park, Pune - 411001', emergencyContact: '+91 98765 43210', workType: 'remote' },
    { id: 'emp_012', userId: '', name: 'Karan Mehta', email: 'karan@abdigital.com', phone: '+91 98765 43221', department: 'Operations', designation: 'Operations Manager', employeeId: 'EMP012', dateOfJoining: '2021-11-01', salary: 1100000, status: 'active', bloodGroup: 'B+', address: '90, Business Hub, BKC, Mumbai - 400051', emergencyContact: '+91 98765 43211', workType: 'office' },
    { id: 'emp_013', userId: '', name: 'Kavita Desai', email: 'kavita@abdigital.com', phone: '+91 98765 43222', department: 'Engineering', designation: 'Junior Software Engineer', employeeId: 'EMP013', dateOfJoining: '2023-06-01', salary: 400000, status: 'active', bloodGroup: 'A-', address: '11, Sunrise Apartments, Aundh, Pune - 411007', emergencyContact: '+91 98765 43212', workType: 'hybrid' },
    { id: 'emp_014', userId: '', name: 'Manoj Tiwari', email: 'manoj@abdigital.com', phone: '+91 98765 43223', department: 'Finance', designation: 'Accountant', employeeId: 'EMP014', dateOfJoining: '2022-08-01', salary: 500000, status: 'active', bloodGroup: 'O-', address: '8, River View Colony, Patna - 800001', emergencyContact: '+91 98765 43213', workType: 'office' },
    { id: 'emp_015', userId: '', name: 'Pooja Malhotra', email: 'pooja@abdigital.com', phone: '+91 98765 43224', department: 'Sales & Marketing', designation: 'Sales Executive', employeeId: 'EMP015', dateOfJoining: '2023-09-01', salary: 500000, status: 'active', bloodGroup: 'B+', address: '45, Star City, Sector 45, Gurgaon - 122003', emergencyContact: '+91 98765 43214', workType: 'office' },
  ]

  const now = new Date()
  const companies = [
    { id: 'comp_001', name: 'TechVista Solutions', industry: 'Technology', website: 'https://techvista.in', phone: '+91 22 4123 4567', email: 'contact@techvista.in', address: 'Bandra Kurla Complex, Mumbai', status: 'active', revenue: 50000000, employees: 200, createdAt: '2024-06-01', assignedTo: 'usr_004', notes: 'Key client for web development' },
    { id: 'comp_002', name: 'GreenEarth Industries', industry: 'Manufacturing', website: 'https://greenearth.in', phone: '+91 33 4123 4567', email: 'info@greenearth.in', address: 'Salt Lake, Kolkata', status: 'active', revenue: 75000000, employees: 500, createdAt: '2024-07-15', assignedTo: 'usr_004', notes: 'Interested in digital transformation' },
    { id: 'comp_003', name: 'MediCare Health Systems', industry: 'Healthcare', website: 'https://medicare.in', phone: '+91 44 4123 4567', email: 'hello@medicare.in', address: 'T Nagar, Chennai', status: 'active', revenue: 35000000, employees: 150, createdAt: '2024-08-20', assignedTo: 'usr_004', notes: 'Needs CRM implementation' },
    { id: 'comp_004', name: 'FinEdge Capital', industry: 'Finance', website: 'https://finedge.in', phone: '+91 22 5123 4567', email: 'connect@finedge.in', address: 'Lower Parel, Mumbai', status: 'active', revenue: 100000000, employees: 300, createdAt: '2024-09-10', assignedTo: 'usr_003', notes: 'High-value prospect for enterprise solution' },
    { id: 'comp_005', name: 'EduPrime Learning', industry: 'Education', website: 'https://eduprime.in', phone: '+91 80 4123 4567', email: 'team@eduprime.in', address: 'Indiranagar, Bangalore', status: 'active', revenue: 15000000, employees: 80, createdAt: '2024-10-05', assignedTo: 'usr_004', notes: 'Need learning management system' },
    { id: 'comp_006', name: 'RetailMart India', industry: 'Retail', website: 'https://retailmart.in', phone: '+91 11 4123 4567', email: 'info@retailmart.in', address: 'Connaught Place, Delhi', status: 'active', revenue: 200000000, employees: 1000, createdAt: '2024-11-01', assignedTo: 'usr_003', notes: 'Major retail chain exploring digital' },
    { id: 'comp_007', name: 'AeroSpace Dynamics', industry: 'Aerospace', website: 'https://aerospace.in', phone: '+91 80 5123 4567', email: 'contact@aerospace.in', address: 'Whitefield, Bangalore', status: 'active', revenue: 80000000, employees: 400, createdAt: '2024-12-01', assignedTo: 'usr_003', notes: 'Requires custom software solutions' },
    { id: 'comp_008', name: 'FoodieExpress Logistics', industry: 'Logistics', website: 'https://foodieexpress.in', phone: '+91 22 6123 4567', email: 'hello@foodieexpress.in', address: 'Andheri East, Mumbai', status: 'active', revenue: 25000000, employees: 120, createdAt: '2025-01-15', assignedTo: 'usr_004', notes: 'Need fleet management software' },
  ]

  const leads = [
    { id: 'lead_001', firstName: 'Rajesh', lastName: 'Khanna', email: 'rajesh@techvista.in', phone: '+91 98765 43225', company: 'TechVista Solutions', companyId: 'comp_001', designation: 'CTO', source: 'Website', stage: 'won', value: 4500000, assignedTo: 'usr_004', notes: 'Signed enterprise agreement', score: 95, lastContacted: '2025-06-10', createdAt: '2025-01-10', convertedAt: '2025-04-15', address: 'BKC, Mumbai' },
    { id: 'lead_002', firstName: 'Sunita', lastName: 'Reddy', email: 'sunita@greenearth.in', phone: '+91 98765 43226', company: 'GreenEarth Industries', companyId: 'comp_002', designation: 'Digital Head', source: 'LinkedIn', stage: 'proposal', value: 2800000, assignedTo: 'usr_004', notes: 'Proposal submitted for digital transformation', score: 82, lastContacted: '2025-06-28', createdAt: '2025-03-20', address: 'Salt Lake, Kolkata' },
    { id: 'lead_003', firstName: 'Dr. Arvind', lastName: 'Nair', email: 'arvind@medicare.in', phone: '+91 98765 43227', company: 'MediCare Health Systems', companyId: 'comp_003', designation: 'Director', source: 'Referral', stage: 'negotiation', value: 1800000, assignedTo: 'usr_003', notes: 'Negotiating CRM implementation', score: 78, lastContacted: '2025-06-25', createdAt: '2025-02-14', address: 'T Nagar, Chennai' },
    { id: 'lead_004', firstName: 'Vivek', lastName: 'Shah', email: 'vivek@finedge.in', phone: '+91 98765 43228', company: 'FinEdge Capital', companyId: 'comp_004', designation: 'CEO', source: 'Conference', stage: 'qualified', value: 6500000, assignedTo: 'usr_003', notes: 'High budget, interested in full suite', score: 90, lastContacted: '2025-06-20', createdAt: '2025-04-01', address: 'Lower Parel, Mumbai' },
    { id: 'lead_005', firstName: 'Meera', lastName: 'Deshpande', email: 'meera@eduprime.in', phone: '+91 98765 43229', company: 'EduPrime Learning', companyId: 'comp_005', designation: 'Founder', source: 'Website', stage: 'contacted', value: 1200000, assignedTo: 'usr_004', notes: 'Needs LMS, initial call done', score: 65, lastContacted: '2025-06-15', createdAt: '2025-05-10', address: 'Indiranagar, Bangalore' },
    { id: 'lead_006', firstName: 'Anil', lastName: 'Gupta', email: 'anil@retailmart.in', phone: '+91 98765 43230', company: 'RetailMart India', companyId: 'comp_006', designation: 'VP Technology', source: 'Email Campaign', stage: 'new', value: 8000000, assignedTo: 'usr_003', notes: 'Major opportunity - needs comprehensive solution', score: 72, lastContacted: '2025-06-30', createdAt: '2025-06-01', address: 'Connaught Place, Delhi' },
    { id: 'lead_007', firstName: 'Suresh', lastName: 'Kumar', email: 'suresh@aerospace.in', phone: '+91 98765 43231', company: 'AeroSpace Dynamics', companyId: 'comp_007', designation: 'Engineering Head', source: 'Referral', stage: 'proposal', value: 3500000, assignedTo: 'usr_003', notes: 'Custom software development proposal sent', score: 85, lastContacted: '2025-06-27', createdAt: '2025-04-20', address: 'Whitefield, Bangalore' },
    { id: 'lead_008', firstName: 'Priyanka', lastName: 'Chopra', email: 'priyanka@foodieexpress.in', phone: '+91 98765 43232', company: 'FoodieExpress Logistics', companyId: 'comp_008', designation: 'COO', source: 'Website', stage: 'qualified', value: 2200000, assignedTo: 'usr_004', notes: 'Fleet management solution interest', score: 75, lastContacted: '2025-06-22', createdAt: '2025-05-05', address: 'Andheri East, Mumbai' },
    { id: 'lead_009', firstName: 'Ravi', lastName: 'Menon', email: 'ravi@newstartup.in', phone: '+91 98765 43233', company: 'NovaTech Startups', companyId: '', designation: 'Co-Founder', source: 'LinkedIn', stage: 'new', value: 800000, assignedTo: 'usr_004', notes: 'Early stage startup, budget limited', score: 40, lastContacted: '2025-06-18', createdAt: '2025-06-15', address: 'Koramangala, Bangalore' },
    { id: 'lead_010', firstName: 'Neelam', lastName: 'Joshi', email: 'neelam@quantum.ai', phone: '+91 98765 43234', company: 'QuantumAI Research', companyId: '', designation: 'Lead Researcher', source: 'Conference', stage: 'contacted', value: 5000000, assignedTo: 'usr_003', notes: 'AI research lab needs infrastructure', score: 60, lastContacted: '2025-06-12', createdAt: '2025-05-25', address: 'Hinjewadi, Pune' },
    { id: 'lead_011', firstName: 'Mohan', lastName: 'Das', email: 'mohan@blueriver.in', phone: '+91 98765 43235', company: 'BlueRiver Constructions', companyId: '', designation: 'Owner', source: 'Referral', stage: 'lost', value: 1500000, assignedTo: 'usr_004', notes: 'Chose competitor, revisit in Q4', score: 35, lastContacted: '2025-05-30', createdAt: '2025-02-10', address: 'Bhubaneswar, Odisha' },
    { id: 'lead_012', firstName: 'Tara', lastName: 'Singh', email: 'tara@silveroak.in', phone: '+91 98765 43236', company: 'SilverOak Hospitality', companyId: '', designation: 'GM', source: 'Website', stage: 'qualified', value: 3200000, assignedTo: 'usr_003', notes: 'Hotel chain needs booking system', score: 70, lastContacted: '2025-06-29', createdAt: '2025-05-15', address: 'Jaipur, Rajasthan' },
    { id: 'lead_013', firstName: 'Ishaan', lastName: 'Bhatt', email: 'ishaan@cloudnine.in', phone: '+91 98765 43237', company: 'CloudNine Services', companyId: '', designation: 'IT Manager', source: 'Email Campaign', stage: 'new', value: 900000, assignedTo: 'usr_004', notes: 'Cloud migration inquiry', score: 45, lastContacted: '2025-06-25', createdAt: '2025-06-20', address: 'Ahmedabad, Gujarat' },
    { id: 'lead_014', firstName: 'Lakshmi', lastName: 'Iyer', email: 'lakshmi@pearl.in', phone: '+91 98765 43238', company: 'Pearl Jewellery', companyId: '', designation: 'Director', source: 'Referral', stage: 'negotiation', value: 2000000, assignedTo: 'usr_003', notes: 'E-commerce platform for jewellery', score: 80, lastContacted: '2025-06-28', createdAt: '2025-04-10', address: 'Matunga, Mumbai' },
    { id: 'lead_015', firstName: 'Aditya', lastName: 'Warrier', email: 'aditya@zenith.in', phone: '+91 98765 43239', company: 'Zenith Corp', companyId: '', designation: 'CEO', source: 'LinkedIn', stage: 'contacted', value: 4500000, assignedTo: 'usr_004', notes: 'Holding company exploring digital solutions', score: 68, lastContacted: '2025-06-24', createdAt: '2025-06-05', address: 'Dadar, Mumbai' },
    { id: 'lead_016', firstName: 'Kavya', lastName: 'Nambiar', email: 'kavya@nextgen.in', phone: '+91 98765 43240', company: 'NextGen Solutions', companyId: '', designation: 'Product Head', source: 'Website', stage: 'qualified', value: 1600000, assignedTo: 'usr_003', notes: 'SaaS product development', score: 76, lastContacted: '2025-06-26', createdAt: '2025-05-20', address: 'Kochi, Kerala' },
    { id: 'lead_017', firstName: 'Rohini', lastName: 'Patil', email: 'rohini@bioworld.in', phone: '+91 98765 43241', company: 'BioWorld Labs', companyId: '', designation: 'Lab Director', source: 'Referral', stage: 'lost', value: 700000, assignedTo: 'usr_004', notes: 'Budget not approved', score: 25, lastContacted: '2025-05-10', createdAt: '2025-03-01', address: 'Pune, Maharashtra' },
    { id: 'lead_018', firstName: 'Karthik', lastName: 'Rajan', email: 'karthik@globaltraders.in', phone: '+91 98765 43242', company: 'Global Trade International', companyId: '', designation: 'MD', source: 'Conference', stage: 'proposal', value: 3800000, assignedTo: 'usr_003', notes: 'International trade platform proposal', score: 88, lastContacted: '2025-06-30', createdAt: '2025-04-25', address: 'Chennai, Tamil Nadu' },
    { id: 'lead_019', firstName: 'Divya', lastName: 'Acharya', email: 'divya@innovate.in', phone: '+91 98765 43243', company: 'InnovateTech', companyId: '', designation: 'CTO', source: 'Website', stage: 'new', value: 1100000, assignedTo: 'usr_004', notes: 'Website redesign inquiry', score: 55, lastContacted: '2025-06-28', createdAt: '2025-06-22', address: 'Bangalore, Karnataka' },
    { id: 'lead_020', firstName: 'Prakash', lastName: 'Rao', email: 'prakash@unitedcorp.in', phone: '+91 98765 43244', company: 'United Corporation', companyId: '', designation: 'VP Operations', source: 'Email Campaign', stage: 'won', value: 2500000, assignedTo: 'usr_004', notes: 'Contract signed for CRM + HRMS', score: 92, lastContacted: '2025-06-05', createdAt: '2025-03-10', convertedAt: '2025-06-01', address: 'Hyderabad, Telangana' },
  ]

  const contacts = [
    { id: 'cont_001', name: 'Rajesh Khanna', email: 'rajesh@techvista.in', phone: '+91 98765 43225', company: 'TechVista Solutions', companyId: 'comp_001', designation: 'CTO', leadId: 'lead_001', type: 'primary', notes: 'Decision maker', createdAt: '2025-01-10' },
    { id: 'cont_002', name: 'Neha Khanna', email: 'neha@techvista.in', phone: '+91 98765 43245', company: 'TechVista Solutions', companyId: 'comp_001', designation: 'Product Manager', leadId: 'lead_001', type: 'secondary', notes: 'Technical contact', createdAt: '2025-01-15' },
    { id: 'cont_003', name: 'Sunita Reddy', email: 'sunita@greenearth.in', phone: '+91 98765 43226', company: 'GreenEarth Industries', companyId: 'comp_002', designation: 'Digital Head', leadId: 'lead_002', type: 'primary', notes: '', createdAt: '2025-03-20' },
    { id: 'cont_004', name: 'Dr. Arvind Nair', email: 'arvind@medicare.in', phone: '+91 98765 43227', company: 'MediCare Health Systems', companyId: 'comp_003', designation: 'Director', leadId: 'lead_003', type: 'primary', notes: '', createdAt: '2025-02-14' },
    { id: 'cont_005', name: 'Vivek Shah', email: 'vivek@finedge.in', phone: '+91 98765 43228', company: 'FinEdge Capital', companyId: 'comp_004', designation: 'CEO', leadId: 'lead_004', type: 'primary', notes: '', createdAt: '2025-04-01' },
    { id: 'cont_006', name: 'Meera Deshpande', email: 'meera@eduprime.in', phone: '+91 98765 43229', company: 'EduPrime Learning', companyId: 'comp_005', designation: 'Founder', leadId: 'lead_005', type: 'primary', notes: '', createdAt: '2025-05-10' },
    { id: 'cont_007', name: 'Anil Gupta', email: 'anil@retailmart.in', phone: '+91 98765 43230', company: 'RetailMart India', companyId: 'comp_006', designation: 'VP Technology', leadId: 'lead_006', type: 'primary', notes: '', createdAt: '2025-06-01' },
    { id: 'cont_008', name: 'Suresh Kumar', email: 'suresh@aerospace.in', phone: '+91 98765 43231', company: 'AeroSpace Dynamics', companyId: 'comp_007', designation: 'Engineering Head', leadId: 'lead_007', type: 'primary', notes: '', createdAt: '2025-04-20' },
    { id: 'cont_009', name: 'Priyanka Chopra', email: 'priyanka@foodieexpress.in', phone: '+91 98765 43232', company: 'FoodieExpress Logistics', companyId: 'comp_008', designation: 'COO', leadId: 'lead_008', type: 'primary', notes: '', createdAt: '2025-05-05' },
    { id: 'cont_010', name: 'Prakash Rao', email: 'prakash@unitedcorp.in', phone: '+91 98765 43244', company: 'United Corporation', companyId: '', designation: 'VP Operations', leadId: 'lead_020', type: 'primary', notes: '', createdAt: '2025-03-10' },
  ]

  const deals = [
    { id: 'deal_001', title: 'Enterprise Web Development', company: 'TechVista Solutions', companyId: 'comp_001', value: 4500000, stage: 'closed_won', probability: 100, assignedTo: 'usr_004', expectedCloseDate: '2025-04-15', actualCloseDate: '2025-04-10', leadId: 'lead_001', notes: 'Full-stack web development project', createdAt: '2025-01-15' },
    { id: 'deal_002', title: 'Digital Transformation Suite', company: 'GreenEarth Industries', companyId: 'comp_002', value: 2800000, stage: 'proposal', probability: 70, assignedTo: 'usr_004', expectedCloseDate: '2025-08-15', leadId: 'lead_002', notes: 'ERP + CRM implementation', createdAt: '2025-03-25' },
    { id: 'deal_003', title: 'CRM Implementation', company: 'MediCare Health Systems', companyId: 'comp_003', value: 1800000, stage: 'negotiation', probability: 85, assignedTo: 'usr_003', expectedCloseDate: '2025-08-01', leadId: 'lead_003', notes: 'Custom CRM for healthcare', createdAt: '2025-02-20' },
    { id: 'deal_004', title: 'Full Enterprise Suite', company: 'FinEdge Capital', companyId: 'comp_004', value: 6500000, stage: 'qualification', probability: 40, assignedTo: 'usr_003', expectedCloseDate: '2025-10-01', leadId: 'lead_004', notes: 'Complete enterprise solution', createdAt: '2025-04-05' },
    { id: 'deal_005', title: 'Learning Management System', company: 'EduPrime Learning', companyId: 'comp_005', value: 1200000, stage: 'contacted', probability: 30, assignedTo: 'usr_004', expectedCloseDate: '2025-09-01', leadId: 'lead_005', notes: 'LMS with analytics', createdAt: '2025-05-15' },
    { id: 'deal_006', title: 'Retail Digital Platform', company: 'RetailMart India', companyId: 'comp_006', value: 8000000, stage: 'qualification', probability: 25, assignedTo: 'usr_003', expectedCloseDate: '2025-12-01', leadId: 'lead_006', notes: 'Massive scope - e-commerce + ERP', createdAt: '2025-06-05' },
    { id: 'deal_007', title: 'Custom Software Development', company: 'AeroSpace Dynamics', companyId: 'comp_007', value: 3500000, stage: 'proposal', probability: 75, assignedTo: 'usr_003', expectedCloseDate: '2025-08-30', leadId: 'lead_007', notes: 'Engineering software suite', createdAt: '2025-04-25' },
    { id: 'deal_008', title: 'Fleet Management Software', company: 'FoodieExpress Logistics', companyId: 'comp_008', value: 2200000, stage: 'qualification', probability: 50, assignedTo: 'usr_004', expectedCloseDate: '2025-09-15', leadId: 'lead_008', notes: 'GPS tracking + route optimization', createdAt: '2025-05-10' },
    { id: 'deal_009', title: 'CRM + HRMS Package', company: 'United Corporation', companyId: '', value: 2500000, stage: 'closed_won', probability: 100, assignedTo: 'usr_004', expectedCloseDate: '2025-06-01', actualCloseDate: '2025-05-28', leadId: 'lead_020', notes: 'Signed deal', createdAt: '2025-03-15' },
    { id: 'deal_010', title: 'E-commerce Platform', company: 'Pearl Jewellery', companyId: '', value: 2000000, stage: 'negotiation', probability: 80, assignedTo: 'usr_003', expectedCloseDate: '2025-08-15', leadId: 'lead_014', notes: 'Online jewellery store', createdAt: '2025-04-15' },
  ]

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const projects = [
    { id: 'proj_001', name: 'Website Redesign - TechVista', description: 'Complete website redesign with modern tech stack', status: 'in_progress', priority: 'high', startDate: '2025-04-01', endDate: '2025-07-30', budget: 4500000, spent: 2500000, company: 'TechVista Solutions', companyId: 'comp_001', leadId: 'lead_001', manager: 'usr_003', team: ['usr_003', 'usr_005', 'emp_013'], progress: 65, createdAt: '2025-03-15' },
    { id: 'proj_002', name: 'Mobile App Development', description: 'Cross-platform mobile application for food delivery', status: 'planning', priority: 'medium', startDate: '2025-06-01', endDate: '2025-09-30', budget: 2200000, spent: 300000, company: 'FoodieExpress Logistics', companyId: 'comp_008', leadId: 'lead_008', manager: 'usr_003', team: ['usr_003', 'emp_007', 'emp_013'], progress: 15, createdAt: '2025-05-20' },
    { id: 'proj_003', name: 'CRM Implementation - MediCare', description: 'Custom CRM system for healthcare provider', status: 'in_progress', priority: 'high', startDate: '2025-05-01', endDate: '2025-09-15', budget: 1800000, spent: 800000, company: 'MediCare Health Systems', companyId: 'comp_003', leadId: 'lead_003', manager: 'usr_003', team: ['usr_003', 'emp_006', 'emp_007'], progress: 45, createdAt: '2025-04-10' },
    { id: 'proj_004', name: 'Cloud Migration - GreenEarth', description: 'Cloud infrastructure migration and setup', status: 'on_hold', priority: 'medium', startDate: '2025-06-15', endDate: '2025-10-30', budget: 2800000, spent: 500000, company: 'GreenEarth Industries', companyId: 'comp_002', leadId: 'lead_002', manager: 'usr_003', team: ['usr_003', 'emp_006'], progress: 20, createdAt: '2025-04-20' },
  ]

  const tasks = [
    { id: 'task_001', title: 'Design homepage wireframes', description: 'Create wireframes for new homepage', projectId: 'proj_001', projectName: 'Website Redesign - TechVista', assignedTo: 'usr_005', assignedName: 'Sneha Gupta', status: 'completed', priority: 'high', dueDate: '2025-05-15', createdAt: '2025-04-10', completedAt: '2025-05-14', estimatedHours: 40, actualHours: 36, tags: ['design', 'frontend'] },
    { id: 'task_002', title: 'Develop landing page component', description: 'Build reusable landing page components', projectId: 'proj_001', projectName: 'Website Redesign - TechVista', assignedTo: 'emp_013', assignedName: 'Kavita Desai', status: 'completed', priority: 'high', dueDate: '2025-05-30', createdAt: '2025-04-15', completedAt: '2025-05-28', estimatedHours: 60, actualHours: 55, tags: ['development', 'frontend'] },
    { id: 'task_003', title: 'Implement authentication module', description: 'Build user auth with JWT and OAuth', projectId: 'proj_001', projectName: 'Website Redesign - TechVista', assignedTo: 'usr_003', assignedName: 'Rahul Verma', status: 'in_progress', priority: 'high', dueDate: '2025-07-10', createdAt: '2025-05-01', estimatedHours: 80, actualHours: 40, tags: ['development', 'backend'] },
    { id: 'task_004', title: 'API integration for dashboard', description: 'Connect frontend dashboard to backend APIs', projectId: 'proj_001', projectName: 'Website Redesign - TechVista', assignedTo: 'usr_003', assignedName: 'Rahul Verma', status: 'in_progress', priority: 'medium', dueDate: '2025-07-15', createdAt: '2025-05-10', estimatedHours: 50, actualHours: 20, tags: ['development', 'api'] },
    { id: 'task_005', title: 'Create CRM data models', description: 'Design database schema for CRM', projectId: 'proj_003', projectName: 'CRM Implementation - MediCare', assignedTo: 'emp_006', assignedName: 'Vikram Singh', status: 'completed', priority: 'high', dueDate: '2025-06-01', createdAt: '2025-05-10', completedAt: '2025-05-30', estimatedHours: 30, actualHours: 28, tags: ['backend', 'database'] },
    { id: 'task_006', title: 'Build patient registration module', description: 'Patient intake and registration system', projectId: 'proj_003', projectName: 'CRM Implementation - MediCare', assignedTo: 'emp_007', assignedName: 'Ananya Reddy', status: 'in_progress', priority: 'high', dueDate: '2025-07-20', createdAt: '2025-06-01', estimatedHours: 60, actualHours: 25, tags: ['development', 'crm'] },
    { id: 'task_007', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment', projectId: 'proj_004', projectName: 'Cloud Migration - GreenEarth', assignedTo: 'emp_006', assignedName: 'Vikram Singh', status: 'todo', priority: 'medium', dueDate: '2025-08-01', createdAt: '2025-06-10', estimatedHours: 20, actualHours: 0, tags: ['devops', 'infrastructure'] },
    { id: 'task_008', title: 'Design app mockups', description: 'Mobile app UI/UX mockups', projectId: 'proj_002', projectName: 'Mobile App Development', assignedTo: 'usr_005', assignedName: 'Sneha Gupta', status: 'in_progress', priority: 'high', dueDate: '2025-07-10', createdAt: '2025-06-05', estimatedHours: 45, actualHours: 20, tags: ['design', 'mobile'] },
    { id: 'task_009', title: 'User research and analysis', description: 'Conduct user interviews and competitive analysis', projectId: 'proj_002', projectName: 'Mobile App Development', assignedTo: 'usr_004', assignedName: 'Amit Patel', status: 'completed', priority: 'medium', dueDate: '2025-06-20', createdAt: '2025-06-01', completedAt: '2025-06-18', estimatedHours: 25, actualHours: 22, tags: ['research'] },
    { id: 'task_010', title: 'Set up cloud infrastructure', description: 'AWS infrastructure setup and configuration', projectId: 'proj_004', projectName: 'Cloud Migration - GreenEarth', assignedTo: 'usr_003', assignedName: 'Rahul Verma', status: 'completed', priority: 'high', dueDate: '2025-07-01', createdAt: '2025-06-05', completedAt: '2025-06-28', estimatedHours: 40, actualHours: 38, tags: ['devops', 'cloud'] },
    { id: 'task_011', title: 'Test and QA - Phase 1', description: 'Comprehensive testing of completed modules', projectId: 'proj_001', projectName: 'Website Redesign - TechVista', assignedTo: 'emp_013', assignedName: 'Kavita Desai', status: 'todo', priority: 'high', dueDate: '2025-07-25', createdAt: '2025-06-15', estimatedHours: 35, actualHours: 0, tags: ['qa', 'testing'] },
    { id: 'task_012', title: 'Write API documentation', description: 'Document all REST API endpoints', projectId: 'proj_001', projectName: 'Website Redesign - TechVista', assignedTo: 'usr_003', assignedName: 'Rahul Verma', status: 'todo', priority: 'low', dueDate: '2025-07-30', createdAt: '2025-06-20', estimatedHours: 15, actualHours: 0, tags: ['documentation'] },
    { id: 'task_013', title: 'Database optimization', description: 'Optimize queries and add indexes', projectId: 'proj_003', projectName: 'CRM Implementation - MediCare', assignedTo: 'emp_006', assignedName: 'Vikram Singh', status: 'todo', priority: 'medium', dueDate: '2025-08-10', createdAt: '2025-06-20', estimatedHours: 25, actualHours: 0, tags: ['backend', 'database'] },
    { id: 'task_014', title: 'Push notification integration', description: 'Implement push notifications for mobile app', projectId: 'proj_002', projectName: 'Mobile App Development', assignedTo: 'emp_007', assignedName: 'Ananya Reddy', status: 'todo', priority: 'medium', dueDate: '2025-08-15', createdAt: '2025-06-25', estimatedHours: 30, actualHours: 0, tags: ['mobile', 'development'] },
    { id: 'task_015', title: 'Security audit', description: 'Conduct security audit and penetration testing', projectId: 'proj_004', projectName: 'Cloud Migration - GreenEarth', assignedTo: 'usr_003', assignedName: 'Rahul Verma', status: 'todo', priority: 'high', dueDate: '2025-09-01', createdAt: '2025-06-25', estimatedHours: 20, actualHours: 0, tags: ['security'] },
  ]

  const attendance: Record<string, unknown>[] = []
  const empIds = employees.map(e => e.id)
  const statuses = ['present', 'present', 'present', 'present', 'present', 'late', 'absent', 'half_day', 'present', 'present']

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = new Date(now)
    date.setDate(date.getDate() - dayOffset)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    const dateStr = date.toISOString().split('T')[0]
    for (const empId of empIds) {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const checkIn = new Date(date)
      checkIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
      const checkOut = new Date(date)
      checkOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
      attendance.push({
        id: `att_${dateStr}_${empId}`,
        employeeId: empId,
        date: dateStr,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        status,
        hoursWorked: status === 'present' ? 8 + Math.random() * 2 : status === 'half_day' ? 4 : status === 'late' ? 7 : 0,
        notes: status === 'absent' ? 'Sick leave' : status === 'late' ? 'Traffic delay' : '',
      })
    }
  }

  const holidays2025 = [
    { id: 'hol_001', name: 'Republic Day', date: '2025-01-26', type: 'national', description: 'Republic Day of India' },
    { id: 'hol_002', name: 'Holi', date: '2025-03-14', type: 'festival', description: 'Festival of Colors' },
    { id: 'hol_003', name: 'Good Friday', date: '2025-04-18', type: 'religious', description: 'Good Friday' },
    { id: 'hol_004', name: 'Eid-ul-Fitr', date: '2025-03-31', type: 'religious', description: 'Eid Celebration' },
    { id: 'hol_005', name: 'Independence Day', date: '2025-08-15', type: 'national', description: 'Independence Day of India' },
    { id: 'hol_006', name: 'Raksha Bandhan', date: '2025-08-09', type: 'festival', description: 'Rakhi Celebration' },
    { id: 'hol_007', name: 'Janmashtami', date: '2025-08-16', type: 'religious', description: 'Lord Krishna Birthday' },
    { id: 'hol_008', name: 'Mahatma Gandhi Jayanti', date: '2025-10-02', type: 'national', description: 'Gandhi Jayanti' },
    { id: 'hol_009', name: 'Dussehra', date: '2025-10-02', type: 'festival', description: 'Vijayadashami' },
    { id: 'hol_010', name: 'Diwali', date: '2025-10-20', type: 'festival', description: 'Festival of Lights' },
    { id: 'hol_011', name: 'Guru Nanak Jayanti', date: '2025-11-05', type: 'religious', description: 'Gurpurab' },
    { id: 'hol_012', name: 'Christmas', date: '2025-12-25', type: 'religious', description: 'Christmas Day' },
  ]

  const leaveRequests = [
    { id: 'leave_001', employeeId: 'emp_005', employeeName: 'Sneha Gupta', type: 'sick', startDate: '2025-07-01', endDate: '2025-07-03', days: 3, reason: 'Not feeling well', status: 'approved', appliedOn: '2025-06-28', approvedBy: 'usr_002', comment: 'Get well soon' },
    { id: 'leave_002', employeeId: 'emp_007', employeeName: 'Ananya Reddy', type: 'vacation', startDate: '2025-07-20', endDate: '2025-07-25', days: 6, reason: 'Family trip to Goa', status: 'pending', appliedOn: '2025-06-25', approvedBy: '', comment: '' },
    { id: 'leave_003', employeeId: 'emp_011', employeeName: 'Deepa Iyer', type: 'personal', startDate: '2025-07-15', endDate: '2025-07-15', days: 1, reason: 'Personal errand', status: 'approved', appliedOn: '2025-06-20', approvedBy: 'usr_002', comment: 'Okay' },
    { id: 'leave_004', employeeId: 'emp_009', employeeName: 'Neha Kapoor', type: 'vacation', startDate: '2025-08-05', endDate: '2025-08-10', days: 6, reason: 'Going to Kerala', status: 'pending', appliedOn: '2025-06-30', approvedBy: '', comment: '' },
    { id: 'leave_005', employeeId: 'emp_014', employeeName: 'Manoj Tiwari', type: 'sick', startDate: '2025-06-15', endDate: '2025-06-16', days: 2, reason: 'Medical checkup', status: 'rejected', appliedOn: '2025-06-10', approvedBy: 'usr_002', comment: 'Insufficient notice period' },
  ]

  const policies = [
    { id: 'pol_001', title: 'Code of Conduct', description: 'Company code of conduct and ethical guidelines', category: 'HR', content: 'All employees must adhere to the highest standards of professional conduct...', version: '2.1', effectiveDate: '2025-01-01', status: 'active', createdBy: 'usr_002' },
    { id: 'pol_002', title: 'Remote Work Policy', description: 'Guidelines for remote and hybrid work arrangements', category: 'HR', content: 'Employees may work remotely up to 3 days per week with manager approval...', version: '1.5', effectiveDate: '2025-03-01', status: 'active', createdBy: 'usr_002' },
    { id: 'pol_003', title: 'Leave Policy', description: 'Annual leave, sick leave, and other time-off policies', category: 'HR', content: 'Employees are entitled to 18 annual leave days, 12 sick days, and 3 personal days...', version: '3.0', effectiveDate: '2025-01-15', status: 'active', createdBy: 'usr_002' },
  ]

  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const payroll = employees.map((emp, i) => ({
    id: `pay_${currentMonth}_${emp.id}`,
    employeeId: emp.id,
    employeeName: emp.name,
    month: currentMonth,
    basicSalary: Math.round(emp.salary * 0.5),
    hra: Math.round(emp.salary * 0.2),
    allowances: Math.round(emp.salary * 0.15),
    bonus: i % 3 === 0 ? Math.round(emp.salary * 0.1) : 0,
    deductions: {
      pf: Math.round(emp.salary * 0.12),
      tax: Math.round(emp.salary * 0.05),
      insurance: i % 4 === 0 ? 5000 : 0,
    },
    netSalary: Math.round(emp.salary - emp.salary * 0.17 - (i % 4 === 0 ? 5000 : 0) + (i % 3 === 0 ? emp.salary * 0.1 : 0)),
    status: i < 12 ? 'paid' : 'pending',
    paidOn: i < 12 ? now.toISOString() : '',
    paymentMethod: 'bank_transfer',
  }))

  const performanceReviews = [
    { id: 'perf_001', employeeId: 'emp_006', employeeName: 'Vikram Singh', reviewerId: 'usr_003', reviewerName: 'Rahul Verma', period: 'Q1 2025', ratings: { technicalSkills: 4.5, communication: 4, teamwork: 4.5, leadership: 3.5, productivity: 5 }, overallRating: 4.3, strengths: 'Excellent problem solver, great code quality', improvements: 'Could mentor juniors more', status: 'completed', completedDate: '2025-04-15' },
    { id: 'perf_002', employeeId: 'emp_005', employeeName: 'Sneha Gupta', reviewerId: 'usr_003', reviewerName: 'Rahul Verma', period: 'Q1 2025', ratings: { technicalSkills: 4, communication: 4.5, teamwork: 4, creativity: 5, productivity: 4 }, overallRating: 4.3, strengths: 'Exceptional design skills, creative thinking', improvements: 'Time management could improve', status: 'completed', completedDate: '2025-04-14' },
    { id: 'perf_003', employeeId: 'emp_007', employeeName: 'Ananya Reddy', reviewerId: 'usr_003', reviewerName: 'Rahul Verma', period: 'Q1 2025', ratings: { technicalSkills: 3.5, communication: 4, teamwork: 4.5, learningAgility: 4.5, productivity: 3.5 }, overallRating: 3.9, strengths: 'Fast learner, good team player', improvements: 'Needs to work on coding efficiency', status: 'pending', completedDate: '' },
  ]

  const invoices = [
    { id: 'inv_001', number: 'INV-2025-001', client: 'TechVista Solutions', clientId: 'comp_001', amount: 1500000, tax: 270000, total: 1770000, status: 'paid', issueDate: '2025-04-15', dueDate: '2025-05-15', paidDate: '2025-05-10', description: 'Website Redesign - Phase 1', dealId: 'deal_001' },
    { id: 'inv_002', number: 'INV-2025-002', client: 'MediCare Health Systems', clientId: 'comp_003', amount: 600000, tax: 108000, total: 708000, status: 'sent', issueDate: '2025-06-01', dueDate: '2025-07-01', paidDate: '', description: 'CRM Implementation - Initial Payment', dealId: 'deal_003' },
    { id: 'inv_003', number: 'INV-2025-003', client: 'United Corporation', clientId: '', amount: 2500000, tax: 450000, total: 2950000, status: 'overdue', issueDate: '2025-06-01', dueDate: '2025-06-30', paidDate: '', description: 'CRM + HRMS Package', dealId: 'deal_009' },
  ]

  const payments = [
    { id: 'payt_001', invoiceId: 'inv_001', amount: 1770000, method: 'bank_transfer', reference: 'RTGS-2025-45871', date: '2025-05-10', notes: 'Full payment received' },
    { id: 'payt_002', invoiceId: 'inv_001', amount: 500000, method: 'cheque', reference: 'CHQ-45872', date: '2025-04-20', notes: 'Advance payment' },
  ]

  const notifications = [
    { id: 'notif_001', title: 'New Lead Assigned', message: 'Lead Anil Gupta from RetailMart India has been assigned to you.', type: 'lead', userId: 'usr_003', read: false, createdAt: now.toISOString(), link: '/admin/crm/leads/lead_006' },
    { id: 'notif_002', title: 'Task Completed', message: 'Design homepage wireframes task has been marked complete.', type: 'task', userId: 'usr_005', read: false, createdAt: new Date(now.getTime() - 3600000).toISOString(), link: '/admin/tasks' },
    { id: 'notif_003', title: 'Leave Request Pending', message: 'Ananya Reddy has applied for vacation leave (6 days).', type: 'hr', userId: 'usr_002', read: false, createdAt: new Date(now.getTime() - 7200000).toISOString(), link: '/admin/hrms/leave' },
    { id: 'notif_004', title: 'Invoice Overdue', message: 'Invoice INV-2025-003 for United Corporation is overdue.', type: 'finance', userId: 'usr_001', read: false, createdAt: now.toISOString(), link: '/admin/invoices' },
    { id: 'notif_005', title: 'Deal Won!', message: 'CRM + HRMS deal with United Corporation has been closed!', type: 'success', userId: 'usr_004', read: true, createdAt: new Date(now.getTime() - 86400000).toISOString(), link: '/admin/crm/deals' },
    { id: 'notif_006', title: 'New Team Member', message: 'Kavita Desai has joined the Engineering team.', type: 'hr', userId: 'usr_001', read: false, createdAt: new Date(now.getTime() - 172800000).toISOString(), link: '/admin/employees' },
    { id: 'notif_007', title: 'Performance Review Due', message: 'Q2 Performance reviews are due in 2 weeks.', type: 'hr', userId: 'usr_002', read: false, createdAt: new Date(now.getTime() - 259200000).toISOString(), link: '/admin/hrms/performance' },
    { id: 'notif_008', title: 'Project Milestone', message: 'Website Redesign project is 65% complete!', type: 'project', userId: 'usr_003', read: true, createdAt: new Date(now.getTime() - 345600000).toISOString(), link: '/admin/projects/proj_001' },
    { id: 'notif_009', title: 'New Support Ticket', message: 'TechVista Solutions has raised a support ticket.', type: 'support', userId: 'usr_001', read: false, createdAt: new Date(now.getTime() - 43200000).toISOString(), link: '/admin/tickets' },
    { id: 'notif_010', title: 'System Update', message: 'System maintenance scheduled for Sunday 2 AM - 4 AM.', type: 'system', userId: 'usr_001', read: true, createdAt: new Date(now.getTime() - 604800000).toISOString(), link: '' },
  ]

  const announcements = [
    { id: 'ann_001', title: 'Company Offsite 2025', content: 'We are excited to announce our annual company offsite will be held in Goa from December 15-18. Please block your calendars!', category: 'events', priority: 'high', postedBy: 'usr_002', postedByName: 'Priya Sharma', createdAt: '2025-06-15', expiresAt: '2025-12-20', pinned: true },
    { id: 'ann_002', title: 'New Health Insurance Policy', content: 'We have upgraded our health insurance coverage. New policies effective from July 1st. Please check the HR portal for details.', category: 'hr', priority: 'medium', postedBy: 'usr_002', postedByName: 'Priya Sharma', createdAt: '2025-06-20', expiresAt: '2025-07-31', pinned: false },
  ]

  const documents = [
    { id: 'doc_001', name: 'Employee Handbook 2025.pdf', type: 'pdf', size: 2500000, category: 'hr', uploadedBy: 'usr_002', uploadedByName: 'Priya Sharma', createdAt: '2025-01-15', url: '#', description: 'Complete employee handbook' },
    { id: 'doc_002', name: 'Project Proposal - TechVista.docx', type: 'docx', size: 1800000, category: 'sales', uploadedBy: 'usr_004', uploadedByName: 'Amit Patel', createdAt: '2025-03-20', url: '#', description: 'Detailed project proposal' },
    { id: 'doc_003', name: 'Q1 Financial Report.xlsx', type: 'xlsx', size: 3200000, category: 'finance', uploadedBy: 'usr_010', uploadedByName: 'Arun Nair', createdAt: '2025-04-10', url: '#', description: 'Quarterly financial report' },
  ]

  const supportTickets = [
    { id: 'tkt_001', subject: 'Login issue with dashboard', description: 'Unable to login to the admin dashboard since yesterday', status: 'open', priority: 'high', customer: 'TechVista Solutions', customerId: 'comp_001', assignedTo: 'usr_003', createdBy: 'Rajesh Khanna', createdAt: now.toISOString(), updatedAt: now.toISOString(), messages: [{ from: 'Rajesh Khanna', content: 'I am unable to login since yesterday.', timestamp: now.toISOString() }] },
    { id: 'tkt_002', subject: 'Feature request: Export to PDF', description: 'Need ability to export reports as PDF', status: 'in_progress', priority: 'medium', customer: 'MediCare Health Systems', customerId: 'comp_003', assignedTo: 'usr_003', createdBy: 'Dr. Arvind Nair', createdAt: new Date(now.getTime() - 604800000).toISOString(), updatedAt: now.toISOString(), messages: [{ from: 'Dr. Arvind Nair', content: 'We need PDF export for patient reports.', timestamp: new Date(now.getTime() - 604800000).toISOString() }, { from: 'Rahul Verma', content: 'We are working on this feature. Will update soon.', timestamp: new Date(now.getTime() - 345600000).toISOString() }] },
  ]

  const knowledgeArticles = [
    { id: 'kb_001', title: 'How to Create a New Lead', content: 'To create a new lead, navigate to CRM > Leads and click the "Add Lead" button...', category: 'crm', tags: ['leads', 'crm', 'guide'], views: 45, helpful: 38, createdBy: 'usr_004', createdAt: '2025-01-10', updatedAt: '2025-03-15', status: 'published' },
    { id: 'kb_002', title: 'Processing Payroll', content: 'Monthly payroll processing steps and guidelines...', category: 'hrms', tags: ['payroll', 'hr', 'salary'], views: 32, helpful: 28, createdBy: 'usr_002', createdAt: '2025-02-01', updatedAt: '2025-04-10', status: 'published' },
    { id: 'kb_003', title: 'Setting Up Email Notifications', content: 'Configure email notification templates and triggers...', category: 'settings', tags: ['email', 'notifications', 'configuration'], views: 28, helpful: 25, createdBy: 'usr_003', createdAt: '2025-03-05', updatedAt: '2025-05-20', status: 'published' },
  ]

  const chatConversations = [
    { id: 'chat_001', participants: ['usr_001', 'usr_002'], participantNames: ['Super Admin', 'Priya Sharma'], lastMessage: 'Sure, I will review the leaves today', lastMessageAt: now.toISOString(), unreadCount: 0 },
    { id: 'chat_002', participants: ['usr_003', 'usr_004'], participantNames: ['Rahul Verma', 'Amit Patel'], lastMessage: 'The proposal is ready for review', lastMessageAt: new Date(now.getTime() - 3600000).toISOString(), unreadCount: 1 },
  ]

  const settings = {
    id: 'settings_main',
    companyName: 'AB Digital Solution',
    companyEmail: 'info@abdigital.com',
    companyPhone: '+91 22 4123 4567',
    companyAddress: '42, Business Tower, Andheri East, Mumbai - 400093, India',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    fiscalYearStart: 'April',
    logo: '',
    emailSettings: {
      smtpHost: 'smtp.abdigital.com',
      smtpPort: 587,
      fromEmail: 'noreply@abdigital.com',
      fromName: 'AB Digital Solution',
    },
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      slackIntegration: false,
      dailyDigest: true,
    },
    securitySettings: {
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      twoFactorRequired: false,
      sessionTimeout: 60,
    },
  }

  const dataMap: Record<string, unknown[]> = {
    departments,
    designations,
    employees,
    companies,
    leads,
    contacts,
    deals,
    projects,
    tasks,
    attendance,
    holidays: holidays2025,
    leaveRequests,
    policies,
    payroll,
    performanceReviews,
    invoices,
    payments,
    notifications,
    announcements,
    documents,
    supportTickets,
    knowledgeArticles,
    chatConversations,
  }

  for (const [key, data] of Object.entries(dataMap)) {
    if (!store.hasCollection(key)) {
      localStorage.setItem(`ab_${key}`, JSON.stringify(data))
    }
  }

  if (!store.hasCollection('settings')) {
    localStorage.setItem('ab_settings', JSON.stringify(settings))
  }
}
