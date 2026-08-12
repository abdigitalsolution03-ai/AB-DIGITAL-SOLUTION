import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const defaultTestimonials = [
  {
    name: "Rahul Sharma",
    role: "Owner, Sharma Trading Co.",
    content:
      "AB DIGITAL SOLUTION transformed our online presence. Our traffic increased by 300% within three months. Their strategic approach and attention to detail are unmatched.",
    rating: 5},
  {
    name: "Priya Patel",
    role: "Founder, Patel Boutique",
    content:
      "The team at AB DIGITAL SOLUTION delivered beyond our expectations. Our conversion rate doubled, and the ROI on our ad spend has been remarkable.",
    rating: 5},
  {
    name: "Amit Verma",
    role: "Owner, Verma Electronics",
    content:
      "Working with AB DIGITAL SOLUTION has been a game-changer. Their branding work gave us a completely new identity that resonates perfectly with our customers.",
    rating: 5},
  {
    name: "Neha Gupta",
    role: "Director, Gupta Garments",
    content:
      "From SEO to web development, every service has been top-notch. They truly understand digital strategy and execute flawlessly. Highly recommended.",
    rating: 5},
  {
    name: "Vikram Singh",
    role: "Owner, Singh Sweets & Snacks",
    content:
      "The Google Ads campaign they managed for us generated a 400% ROI in the first month alone. Their expertise in paid advertising is exceptional.",
    rating: 5},
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminTestimonials");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          setTestimonials(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0}),
    center: {
      x: 0,
      opacity: 1},
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0})};

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return (
    <section id="testimonials" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Testimonials</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            What Our <span className="text-[#60A5FA]">Clients Say</span>
          </h2>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="doodle-card p-10 md:p-14 text-center"
              >
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#60A5FA]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#111111] text-lg md:text-xl leading-relaxed italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                  &ldquo;{testimonials[current].content}&rdquo;
                </p>
                <div className="mt-8">
                  <p className="text-[#111111] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{testimonials[current].name}</p>
                  <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{testimonials[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-500 ease-out ${
                  i === current
                    ? "w-10 h-[4px] bg-[#60A5FA]"
                    : "w-6 h-[4px] bg-gray-200 hover:bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

