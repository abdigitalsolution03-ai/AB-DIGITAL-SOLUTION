import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | AB DIGITAL SOLUTION</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to AB DIGITAL SOLUTION home page." />
      </Helmet>

      <section className="bg-white min-h-screen flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-block mb-8">
                <motion.span
                  className="text-[150px] md:text-[200px] font-black text-[#60A5FA] leading-none tracking-tighter"
                  animate={{
                    y: [0, -10, 0]}}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  404
                </motion.span>
              </div>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111] mt-4 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-[#111] mt-4 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                to="/"
                className="doodle-btn-accent inline-flex items-center gap-2 px-8 py-3.5 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm text-white"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="flex items-center justify-center gap-8 mt-16">
              {["/", "/services", "/portfolio", "/blog"].map((path, i) => (
                <motion.div
                  key={path}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={path}
                    className="text-[#111]/40 text-xs hover:text-[#60A5FA] transition-colors duration-300 uppercase tracking-wider font-bold"
                  >
                    {path === "/" ? "Home" : path.replace("/", "").replace("/", " ")}
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

