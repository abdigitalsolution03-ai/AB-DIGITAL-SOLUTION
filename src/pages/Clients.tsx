import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const clientLogos = [
  "TechVista", "GrowthLabs", "StyleHub", "CloudSync", "BoutiqueLiving",
  "FashionForward", "EcoLiving", "Prestige", "GreenLeaf", "NovaTech",
  "Quantum", "Zenith", "ApexSoft", "BrightPath", "CoreInnovate",
  "DynamicCo", "EliteServe", "FusionLab", "GlobalPeak", "HorizonGroup",
];

const stats = [
  { value: "100+", label: "Happy Clients" },
  { value: "15+", label: "Industries Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "92%", label: "Retention Rate" },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, TechVista Inc.",
    content: "AB DIGITAL SOLUTION transformed our online presence. Our traffic increased by 300% within three months. Their strategic approach and attention to detail are unmatched.",
    rating: 5},
  {
    name: "James Chen",
    role: "Founder, GrowthLabs",
    content: "The team at AB DIGITAL SOLUTION delivered beyond our expectations. Our conversion rate doubled, and the ROI on our ad spend has been remarkable.",
    rating: 5},
  {
    name: "Emma Richards",
    role: "Marketing Director, StyleHub",
    content: "Working with AB DIGITAL SOLUTION has been a game-changer. Their branding work gave us a completely new identity that resonates perfectly with our audience.",
    rating: 5},
  {
    name: "David Park",
    role: "CTO, CloudSync",
    content: "From SEO to web development, every service has been top-notch. They truly understand digital strategy and execute flawlessly.",
    rating: 5},
  {
    name: "Lisa Thompson",
    role: "Owner, BoutiqueLiving",
    content: "The Google Ads campaign they managed for us generated a 400% ROI in the first month alone. Their expertise in paid advertising is exceptional.",
    rating: 5},
  {
    name: "Michael Torres",
    role: "CEO, NovaTech Solutions",
    content: "Their website development team built us a stunning platform that perfectly captures our brand essence. The attention to detail was incredible.",
    rating: 5},
];

export default function Clients() {
  return (
    <>
      <Helmet>
        <title>Our Clients | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Trusted by 100+ businesses worldwide. See why clients choose AB DIGITAL SOLUTION for their digital marketing and web development needs." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Clients</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Trusted by <span className="text-[#FFD400]">Industry Leaders</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              We're proud to partner with innovative companies across diverse industries.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="doodle-card p-8 text-center"
                >
                  <span className="text-3xl md:text-4xl font-black text-[#FFD400]">{stat.value}</span>
                  <p className="text-[#111]/60 text-sm mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="section-label">Brands We've Worked With</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#111] mt-4">Our Client Network</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {clientLogos.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="doodle-card h-24 flex items-center justify-center group"
                >
                  <span className="text-[#111]/30 text-lg font-black tracking-tight group-hover:text-[#111] transition-colors duration-300">
                    {name}
                  </span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-20">
            <div className="text-center mb-12">
              <span className="section-label">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#111] mt-4">
                What Our <span className="text-[#FFD400]">Clients Say</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="doodle-card p-8"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-[#FFD400]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#111] leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
                  <div className="mt-6 pt-4 border-t-3 border-[#111]">
                    <p className="text-[#111] font-bold">{t.name}</p>
                    <p className="text-[#111]/50 text-xs mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16 text-center">
            <div className="doodle-card p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-[#111]">
                Join Our Growing Family of Clients
              </h2>
              <p className="text-[#111] mt-3">
                Experience the AB DIGITAL SOLUTION difference. Let's create something remarkable together.
              </p>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 mt-6 px-8 py-3.5 text-sm text-white"
              >
                Become a Client
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
