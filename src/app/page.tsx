import {
  Hero,
  About,
  Skills,
  Experience,
  CaseStudies,
  Footer,
} from '@/components/redesign';

export default function HomePage() {
  return (
    <>
      <main id="main-content" role="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <CaseStudies />
      </main>
      <Footer />
    </>
  );
}
