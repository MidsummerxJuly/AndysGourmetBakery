"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import styles from "./page.module.css";

export default function PaymentCancelPage() {
  const { t } = useLanguage();

  return (
    <main className={styles.cancelPage}>
      <section className={styles.cancelCard}>
        <div className={styles.cancelIcon} aria-hidden="true">
          ×
        </div>

        <p className={styles.eyebrow}>
          {t(
            "payment.cancelEyebrow",
            "Payment Not Completed"
          )}
        </p>

        <h1>
          {t(
            "payment.cancelHeadline",
            "Your payment was canceled."
          )}
        </h1>

        <p className={styles.message}>
          {t(
            "payment.cancelMessage",
            "Your order was not marked as paid. You can return to checkout and try again, or place a new order if needed."
          )}
        </p>

        <div className={styles.helpCard}>
          <h2>
            {t(
              "payment.needHelp",
              "Need help?"
            )}
          </h2>

          <p>
            {t(
              "payment.helpText",
              "If you were trying to complete an order and something went wrong, please contact Andy’s Bakery before placing a duplicate order."
            )}
          </p>
        </div>

        <div className={styles.buttonRow}>
          <Link
            href="/services/book"
            className={styles.primaryButton}
          >
            {t(
              "payment.returnCheckout",
              "Return to Checkout"
            )}
          </Link>

          <Link
            href="/services"
            className={styles.secondaryButton}
          >
            {t(
              "payment.backToOrder",
              "Back to Order Page"
            )}
          </Link>
        </div>
      </section>
    </main>
  );
}