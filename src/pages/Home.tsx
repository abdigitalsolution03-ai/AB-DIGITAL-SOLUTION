import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Awards from "@/components/Awards";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBrands />
      <About />
      <Services />
      <Portfolio />
      <Process />
      <WhyChooseUs />
      <Awards />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Newsletter />
      <Contact />
    </>
  );
}
