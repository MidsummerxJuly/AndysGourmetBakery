"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { useLanguage } from "@/app/context/LanguageContext";

function getSingleValue(value: string | string[] | null) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function formatReference(value: string) {
  if (!value) return "";
  return value.slice(0, 8).toUpperCase();
}

export default function PaymentCancelPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const orderId = getSingleValue(searchParams.get("order_id"));
  const reference = formatReference(orderId);

  return (
    <main className={styles.cancelPage}>
      <section className={styles.cancelCard}>
        <div className={styles.iconCircle}>!</div>

        <p className={styles.eyebrow}>{t("payment.cancelEyebrow")}</p>

        <h1>{t("payment.cancelHeadline")}</h1>

        <p className={styles.message}>{t("payment.cancelMessage")}</p>

        {reference ? (
          <div className={styles.referenceBox}>
            <span>{t("payment.orderReference")}</span>
            <strong>#{reference}</strong>
          </div>
        ) : null}

        <div className={styles.noticeBox}>
          <h2>{t("payment.needHelp")}</h2>
          <p>{t("payment.helpText")}</p>
        </div>

        <div className={styles.buttonRow}>
          <Link href="/services/book" className={styles.primaryButton}>
            {t("payment.returnCheckout")}
          </Link>

          <Link href="/services" className={styles.secondaryButton}>
            {t("payment.backToOrder")}
          </Link>
        </div>
      </section>
    </main>
  );
}
