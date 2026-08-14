import { motion } from "framer-motion";

const services = [
  "Website Development", "SEO", "Google Ads", "Meta Ads", "Social Media Marketing",
  "Content Marketing", "Branding", "AI Automation", "Lead Generation",
  "Video Editing", "YouTube Management", "Google My Business",
];

export default function TrustedBrands() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-10 text-center">
        <span className="section-label">What We Do</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mt-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Our Services
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 md:gap-6 items-center"
          animate={{
            x: [0, -1920]}}
          transition={{
            x: {
              duration: 40,
              repeat: Infinity,
              ease: "linear"}}}
        >
          {[...services, ...services, ...services].map((service, i) => (
            <div
              key={i}
              className="shrink-0 px-4 md:px-6 py-2 md:py-3 bg-white border-3 border-[#111111]"
              style={{ borderRadius: "20px", boxShadow: "4px 4px 0px #111111" }}
            >
              <span className="text-base md:text-lg lg:text-xl font-bold text-[#111111] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {service}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
