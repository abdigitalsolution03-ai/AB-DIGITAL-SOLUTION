export type SectionType =
  | 'hero' | 'services' | 'testimonials' | 'faq' | 'about' | 'team'
  | 'pricing' | 'process' | 'stats' | 'gallery' | 'cta' | 'features'
  | 'why-choose-us' | 'awards' | 'portfolio' | 'clients' | 'newsletter'
  | 'content' | 'custom-html' | 'contact-form' | 'header' | 'footer'
  | 'blog-posts' | 'careers' | 'case-studies'

export interface SectionField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'color' | 'number' | 'boolean' | 'select' | 'repeater' | 'link'
  options?: { label: string; value: string }[]
  fields?: SectionField[]
  default?: any
  placeholder?: string
}

export interface SectionDefinition {
  type: SectionType
  name: string
  description: string
  fields: SectionField[]
  icon?: string
}

export interface PageRegistration {
  name: string
  slug: string
  route: string
  description: string
  icon?: string
  sections: PageSection[]
}

export interface PageSection {
  type: SectionType
  name: string
  required?: boolean
}

export const sectionDefinitions: Record<SectionType, SectionDefinition> = {
  hero: {
    type: 'hero', name: 'Hero', description: 'Main hero banner with title, subtitle, CTAs',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', default: 'Welcome', placeholder: 'Main heading' },
      { key: 'subtitle', label: 'Subheading', type: 'text', default: '', placeholder: 'Subtitle badge text' },
      { key: 'description', label: 'Description', type: 'textarea', default: '', placeholder: 'Description paragraph' },
      { key: 'ctaText', label: 'Primary Button Text', type: 'text', default: 'Get Started' },
      { key: 'ctaUrl', label: 'Primary Button URL', type: 'text', default: '/contact' },
      { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text', default: '' },
      { key: 'secondaryCtaUrl', label: 'Secondary Button URL', type: 'text', default: '' },
      { key: 'image', label: 'Hero Image', type: 'image', default: '' },
      { key: 'background', label: 'Background Style', type: 'select', default: 'gradient', options: [{ label: 'Gradient Dark', value: 'gradient' }, { label: 'Solid Dark', value: 'solid' }, { label: 'Light', value: 'light' }] },
    ],
  },
  services: {
    type: 'services', name: 'Services', description: 'Service cards with features and pricing',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Our Services' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text', default: '' },
      { key: 'items', label: 'Service Items', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Service Name', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon (emoji)', type: 'text' },
        { key: 'features', label: 'Features (one per line)', type: 'textarea' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'slug', label: 'URL Slug', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
      ]},
    ],
  },
  testimonials: {
    type: 'testimonials', name: 'Testimonials', description: 'Client testimonials with ratings',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'What Our Clients Say' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'items', label: 'Testimonials', type: 'repeater', default: [], fields: [
        { key: 'name', label: 'Client Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'content', label: 'Review Text', type: 'textarea' },
        { key: 'avatar', label: 'Photo URL', type: 'image' },
        { key: 'rating', label: 'Rating', type: 'number', default: 5 },
      ]},
    ],
  },
  faq: {
    type: 'faq', name: 'FAQ', description: 'Frequently asked questions accordion',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'FAQ' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'items', label: 'Questions', type: 'repeater', default: [], fields: [
        { key: 'question', label: 'Question', type: 'text' },
        { key: 'answer', label: 'Answer', type: 'textarea' },
        { key: 'category', label: 'Category', type: 'text' },
      ]},
    ],
  },
  about: {
    type: 'about', name: 'About', description: 'About section with text and stats',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', default: 'About Us' },
      { key: 'subtitle', label: 'Subheading', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'stats', label: 'Statistics', type: 'repeater', default: [], fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'value', label: 'Value', type: 'text' },
      ]},
    ],
  },
  team: {
    type: 'team', name: 'Team', description: 'Team members grid',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Our Team' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'items', label: 'Team Members', type: 'repeater', default: [], fields: [
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'bio', label: 'Bio', type: 'textarea' },
        { key: 'image', label: 'Photo URL', type: 'image' },
        { key: 'socialLinks', label: 'Social Links (platform:url per line)', type: 'textarea' },
      ]},
    ],
  },
  pricing: {
    type: 'pricing', name: 'Pricing', description: 'Pricing plans comparison',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Pricing Plans' },
      { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'plans', label: 'Plans', type: 'repeater', default: [], fields: [
        { key: 'name', label: 'Plan Name', type: 'text' },
        { key: 'price', label: 'Price', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'features', label: 'Features (one per line)', type: 'textarea' },
        { key: 'cta', label: 'Button Text', type: 'text', default: 'Get Started' },
        { key: 'popular', label: 'Popular?', type: 'boolean', default: false },
      ]},
    ],
  },
  process: {
    type: 'process', name: 'Process', description: 'Step-by-step process',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'How We Work' },
      { key: 'steps', label: 'Steps', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Step Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon', type: 'text' },
      ]},
    ],
  },
  stats: {
    type: 'stats', name: 'Statistics', description: 'Number counters row',
    fields: [
      { key: 'items', label: 'Stats', type: 'repeater', default: [], fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'value', label: 'Value', type: 'text' },
        { key: 'suffix', label: 'Suffix', type: 'text', default: '+' },
      ]},
    ],
  },
  gallery: {
    type: 'gallery', name: 'Gallery', description: 'Image gallery grid',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Gallery' },
      { key: 'items', label: 'Images', type: 'repeater', default: [], fields: [
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'title', label: 'Caption', type: 'text' },
      ]},
    ],
  },
  cta: {
    type: 'cta', name: 'CTA Banner', description: 'Call to action banner',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', default: 'Ready to Get Started?' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text', default: 'Contact Us' },
      { key: 'buttonUrl', label: 'Button URL', type: 'text', default: '/contact' },
      { key: 'background', label: 'Background Image', type: 'image' },
    ],
  },
  features: {
    type: 'features', name: 'Features', description: 'Feature cards grid',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Why Choose Us' },
      { key: 'items', label: 'Features', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Feature Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon (emoji)', type: 'text' },
      ]},
    ],
  },
  'why-choose-us': {
    type: 'why-choose-us', name: 'Why Choose Us', description: 'Reasons to choose you',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Why Choose Us' },
      { key: 'items', label: 'Reasons', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon (emoji)', type: 'text' },
      ]},
    ],
  },
  awards: {
    type: 'awards', name: 'Awards', description: 'Awards and recognition',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Awards & Recognition' },
      { key: 'items', label: 'Awards', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Award Name', type: 'text' },
        { key: 'year', label: 'Year', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image', label: 'Image', type: 'image' },
      ]},
    ],
  },
  portfolio: {
    type: 'portfolio', name: 'Portfolio', description: 'Portfolio/gallery items',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Our Work' },
      { key: 'items', label: 'Portfolio Items', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'image', label: 'Image URL', type: 'image' },
        { key: 'url', label: 'Project URL', type: 'text' },
      ]},
    ],
  },
  clients: {
    type: 'clients', name: 'Clients', description: 'Client logo row',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Our Clients' },
      { key: 'items', label: 'Client Logos', type: 'repeater', default: [], fields: [
        { key: 'name', label: 'Client Name', type: 'text' },
        { key: 'logo', label: 'Logo URL', type: 'image' },
      ]},
    ],
  },
  newsletter: {
    type: 'newsletter', name: 'Newsletter', description: 'Email subscription form',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', default: 'Stay Updated' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'buttonText', label: 'Button Text', type: 'text', default: 'Subscribe' },
      { key: 'background', label: 'Background Color', type: 'color', default: '#3B82F6' },
    ],
  },
  content: {
    type: 'content', name: 'Content Block', description: 'Free HTML content',
    fields: [
      { key: 'html', label: 'HTML Content', type: 'richtext', default: '' },
    ],
  },
  'custom-html': {
    type: 'custom-html', name: 'Custom HTML', description: 'Raw HTML/JS/CSS',
    fields: [
      { key: 'html', label: 'Custom Code', type: 'textarea', default: '' },
    ],
  },
  'contact-form': {
    type: 'contact-form', name: 'Contact Form', description: 'Contact form with fields',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', default: 'Get In Touch' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'recipientEmail', label: 'Send Enquiries To', type: 'text', default: '' },
      { key: 'fields', label: 'Form Fields', type: 'repeater', default: [], fields: [
        { key: 'label', label: 'Field Label', type: 'text' },
        { key: 'type', label: 'Field Type', type: 'select', options: [{ label: 'Text', value: 'text' }, { label: 'Email', value: 'email' }, { label: 'Phone', value: 'tel' }, { label: 'Textarea', value: 'textarea' }] },
        { key: 'required', label: 'Required', type: 'boolean', default: false },
      ]},
    ],
  },
  header: {
    type: 'header', name: 'Header', description: 'Site header with navigation',
    fields: [
      { key: 'logo', label: 'Logo URL', type: 'image' },
      { key: 'logoAlt', label: 'Logo Alt Text', type: 'text' },
      { key: 'sticky', label: 'Sticky Header', type: 'boolean', default: true },
      { key: 'ctaText', label: 'CTA Button Text', type: 'text' },
      { key: 'ctaUrl', label: 'CTA Button URL', type: 'text' },
      { key: 'navItems', label: 'Navigation Items', type: 'repeater', default: [], fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' },
      ]},
      { key: 'announcementBar', label: 'Announcement Bar', type: 'repeater', default: [], fields: [
        { key: 'enabled', label: 'Enabled', type: 'boolean' },
        { key: 'text', label: 'Text', type: 'text' },
        { key: 'url', label: 'Link URL', type: 'text' },
      ]},
    ],
  },
  footer: {
    type: 'footer', name: 'Footer', description: 'Site footer with links and info',
    fields: [
      { key: 'logo', label: 'Footer Logo URL', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'copyright', label: 'Copyright Text', type: 'text', default: '© All rights reserved.' },
      { key: 'columns', label: 'Footer Columns', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Column Title', type: 'text' },
        { key: 'links', label: 'Links (label:url per line)', type: 'textarea' },
      ]},
      { key: 'socialLinks', label: 'Social Links (platform:url per line)', type: 'textarea' },
      { key: 'contact', label: 'Contact Info', type: 'repeater', default: [], fields: [
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
      ]},
    ],
  },
  'blog-posts': {
    type: 'blog-posts', name: 'Blog Posts', description: 'Blog listing with posts from CMS',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Latest Posts' },
      { key: 'itemsPerPage', label: 'Posts Per Page', type: 'number', default: 9 },
    ],
  },
  careers: {
    type: 'careers', name: 'Careers', description: 'Job listings',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Join Our Team' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'jobs', label: 'Job Openings', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Job Title', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'type', label: 'Type', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'requirements', label: 'Requirements (one per line)', type: 'textarea' },
      ]},
    ],
  },
  'case-studies': {
    type: 'case-studies', name: 'Case Studies', description: 'Case study cards',
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', default: 'Case Studies' },
      { key: 'items', label: 'Studies', type: 'repeater', default: [], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'client', label: 'Client', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image', label: 'Image', type: 'image' },
        { key: 'results', label: 'Results', type: 'textarea' },
      ]},
    ],
  },
}

