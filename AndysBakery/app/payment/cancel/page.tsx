import Link from "next/link";
import styles from "./page.module.css";

type CancelPageProps = {
  searchParams?: Promise<{
    order_id?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function formatReference(value: string) {
  if (!value) return "";
  return value.slice(0, 8).toUpperCase();
}

export default async function PaymentCancelPage({
  searchParams,
}: CancelPageProps) {
  const params = searchParams ? await searchParams : {};
  const orderId = getSingleValue(params.order_id);
  const reference = formatReference(orderId);

  return (
    <main className={styles.cancelPage}>
      <section className={styles.cancelCard}>
        <div className={styles.iconCircle}>!</div>

        <p className={styles.eyebrow}>Payment Not Completed</p>

        <h1>Your payment was canceled.</h1>

        <p className={styles.message}>
          Your order was not marked as paid. You can return to checkout and try
          again, or place a new order if needed.
        </p>

        {reference ? (
          <div className={styles.referenceBox}>
            <span>Order Reference</span>
            <strong>#{reference}</strong>
          </div>
        ) : null}

        <div className={styles.noticeBox}>
          <h2>Need help?</h2>
          <p>
            If you were trying to complete an order and something went wrong,
            please contact Andy’s Bakery before placing a duplicate order.
          </p>
        </div>

        <div className={styles.buttonRow}>
          <Link href="/services/book" className={styles.primaryButton}>
            Return to Checkout
          </Link>

          <Link href="/services" className={styles.secondaryButton}>
            Back to Order Page
          </Link>
        </div>
      </section>
    </main>
  );
}