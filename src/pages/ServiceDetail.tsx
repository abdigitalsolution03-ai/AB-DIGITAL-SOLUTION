import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";

interface CmsService {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  iconPath: string;
  benefits: string[];
  process: { step: string; description: string }[];
  results: string[];
}

interface CmsFaq {
  id: string;
  question: string;
  answer: string;
  status: string;
}

function loadServices(): CmsService[] {
  try {
    const stored = localStorage.getItem("cms_services");
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function loadFaqs(): CmsFaq[] {
  try {
    const stored = localStorage.getItem("cms_db");
    if (stored) {
      const db = JSON.parse(stored);
      if (db.faqs) return db.faqs.filter((f: CmsFaq) => f.status === "published");
    }
  } catch {}
  return [];
}

export default function ServiceDetail() {
  const { service: slug } = useParams<{ service: string }>();
  const [services] = useState(loadServices);
  const [faqs] = useState(loadFaqs);
  const serviceData = services.find(s => s.id === slug) || null;

  if (!serviceData) {
    return (
      <>
        <Helmet>
          <title>Service Not Found | AB DIGITAL SOLUTION</title>
          <meta name="description" content="The service you're looking for doesn't exist." />
        </Helmet>
        <section className="bg-white pt-36 pb-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center py-20">
              <span className="section-label">Error</span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111] mt-4">Service Not Found</h1>
              <p className="text-[#111] mt-4">The service you're looking for doesn't exist.</p>
              <Link to="/services" className="doodle-btn-accent inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm">
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{serviceData.title} | AB DIGITAL SOLUTION</title>
        <meta name="description" content={serviceData.description} />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <AnimatedSection direction="left">
              <Link to="/services" className="inline-flex items-center gap-2 text-[#111]/60 text-sm hover:text-[#60A5FA] transition-colors duration-300 mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
                </svg>
                Back to Services
              </Link>
              <div className="w-16 h-16 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center text-[#111] mb-6 shadow-[3px_3px_0_#111]">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={serviceData.iconPath} />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] tracking-tight">
                {serviceData.title}
              </h1>
              <p className="text-[#111] text-lg mt-6 leading-relaxed">{serviceData.longDescription}</p>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm text-white"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="doodle-card p-10">
                <h3 className="text-[#111] text-xl font-bold mb-6">Key Benefits</h3>
                <div className="space-y-4">
                  {serviceData.benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-[#60A5FA] border-2 border-[#111] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[#111]">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="section-label">Our Process</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#111] mt-4">How We Work</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {serviceData.process.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="doodle-card p-8"
                >
                  <div className="w-10 h-10 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center text-[#111] font-black text-sm mb-4 shadow-[2px_2px_0_#111]">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-[#111] mb-2">{step.step}</h3>
                  <p className="text-[#111]/70 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {faqs.length > 0 && (
            <AnimatedSection className="mt-20">
              <div className="text-center mb-12">
                <span className="section-label">FAQ</span>
                <h2 className="text-3xl md:text-4xl font-black text-[#111] mt-4">Frequently Asked Questions</h2>
              </div>
              <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((faq) => (
                  <FaqItem key={faq.id} faq={faq} />
                ))}
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection className="mt-20">
            <div className="doodle-card-accent p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-[#111] tracking-tight">
                Ready to Transform Your{" "}
                <span className="text-[#111]">Digital Presence</span>?
              </h2>
              <p className="text-[#111] mt-4 max-w-xl mx-auto">
                Let&apos;s discuss how our {serviceData.title} service can help you achieve your business goals.
              </p>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm text-white"
              >
                Contact Us
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

function FaqItem({ faq }: { faq: CmsFaq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="doodle-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-[#111] font-bold">{faq.question}</span>
        <svg
          className={`w-5 h-5 text-[#111] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <p className="text-[#111]/70 leading-relaxed">{faq.answer}</p>
        </div>
      </motion.div>
    </div>
  );
}