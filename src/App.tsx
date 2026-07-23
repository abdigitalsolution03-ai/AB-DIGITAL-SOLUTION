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
import AdminSiteContent from './pages/admin/SiteContent'
import AdminPages from './pages/admin/Pages'
import AdminServices from './pages/admin/Services'
import AdminBlog from './pages/admin/Blog'
import AdminPortfolio from './pages/admin/Portfolio'
import AdminTestimonials from './pages/admin/Testimonials'
import AdminFAQs from './pages/admin/FAQs'
import AdminLeads from './pages/admin/crm/Leads'
import AdminContacts from './pages/admin/crm/Contacts'
import AdminCompanies from './pages/admin/crm/Companies'
import AdminDeals from './pages/admin/crm/Deals'
import AdminPipeline from './pages/admin/crm/Pipeline'
import AdminMedia from './pages/admin/Media'
import AdminNavigation from './pages/admin/Navigation'
import AdminSEO from './pages/admin/SEO'
import AdminSubscribers from './pages/admin/Subscribers'
import AdminAnnouncements from './pages/admin/announcements/index'
import AdminAnalytics from './pages/admin/analytics/index'
import AdminSettings from './pages/admin/settings/index'
import AdminSecurity from './pages/admin/security/index'
import AdminAuditLogs from './pages/admin/audit/index'
import AdminUsers from './pages/admin/Users'
import AdminChangePassword from './pages/admin/ChangePassword'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/forgot-password" element={<PageTransition><AdminForgotPassword /></PageTransition>} />
        <Route path="/admin/change-password" element={<PageTransition><AdminChangePassword /></PageTransition>} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="site-content" element={<PageTransition><AdminSiteContent /></PageTransition>} />
          <Route path="pages" element={<PageTransition><AdminPages /></PageTransition>} />
          <Route path="services" element={<PageTransition><AdminServices /></PageTransition>} />
          <Route path="blog" element={<PageTransition><AdminBlog /></PageTransition>} />
          <Route path="portfolio" element={<PageTransition><AdminPortfolio /></PageTransition>} />
          <Route path="testimonials" element={<PageTransition><AdminTestimonials /></PageTransition>} />
          <Route path="faqs" element={<PageTransition><AdminFAQs /></PageTransition>} />
          <Route path="crm/leads" element={<PageTransition><AdminLeads /></PageTransition>} />
          <Route path="crm/contacts" element={<PageTransition><AdminContacts /></PageTransition>} />
          <Route path="crm/companies" element={<PageTransition><AdminCompanies /></PageTransition>} />
          <Route path="crm/deals" element={<PageTransition><AdminDeals /></PageTransition>} />
          <Route path="crm/pipeline" element={<PageTransition><AdminPipeline /></PageTransition>} />
          <Route path="media" element={<PageTransition><AdminMedia /></PageTransition>} />
          <Route path="navigation" element={<PageTransition><AdminNavigation /></PageTransition>} />
          <Route path="seo" element={<PageTransition><AdminSEO /></PageTransition>} />
          <Route path="subscribers" element={<PageTransition><AdminSubscribers /></PageTransition>} />
          <Route path="announcements" element={<PageTransition><AdminAnnouncements /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><AdminAnalytics /></PageTransition>} />
          <Route path="settings" element={<PageTransition><AdminSettings /></PageTransition>} />
          <Route path="security" element={<PageTransition><AdminSecurity /></PageTransition>} />
          <Route path="audit" element={<PageTransition><AdminAuditLogs /></PageTransition>} />
          <Route path="users" element={<PageTransition><AdminUsers /></PageTransition>} />
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
