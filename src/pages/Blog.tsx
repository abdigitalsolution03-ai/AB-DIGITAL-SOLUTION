import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  author: string;
  status: "draft" | "published" | "scheduled";
  seo?: { title?: string; description?: string; keywords?: string; ogImage?: string };
  createdAt: string;
  updatedAt: string;
}

const categoryColors: Record<string, string> = {
  SEO: "#FF4D4D",
  Marketing: "#4D7AFF",
  "Web Development": "#8B5CF6",
  Branding: "#FF4D4D",
  Business: "#10B981",
};

const getCategoryColor = (categories: string[]) => {
  const cat = categories[0] || "";
  return categoryColors[cat] || "#60A5FA";
};

const getColorClass = (color: string) => {
  if (color === "#FF4D4D") return "doodle-card-red";
  if (color === "#4D7AFF") return "doodle-card-blue";
  if (color === "#8B5CF6") return "doodle-card-purple";
  return "doodle-card";
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const estimateReadTime = (content: string) => {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const min = Math.max(1, Math.ceil(words / 200));
  return `${min} min read`;
};

function getCMSData(): BlogPost[] {
  try {
    const raw = localStorage.getItem("cms_db");
    if (!raw) return [];
    const data = JSON.parse(raw);
    return data.blog || [];
  } catch {
    return [];
  }
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");

  const posts = useMemo(() => {
    const all = getCMSData();
    return all.filter((p) => p.status === "published");
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filtered = posts.filter(
    (p) => activeCategory === "All" || p.categories.includes(activeCategory)
  );

  return (
    <>
      <Helmet>
        <title>Blog | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Read the latest insights, tips, and strategies from AB DIGITAL SOLUTION. Stay updated with digital marketing, web development, and branding trends." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Blog</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Insights & <span className="text-[#60A5FA]">Strategies</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Stay ahead with the latest digital marketing insights, tips, and industry trends.
            </p>
          </AnimatedSection>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#111] mb-2">No Blog Posts Yet</h3>
              <p className="text-[#111]/60 max-w-md mx-auto">Blog posts will appear here once published. Check back soon for the latest insights and updates.</p>
            </div>
          ) : (
            <>
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
                          layoutId="blogCategory"
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
                  {filtered.map((post, i) => {
                    const color = getCategoryColor(post.categories);
                    return (
                      <motion.div
                        key={post.slug}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link
                          to={`/blog/${post.slug}`}
                          className={`block ${getColorClass(color)} overflow-hidden h-full group`}
                        >
                          <div className="p-6" style={{ backgroundColor: color }}>
                            <span className="px-3 py-1 bg-white border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                              {post.categories[0] || "Uncategorized"}
                            </span>
                          </div>
                          <div className="p-6">
                            <h3 className="text-[#111] font-bold text-lg group-hover:text-[#60A5FA] transition-colors duration-300 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-[#111]/70 mt-2 leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t-3 border-[#111]">
                              <div>
                                <p className="text-[#111] text-xs font-bold">{post.author}</p>
                                <p className="text-[#111]/40 text-[10px] mt-0.5">{formatDate(post.createdAt)} - {estimateReadTime(post.content)}</p>
                              </div>
                              <span className="text-[#111] group-hover:translate-x-1 transition-transform duration-300">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          )}

          <AnimatedSection className="mt-16 text-center">
            <div className="doodle-card p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-[#111]">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-[#111] mt-3">
                Get the latest digital marketing insights delivered straight to your inbox.
              </p>
              <div className="flex gap-3 max-w-md mx-auto mt-6">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none placeholder:text-[#111]/30"
                />
                <button className="doodle-btn px-6 py-3 text-sm text-white font-bold">
                  Subscribe
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
