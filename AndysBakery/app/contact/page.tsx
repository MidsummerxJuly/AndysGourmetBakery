import Link from "next/link";
import styles from "./page.module.css";
import BottomSheetNav from "../components/BottomSheetNav";

const contactEmail = "yourbakeryemail@gmail.com";
const contactPhone = "754-242-4383";
const locationText = "6947 Stirling Road, Davie, FL 33314";

export default function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <BottomSheetNav />
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Contact Andy’s Bakery</p>
        <h1>Questions about an order?</h1>
        <p>
          Reach out for custom cake questions, pickup details, order changes, or
          general bakery inquiries.
        </p>
      </section>

      <section className={styles.contactGrid}>
        <article className={styles.contactCard}>
          <span className={styles.cardIcon}>✉</span>
          <h2>Email</h2>
          <p>Send a message for order questions or custom cake requests.</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </article>

        <article className={styles.contactCard}>
          <span className={styles.cardIcon}>☎</span>
          <h2>Phone</h2>
          <p>Call or text for faster order questions and pickup details.</p>
          <a href={`tel:${contactPhone.replace(/\D/g, "")}`}>
            {contactPhone}
          </a>
        </article>

        <article className={styles.contactCard}>
          <span className={styles.cardIcon}>⌂</span>
          <h2>Location</h2>
          <p>Serving local bakery orders and custom desserts.</p>
          <strong>{locationText}</strong>
        </article>
      </section>

      <section className={styles.infoSection}>
        <div>
          <p className={styles.eyebrow}>Before You Message</p>
          <h2>Helpful details to include</h2>
        </div>

        <ul>
          <li>Date the order is needed</li>
          <li>Item or cake type</li>
          <li>Serving size or quantity</li>
          <li>Flavor, filling, frosting, and decoration ideas</li>
          <li>Pickup questions or special notes</li>
        </ul>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to order?</h2>
        <p>Browse the menu and submit your order online.</p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            Start an Order
          </Link>

          <Link href="/policies" className={styles.secondaryButton}>
            View Policies
          </Link>
        </div>
      </section>
    </main>
  );
}