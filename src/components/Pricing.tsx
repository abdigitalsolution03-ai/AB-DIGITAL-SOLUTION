import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const plans = [
  {
    name: "Starter",
    price: "999",
    description: "Perfect for small businesses starting their digital journey.",
    features: [
      "Website Development (5 Pages)",
      "Basic SEO Setup",
      "Social Media Setup",
      "Monthly Analytics Report",
      "Email Support",
    ],
    popular: false},
  {
    name: "Professional",
    price: "2,499",
    description: "Ideal for growing businesses seeking comprehensive digital solutions.",
    features: [
      "Website Development (10 Pages)",
      "Advanced SEO Strategy",
      "Google Ads Management",
      "Meta Ads Management",
      "Content Marketing (4 posts/mo)",
      "Priority Support",
      "Monthly Strategy Call",
    ],
    popular: true},
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations with complex needs.",
    features: [
      "Custom Web Application",
      "Enterprise SEO Suite",
      "Multi-Platform Ad Management",
      "AI Automation Integration",
      "Full Branding Package",
      "Dedicated Account Manager",
      "24/7 Priority Support",
      "Quarterly Business Review",
    ],
    popular: false},
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Pricing</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Transparent <span className="text-[#FFD400]">Plans</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Choose the plan that fits your needs. All plans include a free consultation.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ translateY: -4 }}
                className={`relative doodle-card p-8 h-full flex flex-col ${
                  plan.popular ? "border-[#FFD400]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FFD400] border-3 border-[#111111] text-[#111111] text-xs font-bold tracking-wider uppercase whitespace-nowrap"
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
                        className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5"
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
