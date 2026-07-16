import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { getSiteContent } from "@/services/siteContent";

export default function Contact() {
  const [content, setContent] = useState(getSiteContent());
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    business: "",
    service: "",
    message: ""});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, service, message } = formData;
    const leads = JSON.parse(localStorage.getItem('adminLeads') || '[]');
    const newLead = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      message,
      service,
      read: false,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    leads.unshift(newLead);
    localStorage.setItem('adminLeads', JSON.stringify(leads.slice(0, 500)));

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="relative py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Contact</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] mt-4 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {content.contact.heading}
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {content.contact.subtext}
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="w-full h-[300px] overflow-hidden doodle-border mb-12" style={{ borderRadius: "20px", padding: "3px" }}>
            <iframe
              src={content.contact.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AB DIGITAL SOLUTION Location"
            />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <form onSubmit={handleSubmit} className="doodle-card p-8 md:p-10 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Business Name"
                name="business"
                value={formData.business}
                onChange={handleChange}
              />
              <div>
                <label className="block text-[#111111] text-sm font-bold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Required Service <span className="text-[#60A5FA]">*</span>
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border-3 border-[#111111] text-[#111111] text-sm focus:outline-none transition-all duration-300 appearance-none"
                  style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif", boxShadow: "3px 3px 0px #111111" }}
                >
                  <option value="">Select a service</option>
                  {content.contact.serviceOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#111111] text-sm font-bold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Message <span className="text-[#60A5FA]">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-3 border-[#111111] text-[#111111] text-sm focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-400"
                  style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif", boxShadow: "3px 3px 0px #111111" }}
                  placeholder="Tell us about your project..."
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ translateX: -2, translateY: -2 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-[#60A5FA] text-[#111111] font-bold text-sm border-3 border-[#111111] transition-all duration-300"
                style={{ borderRadius: "14px", boxShadow: "4px 4px 0px #111111", fontFamily: "'Inter', sans-serif" }}
              >
                {submitted ? "Message Sent!" : "Contact Us"}
              </motion.button>
            </form>
          </AnimatedSection>

          <AnimatedSection direction="right" className="space-y-6">
            <div className="doodle-card p-8 md:p-10">
              <h3 className="text-[#111111] text-lg font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Contact Information</h3>
              <div className="space-y-5">
                <ContactInfo
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  label="Email"
                  value={content.contact.info.email}
                />
                <ContactInfo
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                  label="Phone"
                  value={content.contact.info.phone}
                />
                <ContactInfo
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  label="Location"
                  value={content.contact.info.location}
                />
              </div>
            </div>

            <div className="doodle-card p-8 md:p-10">
              <h3 className="text-[#111111] text-lg font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Follow Us</h3>
              <div className="flex items-center gap-4">
                {content.contact.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="w-10 h-10 flex items-center justify-center bg-white border-3 border-[#111111] text-[#111111] hover:bg-[#60A5FA] transition-all duration-300"
                    style={{ borderRadius: "12px", boxShadow: "3px 3px 0px #111111" }}
                    aria-label={social.platform}
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

      <motion.a
        href={content.contact.info.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-8 z-[9997] w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-3 border-[#111111]"
        style={{ borderRadius: "50%", backgroundColor: "#25D366", boxShadow: "4px 4px 0px #111111" }}
        aria-label="WhatsApp"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>

      <motion.a
        href={`tel:${content.contact.info.phone}`}
        className="fixed bottom-8 right-8 z-[9997] w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 border-3 border-[#111111]"
        style={{ borderRadius: "50%", backgroundColor: "#60A5FA", boxShadow: "4px 4px 0px #111111" }}
        aria-label="Call us"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-7 h-7 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </motion.a>
    </section>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[#111111] text-sm font-bold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}
        {required && <span className="text-[#60A5FA] ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-white border-3 border-[#111111] text-[#111111] text-sm focus:outline-none transition-all duration-300 placeholder:text-gray-400"
        style={{ borderRadius: "14px", fontFamily: "'Inter', sans-serif", boxShadow: "3px 3px 0px #111111" }}
        placeholder={`Your ${label.toLowerCase()}`}
        required={required}
      />
    </div>
  );
}

function ContactInfo({
  icon,
  label,
  value}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 flex items-center justify-center bg-[#60A5FA] border-3 border-[#111111] text-[#111111] shrink-0"
        style={{ borderRadius: "12px", boxShadow: "3px 3px 0px #111111" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs tracking-wider uppercase font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
        <p className="text-[#111111] text-sm font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}

