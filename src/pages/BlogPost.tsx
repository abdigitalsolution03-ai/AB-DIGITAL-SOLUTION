import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface BlogPostData {
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  tags: string[];
}

const blogPostsData: Record<string, BlogPostData> = {
  "seo-trends-2025": {
    slug: "seo-trends-2025",
    title: "SEO Trends to Dominate Search Rankings in 2025",
    content: `
      <p>The search landscape is evolving faster than ever. As we move through 2025, staying ahead of SEO trends is crucial for maintaining and improving your search rankings. Here are the key trends shaping the future of SEO.</p>
      
      <h2>AI-Powered Search Optimization</h2>
      <p>Search engines are increasingly using AI to understand user intent and deliver more relevant results. Google's AI algorithms now prioritize content that demonstrates expertise, experience, authoritativeness, and trustworthiness (E-E-A-T). To succeed, focus on creating comprehensive, well-researched content that genuinely helps users.</p>
      
      <h2>Voice Search Optimization</h2>
      <p>With the rise of smart speakers and voice assistants, voice search continues to grow. Optimize for natural language queries and long-tail keywords that mirror how people speak. Focus on conversational content that answers specific questions.</p>
      
      <h2>Core Web Vitals & User Experience</h2>
      <p>Google's Core Web Vitals remain critical ranking factors. Prioritize page speed, interactivity, and visual stability. Implement lazy loading, optimize images, and minimize JavaScript to improve your scores.</p>
      
      <h2>Video Content Optimization</h2>
      <p>Video continues to dominate search results. Optimize your video content with proper titles, descriptions, transcripts, and structured data. YouTube is now the second largest search engine, making video SEO essential.</p>
      
      <h2>Local SEO & Google Business Profile</h2>
      <p>Local search is more important than ever. Keep your Google Business Profile updated, collect positive reviews, and ensure NAP consistency across all directories. Optimize for "near me" searches with location-specific content.</p>
      
      <h2>Structured Data & Rich Snippets</h2>
      <p>Implement structured data markup to help search engines understand your content better. Rich snippets can significantly improve click-through rates by providing users with more information directly in search results.</p>
      
      <p>Staying ahead of these trends requires continuous learning and adaptation. At AB DIGITAL SOLUTION, we help businesses navigate the ever-changing SEO landscape with data-driven strategies that deliver results.</p>
    `,
    category: "SEO",
    author: "Vikram Singh",
    authorRole: "SEO Director at AB DIGITAL SOLUTION",
    date: "Mar 15, 2025",
    readTime: "5 min read",
    tags: ["SEO", "Search Rankings", "Digital Marketing", "2025 Trends"]},
  "social-media-marketing-strategy": {
    slug: "social-media-marketing-strategy",
    title: "Building a Social Media Marketing Strategy That Works",
    content: `
      <p>Social media marketing is no longer optional for businesses. With billions of active users across platforms, a well-crafted social media strategy can transform your brand's online presence and drive measurable results.</p>
      
      <h2>Define Your Goals</h2>
      <p>Start by setting clear, measurable goals. Whether it's brand awareness, lead generation, community building, or customer support, your goals will shape every aspect of your strategy.</p>
      
      <h2>Know Your Audience</h2>
      <p>Understand who your target audience is, what platforms they use, and what content resonates with them. Create detailed buyer personas to guide your content creation and engagement strategies.</p>
      
      <h2>Content Strategy & Calendar</h2>
      <p>Develop a content mix that educates, entertains, and converts. Use a content calendar to plan and schedule posts consistently. Include a variety of formats: images, videos, stories, live streams, and user-generated content.</p>
      
      <h2>Engagement & Community Building</h2>
      <p>Social media is about being social. Respond to comments, engage with your audience, and build a community around your brand. Authentic engagement drives loyalty and word-of-mouth referrals.</p>
      
      <h2>Analytics & Optimization</h2>
      <p>Track your performance metrics and use insights to refine your strategy. Monitor engagement rates, reach, conversions, and ROI. A/B test different content types and posting times to optimize results.</p>
      
      <p>Building an effective social media presence takes time and consistency. Our team at AB DIGITAL SOLUTION specializes in creating social media strategies that deliver real business results.</p>
    `,
    category: "Marketing",
    author: "Priya Sharma",
    authorRole: "Head of Strategy at AB DIGITAL SOLUTION",
    date: "Mar 12, 2025",
    readTime: "6 min read",
    tags: ["Social Media", "Marketing Strategy", "Content", "Engagement"]},
  "web-development-trends": {
    slug: "web-development-trends",
    title: "Modern Web Development: Frameworks and Best Practices for 2025",
    content: `
      <p>The web development landscape continues to evolve with new frameworks, tools, and best practices. Staying current with these trends is essential for building high-performance, maintainable web applications.</p>
      
      <h2>React & Next.js Domination</h2>
      <p>React remains the most popular frontend framework, with Next.js leading the way for production-grade applications. Server Components, streaming, and edge rendering are reshaping how we think about performance and user experience.</p>
      
      <h2>TypeScript Adoption</h2>
      <p>TypeScript has become the standard for serious web development. Its type safety, improved developer experience, and excellent tooling make it indispensable for building scalable applications.</p>
      
      <h2>Web Performance Optimization</h2>
      <p>Core Web Vitals and page speed continue to be critical. Implement code splitting, lazy loading, image optimization, and caching strategies to deliver blazing-fast experiences.</p>
      
      <h2>Responsive & Mobile-First Design</h2>
      <p>With mobile traffic dominating, a mobile-first approach is non-negotiable. Design for mobile screens first, then progressively enhance for larger screens. Use CSS Grid and Flexbox for flexible layouts.</p>
      
      <h2>API-First Development</h2>
      <p>Modern web applications are increasingly API-driven. REST and GraphQL APIs enable decoupled architectures that are more flexible, scalable, and easier to maintain.</p>
      
      <p>At AB DIGITAL SOLUTION, we leverage the latest web technologies to build websites and applications that are fast, reliable, and conversion-optimized.</p>
    `,
    category: "Web Development",
    author: "Ananya Patel",
    authorRole: "Technical Lead at AB DIGITAL SOLUTION",
    date: "Mar 10, 2025",
    readTime: "7 min read",
    tags: ["Web Development", "React", "Next.js", "TypeScript", "Performance"]}};

