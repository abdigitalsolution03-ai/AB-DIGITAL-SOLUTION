import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { getSiteContent } from "@/services/siteContent";

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
        {count}<span className="text-[#60A5FA]">{suffix}</span>
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

export default function About() {
  const [content, setContent] = useState(getSiteContent());
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
              <span className="section-label">{content.about.label}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
                {content.about.heading}{" "}
                <span className="text-[#60A5FA]">{content.about.headingHighlight}</span>
              </h1>
              <p className="text-[#111] mt-6 leading-relaxed">
                {content.about.paragraphs[0]}
              </p>
              <p className="text-[#111]/70 mt-4 leading-relaxed">
                {content.about.paragraphs[1]}
              </p>
              <Link
                to={content.about.ctaLink}
                className="doodle-btn-accent inline-flex items-center gap-2 mt-8 px-8 py-3.5 text-sm"
              >
                {content.about.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-6">
                {content.about.stats.map((stat, i) => (
                  <div key={i} className="doodle-card p-8">
                    <Counter {...stat} />
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
            {content.aboutPage.values.map((value, i) => (
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

      <section className="bg-white py-[100px]" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight" style={{ color: '#111111' }}>
              Meet the <span className="text-[#60A5FA]" style={{ color: '#60A5FA' }}>Experts</span>
            </h2>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto" style={{ color: '#111111' }}>
              A diverse team of passionate professionals dedicated to your success.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.aboutPage.team.map((member, i) => {
              const imageMap: Record<string, string> = {
                'Avnish Yadav': '/team/page_1.png',
                'Bobby': '/team/page_2.png',
                'Rajneesh': '/team/page_3.png',
                'Ansh|Video Shooting': '/team/page_4.png',
                'Ansh|Social Media Manager': '/team/ansh_smm.png',
                'Abhay': '/team/page_5.png',
                'Subham': '/team/page_6.png',
                'Deepanshu Singh Adhikari': '/team/page_7.png',
                'Pooja': '/team/page_8.png',
              }
              const photo = imageMap[`${member.name}|${member.role}`] || imageMap[member.name] || ''
              return (
                <div
                  key={`${member.name}-${member.role}-${i}`}
                  className="p-8 group rounded-2xl border-2 border-[#111111]"
                  style={{ backgroundColor: '#ffffff', color: '#111111', borderColor: '#111111', boxShadow: '4px 4px 0 0 #111111' }}
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={member.name}
                      className="w-16 h-16 object-cover mb-5 border-3 border-[#111]"
                      style={{ borderColor: '#111111', borderRadius: '9999px' }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center mb-5 shadow-[3px_3px_0_#111]">
                      <span className="text-2xl font-black text-[#111]">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold" style={{ color: '#111111' }}>{member.name}</h3>
                  <p className="text-[#60A5FA] font-bold mt-1" style={{ color: '#60A5FA' }}>{member.role}</p>
                  <p className="text-[#111]/70 mt-3 leading-relaxed" style={{ color: '#4b5563' }}>{member.bio}</p>
                </div>
              )
            })}
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
              {content.aboutPage.timeline.map((item, i) => (
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

