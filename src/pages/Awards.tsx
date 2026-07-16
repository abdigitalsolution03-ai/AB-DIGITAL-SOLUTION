import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface Award {
  title: string;
  organization: string;
  year: string;
  category: string;
  description: string;
}

const awards: Award[] = [
  {
    title: "Best Digital Marketing Agency",
    organization: "Marketing Excellence Awards",
    year: "2025",
    category: "Agency of the Year",
    description: "Recognized for outstanding performance in digital marketing strategy and execution across multiple client campaigns."},
  {
    title: "Gold – Best Website Design",
    organization: "Web Design Awards International",
    year: "2025",
    category: "Web Development",
    description: "Awarded for exceptional UI/UX design and technical implementation of an e-commerce platform."},
  {
    title: "SEO Campaign of the Year",
    organization: "Search Engine Land Awards",
    year: "2024",
    category: "SEO",
    description: "Honored for a groundbreaking SEO campaign that achieved top rankings for a highly competitive industry."},
  {
    title: "Platinum – Social Media Excellence",
    organization: "Social Media Marketing Awards",
    year: "2024",
    category: "Social Media",
    description: "Recognized for an innovative social media strategy that drove unprecedented engagement and brand awareness."},
  {
    title: "Best PPC Campaign",
    organization: "PPC Advertising Awards",
    year: "2024",
    category: "Advertising",
    description: "Awarded for a high-performance Google Ads campaign achieving exceptional ROAS for a B2B client."},
  {
    title: "Top 10 Digital Agencies",
    organization: "Digital Agency Network",
    year: "2024",
    category: "Industry Recognition",
    description: "Listed among the top 10 digital agencies for consistent delivery of outstanding results and client satisfaction."},
  {
    title: "Innovation in Branding",
    organization: "Brand Innovation Awards",
    year: "2023",
    category: "Branding",
    description: "Recognized for a comprehensive brand transformation that repositioned a legacy brand for modern audiences."},
  {
    title: "Excellence in Content Marketing",
    organization: "Content Marketing Institute",
    year: "2023",
    category: "Content",
    description: "Awarded for a content marketing strategy that established thought leadership and drove significant organic growth."},
  {
    title: "Rising Star Agency",
    organization: "Marketing Week Awards",
    year: "2022",
    category: "Industry Recognition",
    description: "Named Rising Star for rapid growth and exceptional client results within the first two years of operation."},
];

const stats = [
  { value: "12+", label: "Awards Won" },
  { value: "5", label: "Industry Categories" },
  { value: "3", label: "Consecutive Years" },
  { value: "98%", label: "Award-to-Nomination Ratio" },
];

export default function Awards() {
  return (
    <>
      <Helmet>
        <title>Awards & Recognition | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Discover the awards and industry recognition earned by AB DIGITAL SOLUTION for excellence in digital marketing, web development, and branding." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Awards & Recognition</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Celebrating <span className="text-[#60A5FA]">Excellence</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by leading industry organizations worldwide.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="doodle-card p-8 text-center"
                >
                  <span className="text-3xl md:text-4xl font-black text-[#60A5FA]">{stat.value}</span>
                  <p className="text-[#111]/60 text-sm mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <div className="space-y-5">
            {awards.map((award, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <motion.div
                  className="doodle-card p-8 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center shadow-[3px_3px_0_#111] group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-[#111] font-bold text-lg">{award.title}</h3>
                        <span className="px-3 py-1 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                          {award.year}
                        </span>
                      </div>
                      <p className="text-[#60A5FA] font-bold">{award.organization}</p>
                      <p className="text-[#111]/50 text-xs mt-1 uppercase tracking-wider font-bold">{award.category}</p>
                      <p className="text-[#111]/70 mt-2 leading-relaxed">{award.description}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

