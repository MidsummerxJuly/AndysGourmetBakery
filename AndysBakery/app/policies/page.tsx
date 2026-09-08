"use client";

import Link from "next/link";
import styles from "./page.module.css";
import BottomSheetNav from "../components/BottomSheetNav";
import { useLanguage } from "../context/LanguageContext";

export default function PoliciesPage() {
  const { t } = useLanguage();

  const policies = [
    {
      title: t("policies.onlineOrders"),
      details: [t("policies.onlineOrders1"), t("policies.onlineOrders2"), t("policies.onlineOrders3")],
    },
    {
      title: t("policies.payments"),
      details: [t("policies.payments1"), t("policies.payments2"), t("policies.payments3")],
    },
    {
      title: t("policies.customCakes"),
      details: [t("policies.customCakes1"), t("policies.customCakes2"), t("policies.customCakes3")],
    },
    {
      title: t("policies.pickup"),
      details: [t("policies.pickup1"), t("policies.pickup2"), t("policies.pickup3")],
    },
    {
      title: t("policies.changes"),
      details: [t("policies.changes1"), t("policies.changes2"), t("policies.changes3")],
    },
    {
      title: t("policies.allergens"),
      details: [t("policies.allergens1"), t("policies.allergens2"), t("policies.allergens3")],
    },
  ];

  return (
    <main className={styles.policiesPage}>
      <BottomSheetNav />
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{t("policies.eyebrow")}</p>
        <h1>{t("policies.headline")}</h1>
        <p>{t("policies.intro")}</p>
      </section>

      <section className={styles.policyList}>
        {policies.map((policy) => (
          <article key={policy.title} className={styles.policyCard}>
            <h2>{policy.title}</h2>

            <ul>
              {policy.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={styles.noticeSection}>
        <h2>{t("policies.questionsTitle")}</h2>
        <p>{t("policies.questionsText")}</p>

        <div className={styles.buttonRow}>
          <Link href="/contact" className={styles.primaryButton}>
            {t("policies.contactUs")}
          </Link>

          <Link href="/services" className={styles.secondaryButton}>
            {t("policies.startOrder")}
          </Link>
        </div>
      </section>
    </main>
  );
}
