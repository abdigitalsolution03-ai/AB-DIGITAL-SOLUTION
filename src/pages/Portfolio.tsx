import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const categories = ["All", "Website", "SEO", "Ads", "Branding", "Design"];

interface Project {
  title: string;
  category: string;
  description: string;
  color: string;
  metrics: string[];
}

const projects: Project[] = [
  { title: "E-Commerce Platform", category: "Website", description: "Next-gen online store with seamless checkout experience", color: "#FF4D4D", metrics: ["150% sales increase", "40% faster load time", "3.2% conversion rate"] },
  { title: "Local SEO Campaign", category: "SEO", description: "Top 3 rankings across 50+ local search terms", color: "#4D7AFF", metrics: ["Top 3 for 50+ keywords", "300% traffic boost", "200% lead increase"] },
  { title: "Google Ads Optimization", category: "Ads", description: "3.5x ROAS improvement through smart bidding", color: "#8B5CF6", metrics: ["3.5x ROAS", "60% lower CPA", "250% more conversions"] },
  { title: "Brand Identity Design", category: "Branding", description: "Complete brand overhaul for a fintech startup", color: "#FF4D4D", metrics: ["80% brand recall", "50% perception boost", "40% loyalty increase"] },
  { title: "SaaS Dashboard", category: "Website", description: "Interactive analytics dashboard with real-time data", color: "#4D7AFF", metrics: ["2x user engagement", "45% retention boost", "98% satisfaction"] },
  { title: "Meta Ads Campaign", category: "Ads", description: "Scaled revenue 4x with targeted social advertising", color: "#8B5CF6", metrics: ["4x revenue scale", "5x ROAS", "500k+ reach"] },
  { title: "Corporate Website Redesign", category: "Website", description: "Modern redesign for a B2B technology company", color: "#FF4D4D", metrics: ["70% bounce rate reduction", "200% page views", "3x lead generation"] },
  { title: "Social Media Campaign", category: "Branding", description: "Integrated social strategy for a lifestyle brand", color: "#4D7AFF", metrics: ["200% engagement", "150k new followers", "40% conversion rate"] },
  { title: "Mobile App UI/UX", category: "Design", description: "Intuitive mobile app design with 5-star ratings", color: "#8B5CF6", metrics: ["4.8 star rating", "60% user retention", "90% task completion"] },
  { title: "Ecommerce SEO Strategy", category: "SEO", description: "Comprehensive SEO for a multi-product online store", color: "#FF4D4D", metrics: ["400% organic traffic", "Top 5 for 100+ terms", "180% revenue increase"] },
  { title: "Video Ad Campaign", category: "Ads", description: "High-converting video ads for a D2C brand", color: "#4D7AFF", metrics: ["10M+ video views", "3x CTR", "150% ROAS increase"] },
  { title: "Brand Guidelines & Collateral", category: "Branding", description: "Comprehensive brand system for a healthcare startup", color: "#8B5CF6", metrics: ["100% brand consistency", "2x brand awareness", "60% faster time-to-market"] },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered = projects.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  const getCardClass = (color: string) => {
    if (color === "#FF4D4D") return "doodle-card-red";
    if (color === "#4D7AFF") return "doodle-card-blue";
    if (color === "#8B5CF6") return "doodle-card-purple";
    return "doodle-card";
  };

  return (
    <>
      <Helmet>
        <title>Our Portfolio | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Explore our portfolio of successful digital marketing and web development projects. See how we've helped businesses achieve remarkable results." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Work</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Featured <span className="text-[#FFD400]">Projects</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Each project reflects our commitment to excellence and results-driven approach.
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
                      layoutId="portfolioCategory"
                      className="absolute inset-0 bg-[#FFD400]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={`${getCardClass(project.color)} p-0 overflow-hidden cursor-pointer group`}>
                    <div className="h-48 flex items-center justify-center border-b-3 border-[#111]" style={{ backgroundColor: project.color }}>
                      <svg className="w-16 h-16 text-white/30 group-hover:text-white/50 transition-all duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <span className="text-[#111]/60 text-xs tracking-widest uppercase font-bold">{project.category}</span>
                      <h3 className="text-[#111] text-lg font-bold mt-1">{project.title}</h3>
                      <p className="text-[#111]/70 text-sm mt-1">{project.description}</p>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: hoveredIndex === i ? 1 : 0,
                        y: hoveredIndex === i ? 0 : 10}}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 flex flex-wrap gap-2"
                    >
                      {project.metrics.map((metric, j) => (
                        <span key={j} className="px-3 py-1 bg-[#FFD400] border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                          {metric}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
}
