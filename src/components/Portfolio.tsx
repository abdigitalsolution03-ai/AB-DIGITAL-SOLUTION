import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

interface PortfolioItem {
  id: string | number;
  title: string;
  category: string;
  image: string;
  url: string;
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cms_portfolio_items");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {}
  }, []);

  if (items.length === 0) return null;

  const categories = ["All", ...new Set(items.map((item) => item.category))];
  const filtered = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <section id="portfolio" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Our Work</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Featured <span className="text-[#60A5FA]">Projects</span>
          </h2>
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
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className="group cursor-pointer doodle-border overflow-hidden bg-white"
                style={{ borderRadius: "20px" }}
              >
                <div className="relative overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
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
                  )}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-[#60A5FA] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.category}
                  </span>
                  <h3 className="text-[#111111] text-lg font-bold mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#60A5FA] font-semibold mt-2 hover:underline"
                    >
                      View Project
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
