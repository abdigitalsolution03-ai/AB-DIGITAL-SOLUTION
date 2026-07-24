import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

interface BlogPostData {
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

function getBlogPostBySlug(slug: string): BlogPostData | undefined {
  try {
    const raw = localStorage.getItem("cms_db");
    if (!raw) return;
    const data = JSON.parse(raw);
    const posts: BlogPostData[] = data.blog || [];
    return posts.find((p) => p.slug === slug && p.status === "published");
  } catch {
    return;
  }
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const estimateReadTime = (content: string) => {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const min = Math.max(1, Math.ceil(words / 200));
  return `${min} min read`;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | AB DIGITAL SOLUTION</title>
          <meta name="description" content="The blog post you're looking for doesn't exist." />
        </Helmet>
        <section className="bg-white pt-36 pb-20">
          <div className="max-w-[800px] mx-auto px-6">
            <div className="text-center py-20">
              <span className="section-label">Error</span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111] mt-4">Post Not Found</h1>
              <p className="text-[#111] mt-4">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog" className="doodle-btn-accent inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm">
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const seoTitle = post.seo?.title || post.title;
  const seoDesc = post.seo?.description || post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 160);

  return (
    <>
      <Helmet>
        <title>{seoTitle} | AB DIGITAL SOLUTION Blog</title>
        <meta name="description" content={seoDesc} />
        {post.seo?.keywords && <meta name="keywords" content={post.seo.keywords} />}
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        {post.seo?.ogImage && <meta property="og:image" content={post.seo.ogImage} />}
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#111]/60 text-sm hover:text-[#60A5FA] transition-colors duration-300 mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <AnimatedSection>
            <div className="doodle-card overflow-hidden mb-8">
              {post.featuredImage && (
                <div className="w-full h-64 md:h-80 overflow-hidden border-b-3 border-[#111]">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`${post.featuredImage ? "" : "bg-[#60A5FA] border-b-3 border-[#111]"} px-8 py-6`}>
                <span className="px-3 py-1 bg-white border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                  {post.categories[0] || "Uncategorized"}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111] mt-4 tracking-tight">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-10 h-10 bg-white border-3 border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111]">
                    <span className="text-[#111] text-sm font-black">{post.author.split(" ").map((n: string) => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-[#111] font-bold">{post.author}</p>
                    <p className="text-[#111]/60 text-xs">{formatDate(post.createdAt)} - {estimateReadTime(post.content)}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t-3 border-[#111]">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1.5 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-3 border-[#111]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111]">
                      <span className="text-[#111] text-lg font-black">{post.author.split(" ").map((n: string) => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-[#111] font-bold">{post.author}</p>
                      <p className="text-[#111]/60">Author at AB DIGITAL SOLUTION</p>
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
        </div>
      </section>
    </>
  );
}
