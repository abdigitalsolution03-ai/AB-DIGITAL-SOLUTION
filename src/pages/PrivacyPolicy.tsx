import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us, including your name, email address, phone number, business name, and any other information you choose to provide when contacting us through our website, forms, or communication channels. We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and browsing behavior through cookies and similar technologies."},
  {
    title: "How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services; to respond to your comments, questions, and requests; to send you technical notices, updates, security alerts, and support messages; to communicate with you about products, services, offers, and events; and to monitor and analyze trends, usage, and activities in connection with our services."},
  {
    title: "Information Sharing",
    content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and business, as long as they agree to keep your information confidential. We may also disclose your information when required by law or to protect our rights."},
  {
    title: "Data Security",
    content: "We implement a variety of security measures to maintain the safety of your personal information when you submit a request or enter, submit, or access your information. These measures include encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure."},
  {
    title: "Cookies",
    content: "Our website uses cookies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can choose to disable cookies through your browser settings, though this may affect certain features of our website. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted)."},
  {
    title: "Third-Party Links",
    content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit. This privacy policy applies solely to information collected by AB DIGITAL SOLUTION."},
  {
    title: "Your Rights",
    content: "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving marketing communications from us by following the unsubscribe instructions in our emails. Depending on your jurisdiction, you may have additional rights under applicable data protection laws."},
  {
    title: "Changes to This Policy",
    content: "We reserve the right to update or change our privacy policy at any time. Any changes will be posted on this page with an updated revision date. We encourage you to periodically review this policy for the latest information on our privacy practices. Continued use of our services after changes constitutes acceptance of the updated policy."},
];

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Read the privacy policy of AB DIGITAL SOLUTION. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[900px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Legal</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Privacy <span className="text-[#60A5FA]">Policy</span>
            </h1>
            <p className="text-[#111] mt-4">
              Last updated: January 1, 2025
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="doodle-card p-10 md:p-14">
              <p className="text-[#111]/70 leading-relaxed mb-10">
                At AB DIGITAL SOLUTION, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully.
              </p>

              <div className="space-y-10">
                {sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-[#111] text-xl font-bold mb-4">{i + 1}. {section.title}</h2>
                    <p className="text-[#111]/70 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t-3 border-[#111]">
                <h2 className="text-[#111] text-xl font-bold mb-4">Contact Us</h2>
                <p className="text-[#111]/70 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:abdigitalsolution03@gmail.com" className="text-[#60A5FA] font-bold hover:underline">abdigitalsolution03@gmail.com</a>.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-8 text-center">
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 text-[#111]/60 text-sm hover:text-[#60A5FA] transition-colors duration-300"
            >
              View Terms of Service
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

