const DB_PREFIX = 'cms_'
const MEDIA_KEY = 'cms_media'

function db(): Record<string, any> {
  try {
    const parsed = JSON.parse(localStorage.getItem(DB_PREFIX + 'db') || '{}')
    const rawMedia = localStorage.getItem(MEDIA_KEY)
    if (rawMedia !== null) {
      try {
        const media = JSON.parse(rawMedia)
        if (Array.isArray(media)) parsed.media = media
      } catch { /* media key corrupt — keep db copy */ }
    }
    return parsed
  } catch { return {} }
}

function save(data: Record<string, any>): void {
  const { media, ...rest } = data
  let mediaStored = false
  try {
    localStorage.setItem(MEDIA_KEY, JSON.stringify(media ?? []))
    mediaStored = true
  } catch { /* media too large for its key — try inside main db below */ }
  try {
    localStorage.setItem(DB_PREFIX + 'db', JSON.stringify(mediaStored ? rest : data))
  } catch { /* quota exceeded — state kept in memory for this session only */ }
}

const serverCollections = new Set([
  'pages', 'header', 'footer', 'media', 'blog', 'seo', 'theme', 'branding',
  'testimonials', 'faqs', 'homepageSections', 'enquiries', 'subscribers', 'leads',
  'careers', 'jobs', 'popups', 'banners', 'team', 'gallery', 'videos', 'portfolio',
  'clients', 'services', 'settings', 'pageData', 'templates',
])

export async function pullCMS(): Promise<boolean> {
  try {
    const res = await fetch('/api/cms', { headers: { Accept: 'application/json' } })
    if (!res.ok) return false
    const body = await res.json()
    const collections = body?.collections
    if (!collections || typeof collections !== 'object') return false
    const data = db()
    let changed = false
    for (const [name, items] of Object.entries(collections)) {
      if (serverCollections.has(name) && Array.isArray(items)) {
        const localItems = data[name]
        if (items.length === 0 && Array.isArray(localItems) && localItems.length > 0) {
          continue
        }
        data[name] = items
        changed = true
      }
    }
    if (changed) save(data)
    return true
  } catch {
    return false
  }
}

async function pushCollection(name: string, items: any[]): Promise<void> {
  if (!serverCollections.has(name)) return
  try {
    const { apiFetch } = await import('./auth')
    await apiFetch('/admin/cms', {
      method: 'POST',
      body: JSON.stringify({ name, items }),
    })
  } catch {
    // server unreachable or not signed in — local-only changes stay in browser
  }
}

function collection<T = any>(name: string): T[] {
  const data = db()
  return (data[name] || []) as T[]
}

function saveCollection(name: string, items: any[]): void {
  const data = db()
  data[name] = items
  save(data)
  void pushCollection(name, items)
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function now(): string {
  return new Date().toISOString()
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  sections: any[]
  seo?: { title?: string; description?: string; keywords?: string }
  status: 'draft' | 'published'
  order: number
  createdAt: string
  updatedAt: string
}

export interface NavItem {
  id: string
  label: string
  url: string
  children: NavItem[]
  order: number
}

export interface HeaderSettings {
  logo: string
  logoAlt: string
  sticky: boolean
  ctaText: string
  ctaUrl: string
  announcementBar: { enabled: boolean; text: string; url: string }
  navItems: NavItem[]
}

export interface FooterSettings {
  logo: string
  description: string
  copyright: string
  socialLinks: { platform: string; url: string; icon: string }[]
  contact: { email: string; phone: string; address: string }
  columns: { title: string; links: { label: string; url: string }[] }[]
  paymentIcons: string[]
  newsletterEnabled: boolean
}

export interface Media {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'pdf' | 'icon' | 'document'
  alt: string
  size: number
  folder: string
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  categories: string[]
  tags: string[]
  author: string
  status: 'draft' | 'published' | 'scheduled'
  scheduledAt?: string
  seo?: { title?: string; description?: string; keywords?: string; ogImage?: string }
  createdAt: string
  updatedAt: string
}

export interface SEOSettings {
  globalTitle: string
  globalDescription: string
  keywords: string
  ogImage: string
  twitterHandle: string
  googleAnalytics: string
  googleVerification: string
  facebookPixel: string
  customHead: string
}

export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  borderRadius: number
  animationEnabled: boolean
  darkModeEnabled: boolean
  customCss: string
}

