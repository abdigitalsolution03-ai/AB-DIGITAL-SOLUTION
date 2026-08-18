import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { getAll, pullCMS } from '@/services/cms';
import SocialIcon from '@/components/SocialIcon';

const categories = ["All", "Social Media", "Video Editing", "Ads", "Design", "SEO"];

interface Project {
  title: string;
  category: string;
  description: string;
  color: string;
  image?: string;
  videoUrl?: string;
  videoThumb?: string;
  channelAvatar?: string;
  instagramUrl?: string;
  metrics: string[];
}

const hardcodedProjects: Project[] = [
  { title: "White Bricks Real Estate", category: "Social Media", description: "Instagram management, post design & content calendar for a premium real estate brand.", color: "#FF4D4D", image: "/portfolio/white-bricks.jpg", instagramUrl: "https://www.instagram.com/whitebrickrealestate", metrics: ["Instagram Management", "Post Design", "Content Calendar"] },
  { title: "Dr. Neha Vasishth", category: "SEO", description: "Google My Business management for one of Delhi's leading consultant psychologists.", color: "#4D7AFF", image: "/portfolio/neha-vasishth.jpg", metrics: ["Google My Business", "Local SEO", "Online Reputation"] },
  { title: "Build With Nishant", category: "Social Media", description: "Personal brand presence & content strategy to grow his digital footprint.", color: "#8B5CF6", image: "/portfolio/build-with-nishant.jpg", metrics: ["Brand Presence", "Content Strategy", "Growth"] },
  { title: "Eco Vibe", category: "Video Editing", description: "Full YouTube channel management for Economics by Sapan Kumar — edits, uploads & SEO.", color: "#60A5FA", image: "/portfolio/eco-vibe.jpg", videoUrl: "https://www.youtube.com/@Economicsbysapankumar", videoThumb: "https://i.ytimg.com/vi/hYeA0iVMNv8/hqdefault.jpg", channelAvatar: "https://yt3.googleusercontent.com/XidJwUvUbs8tXvWc3m0xBwv15wYaKfZG4TG6tgp0TJWxrImihtRrwRO4mY7yUuAxJ4Zeb7u4NQ=s200-c-k-c0x00ffffff-no-rj", metrics: ["YouTube Management", "Video Editing", "YouTube SEO"] },
  { title: "Lawfine Care", category: "Ads", description: "Instagram posts, paid ads & video editing for a legal services brand.", color: "#FF4D4D", image: "/portfolio/lawfine-care.jpg", instagramUrl: "https://www.instagram.com/lawyerpanelexpert", metrics: ["Instagram Marketing", "Meta Ads", "Video Editing"] },
  { title: "Charru Gupta", category: "Video Editing", description: "YouTube video editing for content creator Charru Gupta.", color: "#4D7AFF", image: "/portfolio/charru-gupta.jpg", videoUrl: "https://youtu.be/AzxXnDwudjs", videoThumb: "https://i.ytimg.com/vi/AzxXnDwudjs/hqdefault.jpg", metrics: ["Video Editing", "Reels"] },
  { title: "YCB Toy Zone", category: "Video Editing", description: "Video editing for the YCB Toy Zone YouTube channel.", color: "#8B5CF6", image: "/portfolio/ycb-toy.jpg", videoUrl: "https://www.youtube.com/@YCBToyZone", videoThumb: "https://i.ytimg.com/vi/2Vd1JJpoxTA/hqdefault.jpg", channelAvatar: "https://yt3.googleusercontent.com/LO92V_JjM7IJtU-4NW6KLtsWjv_wIKywV5RW3AzWgyLMn7oXzD6eqN033986P1jmNp1_J6-eNc0=s200-c-k-c0x00ffffff-no-rj", metrics: ["Video Editing", "YouTube"] },
  { title: "Ambrosial Catering", category: "Social Media", description: "Full-stack social media — Instagram & Facebook management, Meta ads, Pinterest & video editing.", color: "#60A5FA", image: "/portfolio/ambrosial.jpg", instagramUrl: "https://www.instagram.com/ambrosial.catering", metrics: ["Instagram & Facebook", "Meta Ads", "Pinterest", "Video Editing"] },
  { title: "ATV News Bihar", category: "Design", description: "Logo and banner design for the ATV Bihar news channel.", color: "#FF4D4D", image: "/portfolio/atv-news.jpg", videoUrl: "https://www.youtube.com/@AtvBihar", videoThumb: "https://i.ytimg.com/vi/50oa9NjCKxg/hqdefault.jpg", channelAvatar: "https://yt3.googleusercontent.com/LHmvmQ-K6O9t3ZgTrl0-V2rTRWnA1MnW4YrRSzUD8kIn6bt8SXi94IsZWf8VaK4oCUVNumt1THo=s200-c-k-c0x00ffffff-no-rj", metrics: ["Logo Design", "Banner Design", "Channel Branding"] },
  { title: "Anytime Impressions", category: "Video Editing", description: "YouTube & Instagram handling — editing and everything for Anytime Impressions.", color: "#4D7AFF", image: "/portfolio/anytime.jpg", videoUrl: "https://www.youtube.com/@Anytimeimpressions", videoThumb: "https://i.ytimg.com/vi/pBA2zZfg_Uo/hqdefault.jpg", channelAvatar: "https://yt3.googleusercontent.com/xHJ4KySUi9WmidIsJ8fbjhSAoX8R_Qb8T2X1mCubm6UlKIZYUrEPDRCdz2rtixx3ExHPS4mTb-Y=s200-c-k-c0x00ffffff-no-rj", metrics: ["YouTube + Instagram", "Editing", "Content"] },
  { title: "Suraj Paul", category: "Social Media", description: "Instagram, LinkedIn & Facebook management, paid ads, Google My Business and video editing.", color: "#8B5CF6", image: "/portfolio/suraj-paul.jpg", instagramUrl: "https://www.instagram.com/surajpaulprosperity", metrics: ["Instagram / LinkedIn / Facebook", "Paid Ads", "Google My Business", "Video Editing"] },
  { title: "MS Tutorials Vaishali", category: "Social Media", description: "Post management, Google My Business, YouTube & Facebook handling with video editing.", color: "#60A5FA", image: "/portfolio/ms-tutorial.jpg", instagramUrl: "https://www.instagram.com/m.s_tutorials_vaishali", metrics: ["Google My Business", "YouTube & Facebook", "Video Editing"] },
  { title: "Vidya Vibe Academy", category: "Social Media", description: "Instagram management — posts & editing for VVA Vasundhara.", color: "#FF4D4D", image: "/portfolio/vidya-vibe.jpg", instagramUrl: "https://www.instagram.com/vva_vasundhara", metrics: ["Instagram Management", "Posts", "Editing"] },
];

