"use client";

import { useState } from "react";
import styles from "./ContactSection.module.css";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would integrate with your preferred form handling service
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.subject.trim() &&
    formData.message.trim();

  return (
    <section
      id="contact"
      className={styles.contactSection}
      aria-labelledby="contact-title"
    >
      <div className="container">
        <div className={styles.contactHeader}>
          <h2 id="contact-title" className={styles.sectionTitle}>
            Let&apos;s Connect
          </h2>
          <p className={styles.sectionSubtitle}>
            Ready to discuss your next project or explore collaboration
            opportunities?
          </p>
        </div>

        <div className={styles.contactContent}>
          {/* Contact Form */}
          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                    aria-describedby="name-error"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                    aria-describedby="email-error"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="project-inquiry">New Project Inquiry</option>
                  <option value="collaboration">
                    Collaboration Opportunity
                  </option>
                  <option value="technical-discussion">
                    Technical Discussion
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  rows={6}
                  required
                  aria-describedby="message-error"
                  placeholder="Tell me about your project, ideas, or how we can work together..."
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ""}`}
                  disabled={!isFormValid || isSubmitting}
                  aria-describedby="submit-status"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className={styles.loadingSpinner}
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className={styles.successMessage} role="alert">
                  ✨ Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className={styles.errorMessage} role="alert">
                  ❌ There was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Professional Links</h3>
              <div className={styles.infoLinks}>
                <a
                  href="https://github.com/isthatamullet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                  aria-label="Visit Tyler's GitHub profile"
                >
                  <span className={styles.linkIcon}>🔗</span>
                  <span className={styles.linkText}>
                    <strong>GitHub</strong>
                    <span>View my code repositories</span>
                  </span>
                </a>

                <a
                  href="mailto:tyler.gohr@example.com"
                  className={styles.infoLink}
                  aria-label="Send email to Tyler"
                >
                  <span className={styles.linkIcon}>📧</span>
                  <span className={styles.linkText}>
                    <strong>Email</strong>
                    <span>tyler.gohr@example.com</span>
                  </span>
                </a>

                <a
                  href="https://linkedin.com/in/tyler-gohr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoLink}
                  aria-label="Connect with Tyler on LinkedIn"
                >
                  <span className={styles.linkIcon}>💼</span>
                  <span className={styles.linkText}>
                    <strong>LinkedIn</strong>
                    <span>Professional network</span>
                  </span>
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>What to Expect</h3>
              <div className={styles.expectationsList}>
                <div className={styles.expectationItem}>
                  <span className={styles.expectationIcon}>⚡</span>
                  <span className={styles.expectationText}>
                    <strong>Quick Response</strong>
                    <span>Usually within 24 hours</span>
                  </span>
                </div>
                <div className={styles.expectationItem}>
                  <span className={styles.expectationIcon}>🎯</span>
                  <span className={styles.expectationText}>
                    <strong>Focused Discussion</strong>
                    <span>Technical solutions-oriented</span>
                  </span>
                </div>
                <div className={styles.expectationItem}>
                  <span className={styles.expectationIcon}>🚀</span>
                  <span className={styles.expectationText}>
                    <strong>Action-Oriented</strong>
                    <span>Ready to build great things</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
