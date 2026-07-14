import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface ServiceData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: JSX.Element;
  benefits: string[];
  process: { step: string; description: string }[];
  results: string[];
}

const servicesData: Record<string, ServiceData> = {
  "seo": {
    id: "seo", title: "SEO", description: "Data-driven SEO strategies that boost your organic rankings, increase visibility, and drive qualified traffic to your site.",
    longDescription: "Our SEO service combines technical expertise, strategic content creation, and authoritative link building to propel your website to the top of search results. We use advanced analytics and AI-powered tools to identify opportunities and optimize every aspect of your online presence.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    benefits: ["Increased organic traffic", "Higher search engine rankings", "Improved user experience", "Long-term sustainable growth", "Better conversion rates", "Enhanced brand credibility"],
    process: [
      { step: "Audit & Analysis", description: "Comprehensive technical and content audit of your current website." },
      { step: "Strategy Development", description: "Custom SEO strategy aligned with your business goals." },
      { step: "On-Page Optimization", description: "Optimizing meta tags, content, and site structure." },
      { step: "Technical SEO", description: "Improving site speed, mobile-friendliness, and crawlability." },
      { step: "Link Building", description: "Building high-quality backlinks to boost authority." },
      { step: "Monitoring & Reporting", description: "Continuous tracking and monthly performance reports." },
    ],
    results: ["3x organic traffic increase in 6 months", "Top 3 rankings for 50+ keywords", "200% ROI within the first quarter"]},
  "google-ads": {
    id: "google-ads", title: "Google Ads", description: "High-ROI Google Ads campaigns optimized for conversions, with precise targeting and continuous performance refinement.",
    longDescription: "We design, launch, and manage Google Ads campaigns that deliver measurable results. From keyword research to ad copy creation and bid optimization, every element is fine-tuned to maximize your return on ad spend.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="18" r="2" /><circle cx="16" cy="16" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="18" cy="9" r="2" /><circle cx="12" cy="5" r="2" /></svg>,
    benefits: ["Immediate traffic generation", "Precise audience targeting", "Full budget control", "Measurable ROI tracking", "Fast campaign adjustments", "Multi-channel reach"],
    process: [
      { step: "Research & Planning", description: "In-depth keyword and competitor research." },
      { step: "Campaign Setup", description: "Structuring campaigns, ad groups, and ad copy." },
      { step: "Optimization", description: "A/B testing ads, landing pages, and bidding strategies." },
      { step: "Monitoring", description: "Real-time performance tracking and adjustments." },
      { step: "Reporting", description: "Detailed monthly reports with actionable insights." },
    ],
    results: ["4.5x average ROAS", "60% reduction in CPA", "300% increase in qualified leads"]},
  "meta-ads": {
    id: "meta-ads", title: "Meta Ads", description: "Social media advertising on Facebook & Instagram that reaches your ideal audience with compelling creative and messaging.",
    longDescription: "Unlock the full potential of Facebook and Instagram advertising with our Meta Ads service. We create visually stunning ad campaigns that resonate with your target audience and drive meaningful engagement.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
    benefits: ["Advanced audience targeting", "Visual ad formats", "Social proof integration", "Retargeting capabilities", "Cross-platform reach", "Real-time engagement"],
    process: [
      { step: "Audience Research", description: "Identifying and segmenting target audiences." },
      { step: "Creative Development", description: "Designing compelling ad creatives and copy." },
      { step: "Campaign Launch", description: "Setting up and launching optimized campaigns." },
      { step: "A/B Testing", description: "Testing variations for continuous improvement." },
      { step: "Scale & Optimize", description: "Scaling winning campaigns for maximum results." },
    ],
    results: ["5x ROAS on average", "70% lower cost per acquisition", "500k+ reach per campaign"]},
  "social-media-marketing": {
    id: "social-media-marketing", title: "Social Media Marketing", description: "Strategic social media management that builds brand awareness, engages communities, and drives measurable business growth.",
    longDescription: "Our social media marketing service goes beyond posting content. We develop comprehensive strategies that build communities, foster engagement, and drive measurable business outcomes across all major platforms.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    benefits: ["Brand awareness growth", "Community engagement", "Lead generation", "Customer loyalty", "Market insights", "Competitive advantage"],
    process: [
      { step: "Strategy Development", description: "Creating a tailored social media strategy." },
      { step: "Content Planning", description: "Developing a content calendar and themes." },
      { step: "Content Creation", description: "Designing and writing engaging posts." },
      { step: "Community Management", description: "Engaging with followers and managing comments." },
      { step: "Analytics & Reporting", description: "Tracking performance and optimizing strategy." },
    ],
    results: ["200% engagement rate increase", "50k+ new followers in 3 months", "40% conversion rate from social traffic"]},
  "content-marketing": {
    id: "content-marketing", title: "Content Marketing", description: "Compelling content that tells your brand story, educates your audience, and establishes your authority in the industry.",
    longDescription: "Content is the foundation of digital marketing. Our content marketing service creates valuable, relevant, and consistent content that attracts and retains a clearly defined audience, ultimately driving profitable customer action.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    benefits: ["SEO improvement", "Thought leadership", "Lead nurturing", "Brand authority", "Long-term value", "Multi-channel distribution"],
    process: [
      { step: "Research & Strategy", description: "Identifying topics and audience needs." },
      { step: "Content Creation", description: "Writing high-quality, SEO-optimized content." },
      { step: "Design & Media", description: "Adding visuals, infographics, and media." },
      { step: "Distribution", description: "Publishing and promoting across channels." },
      { step: "Performance Analysis", description: "Measuring engagement and refining strategy." },
    ],
    results: ["300% increase in organic traffic", "5x more backlinks", "80% boost in lead quality"]},
  "influencer-marketing": {
    id: "influencer-marketing", title: "Influencer Marketing", description: "Strategic influencer partnerships that amplify your brand reach and build authentic connections with your target audience.",
    longDescription: "We connect your brand with the right influencers to create authentic partnerships that resonate with your target audience. Our data-driven approach ensures maximum ROI from every influencer collaboration.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    benefits: ["Authentic brand advocacy", "Expanded reach", "Targeted audience access", "Content creation", "Trust building", "Viral potential"],
    process: [
      { step: "Influencer Discovery", description: "Finding influencers aligned with your brand." },
      { step: "Relationship Building", description: "Establishing partnerships and agreements." },
      { step: "Campaign Development", description: "Co-creating content and campaign strategy." },
      { step: "Launch & Monitor", description: "Launching campaign and tracking performance." },
      { step: "Analysis & Reports", description: "Measuring impact and ROI analysis." },
    ],
    results: ["10x average engagement rate", "1M+ reach per campaign", "150% increase in brand mentions"]},
  "website-development": {
    id: "website-development", title: "Website Development", description: "Custom, responsive websites built with modern tech stacks that drive conversions and deliver exceptional user experiences.",
    longDescription: "We build stunning, high-performance websites using cutting-edge technologies. From simple landing pages to complex web applications, every project is crafted with precision and optimized for conversions.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    benefits: ["Custom design & development", "Mobile-first approach", "SEO-optimized structure", "Fast loading speeds", "Scalable architecture", "CMS integration"],
    process: [
      { step: "Discovery", description: "Understanding your business needs and goals." },
      { step: "Design", description: "Creating wireframes and visual designs." },
      { step: "Development", description: "Building with modern frameworks and best practices." },
      { step: "Testing", description: "Rigorous testing across devices and browsers." },
      { step: "Launch & Support", description: "Deployment and ongoing maintenance." },
    ],
    results: ["50% faster load times", "40% increase in conversion rates", "98% mobile satisfaction score"]},
  "ecommerce-marketing": {
    id: "ecommerce-marketing", title: "Ecommerce Marketing", description: "Comprehensive ecommerce marketing solutions that drive sales, reduce cart abandonment, and maximize customer lifetime value.",
    longDescription: "Our ecommerce marketing service is designed to help online stores thrive in a competitive landscape. We integrate data-driven strategies across channels to maximize sales and customer lifetime value.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
    benefits: ["Increased sales & revenue", "Reduced cart abandonment", "Better customer retention", "Cross-sell opportunities", "Inventory optimization", "Multi-channel selling"],
    process: [
      { step: "Store Audit", description: "Analyzing current store performance and issues." },
      { step: "Strategy Development", description: "Creating a comprehensive marketing strategy." },
      { step: "Campaign Execution", description: "Launching ads, emails, and promotions." },
      { step: "Optimization", description: "A/B testing and conversion rate optimization." },
      { step: "Reporting & Scale", description: "Measuring results and scaling winning tactics." },
    ],
    results: ["120% increase in revenue", "35% reduction in cart abandonment", "3x customer lifetime value"]},
  "branding": {
    id: "branding", title: "Branding", description: "Complete brand identity design from logo to guidelines, creating a cohesive and memorable presence that sets you apart.",
    longDescription: "Your brand is your most valuable asset. We create comprehensive brand identities that communicate your values, resonate with your audience, and differentiate you from competitors.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" /><line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /></svg>,
    benefits: ["Strong brand identity", "Market differentiation", "Customer recognition", "Brand consistency", "Emotional connection", "Premium positioning"],
    process: [
      { step: "Discovery & Research", description: "Understanding your brand values and market." },
      { step: "Strategy", description: "Defining brand positioning and messaging." },
      { step: "Visual Identity", description: "Designing logo, colors, typography, and assets." },
      { step: "Brand Guidelines", description: "Creating comprehensive brand usage guidelines." },
      { step: "Implementation", description: "Applying brand across all touchpoints." },
    ],
    results: ["80% increase in brand recall", "50% improvement in brand perception", "40% higher customer loyalty"]},
  "graphic-design": {
    id: "graphic-design", title: "Graphic Design", description: "Eye-catching designs for digital and print that communicate your brand message effectively and leave lasting impressions.",
    longDescription: "From social media graphics to print materials, our design team creates visually stunning assets that capture attention and communicate your message effectively across all mediums.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>,
    benefits: ["Professional visuals", "Brand consistency", "Engaging content", "Versatile assets", "Quick turnarounds", "Unlimited revisions available"],
    process: [
      { step: "Briefing", description: "Understanding your design needs and preferences." },
      { step: "Concept Development", description: "Creating initial design concepts and mood boards." },
      { step: "Design & Refinement", description: "Developing and refining the chosen design." },
      { step: "Final Delivery", description: "Providing final files in all required formats." },
    ],
    results: ["60% higher engagement rates", "3x more social shares", "45% improvement in brand consistency"]},
  "video-editing": {
    id: "video-editing", title: "Video Editing", description: "Professional video production and editing services that bring your brand stories to life with cinematic quality.",
    longDescription: "Transform your raw footage into compelling brand stories with our professional video editing service. From social media clips to corporate videos, we deliver cinematic quality that captivates your audience.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
    benefits: ["Professional quality", "Brand storytelling", "Multi-platform optimization", "Fast turnaround", "Creative effects", "Audio enhancement"],
    process: [
      { step: "Review & Plan", description: "Reviewing footage and planning the edit." },
      { step: "Rough Cut", description: "Creating the initial assembly edit." },
      { step: "Fine Cut", description: "Refining pacing, transitions, and effects." },
      { step: "Color & Audio", description: "Color grading and audio mixing." },
      { step: "Final Delivery", description: "Exporting in required formats." },
    ],
    results: ["200% increase in video engagement", "50% higher retention rates", "4x more video shares"]},
  "performance-marketing": {
    id: "performance-marketing", title: "Performance Marketing", description: "Data-driven performance marketing campaigns focused on measurable outcomes and maximum return on ad spend.",
    longDescription: "Our performance marketing service is built on data, analytics, and continuous optimization. Every campaign is designed to deliver measurable results and maximum ROI.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    benefits: ["Measurable results", "ROI-focused approach", "Multi-channel strategy", "Real-time optimization", "Transparent reporting", "Scalable campaigns"],
    process: [
      { step: "Goal Setting", description: "Defining KPIs and performance targets." },
      { step: "Channel Selection", description: "Identifying the best channels for your goals." },
      { step: "Campaign Setup", description: "Building and launching performance campaigns." },
      { step: "Optimization", description: "Continuous A/B testing and refinement." },
      { step: "Reporting", description: "Detailed performance analytics and insights." },
    ],
    results: ["4x average ROAS", "40% lower cost per lead", "250% increase in conversions"]},
  "lead-generation": {
    id: "lead-generation", title: "Lead Generation", description: "Multi-channel lead generation campaigns that fill your pipeline with high-quality prospects ready to convert.",
    longDescription: "We design and execute multi-channel lead generation campaigns that attract, engage, and convert your ideal customers. From landing pages to lead magnets, every element is optimized for conversion.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    benefits: ["Qualified leads pipeline", "Multi-channel approach", "Cost-effective acquisition", "Scalable campaigns", "Lead scoring & nurturing", "CRM integration"],
    process: [
      { step: "Target Audience Analysis", description: "Defining your ideal customer profile." },
      { step: "Campaign Design", description: "Creating landing pages, forms, and lead magnets." },
      { step: "Traffic Generation", description: "Driving targeted traffic to conversion points." },
      { step: "Lead Nurturing", description: "Automated email sequences and follow-ups." },
      { step: "Optimization", description: "A/B testing and conversion rate optimization." },
    ],
    results: ["500+ qualified leads monthly", "40% lead-to-customer conversion", "3x reduction in cost per lead"]},
  "email-marketing": {
    id: "email-marketing", title: "Email Marketing", description: "Strategic email campaigns that nurture leads, drive conversions, and build lasting customer relationships through personalized communication.",
    longDescription: "Our email marketing service delivers personalized, data-driven email campaigns that engage your audience at every stage of the customer journey, from welcome sequences to re-engagement campaigns.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    benefits: ["Direct customer reach", "High ROI", "Personalized communication", "Automated sequences", "Segmentation & targeting", "Detailed analytics"],
    process: [
      { step: "Strategy & Planning", description: "Defining goals and email marketing strategy." },
      { step: "List Building", description: "Growing and segmenting your email list." },
      { step: "Campaign Creation", description: "Designing emails and writing compelling copy." },
      { step: "Automation Setup", description: "Setting up triggered email sequences." },
      { step: "Analysis & Optimization", description: "Tracking open rates, CTR, and conversions." },
    ],
    results: ["25% average open rate", "5x ROI on campaigns", "40% increase in repeat purchases"]},
  "local-seo": {
    id: "local-seo", title: "Local SEO", description: "Hyper-local SEO strategies that help businesses dominate local search results and attract nearby customers ready to buy.",
    longDescription: "Dominate your local market with our Local SEO service. We optimize your Google Business Profile, build local citations, and develop location-specific content that drives foot traffic and local phone calls.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    benefits: ["Local search dominance", "Google Maps visibility", "Foot traffic increase", "Local brand awareness", "Competitive advantage", "Voice search optimization"],
    process: [
      { step: "Local Audit", description: "Analyzing current local search presence." },
      { step: "GBP Optimization", description: "Optimizing Google Business Profile." },
      { step: "Citation Building", description: "Building consistent local citations." },
      { step: "Local Content", description: "Creating location-specific content and pages." },
      { step: "Review Management", description: "Managing and responding to reviews." },
    ],
    results: ["Top 3 in local pack", "200% increase in local calls", "150% more foot traffic"]},
  "youtube-marketing": {
    id: "youtube-marketing", title: "YouTube Marketing", description: "Comprehensive YouTube marketing from channel optimization to content strategy that grows your audience and revenue.",
    longDescription: "Unlock the power of YouTube with our comprehensive marketing service. From channel setup and optimization to content strategy and paid promotion, we help you build a thriving YouTube presence.",
    icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
    benefits: ["Massive audience reach", "Video SEO optimization", "Channel growth strategy", "Monetization guidance", "Engagement analytics", "Cross-platform promotion"],
    process: [
      { step: "Channel Audit", description: "Analyzing channel performance and opportunities." },
      { step: "Content Strategy", description: "Planning content themes and publishing schedule." },
      { step: "Video Production", description: "Scripting, filming, and editing videos." },
      { step: "SEO & Promotion", description: "Optimizing titles, tags, and promoting videos." },
      { step: "Analytics & Growth", description: "Tracking performance and scaling strategy." },
    ],
    results: ["100k+ subscribers in 6 months", "5M+ total views", "60% increase in watch time"]}};

