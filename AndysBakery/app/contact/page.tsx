"use client";

import Link from "next/link";
import styles from "./page.module.css";
import BottomSheetNav from "../components/BottomSheetNav";
import { useLanguage } from "../context/LanguageContext";

const contactEmail = "yourbakeryemail@gmail.com";
const contactPhone = "754-242-4383";
const locationText = "6947 Stirling Road, Davie, FL 33314";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className={styles.contactPage}>
      <BottomSheetNav />
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{t("contact.eyebrow")}</p>
        <h1>{t("contact.headline")}</h1>
        <p>{t("contact.intro")}</p>
      </section>

      <section className={styles.contactGrid}>
        <article className={styles.contactCard}>
          <span className={styles.cardIcon}>✉</span>
          <h2>{t("contact.emailTitle")}</h2>
          <p>{t("contact.emailText")}</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </article>

        <article className={styles.contactCard}>
          <span className={styles.cardIcon}>☎</span>
          <h2>{t("contact.phoneTitle")}</h2>
          <p>{t("contact.phoneText")}</p>
          <a href={`tel:${contactPhone.replace(/\D/g, "")}`}>
            {contactPhone}
          </a>
        </article>

        <article className={styles.contactCard}>
          <span className={styles.cardIcon}>⌂</span>
          <h2>{t("contact.locationTitle")}</h2>
          <p>{t("contact.locationText")}</p>
          <strong>{locationText}</strong>
        </article>
      </section>

      <section className={styles.infoSection}>
        <div>
          <p className={styles.eyebrow}>{t("contact.beforeYouMessage")}</p>
          <h2>{t("contact.helpfulDetails")}</h2>
        </div>

        <ul>
          <li>{t("contact.dateNeeded")}</li>
          <li>{t("contact.itemType")}</li>
          <li>{t("contact.servingSize")}</li>
          <li>{t("contact.flavorFilling")}</li>
          <li>{t("contact.pickupNotes")}</li>
        </ul>
      </section>

      <section className={styles.ctaSection}>
        <h2>{t("contact.readyTitle")}</h2>
        <p>{t("contact.readyText")}</p>

        <div className={styles.buttonRow}>
          <Link href="/services" className={styles.primaryButton}>
            {t("contact.startOrder")}
          </Link>

          <Link href="/policies" className={styles.secondaryButton}>
            {t("contact.viewPolicies")}
          </Link>
        </div>
      </section>
    </main>
  );
}
