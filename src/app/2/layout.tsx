import type { Metadata, Viewport } from "next";
import "../globals.css";
import "./styles/brand-tokens.css";
import PerformanceOptimizations from "@/components/PerformanceOptimizations";
import WebVitals from "@/components/WebVitals";
import TopNavigation from "@/components/TopNavigation";

export const metadata: Metadata = {
  title: "Tyler Gohr - Enterprise Solutions Architect",
  description:
    "Creating powerful digital solutions that solve real business problems. From Emmy Award-winning streaming platforms to custom business solutions, I architect digital products that deliver measurable impact.",
  keywords: [
    "enterprise solutions architect",
    "digital solutions",
    "business applications",
    "custom software development",
    "react",
    "next.js",
    "typescript",
    "Emmy Award",
    "Fox Corporation",
    "Warner Bros",
    "streaming platforms",
    "portfolio",
    "technical consulting",
    "full-stack development",
    "system architecture",
    "business value",
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
    canonical: "/2",
  },
  openGraph: {
    title: "Tyler Gohr - Enterprise Solutions Architect",
    description:
      "Creating powerful digital solutions that solve real business problems. From Emmy Award-winning streaming platforms to custom business solutions.",
    url: "https://tylergohr.com/2",
    siteName: "Tyler Gohr - Enterprise Solutions",
    images: [
      {
        url: "/og-image-enterprise.png",
        width: 1200,
        height: 630,
        alt: "Tyler Gohr - Enterprise Solutions Architect Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tyler Gohr - Enterprise Solutions Architect",
    description:
      "Creating powerful digital solutions that solve real business problems. Emmy Award-winning platforms & custom business solutions.",
    images: ["/og-image-enterprise.png"],
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
  verification: {
    // TODO: Add verification codes when ready for production
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function Layout2({
  children,
}: {
  children: React.ReactNode;
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
              name: "Tyler Gohr",
              jobTitle: "Enterprise Solutions Architect",
              description:
                "Enterprise Solutions Architect creating powerful digital solutions that solve real business problems. Emmy Award-winning experience at Fox Corporation and Warner Bros.",
              url: "https://tylergohr.com/2",
              sameAs: [
                "https://github.com/isthatamullet",
                "https://linkedin.com/in/tylergohr",
              ],
              knowsAbout: [
                "Enterprise Architecture",
                "Digital Solutions",
                "Business Applications",
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "Google Cloud Platform",
                "Streaming Platforms",
                "Custom Software Development",
                "System Design",
                "Technical Consulting",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Enterprise Solutions Architect",
                description:
                  "Architecting digital products that deliver measurable business impact, from Emmy Award-winning streaming platforms to custom business solutions",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://tylergohr.com/2",
              },
              award: [
                {
                  "@type": "Award",
                  name: "Emmy Award",
                  description: "Recognition for outstanding work in streaming platform development",
                },
              ],
              worksFor: [
                {
                  "@type": "Organization",
                  name: "Fox Corporation",
                  description: "16+ years of enterprise-level development experience",
                },
                {
                  "@type": "Organization", 
                  name: "Warner Bros",
                  description: "Enterprise streaming platform architecture",
                },
              ],
            }),
          }}
        />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
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

        {/* Main application content with Framer Motion provider */}
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}