const defaultService: ServiceData = {
  id: "default", title: "Service Not Found", description: "The service you're looking for doesn't exist.",
  longDescription: "",
  icon: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  benefits: [],
  process: [],
  results: []};

export default function ServiceDetail() {
  const { service } = useParams<{ service: string }>();
  const data = service ? servicesData[service] : undefined;
  const serviceData = data || defaultService;

  return (
    <>
      <Helmet>
        <title>{serviceData.title} | AB DIGITAL SOLUTION</title>
        <meta name="description" content={serviceData.description} />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          {!data ? (
            <div className="text-center py-20">
              <span className="section-label">Error</span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111] mt-4">Service Not Found</h1>
              <p className="text-[#111] mt-4">The service you're looking for doesn't exist.</p>
              <Link to="/services" className="doodle-btn-accent inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm">
                View All Services
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                <AnimatedSection direction="left">
                  <Link to="/services" className="inline-flex items-center gap-2 text-[#111]/60 text-sm hover:text-[#FFD400] transition-colors duration-300 mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
                    </svg>
                    Back to Services
                  </Link>
                  <div className="w-16 h-16 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center text-[#111] mb-6 shadow-[3px_3px_0_#111]">
                    {serviceData.icon}
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] tracking-tight">
                    {serviceData.title}
                  </h1>
                  <p className="text-[#111] text-lg mt-6 leading-relaxed">{serviceData.longDescription}</p>
                  <Link
                    to="/contact"
                    className="doodle-btn inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm text-white"
                  >
                    Get Started
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </AnimatedSection>

                <AnimatedSection direction="right">
                  <div className="doodle-card p-10">
                    <h3 className="text-[#111] text-xl font-bold mb-6">Key Benefits</h3>
                    <div className="space-y-4">
                      {serviceData.benefits.map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-6 h-6 bg-[#FFD400] border-2 border-[#111] flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-[#111]">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection>
                <div className="text-center mb-12">
                  <span className="section-label">Our Process</span>
                  <h2 className="text-3xl md:text-4xl font-black text-[#111] mt-4">How We Work</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {serviceData.process.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="doodle-card p-8"
                    >
                      <div className="w-10 h-10 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center text-[#111] font-black text-sm mb-4 shadow-[2px_2px_0_#111]">
                        {i + 1}
                      </div>
                      <h3 className="text-lg font-bold text-[#111] mb-2">{step.step}</h3>
                      <p className="text-[#111]/70 leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection className="mt-20">
                <div className="doodle-card-accent p-12 md:p-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">
                    Ready to Transform Your{" "}
                    <span className="text-[#111]">Digital Presence</span>?
                  </h2>
                  <p className="text-[#111] mt-4 max-w-xl mx-auto">
                    Let's discuss how our {serviceData.title} service can help you achieve your business goals.
                  </p>
                  <Link
                    to="/contact"
                    className="doodle-btn inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm text-white"
                  >
                    Contact Us
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </>
  );
}
