import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { getSiteContent } from "@/services/siteContent";

export default function WhyChooseUs() {
  const [content, setContent] = useState(getSiteContent());
  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">{content.whyChooseUs.label}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {content.whyChooseUs.heading} <span className="text-[#60A5FA]">{content.whyChooseUs.headingHighlight}</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {content.whyChooseUs.subtext}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.whyChooseUs.features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="doodle-card p-8 h-full group">
                <div
                  className="w-12 h-12 flex items-center justify-center mb-5 border-3 border-[#111111] transition-all duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]"
                  style={{ borderRadius: "14px", backgroundColor: feature.color, boxShadow: "3px 3px 0px #111111" }}
                >
                  <span className="text-white">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={feature.icon} />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

