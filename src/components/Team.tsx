import { useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: { platform: string; url: string }[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

const gradients = [
  "linear-gradient(135deg, #60A5FA, #3B82F6)",
  "linear-gradient(135deg, #FF4D4D, #DC2626)",
  "linear-gradient(135deg, #8B5CF6, #7C3AED)",
  "linear-gradient(135deg, #10B981, #059669)",
  "linear-gradient(135deg, #F59E0B, #D97706)",
  "linear-gradient(135deg, #EC4899, #DB2777)",
];

function getCMSData(): TeamMember[] {
  try {
    const raw = localStorage.getItem("cms_db");
    if (!raw) return [];
    const data = JSON.parse(raw);
    return data.team || [];
  } catch {
    return [];
  }
}

export default function Team() {
  const members = useMemo(() => {
    const all = getCMSData();
    return all.filter((m) => m.status === "published");
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Our Team</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-4 tracking-tight">
            Meet the <span className="text-[#60A5FA]">Experts</span>
          </h2>
          <p className="text-[#111] mt-4 max-w-2xl mx-auto">
            Talented professionals dedicated to your success.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, i) => (
            <AnimatedSection key={member.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                className="doodle-card p-8 text-center group"
              >
                {member.image ? (
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#111] overflow-hidden mb-5">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 mx-auto rounded-full border-4 border-[#111] flex items-center justify-center text-3xl font-bold text-white mb-5"
                    style={{ background: gradients[i % gradients.length] }}
                  >
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#111] mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-[#60A5FA] mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm mb-4">{member.bio}</p>
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="flex items-center justify-center gap-3">
                    {member.socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border-2 border-[#111] flex items-center justify-center text-[#111] hover:bg-[#60A5FA] hover:border-[#60A5FA] transition-colors duration-200"
                      >
                        <span className="text-[10px] font-bold">{link.platform[0]}</span>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
