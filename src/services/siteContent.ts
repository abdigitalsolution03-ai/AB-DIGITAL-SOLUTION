export interface NavItem { label: string; href: string }
export interface StatItem { value: number; suffix: string; label: string }
export interface FeatureItem { title: string; description: string; color: string; icon: string }
export interface StepItem { number: string; title: string; description: string }
export interface PlanFeature { name: string; price: string; description: string; features: string[]; popular: boolean }
export interface TeamMember { name: string; role: string; bio: string }
export interface ValueItem { title: string; description: string; icon: string }
export interface TimelineItem { year: string; title: string; desc: string }
export interface SocialLink { platform: string; url: string }
export interface ContactInfo { email: string; phone: string; location: string; whatsapp: string }
export interface HeroContent { badge: string; headline1: string; headline2: string; headlineHighlight: string; description: string; cta1: string; cta1Link: string; cta2: string; cta2Link: string; stats: StatItem[] }
export interface SiteContent {
  header: { logo: string; logoHighlight: string; navItems: NavItem[]; cta: string; ctaLink: string }
  hero: HeroContent
  footer: { logo: string; logoHighlight: string; description: string; tagline: string; quickLinks: NavItem[]; services: string[]; newsletterHeading: string; newsletterText: string; copyright: string; legalLinks: NavItem[] }
  contact: { heading: string; subtext: string; serviceOptions: string[]; info: ContactInfo; socialLinks: SocialLink[]; mapsEmbed: string }
  whyChooseUs: { label: string; heading: string; headingHighlight: string; subtext: string; features: FeatureItem[] }
  pricing: { label: string; heading: string; headingHighlight: string; subtext: string; plans: PlanFeature[] }
  process: { label: string; heading: string; headingHighlight: string; steps: StepItem[] }
  about: { label: string; heading: string; headingHighlight: string; paragraphs: string[]; stats: StatItem[]; cta: string; ctaLink: string }
  aboutPage: { values: ValueItem[]; team: TeamMember[]; timeline: TimelineItem[] }
  newsletter: { heading: string; subtext: string; placeholder: string; buttonText: string; successMessage: string }
  homepage: { sections: string[] }
}

