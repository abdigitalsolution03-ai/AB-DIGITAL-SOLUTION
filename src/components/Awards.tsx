import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const awards = [
  {
    year: "2024",
    title: "Best Digital Marketing Agency",
    organization: "Global Business Awards"},
  {
    year: "2024",
    title: "Top SEO Service Provider",
    organization: "Search Engine Land"},
  {
    year: "2023",
    title: "Excellence in Web Development",
    organization: "Webby Awards"},
  {
    year: "2023",
    title: "Best Branding Campaign",
    organization: "Design Rush"},
  {
    year: "2023",
    title: "Fastest Growing Agency",
    organization: "Inc. 5000"},
  {
    year: "2022",
    title: "Innovation in AI Marketing",
    organization: "Martech Awards"},
];

export default function Awards() {
  return (
    <section id="awards" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Recognition</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Our <span className="text-[#60A5FA]">Awards</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Industry recognition that reflects our commitment to excellence and innovation.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ translateX: -4, translateY: -4 }}
                className="doodle-card p-8 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[#60A5FA]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-[#111111] bg-[#60A5FA] px-3 py-1 border-2 border-[#111111]" style={{ borderRadius: "8px", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {award.year}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#111111] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{award.title}</h3>
                <p className="text-[#60A5FA] font-semibold text-sm mb-0" style={{ fontFamily: "'Inter', sans-serif" }}>{award.organization}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

