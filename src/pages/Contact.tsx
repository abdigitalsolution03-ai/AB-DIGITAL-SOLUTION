import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

const serviceOptions = [
  "Website Development", "SEO Optimization", "Google Ads", "Meta Ads",
  "Social Media Marketing", "Content Marketing", "Branding", "AI Automation",
  "Lead Generation", "Influencer Marketing", "Video Editing", "Email Marketing",
  "Local SEO", "YouTube Marketing", "Other",
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", business: "", service: "", message: ""});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | AB DIGITAL SOLUTION</title>
        <meta name="description" content="Get in touch with AB DIGITAL SOLUTION. Book a free consultation and let's discuss how we can help grow your business." />
      </Helmet>

      <section className="bg-white pt-36 pb-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label">Contact</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] mt-4 tracking-tight">
              Let's <span className="text-[#60A5FA]">Work Together</span>
            </h1>
            <p className="text-[#111] mt-4 max-w-2xl mx-auto">
              Ready to take your digital presence to the next level? Get in touch with us today.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="doodle-card overflow-hidden mb-12">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.914770972!2d-74.119763!3d40.697403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1"
                width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AB DIGITAL SOLUTION Location"
              />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection direction="left">
              <form onSubmit={handleSubmit} className="doodle-card p-8 md:p-10 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                  <InputField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <InputField label="Business Name" name="business" value={formData.business} onChange={handleChange} />
                <div>
                  <label className="block text-[#111] text-sm font-bold mb-2">
                    Required Service <span className="text-[#60A5FA]">*</span>
                  </label>
                  <select
                    name="service" value={formData.service} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none"
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#111] text-sm font-bold mb-2">Message</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange}
                    rows={4} placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="doodle-btn-accent w-full py-3.5 text-sm"
                >
                  {submitted ? "Message Sent!" : "Contact Us"}
                </motion.button>
              </form>
            </AnimatedSection>

            <AnimatedSection direction="right" className="space-y-6">
              <div className="doodle-card p-8 md:p-10">
                <h3 className="text-[#111] text-lg font-bold mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <ContactInfo
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    label="Email" value="abdigitalsolution03@gmail.com"
                  />
                  <ContactInfo
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                    label="Phone" value="+91 81785-26092"
                  />
                  <ContactInfo
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    label="Location" value="New York, NY 10001"
                  />
                </div>
              </div>

              <div className="doodle-card p-8 md:p-10">
                <h3 className="text-[#111] text-lg font-bold mb-4">Business Hours</h3>
                <div className="space-y-3">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b-3 border-[#111] last:border-b-0">
                      <span className="text-[#111]/60">{item.day}</span>
                      <span className="text-[#111] font-bold">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="doodle-card p-8 md:p-10">
                <h3 className="text-[#111] text-lg font-bold mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  {["Facebook", "Instagram", "LinkedIn", "Twitter"].map((social) => (
                    <a
                      key={social} href="#"
                      className="w-10 h-10 border-3 border-[#111] flex items-center justify-center text-[#111]/60 hover:text-[#60A5FA] hover:bg-[#60A5FA] transition-all duration-300"
                      aria-label={social}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}

function InputField({
  label, name, type = "text", value, onChange, required = false}: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[#111] text-sm font-bold mb-2">
        {label}{required && <span className="text-[#60A5FA] ml-1">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none placeholder:text-[#111]/30"
        placeholder={`Your ${label.toLowerCase()}`} required={required}
      />
    </div>
  );
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center text-[#111] shrink-0 shadow-[2px_2px_0_#111]">
        {icon}
      </div>
      <div>
        <p className="text-[#111]/60 text-xs tracking-wider uppercase font-bold">{label}</p>
        <p className="text-[#111] font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

