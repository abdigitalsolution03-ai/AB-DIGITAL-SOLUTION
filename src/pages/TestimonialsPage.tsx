import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  category: string;
}

const hardcodedTestimonials: Testimonial[] = [
  { name: "Rakesh Pandey", role: "Director, Star X Institute Private Limited", content: "Our online presence has never been stronger, thanks to the team's expertise and dedication.", rating: 5, category: "Social Media" },
  { name: "Suraj Paul", role: "Gmd Financial Services", content: "Our online presence has never been stronger, thanks to the team's expertise and dedication.", rating: 5, category: "SEO" },
  { name: "Sapan Kumar", role: "Director, Vidya Vibe Academy", content: "Our online presence has never been stronger, thanks to the team's expertise and dedication.", rating: 5, category: "Social Media" },
];

export default function TestimonialsPage() {
  const [testimonials] = useState(hardcodedTestimonials);
  return (
    <>
      <Helmet>
        <title>Testimonials | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Hear from our clients about their experience working with AB DIGITAL SOLUTION. Read genuine testimonials from businesses we've helped grow." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Testimonials</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              What Our <span className="text-[#60A5FA]">Clients Say</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about their experience.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                viewport={{ once: true, margin: "-50px" }}
                className="doodle-card p-8 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-[#60A5FA]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="px-3 py-1 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-xs font-bold shadow-[2px_2px_0_#111]">
                    {t.category}
                  </span>
                </div>
                <div className="mb-6">
                  <svg className="w-6 h-6 text-[#60A5FA]/30 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 10.999H10v10H0z" />
                  </svg>
                  <p className="text-[#111] leading-relaxed">{t.content}</p>
                </div>
                <div className="pt-4 border-t-3 border-[#111]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111]">
                      <span className="text-[#111] text-sm font-black">{t.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-[#111] font-bold">{t.name}</p>
                      <p className="text-[#111]/50 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="mt-16 text-center">
            <div className="doodle-card p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-[#111]">
                Ready to Become Our Next Success Story?
              </h2>
              <p className="text-[#111] mt-3">
                Join 100+ businesses that trust AB DIGITAL SOLUTION for their digital growth.
              </p>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 mt-6 px-8 py-3.5 text-sm text-white"
              >
                Start Your Journey
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


