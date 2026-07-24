import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

interface CmsAbout {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: { label: string; value: number }[];
}

interface CmsTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  status: string;
}

function Counter({ value, label }: { value: number; label: string }) {
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
        {count}<span className="text-[#60A5FA]">+</span>
      </span>
      <p className="text-[#111]/60 text-sm mt-2 tracking-wider uppercase font-medium">{label}</p>
    </div>
  );
}

const iconSvg = (d: string) => (
  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const defaultAbout: CmsAbout = {
  title: "About Us",
  subtitle: "About Us",
  description: "At AB DIGITAL SOLUTION, we combine creative strategy with cutting-edge technology to deliver digital solutions that drive real business growth. Our team of experts is passionate about helping brands establish a powerful online presence.\n\nFrom startups to established enterprises, we've partnered with 100+ businesses to transform their digital footprint through data-driven strategies, stunning design, and results-focused execution.",
  image: "",
  stats: [
    { label: "Happy Clients", value: 100 },
    { label: "Projects Completed", value: 500 },
    { label: "Client Satisfaction", value: 98 },
    { label: "Years Experience", value: 5 },
  ],
};

const defaultValues = [
  { title: "Excellence", description: "We strive for perfection in every project, delivering results that exceed expectations.", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { title: "Innovation", description: "We stay ahead of digital trends to bring you cutting-edge solutions that drive growth.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Transparency", description: "Clear communication, honest reporting, and complete visibility into every aspect of your campaigns.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { title: "Results-Driven", description: "Every strategy is data-backed and focused on delivering measurable ROI for your business.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

const defaultTimeline = [
  { year: "2020", title: "The Beginning", desc: "AB DIGITAL SOLUTION was founded with a vision to provide premium digital marketing services to businesses worldwide." },
  { year: "2021", title: "First 50 Clients", desc: "Within a year, we onboarded 50+ clients and expanded our team to meet growing demand." },
  { year: "2022", title: "Service Expansion", desc: "We launched new service lines including AI automation, video editing, and influencer marketing." },
  { year: "2023", title: "Industry Recognition", desc: "Received multiple industry awards for excellence in digital marketing and web development." },
  { year: "2024", title: "Global Reach", desc: "Expanded operations internationally, serving clients across North America, Europe, and Asia." },
  { year: "2025", title: "100+ Clients Milestone", desc: "Celebrated 100+ happy clients and 500+ successful projects with a 98% satisfaction rate." },
];

function loadAbout(): CmsAbout {
  try {
    const stored = localStorage.getItem("cms_about");
    if (stored) return { ...defaultAbout, ...JSON.parse(stored) };
  } catch {}
  return defaultAbout;
}

function loadTeam(): CmsTeamMember[] {
  try {
    const stored = localStorage.getItem("cms_db");
    if (stored) {
      const db = JSON.parse(stored);
      if (db.team) return db.team.filter((m: CmsTeamMember) => m.status === "published");
    }
  } catch {}
  return [];
}

export default function About() {
  const [about] = useState(loadAbout);
  const [team] = useState(loadTeam);
  const paragraphs = about.description.split("\n\n").filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{about.title} | AB DIGITAL SOLUTION</title>
        <meta name="description" content={paragraphs[0] || about.description} />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="section-label">{about.subtitle}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
                {about.title}{" "}
                <span className="text-[#60A5FA]">Digital Excellence</span>
              </h1>
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[#111] mt-6 leading-relaxed" : "text-[#111]/70 mt-4 leading-relaxed"}>
                  {p}
                </p>
              ))}
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
                {about.stats.map((stat, i) => (
                  <div key={i} className="doodle-card p-8">
                    <Counter value={stat.value} label={stat.label} />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-[#60A5FA] py-[100px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label bg-[#111] text-white">Our Values</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight">
              What We <span className="text-[#111]">Stand For</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {defaultValues.map((value, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="doodle-card p-8 h-full group">
                  <div className="w-12 h-12 bg-[#111] flex items-center justify-center text-[#60A5FA] mb-5 border-3 border-[#111] shadow-[3px_3px_0_#111] group-hover:scale-110 transition-transform duration-300">
                    {iconSvg(value.icon)}
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
              Meet the <span className="text-[#60A5FA]">Experts</span>
            </h2>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              A diverse team of passionate professionals dedicated to your success.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-[#111]/50 text-lg">No team members added yet.</p>
              </div>
            ) : (
              team.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.05}>
                  <div className="doodle-card p-8 group">
                    <div className="w-16 h-16 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center mb-5 shadow-[3px_3px_0_#111]">
                      <span className="text-2xl font-black text-[#111]">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111]">{member.name}</h3>
                    <p className="text-[#60A5FA] font-bold mt-1">{member.role}</p>
                    <p className="text-[#111]/70 mt-3 leading-relaxed">{member.bio}</p>
                  </div>
                </AnimatedSection>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#60A5FA] py-[100px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label bg-[#111] text-white">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight">
              The Journey <span className="text-[#111]">So Far</span>
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {defaultTimeline.map((item, i) => (
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