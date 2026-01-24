import Link from 'next/link';
import styles from './FooterCTA.module.css';

export default function FooterCTA() {
  return (
    <div className={styles.ctaCard}>
      <h2 className={styles.ctaTitle}>
        Ready to build something that <span className={styles.accent}>scales</span>?
      </h2>
      <p className={styles.ctaText}>
        Let&apos;s talk about your content operations challenges and how I can help.
      </p>
      <div className={styles.ctaButtons}>
        <Link href="/contact" className={styles.btnPrimary}>
          Get in Touch
        </Link>
        <Link href="/skills" className={styles.btnSecondary}>
          View Skills
        </Link>
      </div>
    </div>
  );
}
