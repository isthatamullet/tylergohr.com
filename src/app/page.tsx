import {
  Hero,
  About,
  Skills,
  Experience,
  CaseStudies,
  Footer,
  HashScrollHandler,
} from '@/components/redesign';

export default function HomePage() {
  return (
    <>
      <HashScrollHandler />
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
