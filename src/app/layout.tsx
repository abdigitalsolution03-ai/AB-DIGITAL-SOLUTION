import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PremiumCursor from "@/components/PremiumCursor";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import BackToTop from "@/components/BackToTop";
import Loader from "@/components/Loader";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"});

export const metadata: Metadata = {
  title: "AB DIGITAL SOLUTION | Premium Digital Marketing Agency",
  description:
    "We help brands generate more leads, sales, and revenue through SEO, Google Ads, Meta Ads, Web Development, Branding, and AI Automation.",
  keywords: [
    "digital marketing agency",
    "SEO",
    "Google Ads",
    "web development",
    "branding",
    "AI automation",
  ],
  openGraph: {
    title: "AB DIGITAL SOLUTION | Premium Digital Marketing Agency",
    description:
      "Your Growth. Our Strategy. Premium digital marketing & web development agency.",
    type: "website",
    locale: "en_US"}};

export default function RootLayout({
  children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="font-sans bg-primary-bg text-body antialiased">
        <Loader />
        <PremiumCursor />
        <ScrollProgressBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
