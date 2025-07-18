import { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Concerto - AI Development Orchestration Platform',
  description: 'Building the orchestration layer that makes enterprise AI development more reliable and productive.',
}

export default function ConcertoPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Concerto</h1>
        <p className={styles.subtitle}>The AI Development Orchestration Platform</p>
        <p className={styles.tagline}>
          Building the orchestration layer that makes enterprise AI development more reliable and productive.
        </p>
      </section>

      {/* Why Concerto Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why &ldquo;Concerto&rdquo;?</h2>
        <div className={styles.musicNote}>
          <p>
            A concerto is a musical composition featuring a skilled soloist performing challenging technical passages, 
            supported by a coordinated orchestra. Each section of the orchestra contributes at precisely the right 
            moments to enhance the soloist&rsquo;s performance.
          </p>
          <p>
            <strong>That&rsquo;s exactly what our platform does for developers.</strong>
          </p>
          <p>
            The developer remains the star performer, handling the creative and complex coding work, while Concerto 
            coordinates AI tools to provide perfectly timed support. Instead of juggling multiple AI assistants and 
            losing context, developers experience one seamless workflow.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Problem</h2>
        <p><strong>76% of developers use AI coding tools, but only 43% trust their accuracy.</strong></p>
        <p>Current challenges plaguing AI-assisted development:</p>
        <ul className={styles.problemList}>
          <li><strong>Tool Fragmentation</strong>: Developers use 3-5 AI tools simultaneously, creating workflow friction</li>
          <li><strong>Context Loss</strong>: AI agents lose context between sessions, leading to inconsistent responses</li>
          <li><strong>&ldquo;Vibe Coding&rdquo; Crisis</strong>: Studies show widespread reliability issues in AI-generated code</li>
          <li><strong>Trust Gap</strong>: Enterprise adoption limited by accuracy and security concerns</li>
          <li><strong>Performance Issues</strong>: Slow context retrieval disrupts developer flow</li>
        </ul>
      </section>

      {/* Solution Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Solution</h2>
        <p><strong>Three pillars of intelligent AI orchestration:</strong></p>
        
        <div className={styles.pillars}>
          <div className={styles.pillar}>
            <h3 className={styles.pillarTitle}>1. Context Preservation</h3>
            <ul className={styles.pillarList}>
              <li>Advanced context integrity and verification systems</li>
              <li>Fast context retrieval with enterprise-grade security</li>
              <li>Real-time synchronization across development sessions</li>
              <li>Complete codebase knowledge readily available to all AI agents</li>
            </ul>
          </div>

          <div className={styles.pillar}>
            <h3 className={styles.pillarTitle}>2. AI Tool Orchestration</h3>
            <ul className={styles.pillarList}>
              <li>Universal integration layer using emerging industry standards</li>
              <li>Intelligent routing between multiple AI providers</li>
              <li>Cost optimization through advanced caching strategies</li>
              <li>Seamless workflow coordination without tool switching</li>
            </ul>
          </div>

          <div className={styles.pillar}>
            <h3 className={styles.pillarTitle}>3. Intelligent Task Routing</h3>
            <ul className={styles.pillarList}>
              <li>Smart routing optimizing for speed, accuracy, and cost</li>
              <li>Dynamic agent selection based on task complexity and context</li>
              <li>Performance tracking and continuous optimization</li>
              <li>Enterprise governance and audit capabilities</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Market Opportunity Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Market Opportunity</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>$30.1B</span>
            <span className={styles.statLabel}>market by 2032 (27% CAGR)</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>92%</span>
            <span className={styles.statLabel}>of US developers already use AI coding tools</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>78%</span>
            <span className={styles.statLabel}>of enterprises plan to increase AI development tool spending</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>40%+</span>
            <span className={styles.statLabel}>productivity improvements achievable with reliable orchestration</span>
          </div>
        </div>
      </section>

      {/* Research Foundation Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Research Foundation</h2>
        <p><strong>Extensive research validates market need and technical approach:</strong></p>
        <ul className={styles.solutionList}>
          <li><strong>Market Analysis</strong>: Comprehensive study of AI coding platform landscape</li>
          <li><strong>Technical Architecture</strong>: Research-backed approach to distributed systems challenges</li>
          <li><strong>Security Framework</strong>: Enterprise-grade design with compliance readiness</li>
          <li><strong>Performance Validation</strong>: Research-driven targets for production environments</li>
        </ul>
        <p><em>Detailed technical documentation and implementation roadmaps available for qualified partners.</em></p>
      </section>

      {/* Partnership Opportunities Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Partnership Opportunities</h2>
        <p><strong>We&rsquo;re seeking strategic infrastructure partners who understand the enterprise AI market.</strong></p>
        <p><strong>Ideal partners provide:</strong></p>
        <ul className={styles.solutionList}>
          <li>Cloud infrastructure optimized for AI workloads</li>
          <li>Enterprise-grade security and compliance frameworks</li>
          <li>Developer ecosystem and go-to-market capabilities</li>
          <li>Technical advisory and solution architecture support</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to explore partnership opportunities:</h2>
        <div className={styles.ctaButtons}>
          <a href="./partnership-brief.pdf" className={styles.ctaButton}>
            Download Partnership Brief
          </a>
          <a href="mailto:tyler@tylergohr.com?subject=Concerto Technical Discussion" className={styles.ctaButton}>
            Request Technical Discussion
          </a>
          <a href="mailto:tyler@tylergohr.com?subject=Concerto Partnership Discussion" className={`${styles.ctaButton} ${styles.secondary}`}>
            Schedule Partnership Meeting
          </a>
        </div>
      </section>

      {/* About the Founder */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About the Founder</h2>
        <p>
          Tyler Gohr brings a unique combination of technical expertise and musical understanding to AI orchestration. 
          As both a developer and musician, he understands the importance of perfect timing, coordination, and harmony 
          in creating exceptional performance.
        </p>
        <p><strong>Background:</strong></p>
        <ul className={styles.solutionList}>
          <li>Full-stack developer with distributed systems experience</li>
          <li>Musician with deep understanding of orchestration principles</li>
          <li>Extensive research in AI development tools and enterprise needs</li>
          <li>Proven track record in technical documentation and system design</li>
        </ul>
      </section>

      {/* Quote */}
      <section className={styles.section}>
        <div className={styles.musicNote}>
          <p style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '1.1rem' }}>
            &ldquo;Just as a great concerto requires both a skilled soloist and perfectly coordinated orchestra, 
            exceptional AI-assisted development needs both talented developers and intelligently orchestrated AI tools. 
            Concerto makes that harmony possible.&rdquo;
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.contact}>
          <p><strong>Contact:</strong> <a href="mailto:tyler@tylergohr.com">tyler@tylergohr.com</a></p>
          <p>
            <strong>Partnership Inquiry:</strong> 
            <a href="mailto:tyler@tylergohr.com?subject=Concerto Partnership Discussion"> Schedule Discussion</a>
          </p>
        </div>
      </footer>
    </div>
  )
}