export function seedAdminData() {
  const services = [
    { title: 'Website Development', description: 'Custom, responsive websites built with modern tech stacks that drive conversions and deliver exceptional user experiences.', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { title: 'SEO', description: 'Data-driven SEO strategies that boost your organic rankings, increase visibility, and drive qualified traffic to your site.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Google Ads', description: 'High-ROI Google Ads campaigns optimized for conversions, with precise targeting and continuous performance refinement.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Meta Ads', description: 'Social media advertising on Facebook & Instagram that reaches your ideal audience with compelling creative and messaging.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { title: 'Social Media Marketing', description: 'Strategic social media management that builds brand awareness, engages communities, and drives measurable business growth.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { title: 'Content Marketing', description: 'Compelling content that tells your brand story, educates your audience, and establishes your authority in the industry.', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { title: 'Branding', description: 'Complete brand identity design from logo to concepts, creating a cohesive and memorable presence that sets you apart.', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    { title: 'AI Automation', description: 'Intelligent automation solutions powered by AI to streamline operations, reduce costs, and scale your business efficiently.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { title: 'Lead Generation', description: 'Multi-channel lead generation campaigns that fill your pipeline with high-quality prospects ready to convert.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  ]

  if (!localStorage.getItem('adminServices') || JSON.parse(localStorage.getItem('adminServices')!).length === 0) {
    const seeded = services.map((s, i) => ({ id: Date.now().toString() + i, ...s, order: i }))
    localStorage.setItem('adminServices', JSON.stringify(seeded))
  }

  const testimonials = [
    { name: 'Sarah Mitchell', role: 'CEO, TechVista Inc.', content: 'AB DIGITAL SOLUTION transformed our online presence. Our traffic increased by 300% within three months. Their strategic approach and attention to detail are unmatched.', rating: 5 },
    { name: 'James Chen', role: 'Founder, GrowthLabs', content: 'The team at AB DIGITAL SOLUTION delivered beyond our expectations. Our conversion rate doubled, and the ROI on our ad spend has been remarkable.', rating: 5 },
    { name: 'Emma Richards', role: 'Marketing Director, StyleHub', content: 'Working with AB DIGITAL SOLUTION has been a game-changer. Their branding work gave us a completely new identity that resonates perfectly with our audience.', rating: 5 },
    { name: 'David Park', role: 'CTO, CloudSync', content: 'From SEO to web development, every service has been top-notch. They truly understand digital strategy and execute flawlessly. Highly recommended.', rating: 5 },
    { name: 'Lisa Thompson', role: 'Owner, BoutiqueLiving', content: 'The Google Ads campaign they managed for us generated a 400% ROI in the first month alone. Their expertise in paid advertising is exceptional.', rating: 5 },
  ]
  if (!localStorage.getItem('adminTestimonials') || JSON.parse(localStorage.getItem('adminTestimonials')!).length === 0) {
    localStorage.setItem('adminTestimonials', JSON.stringify(testimonials.map((t, i) => ({ id: Date.now().toString() + i, ...t }))))
  }

  const faqs = [
    { q: 'What services does AB DIGITAL SOLUTION offer?', a: 'We offer a comprehensive range of digital marketing and web development services including Website Development, SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, Branding, AI Automation, and Lead Generation.' },
    { q: 'How long does it take to see results?', a: 'Timelines vary by service. SEO typically shows significant results within 3-6 months, while paid advertising can deliver immediate traffic and leads. Web development projects usually take 4-8 weeks depending on complexity.' },
    { q: 'Do you work with small businesses?', a: 'Absolutely! We work with businesses of all sizes, from startups to established enterprises. Our Starter package is specifically designed for small businesses looking to establish their digital presence.' },
    { q: 'What industries do you specialize in?', a: 'We have experience across a wide range of industries including e-commerce, SaaS, healthcare, real estate, finance, education, and professional services. Our strategies are tailored to your specific industry and target audience.' },
    { q: 'How do you measure success?', a: 'We use data-driven KPIs tailored to your goals including traffic, rankings, conversion rates, ROAS, lead quality, and revenue growth. You\'ll receive detailed monthly reports with actionable insights.' },
    { q: 'Can I customize my package?', a: 'Yes! Every business is unique. We offer fully customizable solutions. Contact us for a personalized quote tailored to your specific needs, goals, and budget.' },
  ]
  if (!localStorage.getItem('adminFAQs') || JSON.parse(localStorage.getItem('adminFAQs')!).length === 0) {
    localStorage.setItem('adminFAQs', JSON.stringify(faqs.map((f, i) => ({ id: Date.now().toString() + i, question: f.q, answer: f.a }))))
  }

  const projects = [
    { title: 'E-Commerce Platform', category: 'Website', description: 'Next-gen online store with seamless checkout experience', color: 'from-amber-200 to-yellow-400' },
    { title: 'Local SEO Campaign', category: 'SEO', description: 'Top 3 rankings across 50+ local search terms', color: 'from-yellow-300 to-amber-500' },
    { title: 'Google Ads Optimization', category: 'Ads', description: '3.5x ROAS improvement through smart bidding', color: 'from-amber-300 to-yellow-400' },
    { title: 'Brand Identity Design', category: 'Branding', description: 'Complete brand overhaul for a fintech startup', color: 'from-yellow-200 to-amber-400' },
    { title: 'SaaS Dashboard', category: 'Website', description: 'Interactive analytics dashboard with real-time data', color: 'from-amber-200 to-yellow-500' },
    { title: 'Meta Ads Campaign', category: 'Ads', description: 'Scaled revenue 4x with targeted social advertising', color: 'from-yellow-300 to-amber-400' },
  ]
  if (!localStorage.getItem('adminPortfolio') || JSON.parse(localStorage.getItem('adminPortfolio')!).length === 0) {
    localStorage.setItem('adminPortfolio', JSON.stringify(projects.map((p, i) => ({ id: Date.now().toString() + i, ...p, image: '' }))))
  }
}
