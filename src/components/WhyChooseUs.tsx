import AnimatedSection from "./AnimatedSection";

const features = [
  {
    title: "Fast Delivery",
    description: "Swift project turnaround without compromising on quality or attention to detail.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "#FF4D4D"},
  {
    title: "Transparent Pricing",
    description: "No hidden fees, no surprises. Clear pricing with detailed breakdowns for every project.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#4D7AFF"},
  {
    title: "Expert Team",
    description: "Industry veterans with proven track records across digital marketing and development.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "#8B5CF6"},
  {
    title: "24x7 Support",
    description: "Round-the-clock support team ready to assist you whenever you need us.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#FFD400"},
  {
    title: "ROI Focused",
    description: "Every strategy is data-driven and designed to deliver maximum return on investment.",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: "#FF4D4D"},
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Built for <span className="text-[#FFD400]">Excellence</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            What sets us apart and makes us the preferred partner for businesses worldwide.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="doodle-card p-8 h-full group">
                <div
                  className="w-12 h-12 flex items-center justify-center mb-5 border-3 border-[#111111] transition-all duration-300 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]"
                  style={{ borderRadius: "14px", backgroundColor: feature.color, boxShadow: "3px 3px 0px #111111" }}
                >
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
