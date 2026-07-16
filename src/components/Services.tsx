import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const accentColors = ["#FF4D4D", "#4D7AFF", "#8B5CF6", "#60A5FA"];

const defaultServices = [
  {
    title: "Website Development",
    description:
      "Custom, responsive websites built with modern tech stacks that drive conversions and deliver exceptional user experiences.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )},
  {
    title: "SEO",
    description:
      "Data-driven SEO strategies that boost your organic rankings, increase visibility, and drive qualified traffic to your site.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )},
  {
    title: "Google Ads",
    description:
      "High-ROI Google Ads campaigns optimized for conversions, with precise targeting and continuous performance refinement.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="18" r="2" />
        <circle cx="16" cy="16" r="2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="18" cy="9" r="2" />
        <circle cx="12" cy="5" r="2" />
      </svg>
    )},
  {
    title: "Meta Ads",
    description:
      "Social media advertising on Facebook & Instagram that reaches your ideal audience with compelling creative and messaging.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )},
  {
    title: "Social Media Marketing",
    description:
      "Strategic social media management that builds brand awareness, engages communities, and drives measurable business growth.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )},
  {
    title: "Content Marketing",
    description:
      "Compelling content that tells your brand story, educates your audience, and establishes your authority in the industry.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    )},
  {
    title: "Branding",
    description:
      "Complete brand identity design from logo to concepts, creating a cohesive and memorable presence that sets you apart.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      </svg>
    )},
  {
    title: "AI Automation",
    description:
      "Intelligent automation solutions powered by AI to streamline operations, reduce costs, and scale your business efficiently.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )},
  {
    title: "Lead Generation",
    description:
      "Multi-channel lead generation campaigns that fill your pipeline with high-quality prospects ready to convert.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
];

const iconSvg = (d: string) => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }}};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}};

export default function Services() {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminServices");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          setServices(
            [...parsed]
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
              .map((item: any) => ({
                title: item.title,
                description: item.description,
                icon: iconSvg(item.icon),
              }))
          );
        }
      }
    } catch {}
  }, []);

  return (
    <section id="services" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">What We Do</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Our <span className="text-[#60A5FA]">Services</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Comprehensive digital solutions tailored to elevate your brand and drive measurable results.
          </p>
        </AnimatedSection>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="doodle-card p-8 relative overflow-hidden group"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[5px]"
                style={{ backgroundColor: accentColors[i % accentColors.length] }}
              />
              <div className="relative z-10 pl-4">
                <div
                  className="w-14 h-14 flex items-center justify-center mb-5 border-3 border-[#111111] transition-all duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[4px_4px_0px_#111111]"
                  style={{ borderRadius: "14px", backgroundColor: accentColors[i % accentColors.length] }}
                >
                  <span className="text-white">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

