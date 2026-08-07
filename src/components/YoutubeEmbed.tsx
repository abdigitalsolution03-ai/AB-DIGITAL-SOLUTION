import { useState } from 'react'
import { FiPlay } from 'react-icons/fi'

export function youtubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

interface Props {
  url: string
  title?: string
  className?: string
  thumbnail?: string
}

export default function YoutubeEmbed({ url, title = 'Video', className = '', thumbnail }: Props) {
  const id = youtubeId(url)
  const [playing, setPlaying] = useState(false)
  if (!id) return null
  return (
    <div className={`aspect-video relative bg-black overflow-hidden rounded-xl group ${className}`}>
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full group"
          aria-label={`Play ${title}`}
        >
          <img
            src={thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
              <FiPlay size={22} className="ml-0.5" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

export function useYouTube(url: string): string | null {
  return youtubeId(url)
}