export interface Branding {
  logo: string
  logoDark: string
  favicon: string
  companyName: string
  email: string
  phone: string
  address: string
  socialLinks: { platform: string; url: string }[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
  status: 'draft' | 'published'
  createdAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  status: 'draft' | 'published'
  createdAt: string
}

export interface HomepageSection {
  id: string
  type: string
  title: string
  subtitle: string
  content: any
  order: number
  status: 'visible' | 'hidden'
}

export interface Setting {
  key: string
  value: any
}

const defaults: Record<string, any[]> = {
  pages: [
    {
      id: 'page_home', title: 'Home', slug: '', content: '', sections: [],
      seo: { title: '', description: '', keywords: '' }, status: 'published', order: 0,
      createdAt: now(), updatedAt: now(),
    },
  ],
  header: [{
    logo: '', logoAlt: '', sticky: true, ctaText: 'Get Started', ctaUrl: '/contact',
    announcementBar: { enabled: false, text: '', url: '' },
    navItems: [
      { id: 'nav_1', label: 'Home', url: '/', children: [], order: 0 },
      { id: 'nav_2', label: 'Services', url: '/services', children: [], order: 1 },
      { id: 'nav_3', label: 'About', url: '/about', children: [], order: 2 },
      { id: 'nav_4', label: 'Contact', url: '/contact', children: [], order: 3 },
    ],
  }],
  footer: [{
    logo: '', description: '', copyright: '© 2025 All rights reserved.',
    socialLinks: [], contact: { email: '', phone: '', address: '' },
    columns: [], paymentIcons: [], newsletterEnabled: true,
  }],
  media: [],
  blog: [],
  seo: [{
    globalTitle: '', globalDescription: '', keywords: '', ogImage: '',
    twitterHandle: '', googleAnalytics: '', googleVerification: '', facebookPixel: '', customHead: '',
  }],
  theme: [{
    primaryColor: '#3B82F6', secondaryColor: '#1E293B', accentColor: '#F59E0B',
    fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 8,
    animationEnabled: true, darkModeEnabled: true, customCss: '',
  }],
  branding: [{
    logo: '', logoDark: '', favicon: '', companyName: 'My Company',
    email: '', phone: '', address: '',
    socialLinks: [],
  }],
  testimonials: [],
  faqs: [],
  homepageSections: [],
  enquiries: [],
  subscribers: [],
  leads: [],
  careers: [],
  jobs: [],
  popups: [],
  banners: [],
  team: [],
  gallery: [],
  videos: [],
  templates: [],
  portfolio: [],
  clients: [],
  services: [],
  settings: [],
}

export function initCMS(): void {
  const data = db()
  let changed = false
  for (const [key, value] of Object.entries(defaults)) {
    if (!data[key]) {
      data[key] = JSON.parse(JSON.stringify(value))
      changed = true
    }
  }
  if (changed) save(data)
}

const PORTFOLIO_SEED: Array<Record<string, any>> = [
  { title: 'White Bricks Real Estate', category: 'Social Media', description: 'Instagram management, post design & content calendar for a premium real estate brand.', image: '/portfolio/white-bricks.jpg', instagramUrl: 'https://www.instagram.com/whitebrickrealestate', results: 'Instagram Management\nPost Design\nContent Calendar' },
  { title: 'Dr. Neha Vasishth', category: 'SEO', description: "Google My Business management for one of Delhi's leading consultant psychologists.", image: '/portfolio/neha-vasishth.jpg', results: 'Google My Business\nLocal SEO\nOnline Reputation' },
  { title: 'Build With Nishant', category: 'Social Media', description: 'Personal brand presence & content strategy to grow his digital footprint.', image: '/portfolio/build-with-nishant.jpg', results: 'Brand Presence\nContent Strategy\nGrowth' },
  { title: 'Eco Vibe', category: 'Video Editing', description: 'Full YouTube channel management for Economics by Sapan Kumar — edits, uploads & SEO.', image: '/portfolio/eco-vibe.jpg', videoUrl: 'https://www.youtube.com/@Economicsbysapankumar', videoThumb: 'https://i.ytimg.com/vi/hYeA0iVMNv8/hqdefault.jpg', channelAvatar: 'https://yt3.googleusercontent.com/XidJwUvUbs8tXvWc3m0xBwv15wYaKfZG4TG6tgp0TJWxrImihtRrwRO4mY7yUuAxJ4Zeb7u4NQ=s200-c-k-c0x00ffffff-no-rj', results: 'YouTube Management\nVideo Editing\nYouTube SEO' },
  { title: 'Lawfine Care', category: 'Ads', description: 'Instagram posts, paid ads & video editing for a legal services brand.', image: '/portfolio/lawfine-care.jpg', instagramUrl: 'https://www.instagram.com/lawyerpanelexpert', results: 'Instagram Marketing\nMeta Ads\nVideo Editing' },
  { title: 'Charru Gupta', category: 'Video Editing', description: 'YouTube video editing for content creator Charru Gupta.', image: '/portfolio/charru-gupta.jpg', videoUrl: 'https://youtu.be/AzxXnDwudjs', videoThumb: 'https://i.ytimg.com/vi/AzxXnDwudjs/hqdefault.jpg', results: 'Video Editing\nReels' },
  { title: 'YCB Toy Zone', category: 'Video Editing', description: 'Video editing for the YCB Toy Zone YouTube channel.', image: '/portfolio/ycb-toy.jpg', videoUrl: 'https://www.youtube.com/@YCBToyZone', videoThumb: 'https://i.ytimg.com/vi/2Vd1JJpoxTA/hqdefault.jpg', channelAvatar: 'https://yt3.googleusercontent.com/LO92V_JjM7IJtU-4NW6KLtsWjv_wIKywV5RW3AzWgyLMn7oXzD6eqN033986P1jmNp1_J6-eNc0=s200-c-k-c0x00ffffff-no-rj', results: 'Video Editing\nYouTube' },
  { title: 'Ambrosial Catering', category: 'Social Media', description: 'Full-stack social media — Instagram & Facebook management, Meta ads, Pinterest & video editing.', image: '/portfolio/ambrosial.jpg', instagramUrl: 'https://www.instagram.com/ambrosial.catering', results: 'Instagram & Facebook\nMeta Ads\nPinterest\nVideo Editing' },
  { title: 'ATV News Bihar', category: 'Design', description: 'Logo and banner design for the ATV Bihar news channel.', image: '/portfolio/atv-news.jpg', videoUrl: 'https://www.youtube.com/@AtvBihar', videoThumb: 'https://i.ytimg.com/vi/50oa9NjCKxg/hqdefault.jpg', channelAvatar: 'https://yt3.googleusercontent.com/LHmvmQ-K6O9t3ZgTrl0-V2rTRWnA1MnW4YrRSzUD8kIn6bt8SXi94IsZWf8VaK4oCUVNumt1THo=s200-c-k-c0x00ffffff-no-rj', results: 'Logo Design\nBanner Design\nChannel Branding' },
  { title: 'Anytime Impressions', category: 'Video Editing', description: 'YouTube & Instagram handling — editing and everything for Anytime Impressions.', image: '/portfolio/anytime.jpg', videoUrl: 'https://www.youtube.com/@Anytimeimpressions', videoThumb: 'https://i.ytimg.com/vi/pBA2zZfg_Uo/hqdefault.jpg', channelAvatar: 'https://yt3.googleusercontent.com/xHJ4KySUi9WmidIsJ8fbjhSAoX8R_Qb8T2X1mCubm6UlKIZYUrEPDRCdz2rtixx3ExHPS4mTb-Y=s200-c-k-c0x00ffffff-no-rj', results: 'YouTube + Instagram\nEditing\nContent' },
  { title: 'Suraj Paul', category: 'Social Media', description: 'Instagram, LinkedIn & Facebook management, paid ads, Google My Business and video editing.', image: '/portfolio/suraj-paul.jpg', instagramUrl: 'https://www.instagram.com/surajpaulprosperity', results: 'Instagram / LinkedIn / Facebook\nPaid Ads\nGoogle My Business\nVideo Editing' },
  { title: 'MS Tutorials Vaishali', category: 'Social Media', description: 'Post management, Google My Business, YouTube & Facebook handling with video editing.', image: '/portfolio/ms-tutorial.jpg', instagramUrl: 'https://www.instagram.com/m.s_tutorials_vaishali', results: 'Google My Business\nYouTube & Facebook\nVideo Editing' },
  { title: 'Vidya Vibe Academy', category: 'Social Media', description: 'Instagram management — posts & editing for VVA Vasundhara.', image: '/portfolio/vidya-vibe.jpg', instagramUrl: 'https://www.instagram.com/vva_vasundhara', results: 'Instagram Management\nPosts\nEditing' },
]

export function seedPortfolioIfEmpty(): void {
  const existing = collection('portfolio')
  if (existing.length > 0) return
  const items = PORTFOLIO_SEED.map((p, i) => ({
    ...p,
    status: 'published',
    displayOrder: i,
    clientName: '',
    id: generateId(),
    createdAt: now(),
    updatedAt: now(),
  }))
  saveCollection('portfolio', items)
}

const SERVICES_SEED: Array<Record<string, any>> = [
  { title: 'SEO', slug: 'seo', category: 'Marketing', icon: 'search', description: 'Data-driven SEO strategies that boost your organic rankings, increase visibility, and drive qualified traffic to your site.', status: 'published' },
  { title: 'Google Ads', slug: 'google-ads', category: 'Advertising', icon: 'chart', description: 'High-ROI Google Ads campaigns optimized for conversions, with precise targeting and continuous performance refinement.', status: 'published' },
  { title: 'Meta Ads', slug: 'meta-ads', category: 'Advertising', icon: 'target', description: 'Social media advertising on Facebook & Instagram that reaches your ideal audience with compelling creative and messaging.', status: 'published' },
  { title: 'Social Media Marketing', slug: 'social-media-marketing', category: 'Marketing', icon: 'users', description: 'Strategic social media management that builds brand awareness, engages communities, and drives measurable business growth.', status: 'published' },
  { title: 'Content Marketing', slug: 'content-marketing', category: 'Marketing', icon: 'pen', description: 'Compelling content that tells your brand story, educates your audience, and establishes your authority in the industry.', status: 'published' },
  { title: 'Influencer Marketing', slug: 'influencer-marketing', category: 'Marketing', icon: 'star', description: 'Strategic influencer partnerships that amplify your brand reach and build authentic connections with your target audience.', status: 'published' },
  { title: 'Website Development', slug: 'website-development', category: 'Development', icon: 'code', description: 'Custom, responsive websites built with modern tech stacks that drive conversions and deliver exceptional user experiences.', status: 'published' },
  { title: 'Ecommerce Marketing', slug: 'ecommerce-marketing', category: 'Marketing', icon: 'dollar', description: 'Comprehensive ecommerce marketing solutions that drive sales, reduce cart abandonment, and maximize customer lifetime value.', status: 'published' },
  { title: 'Branding', slug: 'branding', category: 'Creative', icon: 'heart', description: 'Complete brand identity design from logo to guidelines, creating a cohesive and memorable presence that sets you apart.', status: 'published' },
  { title: 'Graphic Design', slug: 'graphic-design', category: 'Creative', icon: 'layers', description: 'Eye-catching designs for digital and print that communicate your brand message effectively and leave lasting impressions.', status: 'published' },
  { title: 'Video Editing', slug: 'video-editing', category: 'Creative', icon: 'camera', description: 'Professional video production and editing services that bring your brand stories to life with cinematic quality.', status: 'published' },
  { title: 'Performance Marketing', slug: 'performance-marketing', category: 'Advertising', icon: 'zap', description: 'Data-driven performance marketing campaigns focused on measurable outcomes and maximum return on ad spend.', status: 'published' },
  { title: 'Lead Generation', slug: 'lead-generation', category: 'Marketing', icon: 'link', description: 'Multi-channel lead generation campaigns that fill your pipeline with high-quality prospects ready to convert.', status: 'published' },
  { title: 'Email Marketing', slug: 'email-marketing', category: 'Marketing', icon: 'mail', description: 'Strategic email campaigns that nurture leads, drive conversions, and build lasting customer relationships through personalized communication.', status: 'published' },
  { title: 'Local SEO', slug: 'local-seo', category: 'Marketing', icon: 'globe', description: 'Hyper-local SEO strategies that help businesses dominate local search results and attract nearby customers ready to buy.', status: 'published' },
  { title: 'YouTube Marketing', slug: 'youtube-marketing', category: 'Marketing', icon: 'megaphone', description: 'Comprehensive YouTube marketing from channel optimization to content strategy that grows your audience and revenue.', status: 'published' },
  { title: 'AI Automation', slug: 'ai-automation', category: 'Development', icon: 'sparkles', description: 'Intelligent automation solutions powered by AI to streamline operations, reduce costs, and scale your business efficiently.', status: 'published' },
]

const TESTIMONIALS_SEED: Array<Record<string, any>> = [
  { name: 'Rahul Sharma', role: 'Owner', company: 'Sharma Trading Co.', content: 'AB DIGITAL SOLUTION transformed our online presence. Our traffic increased by 300% within three months. Their strategic approach and attention to detail are unmatched.', rating: 5, category: 'SEO', status: 'published' },
  { name: 'Priya Patel', role: 'Founder', company: 'Patel Boutique', content: 'The team at AB DIGITAL SOLUTION delivered beyond our expectations. Our conversion rate doubled, and the ROI on our ad spend has been remarkable.', rating: 5, category: 'Google Ads', status: 'published' },
  { name: 'Amit Verma', role: 'Owner', company: 'Verma Electronics', content: 'Working with AB DIGITAL SOLUTION has been a game-changer. Their branding work gave us a completely new identity that resonates perfectly with our customers.', rating: 5, category: 'Branding', status: 'published' },
  { name: 'Neha Gupta', role: 'Director', company: 'Gupta Garments', content: 'From SEO to web development, every service has been top-notch. They truly understand digital strategy and execute flawlessly. Highly recommended.', rating: 5, category: 'Web Development', status: 'published' },
  { name: 'Vikram Singh', role: 'Owner', company: 'Singh Sweets & Snacks', content: 'The Google Ads campaign they managed for us generated a 400% ROI in the first month alone. Their expertise in paid advertising is exceptional.', rating: 5, category: 'Google Ads', status: 'published' },
  { name: 'Sunil Kumar', role: 'Proprietor', company: 'Kumar Furniture', content: 'Their website development team built us a stunning platform that perfectly captures our brand essence. The attention to detail was incredible.', rating: 5, category: 'Web Development', status: 'published' },
  { name: 'Divya Nair', role: 'Owner', company: 'Nair Spices', content: 'Our social media engagement has skyrocketed since partnering with AB DIGITAL SOLUTION. They truly understand how to build communities.', rating: 5, category: 'Social Media', status: 'published' },
  { name: 'Rajesh Yadav', role: 'Owner', company: 'Yadav Hardware', content: 'The SEO results have been phenomenal. We went from page 5 to page 1 for our key terms within 4 months. Outstanding work.', rating: 5, category: 'SEO', status: 'published' },
  { name: 'Sneha Deshmukh', role: 'Founder', company: 'Deshmukh Beauty Salon', content: 'The branding package they created for us was beyond anything we imagined. Our customers love the new look and feel.', rating: 5, category: 'Branding', status: 'published' },
  { name: 'Mohit Agarwal', role: 'Partner', company: 'Agarwal Traders', content: 'Their content marketing strategy helped us establish thought leadership in our industry. Our blog traffic increased by 500%.', rating: 5, category: 'Content Marketing', status: 'published' },
  { name: 'Kavita Reddy', role: 'Owner', company: 'Reddy Realty', content: "Local SEO services from AB DIGITAL SOLUTION put us on the map. We're now the top result for 'near me' searches in our area.", rating: 5, category: 'Local SEO', status: 'published' },
  { name: 'Arjun Menon', role: 'Owner', company: 'Menon Jewelry', content: 'The lead generation campaigns they run for us consistently deliver high-quality prospects. Our sales team is busier than ever.', rating: 5, category: 'Lead Generation', status: 'published' },
]

const TEAM_SEED: Array<Record<string, any>> = [
  { name: 'Avnish Yadav', role: 'Founder', bio: 'Visionary leader who founded AB DIGITAL SOLUTION to help businesses grow through digital marketing. Guides strategy, client relationships, and long-term brand growth.', status: 'published' },
  { name: 'Bobby', role: 'Co-Founder', bio: 'Co-founder driving operations and business growth. Works alongside the founder to keep every project on track and every client happy.', status: 'published' },
  { name: 'Deepanshu Singh Adhikari', role: 'Website Developer', bio: 'Builds clean, fast, and responsive websites using modern technologies. Turns designs into digital experiences that help businesses convert visitors into customers.', status: 'published' },
  { name: 'Ansh', role: 'Social Media Manager', bio: 'Plans content calendars and manages Instagram, Facebook, YouTube, and LinkedIn growth. Creates captions, hashtags, and campaigns that keep audiences engaged.', status: 'published' },
  { name: 'Abhay', role: 'Video Editor', bio: 'Professional reel and video editor crafting short-form content that captures attention. Handles YouTube long-form editing with a focus on retention and storytelling.', status: 'published' },
  { name: 'Pooja', role: 'Graphic Designer', bio: 'Designs thumbnails, creatives, and brand visuals that stand out in the feed. Combines aesthetics with marketing insight to make brands look premium.', status: 'published' },
]

const FAQS_SEED: Array<Record<string, any>> = [
  { question: 'What services does AB DIGITAL SOLUTION offer?', answer: 'We offer a comprehensive range of digital marketing and web development services including Website Development, SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, Branding, AI Automation, and Lead Generation.', category: 'General', status: 'published' },
  { question: 'How long does it take to see results?', answer: 'Timelines vary by service. SEO typically shows significant results within 3-6 months, while paid advertising can deliver immediate traffic and leads. Web development projects usually take 4-8 weeks depending on complexity.', category: 'General', status: 'published' },
  { question: 'Do you work with small businesses?', answer: 'Absolutely! We work with businesses of all sizes, from startups to established enterprises. Our Starter package is specifically designed for small businesses looking to establish their digital presence.', category: 'General', status: 'published' },
  { question: 'What industries do you specialize in?', answer: 'We have experience across a wide range of industries including e-commerce, SaaS, healthcare, real estate, finance, education, and professional services. Our strategies are tailored to your specific industry and target audience.', category: 'General', status: 'published' },
  { question: 'How do you measure success?', answer: 'We use data-driven KPIs tailored to your goals including traffic, rankings, conversion rates, ROAS, lead quality, and revenue growth. You\'ll receive detailed monthly reports with actionable insights.', category: 'General', status: 'published' },
  { question: 'Can I customize my package?', answer: 'Yes! Every business is unique. We offer fully customizable solutions. Contact us for a personalized quote tailored to your specific needs, goals, and budget.', category: 'General', status: 'published' },
]

const BLOG_SEED: Array<Record<string, any>> = [
  { title: 'SEO Trends to Dominate Search Rankings in 2025', slug: 'seo-trends-2025', excerpt: 'Discover the latest SEO trends and strategies that will help your website rank higher in search results this year.', content: '<p>Search engines are evolving faster than ever. Here are the trends shaping 2025 and how to use them.</p><p>From AI-driven search to voice queries, staying ahead requires a content-first approach with technical excellence.</p>', categories: ['SEO'], tags: ['seo', 'trends'], author: 'Ansh', status: 'published' },
  { title: 'Building a Social Media Marketing Strategy That Works', slug: 'social-media-marketing-strategy', excerpt: 'Learn how to create a comprehensive social media strategy that drives engagement, builds community, and generates leads.', content: '<p>A winning social media strategy starts with clear goals and a deep understanding of your audience.</p><p>Consistency, storytelling, and data-driven iteration are the keys to long-term growth.</p>', categories: ['Marketing'], tags: ['social media', 'strategy'], author: 'Ansh', status: 'published' },
  { title: 'Modern Web Development: Frameworks and Best Practices for 2025', slug: 'web-development-trends', excerpt: 'Explore the latest web development frameworks, tools, and best practices to build high-performance websites.', content: '<p>Modern websites need to be fast, accessible, and easy to maintain. Choose the right stack for your goals.</p><p>Core Web Vitals matter more than ever for both users and search rankings.</p>', categories: ['Web Development'], tags: ['web', 'development'], author: 'Deepanshu Singh Adhikari', status: 'published' },
  { title: 'The Ultimate Guide to Building a Strong Brand Identity', slug: 'brand-identity-guide', excerpt: 'From logo design to brand guidelines, learn everything you need to create a memorable brand identity.', content: '<p>Your brand is more than a logo — it is the emotional connection your audience feels with your business.</p><p>Build a cohesive identity across every touchpoint to stand out in a crowded market.</p>', categories: ['Branding'], tags: ['branding', 'identity'], author: 'Pooja', status: 'published' },
  { title: 'Google Ads Optimization: Tips for Higher ROAS', slug: 'google-ads-optimization', excerpt: 'Proven strategies to optimize your Google Ads campaigns for better performance and higher return on ad spend.', content: '<p>Optimization is a continuous process. Start with clean account structure and let data guide your bids.</p><p>Test ad copy, refine audiences, and prune what does not perform.</p>', categories: ['SEO'], tags: ['google ads', 'roas'], author: 'Ansh', status: 'published' },
  { title: 'Measuring Content Marketing ROI: A Complete Framework', slug: 'content-marketing-roi', excerpt: 'Learn how to track and measure the return on investment of your content marketing efforts effectively.', content: '<p>Content ROI goes beyond traffic. Map every piece of content to a business outcome.</p><p>Attribution, lifetime value, and pipeline influence paint the real picture.</p>', categories: ['Marketing'], tags: ['content', 'roi'], author: 'Avnish Yadav', status: 'published' },
  { title: 'Ecommerce Conversion Optimization: Turn Visitors into Customers', slug: 'ecommerce-conversion-optimization', excerpt: 'Actionable strategies to improve your ecommerce conversion rates and boost online sales.', content: '<p>Every click matters. Simplify checkout, strengthen product pages, and build trust with social proof.</p><p>Small changes can compound into significant revenue growth.</p>', categories: ['Business'], tags: ['ecommerce', 'conversion'], author: 'Ansh', status: 'published' },
  { title: 'Local SEO for Small Businesses: A Step-by-Step Guide', slug: 'local-seo-small-business', excerpt: 'Dominate local search results and attract more customers with this comprehensive local SEO guide.', content: '<p>Google My Business is the foundation of local visibility. Claim, verify, and optimize your profile.</p><p>Reviews and local citations complete the picture for local dominance.</p>', categories: ['SEO'], tags: ['local seo', 'small business'], author: 'Ansh', status: 'published' },
  { title: 'Optimizing React Website Performance for Better UX', slug: 'react-website-performance', excerpt: "Tips and techniques to improve your React website's performance and deliver a better user experience.", content: '<p>Performance is a feature. Lazy load, code-split, and keep your bundles lean.</p><p>Measure with Lighthouse and Core Web Vitals to track real progress.</p>', categories: ['Web Development'], tags: ['react', 'performance'], author: 'Deepanshu Singh Adhikari', status: 'published' },
  { title: 'Email Marketing Best Practices for Higher Engagement', slug: 'email-marketing-best-practices', excerpt: 'Master the art of email marketing with these proven best practices for open rates and conversions.', content: '<p>Email remains one of the highest-ROI channels. Segment your list and personalize every send.</p><p>Timing, subject lines, and clear CTAs drive engagement.</p>', categories: ['Marketing'], tags: ['email', 'marketing'], author: 'Ansh', status: 'published' },
]

const CLIENTS_SEED: Array<Record<string, any>> = [
  'Sharma Trading', 'Patel Boutique', 'Verma Electronics', 'Gupta Garments', 'Singh Sweets',
  'Kumar Furniture', 'Nair Spices', 'Yadav Hardware', 'Deshmukh Salon', 'Agarwal Traders',
  'Reddy Realty', 'Menon Jewelry', 'Mehta Pharma', 'Joshi Stationery', 'Kapoor Textiles',
  'Iyer Matrimony', 'Chopra Foods', 'Bhatia Travels', 'Sawant Fitness', 'Pillai Autos',
].map((name, i) => ({ name, website: '', displayOrder: i, status: 'published' }))

export function seedAllIfEmpty(): void {
  const seeds: Record<string, Array<Record<string, any>>> = {
    services: SERVICES_SEED,
    testimonials: TESTIMONIALS_SEED,
    team: TEAM_SEED,
    faqs: FAQS_SEED,
    blog: BLOG_SEED,
    clients: CLIENTS_SEED,
  }
  for (const [name, items] of Object.entries(seeds)) {
    const existing = collection(name)
    if (existing.length > 0) continue
    const seeded = items.map((item, i) => ({
      ...item,
      displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : i,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    }))
    saveCollection(name, seeded)
  }
}

export function get<T = any>(name: string): T {
  const items = collection(name)
  return items[0] as T
}

export function getAll<T = any>(name: string): T[] {
  return collection(name)
}

export function getById<T = any>(name: string, id: string): T | undefined {
  return collection(name).find((item: any) => item.id === id) as T | undefined
}

export function create(name: string, data: any): any {
  const items = collection(name)
  const item = { ...data, id: generateId(), createdAt: now(), updatedAt: now() }
  items.push(item)
  saveCollection(name, items)
  return item
}

export function update(name: string, id: string, data: any): any | undefined {
  const items = collection(name)
  const idx = items.findIndex((item: any) => item.id === id)
  if (idx === -1) return undefined
  items[idx] = { ...items[idx], ...data, updatedAt: now() }
  saveCollection(name, items)
  return items[idx]
}

export function updateSingle(name: string, data: any): any {
  saveCollection(name, [data])
  return data
}

export function deleteEntry(name: string, id: string): void {
  saveCollection(name, collection(name).filter((item: any) => item.id !== id))
}

export function remove(name: string, id: string): boolean {
  const items = collection(name)
  const filtered = items.filter((item: any) => item.id !== id)
  if (filtered.length === items.length) return false
  saveCollection(name, filtered)
  return true
}

export function getHomepageSections(): HomepageSection[] {
  return collection('homepageSections')
}

export function saveHomepageSections(sections: HomepageSection[]): void {
  saveCollection('homepageSections', sections)
}

export function getSetting(key: string): any {
  const settings = collection('settings') as Setting[]
  return settings.find(s => s.key === key)?.value
}

export function setSetting(key: string, value: any): void {
  const settings = collection('settings') as Setting[]
  const idx = settings.findIndex(s => s.key === key)
  if (idx >= 0) settings[idx].value = value
  else settings.push({ key, value })
  saveCollection('settings', settings)
}

export function getMediaUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return path
}

