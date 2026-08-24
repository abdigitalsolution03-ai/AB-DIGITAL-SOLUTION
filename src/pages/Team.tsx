import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import PageTransition from '@/components/PageTransition'
import AnimatedSection from '@/components/AnimatedSection'
import YoutubeEmbed from '@/components/YoutubeEmbed'

const hardcodedTeam = [
  { name: 'Avnish Yadav', role: 'Founder', bio: 'Visionary founder driving digital strategy and brand growth for every client.', color: '#60A5FA', image: '/team/page_1.png' },
  { name: 'Bobby Singh', role: 'Co-Founder', bio: 'Co-founder managing operations and making sure every client project succeeds.', color: '#FF4D4D', image: '/team/page_2.png' },
  { name: 'Ansh', role: 'Business Ads', bio: 'Plans and shoots high converting business ad campaigns for growing brands.', color: '#EC4899', image: '/team/page_4.png' },
  { name: 'Ansh', role: 'Social Media Manager', bio: 'Manages social media growth, content calendars and daily engagement.', color: '#8B5CF6', image: '/team/ansh_smm.png' },
  { name: 'Abhay Sharma', role: 'Video Editor', bio: 'Edits reels and long form videos focused on retention and growth.', color: '#10B981', image: '/team/page_5.png' },
  { name: 'Subham', role: 'Performance Marketer', bio: 'Runs data driven Meta and Google Ads campaigns for maximum ROI.', color: '#EF4444', image: '/team/page_6.png' },
  { name: 'Deepanshu Singh Adhikari', role: 'Website Developer', bio: 'Builds fast, modern websites that turn visitors into paying customers.', color: '#4D7AFF', image: '/team/page_7.png' },
  { name: 'Pooja', role: 'Graphic Designer', bio: 'Designs thumbnails, social creatives and premium brand visuals daily.', color: '#F59E0B', image: '/team/page_8.png' },
]

const colors = ['#60A5FA', '#FF4D4D', '#4D7AFF', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#EF4444']

export default function Team() {
  const [teamMembers] = useState(hardcodedTeam)
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
                className="rounded-2xl p-8 text-center group"
                style={{ backgroundColor: '#ffffff', color: '#111111' }}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover mb-5 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div
                    className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-5"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1" style={{ color: '#111111' }}>{member.name}</h3>
                <p className="text-sm font-semibold mb-3" style={{ color: '#60A5FA' }}>{member.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563', minHeight: '2.5rem' }}>{member.bio}</p>
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
