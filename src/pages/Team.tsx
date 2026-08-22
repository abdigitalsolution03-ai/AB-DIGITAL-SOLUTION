import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import PageTransition from '@/components/PageTransition'
import AnimatedSection from '@/components/AnimatedSection'
import { getAll } from '@/services/cms'
import YoutubeEmbed from '@/components/YoutubeEmbed'

const hardcodedTeam = [
  { name: 'Avnish Yadav', role: 'Founder', bio: 'Visionary leader who founded AB DIGITAL SOLUTION to help businesses grow through digital marketing. Guides strategy, client relationships, and long-term brand growth.', color: '#60A5FA', image: '/team/page_1.png' },
  { name: 'Bobby', role: 'Co-Founder', bio: 'Co-founder driving operations and business growth. Works alongside the founder to keep every project on track and every client happy.', color: '#FF4D4D', image: '/team/page_2.png' },
  { name: 'Rajneesh', role: 'Content Writer', bio: 'Crafts compelling copy that turns ideas into stories and products into must-haves. Writes captions, scripts, and long-form content that drives engagement and conversions.', color: '#F59E0B', image: '/team/page_3.png' },
  { name: 'Ansh', role: 'Video Shooting', bio: 'On-field video shooter capturing high-quality footage for reels, ads, and brand stories. Handles camera work, lighting, and on-location shoots to bring creative concepts to life.', color: '#EC4899', image: '/team/page_4.png' },
  { name: 'Ansh', role: 'Social Media Manager', bio: 'Plans content calendars and manages Instagram, Facebook, YouTube, and LinkedIn growth. Creates captions, hashtags, and campaigns that keep audiences engaged.', color: '#8B5CF6', image: '/team/ansh_smm.png' },
  { name: 'Abhay', role: 'Video Editor', bio: 'Professional reel and video editor crafting short-form content that captures attention. Handles YouTube long-form editing with a focus on retention and storytelling.', color: '#10B981', image: '/team/page_5.png' },
  { name: 'Subham', role: 'Performance Marketer', bio: 'Data-driven performance marketer running paid campaigns across Meta and Google Ads. Optimizes ad spend, audiences, and funnels to deliver measurable ROI for every brand.', color: '#EF4444', image: '/team/page_6.png' },
  { name: 'Deepanshu Singh Adhikari', role: 'Website Developer', bio: 'Builds clean, fast, and responsive websites using modern technologies. Turns designs into digital experiences that help businesses convert visitors into customers.', color: '#4D7AFF', image: '/team/page_7.png' },
  { name: 'Pooja', role: 'Graphic Designer', bio: 'Designs thumbnails, creatives, and brand visuals that stand out in the feed. Combines aesthetics with marketing insight to make brands look premium.', color: '#60A5FA', image: '/team/page_8.png' },
]

const colors = ['#60A5FA', '#FF4D4D', '#4D7AFF', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#EF4444']

function loadTeam() {
  const cms = getAll('team')
  if (cms.length > 0) {
    const cmsByNameRole: Record<string, any> = {}
    cms
      .filter((m: any) => !m.status || m.status === 'published')
      .forEach((m: any) => { cmsByNameRole[`${m.name}|${m.role}`] = m })

    return hardcodedTeam.map((member, i) => {
      const key = `${member.name}|${member.role}`
      const cmsEntry = cmsByNameRole[key]
      return {
        name: member.name,
        role: member.role,
        bio: cmsEntry?.bio || member.bio,
        image: cmsEntry?.image || member.image,
        videoUrl: cmsEntry?.videoUrl || '',
        color: colors[i % colors.length],
      }
    })
  }
  return hardcodedTeam
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState(loadTeam);

  useEffect(() => {
    setTeamMembers(loadTeam())
  }, [])
  return (
    <PageTransition>
      <Helmet>
        <title>Our Team | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Meet the creative minds behind AB DIGITAL SOLUTION. Our team of experts delivers digital marketing excellence." />
      </Helmet>

      <section className="pt-32 pb-20 px-6 bg-white" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Team</span>
            <h1 className="text-5xl md:text-7xl font-bold text-[#111] mt-6 tracking-tight" style={{ color: '#111111' }}>
              Meet the <span className="text-[#60A5FA]" style={{ color: '#60A5FA' }}>Mafia</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg" style={{ color: '#6b7280' }}>
              A powerhouse of creative strategists, tech wizards, and marketing mavericks — we don't just follow trends, we set them.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={`${member.name}-${member.role}-${i}`}
                className="rounded-2xl p-8 text-center group border-2 border-[#111111]"
                style={{ backgroundColor: '#ffffff', color: '#111111', borderColor: '#111111', boxShadow: '4px 4px 0 0 #111111' }}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 mx-auto rounded-full border-4 object-cover mb-5 group-hover:scale-105 transition-transform"
                    style={{ borderColor: '#111111' }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-3xl font-bold text-white mb-5"
                    style={{ backgroundColor: member.color, borderColor: '#111111' }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1" style={{ color: '#111111' }}>{member.name}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: '#60A5FA' }}>{member.role}</p>
                <p className="text-sm" style={{ color: '#4b5563' }}>{member.bio}</p>
                {member.videoUrl && (
                  <div className="mt-5">
                    <YoutubeEmbed url={member.videoUrl} title={`${member.name} video`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

