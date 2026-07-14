import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[9996] transition-all duration-500 bg-white border-b-4 border-[#111111]`}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.span
                className="text-xl font-bold text-[#111111] tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                whileHover={{ scale: 1.02 }}
              >
                AB <span className="text-[#FFD400]">DIGITAL</span>
              </motion.span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative px-4 py-2 text-sm font-semibold transition-colors duration-300 group"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <motion.span
                    className={`relative z-10 transition-colors duration-300 ${
                      isActive(item.href)
                        ? "text-[#111111]"
                        : "text-gray-500 hover:text-[#111111]"
                    }`}
                    whileHover={{ y: -1 }}
                  >
                    {item.label}
                  </motion.span>
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-4 right-4 h-[3px] bg-[#FFD400]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/contact"
                className="doodle-btn-accent"
              >
                Contact Us
              </Link>
            </div>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isMobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-[3px] bg-[#111111] block"
              />
              <motion.span
                animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-[3px] bg-[#111111] block"
              />
              <motion.span
                animate={isMobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-[3px] bg-[#111111] block"
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden border-t-4 border-[#111111] bg-white overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`block py-3 px-4 font-semibold text-sm transition-all duration-300 border-2 border-transparent ${
                        isActive(item.href)
                          ? "text-[#111111] bg-[#FFD400] border-[#111111]"
                          : "text-gray-500 hover:text-[#111111] hover:bg-gray-100"
                      }`}
                      style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="doodle-btn-accent mt-4 text-center block"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
