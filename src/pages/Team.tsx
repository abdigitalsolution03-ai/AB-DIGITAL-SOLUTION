import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import PageTransition from '@/components/PageTransition'
import AnimatedSection from '@/components/AnimatedSection'
import { getAll } from '@/services/cms'
import YoutubeEmbed from '@/components/YoutubeEmbed'

const hardcodedTeam = [
  { name: 'Avnish Yadav', role: 'Founder', bio: 'Visionary founder driving strategy and brand growth.', color: '#60A5FA', image: '/team/page_1.png' },
  { name: 'Boby Singh', role: 'Co-Founder', bio: 'Co-founder managing operations and client success.', color: '#FF4D4D', image: '/team/page_2.png' },
  { name: 'Rajnish Yadav', role: 'Content Writer', bio: 'Crafts engaging copy, captions and scripts that convert.', color: '#F59E0B', image: '/team/page_3.png' },
  { name: 'Ansh', role: 'Business Ads', bio: 'Plans and shoots business ads that drive leads and sales.', color: '#EC4899', image: '/team/page_4.png' },
  { name: 'Ansh', role: 'Social Media Manager', bio: 'Manages social growth, content calendars and campaigns.', color: '#8B5CF6', image: '/team/ansh_smm.png' },
  { name: 'Abhay Sharma', role: 'Video Editor', bio: 'Edits reels and long-form videos focused on retention.', color: '#10B981', image: '/team/page_5.png' },
  { name: 'Subham', role: 'Performance Marketer', bio: 'Runs Meta and Google Ads for maximum ROI.', color: '#EF4444', image: '/team/page_6.png' },
  { name: 'Deepanshu Singh Adhikari', role: 'Website Developer', bio: 'Builds fast, modern websites that convert visitors.', color: '#4D7AFF', image: '/team/page_7.png' },
  { name: 'Pooja', role: 'Graphic Designer', bio: 'Designs thumbnails, creatives and premium brand visuals.', color: '#60A5FA', image: '/team/page_8.png' },
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
              Meet the <span className="text-[#60A5FA]" style={{ color: '#60A5FA' }}>Experts</span>
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
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-5 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-5"
                    style={{ backgroundColor: member.color }}
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

