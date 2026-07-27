import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { getSiteContent } from "@/services/siteContent";

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="doodle-card p-8 text-center group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-5xl md:text-6xl font-bold text-[#111111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {count}
          <span className="text-[#60A5FA]">{suffix}</span>
        </span>
      </motion.div>
      <p className="text-gray-500 text-sm mt-2 tracking-wider uppercase font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
    </div>
  );
}

export default function About() {
  const [content, setContent] = useState(getSiteContent());
  return (
    <section id="about" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <span className="section-label">{content.about.label}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {content.about.heading}{" "}
              <span className="text-[#60A5FA]">{content.about.headingHighlight}</span>
            </h2>
            <p className="text-gray-500 mt-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {content.about.paragraphs[0]}
            </p>
            <p className="text-gray-400 mt-4 leading-relaxed text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              {content.about.paragraphs[1]}
            </p>
            <a
              href={content.about.ctaLink}
              className="inline-flex items-center gap-2 mt-8 text-[#111111] font-bold text-sm group doodle-btn-accent"
            >
              {content.about.cta}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="grid grid-cols-2 gap-6">
              {content.about.stats.map((stat, i) => (
                <Counter key={i} {...stat} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

