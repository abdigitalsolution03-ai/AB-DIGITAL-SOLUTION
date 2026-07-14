# AB DIGITAL SOLUTION — Premium Digital Marketing Agency

A luxury, modern, dark-themed digital marketing agency website built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and GSAP.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion, GSAP
- **Icons:** Lucide React
- **Font:** Manrope (via Google Fonts)

## Features

- Sticky glassmorphism navbar with blur effect
- Animated hero with floating particles and mouse interaction
- Interactive text animations (letter-by-letter reveal, golden underline)
- Premium service cards with glass effect and hover lift
- Animated counter statistics
- Portfolio with category filtering and smooth transitions
- Timeline process section with scroll animation
- Testimonial auto-slider
- Pricing cards with popular plan highlight
- Animated FAQ accordion
- Contact form with service selection, Google Map, floating WhatsApp & Call buttons
- Custom cursor with magnetic effect
- Scroll progress bar
- Back to top button
- Premium loading screen
- Full responsive design
- SEO optimized with meta tags, Open Graph, sitemap, robots.txt

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import repository on Vercel
3. Deploy

### Netlify

1. Push to GitHub
2. Import repository on Netlify
3. Build command: `npm run build`
4. Output directory: `.next`
5. Deploy

## Custom Domain

1. Add your custom domain in Vercel/Netlify dashboard
2. Configure DNS records as instructed
3. SSL/HTTPS is automatically handled

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Site URL (defaults to https://abdigitalsolution.com) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page composition
│   └── globals.css     # Global styles and theme
├── components/
│   ├── Header.tsx       # Sticky navigation
│   ├── Hero.tsx         # Hero section
│   ├── Services.tsx     # Services grid
│   ├── About.tsx        # About + stats
│   ├── Portfolio.tsx    # Project showcase
│   ├── Process.tsx      # Work process timeline
│   ├── WhyChooseUs.tsx  # Features
│   ├── Testimonials.tsx # Client reviews
│   ├── Pricing.tsx      # Pricing plans
│   ├── FAQ.tsx          # Questions accordion
│   ├── Contact.tsx      # Form + map + floating buttons
│   ├── Footer.tsx       # Site footer
│   ├── AnimatedSection.tsx
│   ├── BackToTop.tsx
│   ├── Loader.tsx
│   ├── PremiumCursor.tsx
│   ├── ScrollProgressBar.tsx
│   └── TextAnimation.tsx
└──── ...
```

## License

All rights reserved. AB DIGITAL SOLUTION.
