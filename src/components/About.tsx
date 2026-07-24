import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FaChartLine, FaSmile, FaProjectDiagram, FaTrophy } from "react-icons/fa";
import AnimatedSection from "./AnimatedSection";

const iconMap: Record<string, JSX.Element> = {
  chart: <FaChartLine className="w-6 h-6" />,
  smile: <FaSmile className="w-6 h-6" />,
  project: <FaProjectDiagram className="w-6 h-6" />,
  trophy: <FaTrophy className="w-6 h-6" />,
};

function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
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
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="doodle-card p-8 text-center group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-5xl md:text-6xl font-bold text-[#111111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {count}
          <span className="text-[#60A5FA]">{suffix}</span>
        </span>
      </motion.div>
      <p className="text-gray-500 text-sm mt-2 tracking-wider uppercase font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
    </div>
  );
}

export default function About() {
  const [data, setData] = useState<{ title: string; subtitle: string; description: string; image: string; stats: { label: string; value: number; suffix?: string; icon?: string }[] } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cms_about");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.title) setData(parsed);
      }
    } catch {}
  }, []);

  if (!data) return null;

  return (
    <section id="about" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="left">
            <span className="section-label">{data.subtitle}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.title}
            </h2>
            <p className="text-gray-500 mt-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {data.description}
            </p>
            {data.image && (
              <img src={data.image} alt={data.title} className="mt-8 rounded-2xl w-full max-w-md shadow-xl" />
            )}
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="grid grid-cols-2 gap-6">
              {data.stats?.map((stat, i) => (
                <Counter key={i} value={stat.value} suffix={stat.suffix || "+"} label={stat.label} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
