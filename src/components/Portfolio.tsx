import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const hardcodedCategories = ["All", "Website", "SEO", "Ads", "Branding"];

const hardcodedProjects = [
  {
    title: "E-Commerce Platform",
    category: "Website",
    description: "Next-gen online store with seamless checkout experience",
    gradient: "from-blue-200 to-blue-400",
    visual: "ecommerce"},
  {
    title: "Local SEO Campaign",
    category: "SEO",
    description: "Top 3 rankings across 50+ local search terms",
    gradient: "from-blue-300 to-blue-500",
    visual: "seo"},
  {
    title: "Google Ads Optimization",
    category: "Ads",
    description: "3.5x ROAS improvement through smart bidding",
    gradient: "from-blue-300 to-blue-400",
    visual: "googleads"},
  {
    title: "Brand Identity Design",
    category: "Branding",
    description: "Complete brand overhaul for a fintech startup",
    gradient: "from-blue-200 to-blue-400",
    visual: "branding"},
  {
    title: "SaaS Dashboard",
    category: "Website",
    description: "Interactive analytics dashboard with real-time data",
    gradient: "from-blue-200 to-blue-500",
    visual: "saas"},
  {
    title: "Meta Ads Campaign",
    category: "Ads",
    description: "Scaled revenue 4x with targeted social advertising",
    gradient: "from-blue-300 to-blue-400",
    visual: "meta"},
];

