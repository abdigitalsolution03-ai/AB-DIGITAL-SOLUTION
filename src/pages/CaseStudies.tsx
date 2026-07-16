import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const categories = ["All", "E-Commerce", "SaaS", "Local Business", "Enterprise"];

interface CaseStudy {
  title: string;
  category: string;
  client: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    title: "E-Commerce Revenue Transformation",
    category: "E-Commerce",
    client: "FashionForward",
    challenge: "Struggling with high cart abandonment rates and low conversion rates despite significant traffic.",
    solution: "Implemented a comprehensive CRO strategy including checkout optimization, abandoned cart emails, and personalized product recommendations.",
    metrics: [
      { label: "Revenue Increase", value: "180%" },
      { label: "Cart Abandonment Reduced", value: "45%" },
      { label: "Conversion Rate", value: "4.2%" },
    ]},
  {
    title: "SaaS Platform User Growth",
    category: "SaaS",
    client: "CloudSync Technologies",
    challenge: "Needed to scale user acquisition and reduce churn rates for their B2B SaaS platform.",
    solution: "Developed a multi-channel marketing strategy combining content marketing, paid ads, and email automation with targeted onboarding sequences.",
    metrics: [
      { label: "User Growth", value: "300%" },
      { label: "Churn Rate Reduced", value: "60%" },
      { label: "MRR Growth", value: "250%" },
    ]},
  {
    title: "Local Business Domination",
    category: "Local Business",
    client: "Prestige Dental Care",
    challenge: "Low visibility in local search results and minimal online presence affecting new patient acquisition.",
    solution: "Comprehensive local SEO strategy including GBP optimization, local citations, review management, and location-specific content.",
    metrics: [
      { label: "Local Pack Rankings", value: "Top 3" },
      { label: "New Patients", value: "+400%" },
      { label: "Google Reviews", value: "150+" },
    ]},
  {
    title: "Enterprise Brand Overhaul",
    category: "Enterprise",
    client: "TechVista Inc.",
    challenge: "Outdated brand identity not resonating with modern audience and lacking digital presence cohesion.",
    solution: "Complete brand refresh including new visual identity, website redesign, and integrated digital marketing strategy across all channels.",
    metrics: [
      { label: "Brand Recall", value: "85%" },
      { label: "Website Traffic", value: "+250%" },
      { label: "Lead Generation", value: "+180%" },
    ]},
  {
    title: "D2C Brand Launch Success",
    category: "E-Commerce",
    client: "EcoLiving Co.",
    challenge: "Launching a new D2C sustainable products brand in a competitive market with zero brand awareness.",
    solution: "End-to-end brand launch strategy including influencer partnerships, social media campaigns, and performance marketing.",
    metrics: [
      { label: "First Month Sales", value: "$150K" },
      { label: "Social Following", value: "100K+" },
      { label: "ROAS", value: "4.5x" },
    ]},
  {
    title: "B2B Lead Generation Engine",
    category: "SaaS",
    client: "GrowthLabs",
    challenge: "Inconsistent lead quality and quantity from existing marketing efforts with high cost per lead.",
    solution: "Built a multi-channel lead generation system with targeted LinkedIn ads, content marketing, and automated lead nurturing workflows.",
    metrics: [
      { label: "Monthly Leads", value: "500+" },
      { label: "Cost Per Lead", value: "-70%" },
      { label: "Conversion Rate", value: "25%" },
    ]},
];

export default function CaseStudies() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = caseStudies.filter(
    (cs) => activeCategory === "All" || cs.category === activeCategory
  );

  return (
    <>
      <Helmet>
        <title>Case Studies | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Explore our case studies showcasing real results for our clients. See how AB DIGITAL SOLUTION drives measurable business growth." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Case Studies</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Real <span className="text-[#60A5FA]">Results</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Discover how we've helped businesses achieve remarkable growth through our strategic digital solutions.
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
                      layoutId="caseStudyCategory"
                      className="absolute inset-0 bg-[#60A5FA]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((cs, i) => (
                <motion.div
                  key={cs.title}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div
                    className="doodle-card overflow-hidden cursor-pointer"
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  >
                    <div className="bg-[#60A5FA] border-b-3 border-[#111] px-6 py-4">
                      <span className="text-[#111]/60 text-xs tracking-widest uppercase font-bold">{cs.category}</span>
                      <h3 className="text-[#111] text-xl font-bold mt-1">{cs.title}</h3>
                      <p className="text-[#111]/70 text-sm mt-1">{cs.client}</p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[#111] text-xs tracking-widest uppercase font-bold">Results</span>
                        <motion.div
                          animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-5 h-5 text-[#111]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {cs.metrics.map((metric, j) => (
                          <div key={j} className="text-center">
                            <p className="text-[#60A5FA] text-xl font-black">{metric.value}</p>
                            <p className="text-[#111]/50 text-[10px] uppercase tracking-wider mt-1">{metric.label}</p>
                          </div>
                        ))}
                      </div>
                      <AnimatePresence>
                        {expandedIndex === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t-3 border-[#111] pt-4 mt-4"
                          >
                            <div className="mb-4">
                              <h4 className="text-[#111] text-sm font-black mb-1">The Challenge</h4>
                              <p className="text-[#111]/70 leading-relaxed">{cs.challenge}</p>
                            </div>
                            <div>
                              <h4 className="text-[#111] text-sm font-black mb-1">Our Solution</h4>
                              <p className="text-[#111]/70 leading-relaxed">{cs.solution}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatedSection className="mt-16 text-center">
            <div className="doodle-card p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-[#111]">
                Want Results Like These?
              </h2>
              <p className="text-[#111] mt-3">
                Let's discuss how we can achieve similar success for your business.
              </p>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 mt-6 px-8 py-3.5 text-sm text-white"
              >
                Start Your Success Story
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

