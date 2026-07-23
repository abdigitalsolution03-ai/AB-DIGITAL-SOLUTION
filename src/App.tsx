import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import PageTransition from './components/PageTransition'
import { isAuthenticated } from './services/auth'

import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Portfolio from './pages/Portfolio'
import CaseStudies from './pages/CaseStudies'
import Clients from './pages/Clients'
import Awards from './pages/Awards'
import TestimonialsPage from './pages/TestimonialsPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Careers from './pages/Careers'
import Team from './pages/Team'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

import AdminLogin from './pages/admin/Login'
import AdminForgotPassword from './pages/admin/ForgotPassword'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLeads from './pages/admin/crm/Leads'
import AdminContacts from './pages/admin/crm/Contacts'
import AdminCompanies from './pages/admin/crm/Companies'
import AdminDeals from './pages/admin/crm/Deals'
import AdminPipeline from './pages/admin/crm/Pipeline'
import EmployeeDirectory from './pages/admin/employees/index'
import Departments from './pages/admin/employees/Departments'
import Designations from './pages/admin/employees/Designations'
import AttendanceDashboard from './pages/admin/attendance/index'
import AttendanceCalendar from './pages/admin/attendance/Calendar'
import AttendanceReports from './pages/admin/attendance/Reports'
import LeaveManagement from './pages/admin/hrms/Leave'
import HolidayCalendar from './pages/admin/hrms/Holidays'
import CompanyPolicies from './pages/admin/hrms/Policies'
import PerformanceReviews from './pages/admin/hrms/PerformanceReviews'
import Payroll from './pages/admin/hrms/Payroll'
import ProjectsList from './pages/admin/projects/index'
import KanbanBoard from './pages/admin/projects/Kanban'
import TasksPage from './pages/admin/tasks/index'
import MyTasks from './pages/admin/tasks/my'
import ClientsPage from './pages/admin/clients/index'
import InvoicesPage from './pages/admin/invoices/index'
import PaymentsPage from './pages/admin/payments/index'
import ReportsPage from './pages/admin/reports/index'
import AnalyticsPage from './pages/admin/analytics/index'
import DocumentsPage from './pages/admin/documents/index'
import TicketsPage from './pages/admin/tickets/index'
import KnowledgePage from './pages/admin/knowledge/index'
import ChatPage from './pages/admin/chat/index'
import NotificationsPage from './pages/admin/notifications/index'
import AnnouncementsPage from './pages/admin/announcements/index'
import CalendarPage from './pages/admin/calendar/index'
import SettingsPage from './pages/admin/settings/index'
import SecurityPage from './pages/admin/security/index'
import AuditLogs from './pages/admin/audit/index'

import PortalLogin from './pages/client/PortalLogin'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isPortal = location.pathname.startsWith('/portal')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/forgot-password" element={<PageTransition><AdminForgotPassword /></PageTransition>} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="crm/leads" element={<PageTransition><AdminLeads /></PageTransition>} />
          <Route path="crm/contacts" element={<PageTransition><AdminContacts /></PageTransition>} />
          <Route path="crm/companies" element={<PageTransition><AdminCompanies /></PageTransition>} />
          <Route path="crm/deals" element={<PageTransition><AdminDeals /></PageTransition>} />
          <Route path="crm/pipeline" element={<PageTransition><AdminPipeline /></PageTransition>} />
          <Route path="employees" element={<PageTransition><EmployeeDirectory /></PageTransition>} />
          <Route path="employees/departments" element={<PageTransition><Departments /></PageTransition>} />
          <Route path="employees/designations" element={<PageTransition><Designations /></PageTransition>} />
          <Route path="employees/:id" element={<PageTransition><EmployeeDirectory /></PageTransition>} />
          <Route path="attendance" element={<PageTransition><AttendanceDashboard /></PageTransition>} />
          <Route path="attendance/calendar" element={<PageTransition><AttendanceCalendar /></PageTransition>} />
          <Route path="attendance/reports" element={<PageTransition><AttendanceReports /></PageTransition>} />
          <Route path="hrms/leave" element={<PageTransition><LeaveManagement /></PageTransition>} />
          <Route path="hrms/holidays" element={<PageTransition><HolidayCalendar /></PageTransition>} />
          <Route path="hrms/policies" element={<PageTransition><CompanyPolicies /></PageTransition>} />
          <Route path="hrms/performance" element={<PageTransition><PerformanceReviews /></PageTransition>} />
          <Route path="hrms/payroll" element={<PageTransition><Payroll /></PageTransition>} />
          <Route path="projects" element={<PageTransition><ProjectsList /></PageTransition>} />
          <Route path="projects/kanban" element={<PageTransition><KanbanBoard /></PageTransition>} />
          <Route path="projects/:id" element={<PageTransition><ProjectsList /></PageTransition>} />
          <Route path="tasks" element={<PageTransition><TasksPage /></PageTransition>} />
          <Route path="tasks/my" element={<PageTransition><MyTasks /></PageTransition>} />
          <Route path="clients" element={<PageTransition><ClientsPage /></PageTransition>} />
          <Route path="invoices" element={<PageTransition><InvoicesPage /></PageTransition>} />
          <Route path="payments" element={<PageTransition><PaymentsPage /></PageTransition>} />
          <Route path="reports" element={<PageTransition><ReportsPage /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><AnalyticsPage /></PageTransition>} />
          <Route path="documents" element={<PageTransition><DocumentsPage /></PageTransition>} />
          <Route path="tickets" element={<PageTransition><TicketsPage /></PageTransition>} />
          <Route path="knowledge" element={<PageTransition><KnowledgePage /></PageTransition>} />
          <Route path="chat" element={<PageTransition><ChatPage /></PageTransition>} />
          <Route path="announcements" element={<PageTransition><AnnouncementsPage /></PageTransition>} />
          <Route path="notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
          <Route path="calendar" element={<PageTransition><CalendarPage /></PageTransition>} />
          <Route path="settings" element={<PageTransition><SettingsPage /></PageTransition>} />
          <Route path="security" element={<PageTransition><SecurityPage /></PageTransition>} />
          <Route path="audit" element={<PageTransition><AuditLogs /></PageTransition>} />
        </Route>
      </Routes>
    )
  }

  if (isPortal) {
    return (
      <Routes>
        <Route path="/portal/login" element={<PageTransition><PortalLogin /></PageTransition>} />
        <Route path="/portal" element={<PageTransition><div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-primary)]">Client Portal Dashboard Coming Soon</div></PageTransition>}>
          <Route index element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PageTransition><Home /></PageTransition>} />
          <Route path="about" element={<PageTransition><About /></PageTransition>} />
          <Route path="services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="services/:service" element={<PageTransition><ServiceDetail /></PageTransition>} />
          <Route path="portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
          <Route path="case-studies" element={<PageTransition><CaseStudies /></PageTransition>} />
          <Route path="clients" element={<PageTransition><Clients /></PageTransition>} />
          <Route path="awards" element={<PageTransition><Awards /></PageTransition>} />
          <Route path="testimonials" element={<PageTransition><TestimonialsPage /></PageTransition>} />
          <Route path="blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="careers" element={<PageTransition><Careers /></PageTransition>} />
          <Route path="team" element={<PageTransition><Team /></PageTransition>} />
          <Route path="contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
