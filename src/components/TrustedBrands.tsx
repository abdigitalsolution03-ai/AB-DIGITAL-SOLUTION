import { motion } from "framer-motion";

const brands = [
  "Google", "Meta", "Amazon", "Microsoft", "Shopify",
  "HubSpot", "Salesforce", "Adobe", "Mailchimp", "Canva",
  "WordPress", "Webflow", "Stripe", "Zapier", "Calendly",
  "Slack", "Notion", "Figma", "Vercel", "Netlify",
];

export default function TrustedBrands() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-10 text-center">
        <span className="section-label">Trusted Partners</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mt-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Brands We Work With
        </h2>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 items-center"
          animate={{
            x: [0, -1920]}}
          transition={{
            x: {
              duration: 40,
              repeat: Infinity,
              ease: "linear"}}}
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="shrink-0 px-6 py-3 bg-white border-3 border-[#111111]"
              style={{ borderRadius: "20px", boxShadow: "4px 4px 0px #111111" }}
            >
              <span className="text-lg md:text-xl font-bold text-[#111111] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {brand}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
