"use client";

import styles from "./page.module.css";
import Navigation from "./top-nav-backup";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Results from "./components/Results/Results";
import CaseStudiesPreview from "./components/CaseStudies/CaseStudiesPreview";
import HowIWorkPreview from "./components/HowIWork/HowIWorkPreview";
import TechnicalExpertisePreview from "./components/TechnicalExpertise/TechnicalExpertisePreview";
import ContactSection from "./components/Contact/ContactSection";

export default function EnterprisePage() {

  return (
    <>
      {/* Enterprise Solutions Navigation - BACKUP VERSION FOR TESTING */}
      <Navigation />
      
      <main id="main-content" className={styles.main} role="main">
        {/* Hero Section - Enterprise Solutions Architect */}
        <Hero />

        {/* About Section - Network Animation */}
        <About />

        {/* Results & Impact Section - Measurable Outcomes */}
        <Results />

        {/* Case Studies Preview Section - 4 Interactive Cards */}
        <CaseStudiesPreview />

        {/* How I Work Preview Section - 4 Process Highlight Cards */}
        <HowIWorkPreview />

        {/* Technical Expertise Preview Section - 4 Glassmorphism Cards */}
        <TechnicalExpertisePreview />

        {/* Contact Section - Dual-Column Form & Professional Information */}
        <ContactSection />
      </main>
    </>
  );
}