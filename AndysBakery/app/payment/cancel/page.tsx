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
    const reference = formatReference(orderId);

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

                <div className={styles.noticeBox}>
                    <h2>{t("payment.nextSteps")}</h2>
                    <p>{t("payment.successHelpText")}</p>
                </div>

                <div className={styles.buttonRow}>
                    <Link href="/services" className={styles.primaryButton}>
                        {t("payment.backToServices")}
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