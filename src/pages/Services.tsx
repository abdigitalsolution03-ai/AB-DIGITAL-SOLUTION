import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: JSX.Element;
}

const categories = ["All", "Marketing", "Advertising", "Development", "Creative", "Other"];

const services: Service[] = [
  { id: "seo", title: "SEO", description: "Data-driven SEO strategies that boost your organic rankings, increase visibility, and drive qualified traffic to your site.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
  { id: "google-ads", title: "Google Ads", description: "High-ROI Google Ads campaigns optimized for conversions, with precise targeting and continuous performance refinement.", category: "Advertising", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="18" r="2" /><circle cx="16" cy="16" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="18" cy="9" r="2" /><circle cx="12" cy="5" r="2" /></svg> },
  { id: "meta-ads", title: "Meta Ads", description: "Social media advertising on Facebook & Instagram that reaches your ideal audience with compelling creative and messaging.", category: "Advertising", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> },
  { id: "social-media-marketing", title: "Social Media Marketing", description: "Strategic social media management that builds brand awareness, engages communities, and drives measurable business growth.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
  { id: "content-marketing", title: "Content Marketing", description: "Compelling content that tells your brand story, educates your audience, and establishes your authority in the industry.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg> },
  { id: "influencer-marketing", title: "Influencer Marketing", description: "Strategic influencer partnerships that amplify your brand reach and build authentic connections with your target audience.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { id: "website-development", title: "Website Development", description: "Custom, responsive websites built with modern tech stacks that drive conversions and deliver exceptional user experiences.", category: "Development", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
  { id: "ecommerce-marketing", title: "Ecommerce Marketing", description: "Comprehensive ecommerce marketing solutions that drive sales, reduce cart abandonment, and maximize customer lifetime value.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> },
  { id: "branding", title: "Branding", description: "Complete brand identity design from logo to guidelines, creating a cohesive and memorable presence that sets you apart.", category: "Creative", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" /><line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /></svg> },
  { id: "graphic-design", title: "Graphic Design", description: "Eye-catching designs for digital and print that communicate your brand message effectively and leave lasting impressions.", category: "Creative", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg> },
  { id: "video-editing", title: "Video Editing", description: "Professional video production and editing services that bring your brand stories to life with cinematic quality.", category: "Creative", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg> },
  { id: "performance-marketing", title: "Performance Marketing", description: "Data-driven performance marketing campaigns focused on measurable outcomes and maximum return on ad spend.", category: "Advertising", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
  { id: "lead-generation", title: "Lead Generation", description: "Multi-channel lead generation campaigns that fill your pipeline with high-quality prospects ready to convert.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { id: "email-marketing", title: "Email Marketing", description: "Strategic email campaigns that nurture leads, drive conversions, and build lasting customer relationships through personalized communication.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
  { id: "local-seo", title: "Local SEO", description: "Hyper-local SEO strategies that help businesses dominate local search results and attract nearby customers ready to buy.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { id: "youtube-marketing", title: "YouTube Marketing", description: "Comprehensive YouTube marketing from channel optimization to content strategy that grows your audience and revenue.", category: "Marketing", icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg> },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered = services.filter(
    (s) => activeCategory === "All" || s.category === activeCategory
  );

  return (
    <>
      <Helmet>
        <title>Our Services | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Explore our comprehensive digital marketing services including SEO, Google Ads, Meta Ads, Web Development, Branding, and more." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">What We Do</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Our <span className="text-[#FFD400]">Services</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to elevate your brand and drive measurable results.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-6 py-2.5 text-sm font-bold transition-all duration-300 border-3 border-[#111] ${
                    activeCategory === cat ? "bg-[#FFD400] text-[#111]" : "bg-white text-[#111] hover:bg-[#FFD400]"
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="serviceCategory"
                      className="absolute inset-0 bg-[#FFD400]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: "easeOut" }}
                >
                  <Link
                    to={`/services/${service.id}`}
                    className="block doodle-card p-8 h-full group"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transform: hoveredIndex === i ? "translateY(-8px)" : "translateY(0)",
                      transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"}}
                  >
                    <div className="w-14 h-14 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center text-[#111] mb-5 shadow-[3px_3px_0_#111]"
                      style={hoveredIndex === i ? { transform: "scale(1.1) rotate(5deg)" } : {}}
                    >
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#111] mb-2">{service.title}</h3>
                    <p className="text-[#111]/70 leading-relaxed">{service.description}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-[#111] font-bold group-hover:gap-2 transition-all duration-300">
                      Learn More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FFD400] py-[100px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="doodle-card p-12 md:p-16 text-center max-w-4xl mx-auto">
            <AnimatedSection>
              <span className="section-label bg-[#111] text-white">Get Started</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111] mt-4 tracking-tight">
                Not Sure Which Service You Need?
              </h2>
              <p className="text-[#111] mt-4 max-w-xl mx-auto">
                Book a free consultation and our experts will help you find the perfect solution for your business.
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
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