export const pageRegistry: PageRegistration[] = [
  {
    name: 'Home', slug: '', route: '/', description: 'Landing page',
    sections: [
      { type: 'hero', name: 'Hero Section' },
      { type: 'stats', name: 'Statistics' },
      { type: 'services', name: 'Services' },
      { type: 'about', name: 'About' },
      { type: 'process', name: 'Process' },
      { type: 'features', name: 'Features / Why Choose Us' },
      { type: 'portfolio', name: 'Portfolio' },
      { type: 'testimonials', name: 'Testimonials' },
      { type: 'pricing', name: 'Pricing' },
      { type: 'faq', name: 'FAQ' },
      { type: 'newsletter', name: 'Newsletter' },
      { type: 'contact-form', name: 'Contact Form' },
    ],
  },
  {
    name: 'About', slug: 'about', route: '/about', description: 'About us page',
    sections: [
      { type: 'about', name: 'About Content' },
      { type: 'stats', name: 'Statistics' },
      { type: 'team', name: 'Team Members' },
      { type: 'process', name: 'Our Process' },
      { type: 'cta', name: 'CTA Section' },
    ],
  },
  {
    name: 'Services', slug: 'services', route: '/services', description: 'Services listing',
    sections: [
      { type: 'services', name: 'All Services' },
      { type: 'process', name: 'Our Process' },
      { type: 'faq', name: 'FAQ' },
      { type: 'cta', name: 'CTA' },
    ],
  },
  {
    name: 'Portfolio', slug: 'portfolio', route: '/portfolio', description: 'Portfolio showcase',
    sections: [
      { type: 'portfolio', name: 'Portfolio Items' },
      { type: 'cta', name: 'CTA' },
    ],
  },
  {
    name: 'Blog', slug: 'blog', route: '/blog', description: 'Blog listing',
    sections: [
      { type: 'blog-posts', name: 'Blog Posts' },
    ],
  },
  {
    name: 'Testimonials', slug: 'testimonials', route: '/testimonials', description: 'Client testimonials',
    sections: [
      { type: 'testimonials', name: 'All Testimonials' },
      { type: 'cta', name: 'CTA' },
    ],
  },
  {
    name: 'FAQ', slug: 'faq', route: '/faq', description: 'Frequently asked questions',
    sections: [
      { type: 'faq', name: 'All FAQs' },
    ],
  },
  {
    name: 'Contact', slug: 'contact', route: '/contact', description: 'Contact page',
    sections: [
      { type: 'contact-form', name: 'Contact Form' },
    ],
  },
  {
    name: 'Team', slug: 'team', route: '/team', description: 'Team members page',
    sections: [
      { type: 'team', name: 'All Team Members' },
      { type: 'cta', name: 'Join Us CTA' },
    ],
  },
  {
    name: 'Case Studies', slug: 'case-studies', route: '/case-studies', description: 'Case studies',
    sections: [
      { type: 'case-studies', name: 'Case Studies' },
    ],
  },
  {
    name: 'Clients', slug: 'clients', route: '/clients', description: 'Client logos',
    sections: [
      { type: 'clients', name: 'Our Clients' },
    ],
  },
  {
    name: 'Awards', slug: 'awards', route: '/awards', description: 'Awards & recognition',
    sections: [
      { type: 'awards', name: 'Awards' },
    ],
  },
  {
    name: 'Careers', slug: 'careers', route: '/careers', description: 'Job listings',
    sections: [
      { type: 'careers', name: 'Job Openings' },
    ],
  },
  {
    name: 'Privacy Policy', slug: 'privacy-policy', route: '/privacy-policy', description: 'Privacy policy',
    sections: [
      { type: 'content', name: 'Page Content' },
    ],
  },
  {
    name: 'Terms & Conditions', slug: 'terms', route: '/terms', description: 'Terms and conditions',
    sections: [
      { type: 'content', name: 'Page Content' },
    ],
  },
  {
    name: 'Refund Policy', slug: 'refund-policy', route: '/refund-policy', description: 'Refund policy page',
    sections: [
      { type: 'content', name: 'Page Content' },
    ],
  },
  {
    name: 'Shipping Policy', slug: 'shipping-policy', route: '/shipping-policy', description: 'Shipping policy page',
    sections: [
      { type: 'content', name: 'Page Content' },
    ],
  },
  {
    name: 'Landing Page', slug: 'landing', route: '/landing', description: 'Marketing landing page',
    sections: [
      { type: 'hero', name: 'Hero' },
      { type: 'features', name: 'Features' },
      { type: 'cta', name: 'Call to Action' },
      { type: 'contact-form', name: 'Contact Form' },
    ],
  },
]

export function getPageByRoute(route: string): PageRegistration | undefined {
  return pageRegistry.find(p => p.route === route)
}

export function getPageBySlug(slug: string): PageRegistration | undefined {
  return pageRegistry.find(p => p.slug === slug)
}

export function getSectionDefinition(type: SectionType): SectionDefinition {
  return sectionDefinitions[type]
}

export function getDefaultSectionContent(type: SectionType): Record<string, any> {
  const def = sectionDefinitions[type]
  const result: Record<string, any> = {}
  for (const field of def.fields) {
    if (field.type === 'repeater') {
      result[field.key] = field.default || []
    } else {
      result[field.key] = field.default ?? ''
    }
  }
  return result
}
