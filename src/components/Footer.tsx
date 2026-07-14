import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Website Development",
  "SEO",
  "Google Ads",
  "Meta Ads",
  "Social Media Marketing",
  "Content Marketing",
  "Branding",
  "AI Automation",
  "Lead Generation",
];

export default function Footer() {
  return (
    <footer className="relative border-t-4 border-[#111111] bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="text-xl font-bold text-[#111111] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AB <span className="text-[#FFD400]">DIGITAL</span>
            </Link>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              Premium digital marketing and web development agency delivering data-driven results for
              brands worldwide.
            </p>
            <p className="text-[#FFD400] text-xs tracking-widest uppercase mt-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your Growth. Our Strategy.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {["Facebook", "Instagram", "LinkedIn", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center bg-white border-3 border-[#111111] text-[#111111] hover:bg-[#FFD400] transition-all duration-300"
                  style={{ borderRadius: "10px", boxShadow: "3px 3px 0px #111111" }}
                  aria-label={social}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#111111] font-bold text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-500 text-sm hover:text-[#111111] transition-colors duration-300 animated-underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#111111] font-bold text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-gray-500 text-sm hover:text-[#111111] transition-colors duration-300 animated-underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#111111] font-bold text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Newsletter
            </h4>
            <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Stay updated with the latest digital marketing insights.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-white border-3 border-[#111111] text-[#111111] text-sm focus:outline-none placeholder:text-gray-400"
                style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif" }}
              />
              <motion.button
                whileHover={{ translateX: -2, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 bg-[#FFD400] text-[#111111] font-bold text-sm border-3 border-[#111111]"
                style={{ borderRadius: "14px", boxShadow: "4px 4px 0px #111111", fontFamily: "'Inter', sans-serif" }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border-t-4 border-[#111111]">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
            &copy; {new Date().getFullYear()} AB DIGITAL SOLUTION. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-gray-400 text-xs hover:text-[#FFD400] transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 text-xs hover:text-[#FFD400] transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
