import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import BackToTop from '@/components/BackToTop'
import AutoInternalLinks from '@/components/AutoInternalLinks'
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
        <div className="max-w-[1280px] mx-auto px-6">
          <AutoInternalLinks />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