const defaultPost: BlogPostData = {
  slug: "not-found",
  title: "Post Not Found",
  content: "<p>The blog post you're looking for doesn't exist.</p>",
  category: "",
  author: "",
  authorRole: "",
  date: "",
  readTime: "",
  tags: []};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPostsData[slug] : undefined;
  const data = post || defaultPost;

  return (
    <>
      <Helmet>
        <title>{data.title} | AB DIGITAL SOLUTION Blog</title>
        <meta name="description" content={data.content.replace(/<[^>]*>/g, "").substring(0, 160)} />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          {!post ? (
            <div className="text-center py-20">
              <span className="section-label">Error</span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111] mt-4">Post Not Found</h1>
              <p className="text-[#111] mt-4">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog" className="doodle-btn-accent inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm">
                View All Posts
              </Link>
            </div>
          ) : (
            <>
              <Link to="/blog" className="inline-flex items-center gap-2 text-[#111]/60 text-sm hover:text-[#FFD400] transition-colors duration-300 mb-8">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>

              <AnimatedSection>
                <div className="doodle-card overflow-hidden mb-8">
                  <div className="bg-[#FFD400] border-b-3 border-[#111] px-8 py-6">
                    <span className="px-3 py-1 bg-white border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                      {data.category}
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111] mt-4 tracking-tight">
                      {data.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-10 h-10 bg-white border-3 border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111]">
                        <span className="text-[#111] text-sm font-black">{data.author.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="text-[#111] font-bold">{data.author}</p>
                        <p className="text-[#111]/60 text-xs">{data.date} - {data.readTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-12">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
                    
                    <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t-3 border-[#111]">
                      {data.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-[#FFD400] border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t-3 border-[#111]">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111]">
                          <span className="text-[#111] text-lg font-black">{data.author.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="text-[#111] font-bold">{data.author}</p>
                          <p className="text-[#111]/60">{data.authorRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection className="mt-12 text-center">
                <div className="doodle-card p-10">
                  <h2 className="text-xl md:text-2xl font-black text-[#111]">
                    Get the Latest Insights
                  </h2>
                  <p className="text-[#111] mt-2">
                    Subscribe to our newsletter for more digital marketing tips and strategies.
                  </p>
                  <div className="flex gap-3 max-w-md mx-auto mt-4">
                    <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 bg-white border-3 border-[#111] text-[#111] focus:outline-none placeholder:text-[#111]/30" />
                    <button className="doodle-btn px-5 py-2.5 text-sm text-white font-bold">Subscribe</button>
                  </div>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </>
  );
}