function loadProjects(): Project[] {
  const cms = getAll('portfolio')
  if (cms.length > 0) {
    return cms.map((p: any) => ({
      title: p.title,
      category: p.category || 'Social Media',
      description: p.description || '',
      color: p.color || '#4D7AFF',
      image: p.image || '',
      videoUrl: p.videoUrl || '',
      videoThumb: p.videoThumb || '',
      channelAvatar: p.channelAvatar || '',
      instagramUrl: p.instagramUrl || '',
      metrics: (p.results || '').split('\n').filter(Boolean).map((m: string) => m.trim()),
    }))
  }
  return hardcodedProjects
}

export default function Portfolio() {
  const [projects, setProjects] = useState(loadProjects);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true
    void pullCMS().then(() => {
      if (active) setProjects(loadProjects())
    })
    return () => { active = false }
  }, [])

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
              Featured <span className="text-[#60A5FA]">Projects</span>
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
                    activeCategory === cat ? "bg-[#60A5FA] text-[#111]" : "bg-white text-[#111] hover:bg-[#60A5FA]"
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="portfolioCategory"
                      className="absolute inset-0 bg-[#60A5FA]"
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
                    <div className="relative h-48 border-b-3 border-[#111] overflow-hidden" style={{ backgroundColor: project.color }}>
                      {project.videoThumb ? (
                        <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <img src={project.videoThumb} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-[#111] shadow-[3px_3px_0_#111] group-hover:bg-[#FF4D4D] transition-colors duration-300">
                              <svg className="w-5 h-5 text-[#111] ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </span>
                          </div>
                          {project.channelAvatar && (
                            <img src={project.channelAvatar} alt={`${project.title} channel`} className="absolute bottom-2 left-2 w-9 h-9 rounded-full border-2 border-[#111] bg-white object-cover" />
                          )}
                        </a>
                      ) : project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : project.videoUrl ? (
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                      ) : null}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {project.instagramUrl && (
                          <a
                            href={project.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#111] text-[#111] hover:bg-[#60A5FA] transition-all duration-300 shadow-[2px_2px_0_#111]"
                            style={{ borderRadius: "8px" }}
                            aria-label={`${project.title} on Instagram`}
                          >
                            <SocialIcon platform="Instagram" className="w-4 h-4" />
                          </a>
                        )}
                        {project.videoUrl && (
                          <a
                            href={project.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#111] text-[#111] hover:bg-[#FF4D4D] transition-all duration-300 shadow-[2px_2px_0_#111]"
                            style={{ borderRadius: "8px" }}
                            aria-label={`${project.title} on YouTube`}
                          >
                            <SocialIcon platform="YouTube" className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {!project.image && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <span className="text-6xl font-black text-white/90 select-none">{project.title.charAt(0).toUpperCase()}</span>
                          <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-bold px-3 py-1 border-2 border-white/40">{project.category}</span>
                        </div>
                      )}
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
                        <span key={j} className="px-3 py-1 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
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

