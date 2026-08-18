import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import BackToTop from '@/components/BackToTop'
import Loader from '@/components/Loader'
import ThemeApplier from '@/components/ThemeApplier'

export default function MainLayout() {
  return (
    <>
      <ThemeApplier />
      <Loader />
      <ScrollProgressBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