const defaultContent: SiteContent = {
  header: {
    logo: 'AB', logoHighlight: 'DIGITAL',
    navItems: [
      { label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' }, { label: 'Team', href: '/team' }, { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    cta: 'Contact Us', ctaLink: '/contact',
  },
  hero: {
    badge: 'Premium Digital Agency',
    headline1: 'WE ARE', headline2: 'AB ', headlineHighlight: 'DIGITAL SOLUTION',
    description: 'We help businesses dominate online through SEO, Website Development, Google Ads, Meta Ads, Social Media Marketing, Branding, AI Automation and Lead Generation.',
    cta1: 'Get Free Consultation', cta1Link: '/contact',
    cta2: 'View Portfolio', cta2Link: '/portfolio',
    stats: [
      { value: 100, suffix: '+', label: 'Happy Clients' },
      { value: 500, suffix: '+', label: 'Projects Done' },
      { value: 98, suffix: '%', label: 'Satisfaction' },
      { value: 5, suffix: '+', label: 'Years Experience' },
    ],
  },
  footer: {
    logo: 'AB', logoHighlight: 'DIGITAL',
    description: 'Premium digital marketing and web development agency delivering data-driven results for brands worldwide.',
    tagline: 'Your Growth. Our Strategy.',
    quickLinks: [
      { label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' }, { label: 'Blog', href: '/blog' }, { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    services: ['Website Development', 'SEO', 'Google Ads', 'Meta Ads', 'Social Media Marketing', 'Content Marketing', 'Branding', 'AI Automation', 'Lead Generation'],
    newsletterHeading: 'Newsletter', newsletterText: 'Stay updated with the latest digital marketing insights.',
    copyright: 'AB DIGITAL SOLUTION. All rights reserved.',
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  contact: {
    heading: "Let's Work Together", subtext: 'Ready to take your digital presence to the next level? Get in touch with us today.',
    serviceOptions: ['Website Development', 'SEO Optimization', 'Google Ads', 'Meta Ads', 'Social Media Marketing', 'Content Marketing', 'Branding', 'AI Automation', 'Lead Generation'],
    info: { email: 'abdigitalsolution03@gmail.com', phone: '+91 81785-26092', location: 'New York, NY 10001', whatsapp: 'https://wa.me/918178526092' },
    socialLinks: [
      { platform: 'Facebook', url: '#' }, { platform: 'Instagram', url: '#' },
      { platform: 'LinkedIn', url: '#' }, { platform: 'Twitter', url: '#' },
    ],
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.914770972!2d-74.119763!3d40.697403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York%2C+NY!5e0!3m2!1sen!2sus!4v1',
  },
  whyChooseUs: {
    label: 'Why Choose Us', heading: 'Built for', headingHighlight: 'Excellence',
    subtext: 'What sets us apart and makes us the preferred partner for businesses worldwide.',
    features: [
      { title: 'Fast Delivery', description: 'Swift project turnaround without compromising on quality or attention to detail.', color: '#FF4D4D', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
      { title: 'Transparent Pricing', description: 'No hidden fees, no surprises. Clear pricing with detailed breakdowns for every project.', color: '#4D7AFF', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { title: 'Expert Team', description: 'Industry veterans with proven track records across digital marketing and development.', color: '#8B5CF6', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
      { title: '24x7 Support', description: 'Round-the-clock support team ready to assist you whenever you need us.', color: '#60A5FA', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { title: 'ROI Focused', description: 'Every strategy is data-driven and designed to deliver maximum return on investment.', color: '#FF4D4D', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    ],
  },
  pricing: {
    label: 'Pricing', heading: 'Transparent', headingHighlight: 'Plans',
    subtext: 'Choose the plan that fits your needs. All plans include a free consultation.',
    plans: [
      { name: 'Starter', price: '999', description: 'Perfect for small businesses starting their digital journey.', features: ['Website Development (5 Pages)', 'Basic SEO Setup', 'Social Media Setup', 'Monthly Analytics Report', 'Email Support'], popular: false },
      { name: 'Professional', price: '2,499', description: 'Ideal for growing businesses seeking comprehensive digital solutions.', features: ['Website Development (10 Pages)', 'Advanced SEO Strategy', 'Google Ads Management', 'Meta Ads Management', 'Content Marketing (4 posts/mo)', 'Priority Support', 'Monthly Strategy Call'], popular: true },
      { name: 'Enterprise', price: 'Custom', description: 'Tailored solutions for large organizations with complex needs.', features: ['Custom Web Application', 'Enterprise SEO Suite', 'Multi-Platform Ad Management', 'AI Automation Integration', 'Full Branding Package', 'Dedicated Account Manager', '24/7 Priority Support', 'Quarterly Business Review'], popular: false },
    ],
  },
  process: {
    label: 'Our Process', heading: 'How We', headingHighlight: 'Deliver Results',
    steps: [
      { number: '01', title: 'Discovery', description: 'We dive deep into your business, goals, and target audience to build a solid foundation.' },
      { number: '02', title: 'Research', description: 'Thorough market analysis and competitor research to identify opportunities and trends.' },
      { number: '03', title: 'Planning', description: 'Strategic roadmap creation with clear milestones, KPIs, and deliverables.' },
      { number: '04', title: 'Design', description: 'Crafting visually stunning and user-centric designs that captivate your audience.' },
      { number: '05', title: 'Development', description: 'Bringing designs to life with clean, performant, and scalable code.' },
      { number: '06', title: 'Marketing', description: 'Launching data-driven campaigns to drive traffic, engagement, and conversions.' },
      { number: '07', title: 'Growth', description: 'Continuous optimization and scaling to maximize ROI and long-term success.' },
    ],
  },
  about: {
    label: 'About Us', heading: 'Transforming Brands Through', headingHighlight: 'Digital Excellence',
    paragraphs: [
      'At AB DIGITAL SOLUTION, we combine creative strategy with cutting-edge technology to deliver digital solutions that drive real business growth. Our team of experts is passionate about helping brands establish a powerful online presence.',
      'From startups to established enterprises, we\'ve partnered with 100+ businesses to transform their digital footprint through data-driven strategies, stunning design, and results-focused execution.',
    ],
    stats: [
      { value: 100, suffix: '+', label: 'Happy Clients' },
      { value: 500, suffix: '+', label: 'Projects Completed' },
      { value: 98, suffix: '%', label: 'Client Satisfaction' },
      { value: 5, suffix: '+', label: 'Years Experience' },
    ],
    cta: 'Start Your Journey', ctaLink: '/contact',
  },
  aboutPage: {
    values: [
      { title: 'Excellence', description: 'We strive for perfection in every project, delivering results that exceed expectations.', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
      { title: 'Innovation', description: 'We stay ahead of digital trends to bring you cutting-edge solutions that drive growth.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { title: 'Transparency', description: 'Clear communication, honest reporting, and complete visibility into every aspect of your campaigns.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
      { title: 'Results-Driven', description: 'Every strategy is data-backed and focused on delivering measurable ROI for your business.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ],
    team: [
      { name: 'Arjun Bhatia', role: 'Founder & CEO', bio: 'Visionary leader with 12+ years in digital marketing and technology.' },
      { name: 'Priya Sharma', role: 'Head of Strategy', bio: 'Data-driven strategist specializing in growth marketing and analytics.' },
      { name: 'Rahul Verma', role: 'Creative Director', bio: 'Award-winning designer passionate about brand storytelling.' },
      { name: 'Ananya Patel', role: 'Technical Lead', bio: 'Full-stack developer with expertise in modern web technologies.' },
      { name: 'Vikram Singh', role: 'SEO Director', bio: 'SEO specialist with track record of top rankings across industries.' },
      { name: 'Neha Gupta', role: 'Head of Ads', bio: 'Paid media expert managing multi-million dollar ad budgets.' },
    ],
    timeline: [
      { year: '2020', title: 'The Beginning', desc: 'AB DIGITAL SOLUTION was founded with a vision to provide premium digital marketing services to businesses worldwide.' },
      { year: '2021', title: 'First 50 Clients', desc: 'Within a year, we onboarded 50+ clients and expanded our team to meet growing demand.' },
      { year: '2022', title: 'Service Expansion', desc: 'We launched new service lines including AI automation, video editing, and influencer marketing.' },
      { year: '2023', title: 'Industry Recognition', desc: 'Received multiple industry awards for excellence in digital marketing and web development.' },
      { year: '2024', title: 'Global Reach', desc: 'Expanded operations internationally, serving clients across North America, Europe, and Asia.' },
      { year: '2025', title: '100+ Clients Milestone', desc: 'Celebrated 100+ happy clients and 500+ successful projects with a 98% satisfaction rate.' },
    ],
  },
  newsletter: {
    heading: 'Subscribe to Our Newsletter', subtext: 'Get the latest digital marketing insights, strategies, and trends delivered straight to your inbox.',
    placeholder: 'Enter your email', buttonText: 'Subscribe', successMessage: 'Thanks for subscribing!',
  },
  homepage: {
    sections: ['Hero', 'TrustedBrands', 'About', 'Services', 'Portfolio', 'Process', 'WhyChooseUs', 'Awards', 'Testimonials', 'Pricing', 'FAQ', 'Newsletter', 'Contact'],
  },
}

const KEY = 'ab_site_content'

function loadContent(): SiteContent {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultContent, ...parsed }
    }
  } catch {}
  return defaultContent
}

function saveContent(content: SiteContent) {
  localStorage.setItem(KEY, JSON.stringify(content))
}

export function getSiteContent(): SiteContent {
  if (typeof window === 'undefined') return defaultContent
  return loadContent()
}

export function updateSiteContent(updater: (content: SiteContent) => SiteContent) {
  const content = loadContent()
  saveContent(updater(content))
  return content
}

export function resetSiteContent() {
  saveContent(defaultContent)
  return defaultContent
}

export function seedSiteContent() {
  const existing = localStorage.getItem(KEY)
  if (!existing) saveContent(defaultContent)
}
