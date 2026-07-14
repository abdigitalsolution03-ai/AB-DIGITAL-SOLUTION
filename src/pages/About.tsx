import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
}

function Counter({ value, suffix, label }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasStarted]);

  return (
    <div ref={ref} className="text-center">
      <span className="text-5xl md:text-6xl font-black text-[#111]">
        {count}<span className="text-[#FFD400]">{suffix}</span>
      </span>
      <p className="text-[#111]/60 text-sm mt-2 tracking-wider uppercase font-medium">{label}</p>
    </div>
  );
}

const stats: StatProps[] = [
  { value: 100, suffix: "+", label: "Happy Clients" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 5, suffix: "+", label: "Years Experience" },
];

const values = [
  {
    title: "Excellence",
    description: "We strive for perfection in every project, delivering results that exceed expectations.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    )},
  {
    title: "Innovation",
    description: "We stay ahead of digital trends to bring you cutting-edge solutions that drive growth.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    )},
  {
    title: "Transparency",
    description: "Clear communication, honest reporting, and complete visibility into every aspect of your campaigns.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  {
    title: "Results-Driven",
    description: "Every strategy is data-backed and focused on delivering measurable ROI for your business.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    )},
];

const team = [
  { name: "Arjun Bhatia", role: "Founder & CEO", bio: "Visionary leader with 12+ years in digital marketing and technology." },
  { name: "Priya Sharma", role: "Head of Strategy", bio: "Data-driven strategist specializing in growth marketing and analytics." },
  { name: "Rahul Verma", role: "Creative Director", bio: "Award-winning designer passionate about brand storytelling." },
  { name: "Ananya Patel", role: "Technical Lead", bio: "Full-stack developer with expertise in modern web technologies." },
  { name: "Vikram Singh", role: "SEO Director", bio: "SEO specialist with track record of top rankings across industries." },
  { name: "Neha Gupta", role: "Head of Ads", bio: "Paid media expert managing multi-million dollar ad budgets." },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Learn about AB DIGITAL SOLUTION - a premium digital marketing agency transforming brands through digital excellence. Meet our team, values, and story." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="section-label">About Us</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
                Transforming Brands Through{" "}
                <span className="text-[#FFD400]">Digital Excellence</span>
              </h1>
              <p className="text-[#111] mt-6 leading-relaxed">
                At AB DIGITAL SOLUTION, we combine creative strategy with cutting-edge technology to
                deliver digital solutions that drive real business growth. Our team of experts is
                passionate about helping brands establish a powerful online presence.
              </p>
              <p className="text-[#111]/70 mt-4 leading-relaxed">
                Founded in 2020, we started with a simple mission: make premium digital marketing accessible
                to businesses of all sizes. From startups to established enterprises, we&apos;ve partnered with
                100+ businesses to transform their digital footprint through data-driven strategies,
                stunning design, and results-focused execution.
              </p>
              <Link
                to="/contact"
                className="doodle-btn-accent inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm"
              >
                Start Your Journey
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="doodle-card p-8">
                    <Counter {...stat} />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-[#FFD400] py-[100px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label bg-[#111] text-white">Our Values</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight">
              What We <span className="text-[#111]">Stand For</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="doodle-card p-8 h-full group">
                  <div className="w-12 h-12 bg-[#111] flex items-center justify-center text-[#FFD400] mb-5 border-3 border-[#111] shadow-[3px_3px_0_#111] group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#111] mb-3">{value.title}</h3>
                  <p className="text-[#111]/70 leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-[100px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight">
              Meet the <span className="text-[#FFD400]">Experts</span>
            </h2>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              A diverse team of passionate professionals dedicated to your success.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="doodle-card p-8 group">
                  <div className="w-16 h-16 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center mb-5 shadow-[3px_3px_0_#111]">
                    <span className="text-2xl font-black text-[#111]">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#111]">{member.name}</h3>
                  <p className="text-[#FFD400] font-bold mt-1">{member.role}</p>
                  <p className="text-[#111]/70 mt-3 leading-relaxed">{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FFD400] py-[100px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label bg-[#111] text-white">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight">
              The Journey <span className="text-[#111]">So Far</span>
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                { year: "2020", title: "The Beginning", desc: "AB DIGITAL SOLUTION was founded with a vision to provide premium digital marketing services to businesses worldwide." },
                { year: "2021", title: "First 50 Clients", desc: "Within a year, we onboarded 50+ clients and expanded our team to meet growing demand." },
                { year: "2022", title: "Service Expansion", desc: "We launched new service lines including AI automation, video editing, and influencer marketing." },
                { year: "2023", title: "Industry Recognition", desc: "Received multiple industry awards for excellence in digital marketing and web development." },
                { year: "2024", title: "Global Reach", desc: "Expanded operations internationally, serving clients across North America, Europe, and Asia." },
                { year: "2025", title: "100+ Clients Milestone", desc: "Celebrated 100+ happy clients and 500+ successful projects with a 98% satisfaction rate." },
              ].map((item, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="doodle-card p-8 flex gap-6">
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-white border-3 border-[#111] flex items-center justify-center shadow-[3px_3px_0_#111]">
                        <span className="text-[#111] font-bold text-sm">{item.year}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#111]">{item.title}</h3>
                      <p className="text-[#111]/70 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
