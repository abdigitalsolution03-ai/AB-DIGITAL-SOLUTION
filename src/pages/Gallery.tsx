import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'
import { getAll, pullCMS } from '@/services/cms'
import { FiYoutube, FiImage, FiFilm } from 'react-icons/fi'

interface GalleryItem {
  id: string
  title?: string
  description?: string
  image?: string
  link?: string
  displayOrder?: number
  status?: string
}

interface VideoItem {
  id: string
  title?: string
  description?: string
  videoUrl?: string
  image?: string
  displayOrder?: number
  status?: string
}

const published = (items: any[]) => items.filter((i) => i.status === 'published')

function VideoCard({ item }: { item: VideoItem }) {
  const match = item.videoUrl?.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/)
  const id = match ? match[1] : null
  if (!id) return null
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="doodle-card overflow-hidden group">
      <div className="aspect-video relative bg-black overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title || 'Video'} className="w-full h-full object-cover" />
        ) : (
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={item.title || 'Video'} className="w-full h-full object-cover" loading="lazy" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
            <FiYoutube size={20} />
          </span>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0"
          aria-label={`Watch ${item.title || 'video'}`}
        />
      </div>
      <div className="p-5">
        {item.title && <h3 className="font-bold text-[var(--text-primary)]">{item.title}</h3>}
        {item.description && <p className="text-sm text-[var(--text-tertiary)] mt-1">{item.description}</p>}
      </div>
    </motion.div>
  )
}

export default function GalleryPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    void pullCMS().then(() => {
      if (!active) return
      setVideos(published(getAll('videos')))
      setGallery(published(getAll('gallery')))
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  return (
    <>
      <Helmet>
        <title>Gallery & Videos | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Explore our photo gallery and YouTube videos showcasing our latest projects and digital solutions." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Media</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Gallery {'&'} <span className="text-[#60A5FA]">Videos</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Photos and videos from our work and behind the scenes.
            </p>
          </AnimatedSection>

          {loading && <p className="text-center text-[#111]/60">Loading…</p>}

          {!loading && videos.length > 0 && (
            <AnimatedSection className="mb-16">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-[#111] mb-6">
                <FiFilm className="text-[#FF4D4D]" /> <span>Videos</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)).map((v) => (
                  <VideoCard key={v.id} item={v} />
                ))}
              </div>
            </AnimatedSection>
          )}

          {!loading && gallery.length > 0 && (
            <AnimatedSection>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-[#111] mb-6">
                <FiImage className="text-[#60A5FA]" /> <span>Photos</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)).map((item) => (
                  <motion.figure
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="overflow-hidden border-3 border-[#111] shadow-[6px_6px_0_#111] group"
                  >
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        <img src={item.image} alt={item.title || 'Photo'} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </a>
                    ) : (
                      <img src={item.image} alt={item.title || 'Photo'} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    )}
                    {item.title && (
                      <figcaption className="p-3 bg-white">
                        <p className="font-semibold text-sm text-[#111]">{item.title}</p>
                        {item.description && <p className="text-xs text-[#111]/70 mt-0.5">{item.description}</p>}
                      </figcaption>
                    )}
                  </motion.figure>
                ))}
              </div>
            </AnimatedSection>
          )}

          {!loading && videos.length === 0 && gallery.length === 0 && (
            <p className="text-center text-[#111]/60 py-10">Nothing published yet — add photos and videos from the admin panel.</p>
          )}
        </div>
      </section>
    </>
  )
}