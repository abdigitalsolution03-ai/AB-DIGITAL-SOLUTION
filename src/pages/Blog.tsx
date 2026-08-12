import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { getAll } from '@/services/cms';

const categories = ["All", "SEO", "Marketing", "Web Development", "Branding", "Business"];

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  color: string;
}

const hardcodedPosts: BlogPost[] = [
  { slug: "seo-trends-2025", title: "SEO Trends to Dominate Search Rankings in 2025", excerpt: "Discover the latest SEO trends and strategies that will help your website rank higher in search results this year.", category: "SEO", author: "Ansh", date: "Mar 15, 2025", readTime: "5 min read", color: "#FF4D4D" },
  { slug: "social-media-marketing-strategy", title: "Building a Social Media Marketing Strategy That Works", excerpt: "Learn how to create a comprehensive social media strategy that drives engagement, builds community, and generates leads.", category: "Marketing", author: "Ansh", date: "Mar 12, 2025", readTime: "6 min read", color: "#4D7AFF" },
  { slug: "web-development-trends", title: "Modern Web Development: Frameworks and Best Practices for 2025", excerpt: "Explore the latest web development frameworks, tools, and best practices to build high-performance websites.", category: "Web Development", author: "Deepanshu Singh Adhikari", date: "Mar 10, 2025", readTime: "7 min read", color: "#8B5CF6" },
  { slug: "brand-identity-guide", title: "The Ultimate Guide to Building a Strong Brand Identity", excerpt: "From logo design to brand guidelines, learn everything you need to create a memorable brand identity.", category: "Branding", author: "Pooja", date: "Mar 8, 2025", readTime: "8 min read", color: "#FF4D4D" },
  { slug: "google-ads-optimization", title: "Google Ads Optimization: Tips for Higher ROAS", excerpt: "Proven strategies to optimize your Google Ads campaigns for better performance and higher return on ad spend.", category: "SEO", author: "Ansh", date: "Mar 5, 2025", readTime: "5 min read", color: "#4D7AFF" },
  { slug: "content-marketing-roi", title: "Measuring Content Marketing ROI: A Complete Framework", excerpt: "Learn how to track and measure the return on investment of your content marketing efforts effectively.", category: "Marketing", author: "Avnish Yadav", date: "Mar 3, 2025", readTime: "6 min read", color: "#8B5CF6" },
  { slug: "ecommerce-conversion-optimization", title: "Ecommerce Conversion Optimization: Turn Visitors into Customers", excerpt: "Actionable strategies to improve your ecommerce conversion rates and boost online sales.", category: "Business", author: "Ansh", date: "Feb 28, 2025", readTime: "7 min read", color: "#FF4D4D" },
  { slug: "local-seo-small-business", title: "Local SEO for Small Businesses: A Step-by-Step Guide", excerpt: "Dominate local search results and attract more customers with this comprehensive local SEO guide.", category: "SEO", author: "Ansh", date: "Feb 25, 2025", readTime: "5 min read", color: "#4D7AFF" },
  { slug: "react-website-performance", title: "Optimizing React Website Performance for Better UX", excerpt: "Tips and techniques to improve your React website's performance and deliver a better user experience.", category: "Web Development", author: "Deepanshu Singh Adhikari", date: "Feb 22, 2025", readTime: "6 min read", color: "#8B5CF6" },
  { slug: "email-marketing-best-practices", title: "Email Marketing Best Practices for Higher Engagement", excerpt: "Master the art of email marketing with these proven best practices for open rates and conversions.", category: "Marketing", author: "Ansh", date: "Feb 20, 2025", readTime: "5 min read", color: "#FF4D4D" },
];

const colors = ["#FF4D4D", "#4D7AFF", "#8B5CF6"] as const;

function loadPosts(): BlogPost[] {
  const cms = getAll('blog')
  if (cms.length > 0) {
    return cms.map((p: any, i: number) => ({
      slug: p.slug || p.id,
      title: p.title,
      excerpt: p.excerpt || '',
      category: (p.categories?.[0]) || 'Marketing',
      author: p.author || 'Admin',
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      readTime: `${Math.ceil((p.content || '').split(' ').length / 200) || 3} min read`,
      color: colors[i % colors.length],
    }))
  }
  return hardcodedPosts
}

const getColorClass = (color: string) => {
  if (color === "#FF4D4D") return "doodle-card-red";
  if (color === "#4D7AFF") return "doodle-card-blue";
  if (color === "#8B5CF6") return "doodle-card-purple";
  return "doodle-card";
};

export default function Blog() {
  const [blogPosts] = useState(loadPosts);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = blogPosts.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
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
              {filtered.map((post, i) => (
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
                    className={`block ${getColorClass(post.color)} overflow-hidden h-full group`}
                  >
                    <div className="p-6" style={{ backgroundColor: post.color }}>
                      <span className="px-3 py-1 bg-white border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                        {post.category}
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
                          <p className="text-[#111]/40 text-[10px] mt-0.5">{post.date} - {post.readTime}</p>
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
              ))}
            </AnimatePresence>
          </motion.div>

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

