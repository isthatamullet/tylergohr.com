'use client';

import { ContactForm } from '@/components/Contact/ContactForm';
import Footer from '@/components/redesign/Footer';
import styles from './Contact.module.css';

export default function ContactPage() {
  return (
    <>
      <main className={styles.main}>
        {/* Background */}
        <div className={styles.background}>
          <div className={styles.gradientOrb1} />
          <div className={styles.gradientOrb2} />
          <div className={styles.overlay} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Header */}
          <header className={styles.header}>
            <span className={styles.label}>Get in Touch</span>
            <h1 className={styles.title}>Let&apos;s Work Together</h1>
            <p className={styles.subtitle}>
              Have a project in mind? I&apos;d love to hear about it. Fill out the form below
              and I&apos;ll get back to you within 24 hours.
            </p>
          </header>

          {/* Form Card */}
          <div className={styles.formWrapper}>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
