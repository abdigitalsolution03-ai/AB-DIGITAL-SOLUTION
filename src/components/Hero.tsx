import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const floatingShapes = [
  { size: 80, x: "5%", y: "15%", duration: 6, rotation: 15 },
  { size: 60, x: "90%", y: "25%", duration: 8, rotation: -10 },
  { size: 100, x: "85%", y: "75%", duration: 7, rotation: 20 },
  { size: 50, x: "10%", y: "80%", duration: 9, rotation: -5 },
  { size: 70, x: "50%", y: "10%", duration: 10, rotation: 30 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]});

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20"
    >
      {/* Floating decorative shapes */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: shape.x,
            top: shape.y}}
          animate={{
            y: [0, -20, 10, -5, 0],
            rotate: [0, shape.rotation, -shape.rotation, shape.rotation / 2, 0]}}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut"}}
        >
          <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
            <rect
              x="5" y="5" width="90" height="90"
              fill="none"
              stroke="#111111"
              strokeWidth="4"
              rx="15"
              style={{ opacity: 0.15 }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Paper airplane */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: "75%", top: "20%" }}
        animate={{
          y: [0, -30, 10, -15, 0],
          x: [0, 20, -10, 5, 0],
          rotate: [0, 10, -5, 5, 0]}}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"}}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </motion.div>

      {/* Dashed flight path */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: "70%", top: "15%", width: "200px", height: "200px", opacity: 0.15 }}
        viewBox="0 0 200 200"
      >
        <path
          d="M10,180 Q50,20 120,40 Q180,60 170,120"
          fill="none"
          stroke="#111111"
          strokeWidth="3"
          strokeDasharray="8 8"
          className="animate-dash-move"
        />
      </svg>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-[1280px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#FFD400] border-3 border-[#111111] text-[#111111] text-xs font-bold tracking-widest uppercase mb-8"
          style={{ borderRadius: "14px", boxShadow: "4px 4px 0px #111111" }}
        >
          <span className="w-2 h-2 bg-[#111111]" style={{ borderRadius: "50%" }} />
          Premium Digital Agency
        </motion.div>

        <h1 className="max-w-4xl mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <div className="overflow-hidden">
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-400 tracking-[0.3em]"
            >
              WE ARE
            </motion.span>
          </div>
          <div className="overflow-hidden mt-2">
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-[#111111] tracking-tight"
            >
              AB <span className="text-[#FFD400]">DIGITAL</span> SOLUTION
            </motion.span>
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We help businesses dominate online through SEO, Website Development, Google Ads, Meta Ads, Social Media Marketing, Branding, AI Automation and Lead Generation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="doodle-btn-accent px-8 py-3.5 text-sm"
          >
            Get Free Consultation
          </a>
          <a
            href="#portfolio"
            className="doodle-btn-outline px-8 py-3.5 text-sm"
          >
            View Portfolio
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {[
            { value: "100+", label: "Happy Clients" },
            { value: "500+", label: "Projects Done" },
            { value: "98%", label: "Satisfaction" },
            { value: "5+", label: "Years Experience" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#111111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</div>
              <div className="text-xs text-gray-500 tracking-wider uppercase mt-1 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-3 border-[#111111] flex items-start justify-center pt-2"
          style={{ borderRadius: "12px" }}
        >
          <motion.div className="w-1.5 h-1.5 bg-[#FFD400]" style={{ borderRadius: "50%" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
