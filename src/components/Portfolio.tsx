import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const hardcodedCategories = ["All", "Website", "SEO", "Ads", "Branding"];

const hardcodedProjects = [
  {
    title: "E-Commerce Platform",
    category: "Website",
    description: "Next-gen online store with seamless checkout experience",
    gradient: "from-blue-200 to-blue-400"},
  {
    title: "Local SEO Campaign",
    category: "SEO",
    description: "Top 3 rankings across 50+ local search terms",
    gradient: "from-blue-300 to-blue-500"},
  {
    title: "Google Ads Optimization",
    category: "Ads",
    description: "3.5x ROAS improvement through smart bidding",
    gradient: "from-blue-300 to-blue-400"},
  {
    title: "Brand Identity Design",
    category: "Branding",
    description: "Complete brand overhaul for a fintech startup",
    gradient: "from-blue-200 to-blue-400"},
  {
    title: "SaaS Dashboard",
    category: "Website",
    description: "Interactive analytics dashboard with real-time data",
    gradient: "from-blue-200 to-blue-500"},
  {
    title: "Meta Ads Campaign",
    category: "Ads",
    description: "Scaled revenue 4x with targeted social advertising",
    gradient: "from-blue-300 to-blue-400"},
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState(hardcodedProjects);
  const [categories, setCategories] = useState(hardcodedCategories);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminPortfolio");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map((item) => ({
            title: item.title,
            category: item.category,
            description: item.description,
            gradient: item.color,
          }));
          setProjects(mapped);
          const uniqueCats = ["All", ...new Set(mapped.map((p) => p.category))];
          setCategories(uniqueCats);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const filtered = projects.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <section id="portfolio" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Our Work</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Featured <span className="text-[#60A5FA]">Projects</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Each project reflects our commitment to excellence and results-driven approach.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-6 py-2.5 text-sm font-bold transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {activeCategory === cat ? (
                  <motion.span
                    layoutId="portfolioCategory"
                    className="absolute inset-0 bg-[#60A5FA] border-3 border-[#111111]"
                    style={{ borderRadius: "14px", boxShadow: "4px 4px 0px #111111" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute inset-0 border-3 border-[#111111] hover:bg-gray-100 transition-colors duration-300" style={{ borderRadius: "14px" }} />
                )}
                <span className="relative z-10 text-[#111111]">{cat}</span>
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
                className="group cursor-pointer doodle-border overflow-hidden bg-white"
                style={{ borderRadius: "20px" }}
              >
                <div className="relative overflow-hidden">
                  <div
                    className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-[#111111] opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[#60A5FA] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {project.category}
                  </span>
                  <h3 className="text-[#111111] text-lg font-bold mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{project.title}</h3>
                  <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{project.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