// Page & Section Data
import { pageRegistry, getDefaultSectionContent, type SectionType, type PageRegistration } from './pageRegistry'

export interface PageData {
  route: string
  slug: string
  name: string
  sections: Record<string, any>
  seo: { title: string; description: string; keywords: string; ogImage: string; canonicalUrl: string; schema: string }
  status: 'published' | 'draft'
  updatedAt: string
  revisions: { data: string; timestamp: string; label: string }[]
}

export interface SectionInstance {
  id: string
  type: string
  data: Record<string, any>
}

export type PageSections = SectionInstance[]

function makeSectionId(): string {
  return 'sec_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getPageSections(route: string): PageSections {
  const page = getAll<PageData>('pageData').find((p: PageData) => p.route === route)
  if (!page?.sections) return []
  const sections = page.sections
  if (Array.isArray(sections)) return sections as PageSections
  const legacy = sections as Record<string, any>
  const registry = pageRegistry.find((p) => p.route === route)
  const types = registry?.sections.map((s) => s.type) ?? Object.keys(legacy)
  return types
    .filter((t) => legacy[t] !== undefined)
    .map((t) => ({ id: makeSectionId(), type: t, data: legacy[t] }))
}

export function initAllPages(): void {
  const existing = getAll<PageData>('pageData')
  for (const reg of pageRegistry) {
    if (!existing.find((p: PageData) => p.route === reg.route)) {
      const sections: SectionInstance[] = []
      for (const sec of reg.sections) {
        sections.push({
          id: makeSectionId(),
          type: sec.type,
          data: getDefaultSectionContent(sec.type),
        })
      }
      const pageData: PageData = {
        route: reg.route,
        slug: reg.slug,
        name: reg.name,
        sections,
        seo: { title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '', schema: '' },
        status: 'published',
        updatedAt: now(),
        revisions: [],
      }
      existing.push(pageData)
    }
  }
  saveCollection('pageData', existing)
}

