export type FieldType = 
  | 'text' | 'textarea' | 'richtext' | 'image' | 'gallery' | 'color' 
  | 'number' | 'boolean' | 'select' | 'multiselect' | 'repeater' | 'link'
  | 'email' | 'tel' | 'url' | 'slug' | 'date' | 'time' | 'code' | 'icon'

export interface SchemaField {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  defaultValue?: any
  options?: { label: string; value: string }[]
  fields?: SchemaField[]
  validation?: { required?: boolean; min?: number; max?: number; pattern?: string }
  group?: string
  description?: string
}

export interface SchemaDefinition {
  name: string
  label: string
  description: string
  icon: string
  single?: boolean
  fields: SchemaField[]
  groups?: { key: string; label: string }[]
}

export const schemas: Record<string, SchemaDefinition> = {
  header: {
    name: 'header', label: 'Header', description: 'Site header with navigation, logo, announcement bar', icon: 'FiMenu',
    single: true,
    groups: [
      { key: 'logo', label: 'Logo & Branding' },
      { key: 'navigation', label: 'Navigation' },
      { key: 'announcement', label: 'Announcement Bar' },
      { key: 'cta', label: 'CTA Button' },
      { key: 'settings', label: 'Settings' },
    ],
    fields: [
      { key: 'logo', label: 'Logo Image', type: 'image', group: 'logo' },
      { key: 'logoAlt', label: 'Logo Alt Text', type: 'text', group: 'logo' },
      { key: 'logoWidth', label: 'Logo Width (px)', type: 'number', defaultValue: 140, group: 'logo' },
      { key: 'sticky', label: 'Sticky Header', type: 'boolean', defaultValue: true, group: 'settings' },
      { key: 'transparent', label: 'Transparent on Top', type: 'boolean', defaultValue: false, group: 'settings' },
      { key: 'navItems', label: 'Navigation Items', type: 'repeater', group: 'navigation', fields: [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' },
        { key: 'megaMenu', label: 'Mega Menu', type: 'boolean', defaultValue: false },
        { key: 'children', label: 'Dropdown Items', type: 'repeater', fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'url', label: 'URL', type: 'text' },
          { key: 'description', label: 'Description', type: 'text' },
          { key: 'icon', label: 'Icon', type: 'icon' },
        ]},
      ]},
      { key: 'ctaText', label: 'CTA Button Text', type: 'text', defaultValue: 'Get Started', group: 'cta' },
      { key: 'ctaUrl', label: 'CTA Button URL', type: 'text', defaultValue: '/contact', group: 'cta' },
      { key: 'announcementBarEnabled', label: 'Enable Announcement Bar', type: 'boolean', defaultValue: false, group: 'announcement' },
      { key: 'announcementText', label: 'Announcement Text', type: 'text', group: 'announcement' },
      { key: 'announcementUrl', label: 'Announcement Link URL', type: 'url', group: 'announcement' },
    ],
  },
  footer: {
    name: 'footer', label: 'Footer', description: 'Site footer with columns, links, social, copyright', icon: 'FiLayout',
    single: true,
    groups: [
      { key: 'branding', label: 'Branding & Description' },
      { key: 'columns', label: 'Footer Columns' },
      { key: 'social', label: 'Social Links' },
      { key: 'contact', label: 'Contact Info' },
      { key: 'bottom', label: 'Bottom Bar' },
    ],
    fields: [
      { key: 'logo', label: 'Footer Logo', type: 'image', group: 'branding' },
      { key: 'description', label: 'Description', type: 'textarea', group: 'branding' },
      { key: 'columns', label: 'Link Columns', type: 'repeater', group: 'columns', fields: [
        { key: 'title', label: 'Column Title', type: 'text' },
        { key: 'links', label: 'Links', type: 'repeater', fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'url', label: 'URL', type: 'text' },
        ]},
      ]},
      { key: 'socialLinks', label: 'Social Links', type: 'repeater', group: 'social', fields: [
        { key: 'platform', label: 'Platform', type: 'select', options: [
          { label: 'Facebook', value: 'facebook' },
          { label: 'Instagram', value: 'instagram' },
          { label: 'Twitter', value: 'twitter' },
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'YouTube', value: 'youtube' },
          { label: 'WhatsApp', value: 'whatsapp' },
        ]},
        { key: 'url', label: 'URL', type: 'url' },
      ]},
      { key: 'contactEmail', label: 'Email', type: 'email', group: 'contact' },
      { key: 'contactPhone', label: 'Phone', type: 'tel', group: 'contact' },
      { key: 'contactAddress', label: 'Address', type: 'textarea', group: 'contact' },
      { key: 'copyright', label: 'Copyright Text', type: 'text', defaultValue: '© 2025 All rights reserved.', group: 'bottom' },
      { key: 'paymentIcons', label: 'Payment Methods (one per line)', type: 'textarea', group: 'bottom' },
      { key: 'newsletterEnabled', label: 'Enable Newsletter Signup', type: 'boolean', defaultValue: true, group: 'bottom' },
    ],
  },
  hero: {
    name: 'hero', label: 'Hero Section', description: 'Main hero banner for the homepage', icon: 'FiLayout',
    single: true,
    fields: [
      { key: 'title', label: 'Heading', type: 'text', defaultValue: 'Welcome to AB Digital Solution' },
      { key: 'subtitle', label: 'Subtitle Badge', type: 'text', defaultValue: 'Your Digital Partner' },
      { key: 'description', label: 'Description', type: 'textarea', defaultValue: 'We help businesses grow with modern digital solutions.' },
      { key: 'image', label: 'Hero Image', type: 'image' },
      { key: 'backgroundType', label: 'Background Style', type: 'select', defaultValue: 'gradient', options: [
        { label: 'Gradient Dark', value: 'gradient' },
        { label: 'Solid Dark', value: 'solid' },
        { label: 'Light', value: 'light' },
        { label: 'Image Overlay', value: 'image' },
      ]},
      { key: 'backgroundImage', label: 'Background Image', type: 'image' },
      { key: 'ctaText', label: 'Primary Button Text', type: 'text', defaultValue: 'Get Started' },
      { key: 'ctaUrl', label: 'Primary Button URL', type: 'text', defaultValue: '/contact' },
      { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text', defaultValue: 'Learn More' },
      { key: 'secondaryCtaUrl', label: 'Secondary Button URL', type: 'text', defaultValue: '/about' },
    ],
  },
  seo: {
    name: 'seo', label: 'SEO Settings', description: 'Global SEO, analytics, verification codes', icon: 'FiTrendingUp',
    single: true,
    groups: [
      { key: 'global', label: 'Global Meta' },
      { key: 'analytics', label: 'Analytics & Verification' },
      { key: 'social', label: 'Social & OG' },
      { key: 'advanced', label: 'Advanced' },
    ],
    fields: [
      { key: 'globalTitle', label: 'Default Site Title', type: 'text', group: 'global' },
      { key: 'globalDescription', label: 'Default Meta Description', type: 'textarea', group: 'global' },
      { key: 'keywords', label: 'Default Keywords', type: 'text', group: 'global' },
      { key: 'ogImage', label: 'Default OG Image', type: 'image', group: 'social' },
      { key: 'twitterHandle', label: 'Twitter Handle', type: 'text', group: 'social' },
      { key: 'googleAnalytics', label: 'Google Analytics ID (G-...)', type: 'text', group: 'analytics' },
      { key: 'googleVerification', label: 'Google Search Console Verification', type: 'text', group: 'analytics' },
      { key: 'facebookPixel', label: 'Facebook Pixel ID', type: 'text', group: 'analytics' },
      { key: 'gtmId', label: 'Google Tag Manager ID', type: 'text', group: 'analytics' },
      { key: 'customHead', label: 'Custom Head Code', type: 'code', group: 'advanced' },
    ],
  },
  theme: {
    name: 'theme', label: 'Theme Customizer', description: 'Colors, fonts, animations, dark mode', icon: 'FiSliders',
    single: true,
    groups: [
      { key: 'colors', label: 'Colors' },
      { key: 'typography', label: 'Typography' },
      { key: 'layout', label: 'Layout & Style' },
      { key: 'advanced', label: 'Advanced' },
    ],
    fields: [
      { key: 'primaryColor', label: 'Primary Color', type: 'color', defaultValue: '#3B82F6', group: 'colors' },
      { key: 'secondaryColor', label: 'Secondary Color', type: 'color', defaultValue: '#1E293B', group: 'colors' },
      { key: 'accentColor', label: 'Accent Color', type: 'color', defaultValue: '#F59E0B', group: 'colors' },
      { key: 'bgColor', label: 'Background Color', type: 'color', defaultValue: '#FFFFFF', group: 'colors' },
      { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#111827', group: 'colors' },
      { key: 'fontHeading', label: 'Heading Font', type: 'select', defaultValue: 'Inter', group: 'typography', options: [
        { label: 'Inter', value: 'Inter' },
        { label: 'Poppins', value: 'Poppins' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Playfair Display', value: 'Playfair Display' },
      ]},
      { key: 'fontBody', label: 'Body Font', type: 'select', defaultValue: 'Inter', group: 'typography', options: [
        { label: 'Inter', value: 'Inter' },
        { label: 'Poppins', value: 'Poppins' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Open Sans', value: 'Open Sans' },
      ]},
      { key: 'borderRadius', label: 'Border Radius (px)', type: 'number', defaultValue: 8, group: 'layout' },
      { key: 'animationEnabled', label: 'Enable Animations', type: 'boolean', defaultValue: true, group: 'layout' },
      { key: 'darkModeEnabled', label: 'Enable Dark Mode', type: 'boolean', defaultValue: true, group: 'layout' },
      { key: 'containerWidth', label: 'Container Max Width (px)', type: 'number', defaultValue: 1280, group: 'layout' },
      { key: 'customCss', label: 'Custom CSS', type: 'code', group: 'advanced' },
    ],
  },
  branding: {
    name: 'branding', label: 'Branding', description: 'Company logos, favicon, name, contact', icon: 'FiPenTool',
    single: true,
    fields: [
      { key: 'companyName', label: 'Company Name', type: 'text', defaultValue: 'AB Digital Solution' },
      { key: 'logo', label: 'Light Logo', type: 'image' },
      { key: 'logoDark', label: 'Dark Logo', type: 'image' },
      { key: 'favicon', label: 'Favicon', type: 'image' },
      { key: 'email', label: 'Company Email', type: 'email' },
      { key: 'phone', label: 'Company Phone', type: 'tel' },
      { key: 'address', label: 'Company Address', type: 'textarea' },
    ],
  },
  services: {
    name: 'services', label: 'Services', description: 'Manage service offerings', icon: 'FiBriefcase',
    fields: [
      { key: 'title', label: 'Service Name', type: 'text', validation: { required: true } },
      { key: 'slug', label: 'URL Slug', type: 'slug', validation: { required: true } },
      { key: 'description', label: 'Short Description', type: 'textarea' },
      { key: 'longDescription', label: 'Detailed Description', type: 'richtext' },
      { key: 'icon', label: 'Icon (emoji or SVG path)', type: 'icon' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'price', label: 'Starting Price', type: 'text' },
      { key: 'features', label: 'Features (one per line)', type: 'textarea' },
      { key: 'benefits', label: 'Benefits (one per line)', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'select', options: [
        { label: 'Marketing', value: 'marketing' },
        { label: 'Advertising', value: 'advertising' },
        { label: 'Development', value: 'development' },
        { label: 'Creative', value: 'creative' },
      ]},
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  blog: {
    name: 'blog', label: 'Blog Posts', description: 'Manage blog articles', icon: 'FiEdit3',
    fields: [
      { key: 'title', label: 'Post Title', type: 'text', validation: { required: true } },
      { key: 'slug', label: 'URL Slug', type: 'slug', validation: { required: true } },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'content', label: 'Content', type: 'richtext' },
      { key: 'featuredImage', label: 'Featured Image', type: 'image' },
      { key: 'categories', label: 'Categories', type: 'multiselect', options: [
        { label: 'SEO', value: 'SEO' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Web Development', value: 'Web Development' },
        { label: 'Branding', value: 'Branding' },
        { label: 'Business', value: 'Business' },
      ]},
      { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
      { key: 'author', label: 'Author', type: 'text', defaultValue: 'Admin' },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
      ]},
      { key: 'scheduledAt', label: 'Schedule Date', type: 'date' },
      { key: 'allowComments', label: 'Allow Comments', type: 'boolean', defaultValue: true },
    ],
  },
  testimonials: {
    name: 'testimonials', label: 'Testimonials', description: 'Client testimonials and reviews', icon: 'FiStar',
    fields: [
      { key: 'name', label: 'Client Name', type: 'text', validation: { required: true } },
      { key: 'role', label: 'Position', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'content', label: 'Review Text', type: 'textarea', validation: { required: true } },
      { key: 'avatar', label: 'Photo', type: 'image' },
      { key: 'rating', label: 'Rating', type: 'number', defaultValue: 5 },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  faqs: {
    name: 'faqs', label: 'FAQ', description: 'Frequently asked questions', icon: 'FiHelpCircle',
    fields: [
      { key: 'question', label: 'Question', type: 'text', validation: { required: true } },
      { key: 'answer', label: 'Answer', type: 'richtext', validation: { required: true } },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'order', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  team: {
    name: 'team', label: 'Team Members', description: 'Manage team members', icon: 'FiUsers',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', validation: { required: true } },
      { key: 'role', label: 'Position', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'image', label: 'Photo', type: 'image' },
      { key: 'videoUrl', label: 'YouTube URL (optional)', type: 'url', placeholder: 'https://www.youtube.com/watch?v=…' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'socialLinks', label: 'Social Links (platform:url per line)', type: 'textarea' },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  portfolio: {
    name: 'portfolio', label: 'Portfolio', description: 'Portfolio projects and case studies', icon: 'FiImage',
    fields: [
      { key: 'title', label: 'Project Title', type: 'text', validation: { required: true } },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Main Image', type: 'image' },
      { key: 'gallery', label: 'Image Gallery', type: 'gallery' },
      { key: 'videoUrl', label: 'Video URL', type: 'url' },
      { key: 'clientName', label: 'Client Name', type: 'text' },
      { key: 'technologies', label: 'Technologies Used (one per line)', type: 'textarea' },
      { key: 'projectUrl', label: 'Live Project URL', type: 'url' },
      { key: 'results', label: 'Results', type: 'textarea' },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  careers: {
    name: 'careers', label: 'Careers', description: 'Job openings and positions', icon: 'FiBriefcase',
    fields: [
      { key: 'title', label: 'Job Title', type: 'text', validation: { required: true } },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'type', label: 'Employment Type', type: 'select', options: [
        { label: 'Full Time', value: 'Full Time' },
        { label: 'Part Time', value: 'Part Time' },
        { label: 'Contract', value: 'Contract' },
        { label: 'Remote', value: 'Remote' },
      ]},
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'description', label: 'Job Description', type: 'richtext' },
      { key: 'requirements', label: 'Requirements (one per line)', type: 'textarea' },
      { key: 'salary', label: 'Salary Range', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Closed', value: 'closed' },
      ]},
    ],
  },
  clients: {
    name: 'clients', label: 'Clients', description: 'Client logos and brands', icon: 'FiUsers',
    fields: [
      { key: 'name', label: 'Client Name', type: 'text', validation: { required: true } },
      { key: 'logo', label: 'Logo Image', type: 'image' },
      { key: 'website', label: 'Website URL', type: 'url' },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
    ],
  },
  awards: {
    name: 'awards', label: 'Awards', description: 'Awards and recognition', icon: 'FiAward',
    fields: [
      { key: 'title', label: 'Award Name', type: 'text', validation: { required: true } },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
    ],
  },
  media: {
    name: 'media', label: 'Media Library', description: 'Upload and manage files', icon: 'FiImage',
    fields: [
      { key: 'name', label: 'File Name', type: 'text' },
      { key: 'url', label: 'URL', type: 'text' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
      { key: 'folder', label: 'Folder', type: 'text' },
    ],
  },
  popups: {
    name: 'popups', label: 'Popups', description: 'Popup notifications and modals', icon: 'FiLayers',
    fields: [
      { key: 'title', label: 'Popup Title', type: 'text' },
      { key: 'content', label: 'Content', type: 'richtext' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonUrl', label: 'Button URL', type: 'url' },
      { key: 'displayOn', label: 'Display On', type: 'select', defaultValue: 'all', options: [
        { label: 'All Pages', value: 'all' },
        { label: 'Home Page', value: 'home' },
        { label: 'Specific Pages', value: 'specific' },
      ]},
      { key: 'trigger', label: 'Trigger', type: 'select', defaultValue: 'immediate', options: [
        { label: 'Immediate', value: 'immediate' },
        { label: 'After 5 Seconds', value: '5s' },
        { label: 'After 10 Seconds', value: '10s' },
        { label: 'On Exit', value: 'exit' },
        { label: 'On Scroll 50%', value: 'scroll50' },
      ]},
      { key: 'frequency', label: 'Frequency', type: 'select', defaultValue: 'once', options: [
        { label: 'Once Per Session', value: 'once' },
        { label: 'Every Visit', value: 'always' },
        { label: 'Once', value: 'once_only' },
      ]},
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  banners: {
    name: 'banners', label: 'Banners', description: 'Promotional banners and announcements', icon: 'FiImage',
    fields: [
      { key: 'title', label: 'Banner Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
      { key: 'buttonUrl', label: 'Button URL', type: 'url' },
      { key: 'position', label: 'Position', type: 'select', defaultValue: 'top', options: [
        { label: 'Top Banner', value: 'top' },
        { label: 'Bottom Banner', value: 'bottom' },
        { label: 'Between Content', value: 'middle' },
        { label: 'Sidebar', value: 'sidebar' },
      ]},
      { key: 'pages', label: 'Show on Pages', type: 'multiselect' },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  enquiries: {
    name: 'enquiries', label: 'Enquiries', description: 'Contact form submissions', icon: 'FiMessageSquare',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'service', label: 'Service', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' },
      { key: 'read', label: 'Read', type: 'boolean', defaultValue: false },
    ],
  },
  subscribers: {
    name: 'subscribers', label: 'Subscribers', description: 'Newsletter email subscribers', icon: 'FiMail',
    fields: [
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'subscribedAt', label: 'Subscribed At', type: 'date' },
      { key: 'active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
  gallery: {
    name: 'gallery', label: 'Gallery', description: 'Photo gallery images shown on the website', icon: 'FiImage',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Photo', type: 'image', validation: { required: true } },
      { key: 'link', label: 'Link (optional)', type: 'url' },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
  videos: {
    name: 'videos', label: 'YouTube Videos', description: 'YouTube videos shown in a gallery on the website', icon: 'FiYoutube',
    fields: [
      { key: 'title', label: 'Video Title', type: 'text', validation: { required: true } },
      { key: 'videoUrl', label: 'YouTube URL', type: 'url', placeholder: 'https://www.youtube.com/watch?v=…' },
      { key: 'image', label: 'Cover / Thumbnail', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'displayOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
      { key: 'status', label: 'Status', type: 'select', defaultValue: 'published', options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ]},
    ],
  },
}

export function getSchema(name: string): SchemaDefinition | undefined {
  return schemas[name]
}

export function getSchemaDefaults(name: string): Record<string, any> {
  const schema = schemas[name]
  if (!schema) return {}
  const result: Record<string, any> = {}
  const walk = (fields: SchemaField[]) => {
    for (const field of fields) {
      if (field.type === 'repeater') {
        result[field.key] = field.defaultValue || []
        if (field.fields) walk(field.fields)
      } else {
        result[field.key] = field.defaultValue ?? ''
      }
    }
  }
  walk(schema.fields)
  return result
}
