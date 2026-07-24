import { useState, useEffect } from "react";
import { FaLightbulb, FaShieldAlt, FaRocket, FaHandshake, FaCogs, FaChartBar } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";

const iconMap: Record<string, JSX.Element> = {
  lightbulb: <FaLightbulb className="w-6 h-6" />,
  shield: <FaShieldAlt className="w-6 h-6" />,
  rocket: <FaRocket className="w-6 h-6" />,
  handshake: <FaHandshake className="w-6 h-6" />,
  cogs: <FaCogs className="w-6 h-6" />,
  chart: <FaChartBar className="w-6 h-6" />,
};

export default function WhyChooseUs() {
  const [data, setData] = useState<{ title: string; items: { title: string; description: string; icon?: string }[] } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cms_whychooseus");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.title) setData(parsed);
      }
    } catch {}
  }, []);

  if (!data) return null;

  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {data.title}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="doodle-card p-8 h-full group">
                <div
                  className="w-12 h-12 flex items-center justify-center mb-5 border-3 border-[#111111] transition-all duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]"
                  style={{ borderRadius: "14px", backgroundColor: "#60A5FA", boxShadow: "3px 3px 0px #111111" }}
                >
                  <span className="text-white">
                    {item.icon && iconMap[item.icon] ? iconMap[item.icon] : (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    )}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
