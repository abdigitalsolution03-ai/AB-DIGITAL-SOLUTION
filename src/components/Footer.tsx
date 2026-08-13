import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getSiteContent } from "@/services/siteContent";
import SocialIcon from "@/components/SocialIcon";

export default function Footer() {
  const [content, setContent] = useState(getSiteContent());
  return (
    <footer className="relative border-t-4 border-[#111111] bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="text-xl font-bold text-[#111111] tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {content.footer.logo} <span className="text-[#60A5FA]">{content.footer.logoHighlight}</span>
            </Link>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              {content.footer.description}
            </p>
            <p className="text-[#60A5FA] text-xs tracking-widest uppercase mt-4 font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {content.footer.tagline}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {content.contact.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white border-3 border-[#111111] text-[#111111] hover:bg-[#60A5FA] transition-all duration-300"
                  style={{ borderRadius: "10px", boxShadow: "3px 3px 0px #111111" }}
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#111111] font-bold text-sm uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {content.footer.quickLinks.map((link) => (
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
              {content.footer.services.map((service) => (
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
              {content.footer.newsletterHeading}
            </h4>
            <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              {content.footer.newsletterText}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={content.newsletter?.placeholder || "Your email"}
                className="flex-1 px-4 py-2.5 bg-white border-3 border-[#111111] text-[#111111] text-sm focus:outline-none placeholder:text-gray-400"
                style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif" }}
              />
              <motion.button
                whileHover={{ translateX: -2, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 bg-[#60A5FA] text-[#111111] font-bold text-sm border-3 border-[#111111]"
                style={{ borderRadius: "14px", boxShadow: "4px 4px 0px #111111", fontFamily: "'Inter', sans-serif" }}
              >
                {content.newsletter?.buttonText || "Subscribe"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border-t-4 border-[#111111]">
        <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
            &copy; {new Date().getFullYear()} {content.footer.copyright}
          </p>
          <div className="flex items-center gap-6">
            {content.footer.legalLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-gray-400 text-xs hover:text-[#60A5FA] transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

