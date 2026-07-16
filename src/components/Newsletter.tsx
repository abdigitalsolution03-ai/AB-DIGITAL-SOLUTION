import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { getSiteContent } from "@/services/siteContent";

export default function Newsletter() {
  const [content, setContent] = useState(getSiteContent());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const subs = JSON.parse(localStorage.getItem('adminSubscribers') || '[]');
      subs.unshift({ id: Date.now().toString(), email, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem('adminSubscribers', JSON.stringify(subs.slice(0, 1000)));
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="relative py-24 bg-[#60A5FA]">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {content.newsletter.heading}
          </h2>
          <p className="text-[#111111] mt-4 max-w-xl mx-auto opacity-80" style={{ fontFamily: "'Inter', sans-serif" }}>
            {content.newsletter.subtext}
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-4 bg-white border-3 border-[#111111] inline-flex items-center gap-3"
              style={{ borderRadius: "14px", boxShadow: "4px 4px 0px #111111" }}
            >
              <svg className="w-5 h-5 text-[#111111] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-[#111111]" style={{ fontFamily: "'Inter', sans-serif" }}>{content.newsletter.successMessage}</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content.newsletter.placeholder}
                  required
                  className="w-full px-5 py-3.5 bg-white border-3 border-[#111111] text-[#111111] text-sm focus:outline-none placeholder:text-gray-400"
                  style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ translateX: -2, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] text-white font-semibold text-sm border-3 border-[#111111]"
                style={{ borderRadius: "14px", boxShadow: "4px 4px 0px rgba(0,0,0,0.15)", fontFamily: "'Inter', sans-serif" }}
              >
                {content.newsletter.buttonText}
              </motion.button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

