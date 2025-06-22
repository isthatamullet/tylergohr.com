import type { Metadata, Viewport } from 'next'
import './globals.css'
import PerformanceOptimizations from '@/components/PerformanceOptimizations'
import WebVitals from '@/components/WebVitals'
import TopNavigation from '@/components/TopNavigation'

export const metadata: Metadata = {
  title: 'Tyler Gohr - Full-Stack Developer & Creative Problem Solver',
  description: 'Interactive portfolio showcasing cutting-edge web development, innovative solutions, and technical mastery through creative digital experiences.',
  keywords: ['full-stack developer', 'react', 'next.js', 'typescript', 'creative web development', 'portfolio', 'invoice chaser', 'saas', 'javascript', 'node.js', 'postgresql', 'google cloud'],
  authors: [{ name: 'Tyler Gohr' }],
  creator: 'Tyler Gohr',
  publisher: 'Tyler Gohr',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tylergohr.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tyler Gohr - Full-Stack Developer & Creative Problem Solver',
    description: 'Interactive portfolio showcasing cutting-edge web development, innovative solutions, and technical mastery through creative digital experiences.',
    url: 'https://tylergohr.com',
    siteName: 'Tyler Gohr Portfolio',
    images: [
      {
        url: '/og-image.png', // TODO: Create OG image
        width: 1200,
        height: 630,
        alt: 'Tyler Gohr - Full-Stack Developer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tyler Gohr - Full-Stack Developer & Creative Problem Solver',
    description: 'Interactive portfolio showcasing cutting-edge web development, innovative solutions, and technical mastery.',
    images: ['/og-image.png'], // TODO: Create Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // TODO: Add verification codes when ready for production
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Tyler Gohr",
              "jobTitle": "Full-Stack Developer",
              "description": "Creative full-stack developer specializing in React, Next.js, Node.js, and innovative web solutions",
              "url": "https://tylergohr.com",
              "sameAs": [
                "https://github.com/isthatamullet",
                "https://linkedin.com/in/tylergohr"
              ],
              "knowsAbout": [
                "JavaScript",
                "TypeScript", 
                "React",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "Google Cloud Platform",
                "Full-Stack Development",
                "SaaS Applications",
                "API Development"
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Full-Stack Developer",
                "description": "Developing innovative web applications and creative digital solutions"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://tylergohr.com"
              }
            })
          }}
        />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-portfolio-dark text-portfolio-text-primary antialiased">
        {/* Skip Navigation for Accessibility */}
        <a 
          href="#main-content" 
          className="skip-nav"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        
        {/* Accessibility announcement region */}
        <div 
          id="accessibility-announcements" 
          aria-live="polite" 
          aria-atomic="true"
          className="sr-only"
        />
        
        {/* Performance optimizations */}
        <PerformanceOptimizations />
        
        {/* Web Vitals monitoring */}
        <WebVitals />
        
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Main application content */}
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  )
}