import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";

const departments = ["All", "Development", "Marketing", "Design", "Sales", "Operations"];

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const jobs: Job[] = [
  {
    id: "senior-react-developer",
    title: "Senior React Developer",
    department: "Development",
    location: "Remote / New York",
    type: "Full-time",
    description: "We're looking for an experienced React developer to lead frontend projects and mentor junior developers.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Experience with Next.js", "Strong UI/UX sensibilities", "Excellent problem-solving skills"]},
  {
    id: "seo-specialist",
    title: "SEO Specialist",
    department: "Marketing",
    location: "New York",
    type: "Full-time",
    description: "Join our SEO team to execute data-driven strategies that improve search rankings and drive organic growth.",
    requirements: ["3+ years SEO experience", "Proficiency with SEO tools", "Strong analytical skills", "Content strategy experience", "Knowledge of local SEO"]},
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create beautiful, intuitive interfaces for web and mobile applications that delight users.",
    requirements: ["3+ years UI/UX design experience", "Figma proficiency", "Portfolio of past work", "User research experience", "Design system knowledge"]},
  {
    id: "ppc-specialist",
    title: "PPC Advertising Specialist",
    department: "Marketing",
    location: "New York",
    type: "Full-time",
    description: "Manage and optimize paid advertising campaigns across Google, Meta, and other platforms.",
    requirements: ["3+ years PPC experience", "Google Ads certification", "Meta Ads expertise", "Data analysis skills", "Budget management experience"]},
  {
    id: "content-writer",
    title: "Content Writer & Strategist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Create compelling content that drives engagement and establishes thought leadership for our clients.",
    requirements: ["3+ years content writing experience", "SEO content knowledge", "Excellent writing skills", "Research capabilities", "Content strategy experience"]},
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    department: "Development",
    location: "Remote / New York",
    type: "Full-time",
    description: "Build scalable web applications using modern technologies across the full stack.",
    requirements: ["4+ years full-stack experience", "React & Node.js expertise", "Database design skills", "API development experience", "Cloud platform knowledge"]},
  {
    id: "account-manager",
    title: "Account Manager",
    department: "Sales",
    location: "New York",
    type: "Full-time",
    description: "Manage client relationships and ensure the successful delivery of our digital marketing services.",
    requirements: ["3+ years account management", "Digital marketing knowledge", "Excellent communication", "Project management skills", "Client relationship experience"]},
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    description: "Create stunning visual assets for digital and print marketing materials.",
    requirements: ["2+ years graphic design experience", "Adobe Creative Suite proficiency", "Brand identity experience", "Strong typography skills", "Motion design is a plus"]},
  {
    id: "operations-coordinator",
    title: "Operations Coordinator",
    department: "Operations",
    location: "New York",
    type: "Full-time",
    description: "Support daily operations and help streamline processes across the organization.",
    requirements: ["2+ years operations experience", "Project management tools", "Organizational skills", "Process improvement mindset", "Data entry and analysis"]},
];

const perks = [
  { title: "Remote-First Culture", description: "Work from anywhere. We believe in flexibility and trust.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" /></svg> },
  { title: "Competitive Compensation", description: "Top-tier salaries, equity options, and performance bonuses.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { title: "Growth & Development", description: "Learning budget, conferences, and career advancement opportunities.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg> },
  { title: "Health & Wellness", description: "Comprehensive health, dental, and vision insurance coverage.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
];

export default function Careers() {
  const [activeDepartment, setActiveDepartment] = useState("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const filtered = jobs.filter(
    (j) => activeDepartment === "All" || j.department === activeDepartment
  );

  return (
    <>
      <Helmet>
        <title>Careers | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Join the AB DIGITAL SOLUTION team. Explore career opportunities in digital marketing, web development, design, and more." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Careers</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Join Our <span className="text-[#60A5FA]">Team</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Help us shape the future of digital marketing. We're looking for passionate people to join our growing team.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-[#111] text-center mb-8">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="doodle-card p-6 text-center group"
                >
                  <div className="w-12 h-12 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center text-[#111] mx-auto mb-4 shadow-[3px_3px_0_#111] group-hover:scale-110 transition-transform duration-300">
                    {perk.icon}
                  </div>
                  <h3 className="text-[#111] font-bold">{perk.title}</h3>
                  <p className="text-[#111]/60 text-xs mt-2">{perk.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="section-label">Open Positions</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#111] mt-4">Current Openings</h2>
              <p className="text-[#111] mt-2">{filtered.length} position{filtered.length !== 1 ? "s" : ""} available</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDepartment(dept)}
                  className={`relative px-5 py-2 text-sm font-bold transition-all duration-300 border-3 border-[#111] ${
                    activeDepartment === dept ? "bg-[#60A5FA] text-[#111]" : "bg-white text-[#111] hover:bg-[#60A5FA]"
                  }`}
                >
                  {activeDepartment === dept && (
                    <motion.span
                      layoutId="jobDepartment"
                      className="absolute inset-0 bg-[#60A5FA]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{dept}</span>
                </button>
              ))}
            </div>

            <motion.div layout className="space-y-4 max-w-4xl mx-auto">
              <AnimatePresence mode="popLayout">
                {filtered.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="doodle-card p-6 cursor-pointer"
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-[#111] font-bold text-lg">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-[#60A5FA] text-xs font-bold">{job.department}</span>
                            <span className="text-[#111]/40">-</span>
                            <span className="text-[#111]/60 text-xs">{job.location}</span>
                            <span className="text-[#111]/40">-</span>
                            <span className="px-2.5 py-0.5 bg-[#60A5FA] border-2 border-[#111] text-[#111] text-[10px] font-bold shadow-[2px_2px_0_#111]">
                              {job.type}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          animate={{ rotate: expandedJob === job.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-[#111]/40 hover:text-[#60A5FA] transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.button>
                      </div>
                      <AnimatePresence>
                        {expandedJob === job.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t-3 border-[#111] mt-4 pt-4"
                          >
                            <p className="text-[#111]/70 mb-4">{job.description}</p>
                            <h4 className="text-[#111] font-black mb-2">Requirements:</h4>
                            <ul className="space-y-2 mb-6">
                              {job.requirements.map((req, j) => (
                                <li key={j} className="flex items-start gap-2 text-[#111]/70">
                                  <svg className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {req}
                                </li>
                              ))}
                            </ul>
                            <Link
                              to="/contact"
                              className="doodle-btn-accent inline-flex items-center gap-2 px-6 py-2.5 text-sm"
                            >
                              Apply Now
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection className="mt-16 text-center">
            <div className="doodle-card p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-[#111]">
                Don't See the Right Role?
              </h2>
              <p className="text-[#111] mt-3">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind.
              </p>
              <Link
                to="/contact"
                className="doodle-btn inline-flex items-center gap-2 mt-6 px-8 py-3.5 text-sm text-white"
              >
                Send Your Resume
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

