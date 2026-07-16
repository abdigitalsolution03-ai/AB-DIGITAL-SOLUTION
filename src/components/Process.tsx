import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We dive deep into your business, goals, and target audience to build a solid foundation."},
  {
    number: "02",
    title: "Research",
    description: "Thorough market analysis and competitor research to identify opportunities and trends."},
  {
    number: "03",
    title: "Planning",
    description: "Strategic roadmap creation with clear milestones, KPIs, and deliverables."},
  {
    number: "04",
    title: "Design",
    description: "Crafting visually stunning and user-centric designs that captivate your audience."},
  {
    number: "05",
    title: "Development",
    description: "Bringing designs to life with clean, performant, and scalable code."},
  {
    number: "06",
    title: "Marketing",
    description: "Launching data-driven campaigns to drive traffic, engagement, and conversions."},
  {
    number: "07",
    title: "Growth",
    description: "Continuous optimization and scaling to maximize ROI and long-term success."},
];

export default function Process() {
  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="section-label">Our Process</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How We <span className="text-[#60A5FA]">Deliver Results</span>
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Center connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-[#111111] -translate-x-1/2" style={{ opacity: 0.1 }} />

          <div className="space-y-20">
            {steps.map((step, i) => (
              <AnimatedSection
                key={i}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 0.1}
              >
                <div
                  className={`flex flex-col ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-8 lg:gap-16`}
                >
                  <div className="flex-1">
                    <div className="doodle-card p-8 lg:p-10">
                      <span className="text-5xl font-bold text-[#60A5FA] opacity-50">
                        {step.number}
                      </span>
                      <h3 className="text-2xl font-bold text-[#111111] mt-4">{step.title}</h3>
                      <p className="text-gray-500 mt-3 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center justify-center w-14 h-14 bg-[#60A5FA] border-4 border-[#111111] text-[#111111] font-bold text-lg z-10"
                    style={{ borderRadius: "50%", boxShadow: "4px 4px 0px #111111" }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

