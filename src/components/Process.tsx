import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaSearch, FaCode, FaRocket } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";

const iconMap: Record<string, JSX.Element> = {
  lightbulb: <FaLightbulb className="w-6 h-6" />,
  search: <FaSearch className="w-6 h-6" />,
  code: <FaCode className="w-6 h-6" />,
  rocket: <FaRocket className="w-6 h-6" />,
};

export default function Process() {
  const [data, setData] = useState<{ title: string; steps: { title: string; description: string; icon?: string }[] } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cms_process");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.title) setData(parsed);
      }
    } catch {}
  }, []);

  if (!data) return null;

  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-20">
          <span className="section-label">How We Work</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {data.title}
          </h2>
        </AnimatedSection>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-[#111111] -translate-x-1/2" style={{ opacity: 0.1 }} />

          <div className="space-y-20">
            {data.steps.map((step, i) => (
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
                      <div className="w-12 h-12 flex items-center justify-center mb-4 bg-[#60A5FA] border-3 border-[#111111] text-[#111111]"
                        style={{ borderRadius: "14px", boxShadow: "3px 3px 0px #111111" }}
                      >
                        {step.icon && iconMap[step.icon] ? iconMap[step.icon] : (
                          <span className="text-lg font-bold">{i + 1}</span>
                        )}
                      </div>
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
