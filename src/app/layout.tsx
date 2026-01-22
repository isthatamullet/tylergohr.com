import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/redesign";

export const metadata: Metadata = {
  title: "Tyler Gohr - Content Operations Leader",
  description:
    "Emmy Award-winning content operations leader with 16+ years building systems that scale. From Fox Corporation to Warner Bros, transforming chaos into operations that deliver results.",
  keywords: [
    "content operations",
    "digital operations",
    "content management",
    "Emmy Award",
    "Fox Corporation",
    "Warner Bros",
    "CMS architecture",
    "DAM systems",
    "localization",
    "AI integration",
    "streaming platforms",
    "portfolio",
  ],
  authors: [{ name: "Tyler Gohr" }],
  creator: "Tyler Gohr",
  publisher: "Tyler Gohr",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tylergohr.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tyler Gohr - Content Operations Leader",
    description:
      "Emmy Award-winning content operations leader with 16+ years building systems that scale.",
    url: "https://tylergohr.com",
    siteName: "Tyler Gohr",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tyler Gohr - Content Operations Leader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tyler Gohr - Content Operations Leader",
    description:
      "Emmy Award-winning content operations leader with 16+ years building systems that scale.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Tyler Gohr",
              jobTitle: "Content Operations Leader",
              description:
                "Emmy Award-winning content operations leader with 16+ years building systems that scale at Fox Corporation, Warner Bros, and SDI Media.",
              url: "https://tylergohr.com",
              sameAs: [
                "https://github.com/isthatamullet",
                "https://linkedin.com/in/tylergohr",
              ],
              knowsAbout: [
                "Content Operations",
                "CMS Architecture",
                "Digital Asset Management",
                "Localization",
                "Quality Assurance",
                "AI/ML Integration",
                "Streaming Platforms",
                "Process Optimization",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Content Operations Leader",
                description:
                  "Building content operations that scale—from Emmy-winning streaming platforms to AI-powered intelligence systems",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://tylergohr.com",
              },
              award: [
                {
                  "@type": "Award",
                  name: "Emmy Award",
                  description: "Outstanding Trans-Media Sports Coverage - 2018 FIFA World Cup",
                },
              ],
              worksFor: [
                {
                  "@type": "Organization",
                  name: "Fox Corporation",
                  description: "Lead Content Operator (2017-2022)",
                },
                {
                  "@type": "Organization",
                  name: "Warner Bros",
                  description: "Metadata Technician, SME (2012-2014)",
                },
              ],
            }),
          }}
        />

        {/* Preload hero background for better LCP */}
        <link
          rel="preload"
          as="image"
          href="/images/backgrounds/hero-bg.webp"
          type="image/webp"
        />
      </head>
      <body>
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

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
