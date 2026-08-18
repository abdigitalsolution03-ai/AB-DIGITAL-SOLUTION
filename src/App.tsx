import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import PageTransition from './components/PageTransition'
import { isAuthenticated, refreshSession } from './services/auth'

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
import Gallery from './pages/Gallery'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAnalytics from './pages/admin/Analytics'
import AdminPages from './pages/admin/Pages'
import AdminManager from './pages/admin/AdminManager'
import AdminSecurity from './pages/admin/Security'
import AdminProfile from './pages/admin/Profile'
import AdminMedia from './pages/admin/Media'
import AdminBlog from './pages/admin/Blog'
import AdminEnquiries from './pages/admin/Enquiries'
import AdminTheme from './pages/admin/Theme'
import AdminHeader from './pages/admin/Header'
import AdminHero from './pages/admin/Hero'
import AdminFooter from './pages/admin/Footer'
import AdminBranding from './pages/admin/Branding'
import AdminServices from './pages/admin/Services'
import AdminTeam from './pages/admin/Team'
import AdminTestimonials from './pages/admin/Testimonials'
import AdminFAQ from './pages/admin/FAQ'
import AdminSubscribers from './pages/admin/Subscribers'
import AdminSEO from './pages/admin/SEO'
import AdminSettings from './pages/admin/Settings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    refreshSession().finally(() => {
      if (!cancelled) setChecking(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (checking) return null
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
        <Route path="/admin/code03" element={<PageTransition><AdminLogin codeMode /></PageTransition>} />
        <Route path="/code03" element={<PageTransition><AdminLogin codeMode /></PageTransition>} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><AdminAnalytics /></PageTransition>} />
          <Route path="pages" element={<PageTransition><AdminPages /></PageTransition>} />
          <Route path="content" element={<PageTransition><AdminManager /></PageTransition>} />
          <Route path="media" element={<PageTransition><AdminMedia /></PageTransition>} />
          <Route path="profile" element={<PageTransition><AdminProfile /></PageTransition>} />
          <Route path="security" element={<PageTransition><AdminSecurity /></PageTransition>} />
          <Route path="blog" element={<PageTransition><AdminBlog /></PageTransition>} />
          <Route path="enquiries" element={<PageTransition><AdminEnquiries /></PageTransition>} />
          <Route path="theme" element={<PageTransition><AdminTheme /></PageTransition>} />
          <Route path="header" element={<PageTransition><AdminHeader /></PageTransition>} />
          <Route path="hero" element={<PageTransition><AdminHero /></PageTransition>} />
          <Route path="footer" element={<PageTransition><AdminFooter /></PageTransition>} />
          <Route path="branding" element={<PageTransition><AdminBranding /></PageTransition>} />
          <Route path="services" element={<PageTransition><AdminServices /></PageTransition>} />
          <Route path="team" element={<PageTransition><AdminTeam /></PageTransition>} />
          <Route path="testimonials" element={<PageTransition><AdminTestimonials /></PageTransition>} />
          <Route path="faq" element={<PageTransition><AdminFAQ /></PageTransition>} />
          <Route path="subscribers" element={<PageTransition><AdminSubscribers /></PageTransition>} />
          <Route path="seo" element={<PageTransition><AdminSEO /></PageTransition>} />
          <Route path="settings" element={<PageTransition><AdminSettings /></PageTransition>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
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
          <Route path="gallery" element={<PageTransition><Gallery /></PageTransition>} />
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
