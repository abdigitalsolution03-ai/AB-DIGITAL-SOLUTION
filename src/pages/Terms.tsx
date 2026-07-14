import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using the AB DIGITAL SOLUTION website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access our services. We reserve the right to update these terms at any time without prior notice."},
  {
    title: "Services Description",
    content: "AB DIGITAL SOLUTION provides digital marketing services including but not limited to search engine optimization (SEO), pay-per-click advertising (PPC), social media marketing, content marketing, web development, branding, and graphic design. The specific scope of services will be outlined in individual service agreements."},
  {
    title: "Intellectual Property",
    content: "All content, materials, and deliverables created by AB DIGITAL SOLUTION for clients, including designs, code, copy, and marketing strategies, are the intellectual property of AB DIGITAL SOLUTION until full payment is received. Upon full payment, ownership of deliverable assets is transferred to the client, unless otherwise specified in the service agreement."},
  {
    title: "Client Responsibilities",
    content: "Clients agree to provide timely access to necessary information, assets, and approvals required for project completion. Clients are responsible for ensuring they have the legal right to use any materials, trademarks, or content provided to AB DIGITAL SOLUTION for project execution."},
  {
    title: "Payment Terms",
    content: "Payment terms are outlined in individual service agreements. Unless otherwise specified, payments are due within 30 days of invoice date. Late payments may result in service suspension and additional fees. All prices are in USD unless otherwise stated."},
  {
    title: "Confidentiality",
    content: "Both parties agree to maintain the confidentiality of proprietary information shared during the course of the business relationship. This includes but is not limited to business strategies, client data, financial information, and marketing plans. This obligation survives termination of the agreement."},
  {
    title: "Limitation of Liability",
    content: "AB DIGITAL SOLUTION shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services. Our total liability for any claims shall not exceed the total amount paid by the client for the specific service giving rise to the claim."},
  {
    title: "Termination",
    content: "Either party may terminate the service agreement with written notice as specified in the individual agreement. Upon termination, client shall pay for all services rendered up to the termination date. Any materials or work in progress will be delivered to the client upon full payment."},
  {
    title: "Governing Law",
    content: "These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of New York County."},
];

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Read the terms of service for AB DIGITAL SOLUTION. Understand the terms and conditions governing the use of our digital marketing services." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[900px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Legal</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Terms of <span className="text-[#FFD400]">Service</span>
            </h1>
            <p className="text-[#111] mt-4">
              Last updated: January 1, 2025
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="doodle-card p-10 md:p-14">
              <p className="text-[#111]/70 leading-relaxed mb-10">
                Please read these Terms of Service carefully before using our website or services. By accessing or using AB DIGITAL SOLUTION, you agree to be bound by these terms.
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
                <h2 className="text-[#111] text-xl font-bold mb-4">Contact</h2>
                <p className="text-[#111]/70 leading-relaxed">
                  For questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:abdigitalsolution03@gmail.com" className="text-[#FFD400] font-bold hover:underline">abdigitalsolution03@gmail.com</a>.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-8 text-center">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center gap-2 text-[#111]/60 text-sm hover:text-[#FFD400] transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
              </svg>
              View Privacy Policy
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
