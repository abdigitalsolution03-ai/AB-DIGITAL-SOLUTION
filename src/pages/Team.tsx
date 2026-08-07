import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import PageTransition from '@/components/PageTransition'
import AnimatedSection from '@/components/AnimatedSection'
import { getAll, pullCMS } from '@/services/cms'
import YoutubeEmbed from '@/components/YoutubeEmbed'

const hardcodedTeam = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', bio: 'Visionary leader with 15+ years in digital strategy and brand transformation.', color: '#60A5FA' },
  { name: 'Priya Sharma', role: 'Creative Director', bio: 'Award-winning creative mind behind iconic brand campaigns and visual identities.', color: '#FF4D4D' },
  { name: 'Rohan Desai', role: 'Head of SEO', bio: 'Data-driven SEO specialist who has ranked 200+ sites on page one of Google.', color: '#4D7AFF' },
  { name: 'Ananya Patel', role: 'Lead Developer', bio: 'Full-stack engineer building high-performance websites and web applications.', color: '#8B5CF6' },
  { name: 'Vikram Singh', role: 'Marketing Director', bio: 'Paid media expert managing $5M+ in annual ad spend across global markets.', color: '#10B981' },
  { name: 'Neha Gupta', role: 'Social Media Head', bio: 'Social strategist who grew brand communities to 1M+ engaged followers.', color: '#60A5FA' },
  { name: 'Karan Joshi', role: 'Content Strategist', bio: 'Storyteller crafting compelling narratives that drive conversions and brand love.', color: '#FF4D4D' },
  { name: 'Divya Kumar', role: 'UI/UX Designer', bio: 'User-centric designer creating intuitive digital experiences that delight users.', color: '#4D7AFF' },
  { name: 'Rahul Verma', role: 'Analytics Lead', bio: 'Conversion rate optimization expert with a data-first approach to growth.', color: '#8B5CF6' },
]

const hardcodedStats = [
  { value: '15+', label: 'Years Combined Experience' },
  { value: '200+', label: 'Happy Clients' },
  { value: '50+', label: 'Awards Won' },
  { value: '9', label: 'Core Team Members' },
]

const colors = ['#60A5FA', '#FF4D4D', '#4D7AFF', '#8B5CF6', '#10B981']

function loadTeam() {
  const cms = getAll('team')
  if (cms.length > 0) {
    return cms
      .filter((m: any) => !m.status || m.status === 'published')
      .map((m: any, i: number) => ({
        name: m.name,
        role: m.role || '',
        bio: m.bio || '',
        image: m.image || '',
        videoUrl: m.videoUrl || '',
        color: colors[i % colors.length],
      }))
  }
  return hardcodedTeam
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState(loadTeam);
  const stats = hardcodedStats;

  useEffect(() => {
    let active = true
    void pullCMS().then(() => {
      if (active) setTeamMembers(loadTeam())
    })
    return () => { active = false }
  }, [])
  return (
    <PageTransition>
      <Helmet>
        <title>Our Team | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Meet the creative minds behind AB DIGITAL SOLUTION. Our team of experts delivers digital marketing excellence." />
      </Helmet>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Team</span>
            <h1 className="text-5xl md:text-7xl font-bold text-[#111] mt-6 tracking-tight">
              Meet the <span className="text-[#60A5FA]">Mafia</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              A powerhouse of creative strategists, tech wizards, and marketing mavericks — we don't just follow trends, we set them.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="doodle-card p-8 text-center group"
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 mx-auto rounded-full border-4 border-[#111] object-cover mb-5 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div
                      className="w-24 h-24 mx-auto rounded-full border-4 border-[#111] flex items-center justify-center text-3xl font-bold text-white mb-5"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#111] mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-[#60A5FA] mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.bio}</p>
                  {member.videoUrl && (
                    <div className="mt-5">
                      <YoutubeEmbed url={member.videoUrl} title={`${member.name} video`} />
                    </div>
                  )}
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="doodle-card-accent p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#111]">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#111]/70 mt-1">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

