import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Portfolio from './pages/Portfolio'
import CaseStudies from './pages/CaseStudies'
import Clients from './pages/Clients'
import Awards from './pages/Awards'
import Testimonials from './pages/TestimonialsPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Careers from './pages/Careers'
import Team from './pages/Team'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminSEO from './pages/admin/SEO'
import AdminServices from './pages/admin/Services'
import AdminBlog from './pages/admin/Blog'
import AdminPortfolio from './pages/admin/Portfolio'
import AdminTestimonials from './pages/admin/Testimonials'
import AdminFAQs from './pages/admin/FAQs'
import AdminPages from './pages/admin/Pages'
import AdminLeads from './pages/admin/Leads'
import AdminLeadDiscovery from './pages/admin/LeadDiscovery'
import AdminSubscribers from './pages/admin/Subscribers'
import AdminMedia from './pages/admin/Media'
import AdminNavigation from './pages/admin/Navigation'
import AdminSettings from './pages/admin/Settings'
import AdminAudit from './pages/admin/Audit'
import AdminUsers from './pages/admin/Users'
import AdminSecurity from './pages/admin/Security'
import AdminChangePassword from './pages/admin/ChangePassword'
import AdminForgotPassword from './pages/admin/ForgotPassword'
import AdminSiteContent from './pages/admin/SiteContent'
import PageTransition from './components/PageTransition'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/change-password" element={<AdminChangePassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="seo" element={<AdminSEO />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="lead-discovery" element={<AdminLeadDiscovery />} />
          <Route path="site-content" element={<AdminSiteContent />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="navigation" element={<AdminNavigation />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="audit" element={<AdminAudit />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="security" element={<AdminSecurity />} />
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
          <Route path="testimonials" element={<PageTransition><Testimonials /></PageTransition>} />
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