function ProjectVisual({ type }: { type: string }) {
  const bar = (h: string, c: string) => (
    <div className="rounded-t-sm w-full" style={{ height: h, background: c }} />
  );

  if (type === "googleads") {
    return (
      <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-lg border-2 border-[#111] p-3 shadow-[3px_3px_0_#111]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#4285F4]" />
            <span className="text-[9px] font-bold text-[#111]">Google Ads — Campaign Dashboard</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[["Clicks", "12,480"], ["CTR", "8.2%"], ["ROAS", "3.5x"]].map(([k, v]) => (
              <div key={k} className="bg-gray-100 rounded-md p-1.5">
                <div className="text-[7px] text-gray-500 font-semibold uppercase">{k}</div>
                <div className="text-[10px] font-black text-[#111]">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-end gap-1 h-12">
            {[35, 55, 45, 70, 60, 85, 100].map((h, i) => bar(`${h}%`, i === 6 ? "#4285F4" : "#93C5FD"))}
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            {["Paused", "Enabled", "Enabled"].map((s) => (
              <span key={s} className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#111] ${s === "Enabled" ? "bg-[#4285F4] text-white" : "bg-gray-200 text-gray-500"}`}>{s}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex-1 bg-white rounded-md border-2 border-[#111] p-2 shadow-[2px_2px_0_#111]">
            <div className="text-[7px] text-gray-500 font-semibold">Campaign · Search</div>
            <div className="text-[9px] font-bold text-[#111]">Best Bidding Strategy</div>
            <div className="text-[8px] font-black text-[#4285F4]">$0.42 CPC · 99.9% Valid</div>
          </div>
          <div className="bg-[#4285F4] text-white text-[9px] font-black px-2 py-1.5 rounded-md border-2 border-[#111] shadow-[2px_2px_0_#111]">3.5x ROAS</div>
        </div>
      </div>
    );
  }

  if (type === "seo") {
    return (
      <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-lg border-2 border-[#111] p-3 shadow-[3px_3px_0_#111]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#60A5FA]" />
            <span className="text-[9px] font-bold text-[#111]">Google Search Results</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {[
              ["1", "Local Business Near You — Top Rated", "ad www.yourclient.com"],
              ["2", "Best Services in Your Area", "www.yourclient.com"],
              ["3", "Reviews & Offers · Free Quote", "maps.google.com"],
            ].map(([rank, t, u]) => (
              <div key={rank} className="flex items-center gap-2 bg-gray-100 rounded-md p-1.5">
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#60A5FA] border-2 border-[#111] text-[8px] font-black text-[#111]">{rank}</span>
                <div className="min-w-0">
                  <div className="text-[8px] font-bold text-[#111] truncate">{t}</div>
                  <div className="text-[7px] text-gray-500 truncate">{u}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-[#111] p-2 shadow-[2px_2px_0_#111]">
          <div className="flex justify-between text-[8px] font-bold text-[#111]"><span>Organic Traffic</span><span className="text-green-600">+300%</span></div>
          <div className="mt-1 flex items-end gap-1 h-10">
            {[30, 45, 40, 60, 55, 80, 100].map((h, i) => bar(`${h}%`, "#4ADE80"))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "ecommerce") {
    return (
      <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-lg border-2 border-[#111] p-3 shadow-[3px_3px_0_#111]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#111]">Store Revenue</span>
            <span className="text-[8px] font-black text-green-600 bg-green-100 px-1.5 py-0.5 rounded-md border-2 border-[#111]">+150%</span>
          </div>
          <div className="mt-2 flex items-end gap-1.5 h-14">
            {[40, 55, 45, 70, 62, 88, 100].map((h, i) => bar(`${h}%`, i === 6 ? "#FF4D4D" : "#FCA5A5"))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[["Orders", "3,214"], ["Conversion", "3.2%"], ["Cart Value", "$84"]].map(([k, v]) => (
              <div key={k} className="bg-gray-100 rounded-md p-1.5">
                <div className="text-[7px] text-gray-500 font-semibold uppercase">{k}</div>
                <div className="text-[10px] font-black text-[#111]">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex-1 bg-white rounded-md border-2 border-[#111] p-2 shadow-[2px_2px_0_#111]">
            <div className="text-[8px] font-bold text-[#111]">🛒 New Order #4821</div>
            <div className="text-[7px] text-gray-500">Noida, UP · COD</div>
          </div>
          <div className="bg-[#FF4D4D] text-white text-[9px] font-black px-2 py-1.5 rounded-md border-2 border-[#111] shadow-[2px_2px_0_#111]">Checkout</div>
        </div>
      </div>
    );
  }

  if (type === "saas") {
    return (
      <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-lg border-2 border-[#111] p-3 shadow-[3px_3px_0_#111]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#111]">Analytics Overview</span>
            <span className="text-[8px] text-gray-500 font-semibold">Last 30 days</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {[["Active Users", "48,290"], ["Engagement", "2x"], ["Retention", "45%"], ["Sessions", "102k"]].map(([k, v]) => (
              <div key={k} className="bg-gray-100 rounded-md p-1.5">
                <div className="text-[7px] text-gray-500 font-semibold uppercase">{k}</div>
                <div className="text-[10px] font-black text-[#111]">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-end gap-1.5 h-10">
            {[50, 62, 48, 72, 90, 78, 95].map((h, i) => bar(`${h}%`, i === 6 ? "#4D7AFF" : "#93C5FD"))}
          </div>
        </div>
        <div className="bg-white rounded-md border-2 border-[#111] p-2 shadow-[2px_2px_0_#111]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#4D7AFF]" />
            <div className="text-[8px] font-bold text-[#111] flex-1">Weekly Active Users</div>
            <div className="text-[8px] font-black text-green-600">↑ 45%</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "meta") {
    return (
      <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white rounded-lg border-2 border-[#111] p-3 shadow-[3px_3px_0_#111]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#FF4D4D]" />
            <span className="text-[9px] font-bold text-[#111]">Meta Ads Manager</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[["Reach", "500k+"], ["Results", "4x"], ["ROAS", "5x"]].map(([k, v]) => (
              <div key={k} className="bg-gray-100 rounded-md p-1.5">
                <div className="text-[7px] text-gray-500 font-semibold uppercase">{k}</div>
                <div className="text-[10px] font-black text-[#111]">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1">
            {[["Summer Sale 40% Off", "Video · Conversions", "$1,240"], ["New Collection", "Carousel · Traffic", "$980"]].map(([name, type_, spend]) => (
              <div key={name} className="flex items-center justify-between bg-gray-100 rounded-md p-1.5">
                <div className="min-w-0">
                  <div className="text-[8px] font-bold text-[#111] truncate">{name}</div>
                  <div className="text-[7px] text-gray-500">{type_}</div>
                </div>
                <span className="text-[8px] font-black text-[#111]">{spend}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#FF4D4D] text-white text-[9px] font-black px-2 py-1.5 rounded-md border-2 border-[#111] shadow-[2px_2px_0_#111] self-end">Live: 12 Campaigns</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col gap-2 p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="bg-white rounded-lg border-2 border-[#111] p-3 shadow-[3px_3px_0_#111]">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-[#111]">Brand Identity</span>
          <div className="flex gap-1">
            {["#FF4D4D", "#4D7AFF", "#8B5CF6", "#60A5FA"].map((c) => <div key={c} className="w-3.5 h-3.5 rounded-full border-2 border-[#111]" style={{ background: c }} />)}
          </div>
        </div>
        <div className="mt-2 bg-[#111] rounded-md p-3 flex items-center justify-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#FF4D4D] flex items-center justify-center text-white text-[12px] font-black">AB</span>
          <div>
            <div className="text-white text-[9px] font-black">BRAND NAME</div>
            <div className="text-white/60 text-[7px] font-semibold">Est. 2023 · Digital</div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[["Logo", "Done"], ["Colors", "Done"], ["Type", "Done"]].map(([k, v]) => (
            <div key={k} className="bg-gray-100 rounded-md p-1.5 flex items-center justify-between">
              <span className="text-[7px] text-gray-500 font-semibold">{k}</span>
              <span className="text-[8px] font-black text-green-600">✓</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1 bg-white rounded-md border-2 border-[#111] p-2 shadow-[2px_2px_0_#111]">
          <div className="text-[8px] font-bold text-[#111]">Brand Kit</div>
          <div className="text-[7px] text-gray-500">Typography · Logo · Guidelines</div>
        </div>
        <div className="bg-[#8B5CF6] text-white text-[9px] font-black px-2 py-1.5 rounded-md border-2 border-[#111] shadow-[2px_2px_0_#111]">80% Recall</div>
      </div>
    </div>
  );
}

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
            visual: item.visual || "",
            image: item.image || "",
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
                    {project.visual ? (
                      <ProjectVisual type={project.visual} />
                    ) : project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
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
                    )}
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

