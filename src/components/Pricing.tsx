import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { getSiteContent } from "@/services/siteContent";

export default function Pricing() {
  const [content, setContent] = useState(getSiteContent());
  return (
    <section id="pricing" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">{content.pricing.label}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {content.pricing.heading} <span className="text-[#60A5FA]">{content.pricing.headingHighlight}</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {content.pricing.subtext}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {content.pricing.plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ translateY: -4 }}
                className={`relative doodle-card p-8 h-full flex flex-col ${
                  plan.popular ? "border-[#60A5FA]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#60A5FA] border-3 border-[#111111] text-[#111111] text-xs font-bold tracking-wider uppercase whitespace-nowrap"
                    style={{ borderRadius: "10px", boxShadow: "3px 3px 0px #111111" }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#111111]">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#111111]">
                      {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-400 text-sm ml-1">/month</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{plan.description}</p>
                </div>
                <div className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <motion.a
                  href="#contact"
                  whileHover={{ translateX: -2, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block text-center py-3 px-6 font-bold text-sm transition-all duration-300 border-3 border-[#111111] ${
                    plan.popular
                      ? "doodle-btn-accent"
                      : "doodle-btn-outline"
                  }`}
                  style={{ borderRadius: "14px" }}
                >
                  Get Started
                </motion.a>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

