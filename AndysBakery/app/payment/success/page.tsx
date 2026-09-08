"use client";

import { Suspense } from "react";
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

function PaymentSuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const orderId = getSingleValue(searchParams.get("order_id"));
  const sessionId = getSingleValue(searchParams.get("session_id"));

  const reference = formatReference(orderId) || formatReference(sessionId);

  return (
      <main className={styles.successPage}>
        <section className={styles.successCard}>
          <div className={styles.iconCircle}>✓</div>

          <p className={styles.eyebrow}>{t("payment.successEyebrow")}</p>

          <h1>{t("payment.successHeadline")}</h1>

          <p className={styles.message}>{t("payment.successMessage")}</p>

          {reference ? (
              <div className={styles.referenceBox}>
                <span>{t("payment.orderReference")}</span>
                <strong>#{reference}</strong>
              </div>
          ) : null}

          <div className={styles.nextSteps}>
            <h2>{t("payment.nextStepsTitle")}</h2>

            <ul>
              <li>{t("payment.nextSteps1")}</li>
              <li>{t("payment.nextSteps2")}</li>
              <li>{t("payment.nextSteps3")}</li>
              <li>{t("payment.nextSteps4")}</li>
            </ul>
          </div>

          <div className={styles.buttonRow}>
            <Link href="/" className={styles.primaryButton}>
              {t("payment.backHome")}
            </Link>

            <Link href="/services" className={styles.secondaryButton}>
              {t("payment.placeAnother")}
            </Link>
          </div>
        </section>
      </main>
  );
}

export default function PaymentSuccessPage() {
  return (
      <Suspense fallback={null}>
        <PaymentSuccessContent />
      </Suspense>
  );
}