export function getPageData(route: string): PageData | undefined {
  return getAll<PageData>('pageData').find((p: PageData) => p.route === route)
}

export function savePageSections(route: string, sections: PageSections): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  all[idx].sections = sections as unknown as Record<string, any>
  all[idx].updatedAt = now()
  saveCollection('pageData', all)
}

export function listTemplates(): { id: string; name: string; route: string; sections: PageSections; createdAt: string }[] {
  return getAll('templates')
}

export function saveTemplate(name: string, route: string, sections: PageSections): any {
  return create('templates', { name, route, sections })
}

export function savePageSEO(route: string, seo: PageData['seo']): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  all[idx].seo = seo
  all[idx].updatedAt = now()
  saveCollection('pageData', all)
}

export function savePageStatus(route: string, status: 'published' | 'draft'): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  all[idx].status = status
  all[idx].updatedAt = now()
  saveCollection('pageData', all)
}

export function addRevision(route: string, label: string): void {
  const all = getAll<PageData>('pageData')
  const idx = all.findIndex((p: PageData) => p.route === route)
  if (idx === -1) return
  const rev = { data: JSON.stringify(all[idx].sections), timestamp: now(), label }
  all[idx].revisions.unshift(rev)
  if (all[idx].revisions.length > 20) all[idx].revisions.length = 20
  saveCollection('pageData', all)
}

export function getAllPageData(): PageData[] {
  return getAll<PageData>('pageData')
}

export function duplicatePageData(route: string): boolean {
  const all = getAll<PageData>('pageData')
  const src = all.find((p: PageData) => p.route === route)
  if (!src) return false
  const dup: PageData = {
    ...src,
    route: route + '-copy',
    slug: src.slug + '-copy',
    name: src.name + ' (Copy)',
    revisions: [],
    updatedAt: now(),
  }
  all.push(dup)
  saveCollection('pageData', all)
  return true
}
