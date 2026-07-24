import { useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

interface TeamMember {
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
  "linear-gradient(135deg, #60A5FA, #3B82F6)",
  "linear-gradient(135deg, #FF4D4D, #DC2626)",
  "linear-gradient(135deg, #8B5CF6, #7C3AED)",
];

const stats = [
  { value: "15+", label: "Years Combined Experience" },
  { value: "200+", label: "Happy Clients" },
  { value: "50+", label: "Awards Won" },
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

  return (
    <PageTransition>
      <Helmet>
        <title>Our Team | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Meet the creative minds behind AB DIGITAL SOLUTION. Our team of experts delivers digital marketing excellence." />
      </Helmet>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Our Team</span>
            <h1 className="text-5xl md:text-7xl font-bold text-[#111] mt-6 tracking-tight">
              Meet the <span className="text-[#60A5FA]">Mafia</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              A powerhouse of creative strategists, tech wizards, and marketing mavericks — we don't just follow trends, we set them.
            </p>
          </AnimatedSection>

          {members.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#111] mb-2">No Team Members Yet</h3>
              <p className="text-[#111]/60 max-w-md mx-auto">Team members will appear here once added and published from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
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
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="doodle-card-accent p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#111]">{stat.value}</div>
                  <div className="text-sm font-semibold text-[#111]/70 mt-1">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
            <AnimatedSection delay={0.3}>
              <div className="doodle-card-accent p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#111]">{members.length}</div>
                <div className="text-sm font-semibold text-[#111]/70 mt-1">Core Team Members</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
