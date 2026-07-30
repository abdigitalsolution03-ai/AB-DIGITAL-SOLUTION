import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { getAll } from '@/services/cms';

const hardcodedFaqs = [
  {
    q: "What services does AB DIGITAL SOLUTION offer?",
    a: "We offer a comprehensive range of digital marketing and web development services including Website Development, SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, Branding, AI Automation, and Lead Generation."},
  {
    q: "How long does it take to see results?",
    a: "Timelines vary by service. SEO typically shows significant results within 3-6 months, while paid advertising can deliver immediate traffic and leads. Web development projects usually take 4-8 weeks depending on complexity."},
  {
    q: "Do you work with small businesses?",
    a: "Absolutely! We work with businesses of all sizes, from startups to established enterprises. Our Starter package is specifically designed for small businesses looking to establish their digital presence."},
  {
    q: "What industries do you specialize in?",
    a: "We have experience across a wide range of industries including e-commerce, SaaS, healthcare, real estate, finance, education, and professional services. Our strategies are tailored to your specific industry and target audience."},
  {
    q: "How do you measure success?",
    a: "We use data-driven KPIs tailored to your goals including traffic, rankings, conversion rates, ROAS, lead quality, and revenue growth. You'll receive detailed monthly reports with actionable insights."},
  {
    q: "Can I customize my package?",
    a: "Yes! Every business is unique. We offer fully customizable solutions. Contact us for a personalized quote tailored to your specific needs, goals, and budget."},
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState(hardcodedFaqs);

  useEffect(() => {
    const cms = getAll('faqs')
    if (cms.length > 0) {
      setFaqs(cms.map((f: any) => ({ q: f.question, a: f.answer })))
    }
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">FAQ</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Frequently Asked <span className="text-[#60A5FA]">Questions</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div
                  className={`doodle-card overflow-hidden cursor-pointer ${
                    openIndex === i ? "border-[#60A5FA]" : ""
                  }`}
                  onClick={() => toggle(i)}
                >
                  <div className="flex items-center justify-between p-6">
                    <h3 className="text-[#111111] font-bold text-sm md:text-base pr-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {faq.q}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-7 h-7 shrink-0 flex items-center justify-center bg-[#60A5FA] border-2 border-[#111111]"
                      style={{ borderRadius: "8px" }}
                    >
                      <svg
                        className="w-4 h-4 text-[#111111]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  </div>
                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

