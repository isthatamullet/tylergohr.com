"use client";

import { Suspense, lazy } from "react";
import styles from "./page.module.css";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
// BasicScene removed - Phase 2.3 NetworkAnimation3D now integrated in About section

// Lazy load below-the-fold components for better performance
const Results = lazy(() => import("./components/Results/Results"));
const CaseStudiesPreview = lazy(() => import("./components/CaseStudies/CaseStudiesPreview"));
const HowIWorkPreview = lazy(() => import("./components/HowIWork/HowIWorkPreview"));
const TechnicalExpertisePreview = lazy(() => import("./components/TechnicalExpertise/TechnicalExpertisePreview"));
const ContactSection = lazy(() => import("./components/Contact/ContactSection"));
const Footer = lazy(() => import("./components/Footer/Footer"));

export default function EnterprisePage() {

  return (
    <>
      <main id="main-content" className={styles.main} role="main">
        {/* Hero Section - Enterprise Solutions Architect */}
        <Hero />

        {/* About Section - Enhanced Network Animation with 3D Particles */}
        <About />

        {/* Results & Impact Section - Measurable Outcomes */}
        <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading metrics...</div>}>
          <Results />
        </Suspense>

        {/* Case Studies Preview Section - 4 Interactive Cards */}
        <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading case studies...</div>}>
          <CaseStudiesPreview />
        </Suspense>

        {/* How I Work Preview Section - 4 Process Highlight Cards */}
        <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading process overview...</div>}>
          <HowIWorkPreview />
        </Suspense>

        {/* Technical Expertise Preview Section - 4 Glassmorphism Cards */}
        <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading technical expertise...</div>}>
          <TechnicalExpertisePreview />
        </Suspense>

        {/* Contact Section - Dual-Column Form & Professional Information */}
        <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading contact form...</div>}>
          <ContactSection />
        </Suspense>
      </main>

      {/* Footer Section - Navigation Links & Professional Information */}
      <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading footer...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}