import Link from "next/link";
import styles from "./page.module.css";

type SuccessPageProps = {
  searchParams?: Promise<{
    order_id?: string | string[];
    session_id?: string | string[];
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

export default async function PaymentSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = searchParams ? await searchParams : {};

  const orderId = getSingleValue(params.order_id);
  const sessionId = getSingleValue(params.session_id);

  const reference = formatReference(orderId) || formatReference(sessionId);

  return (
    <main className={styles.successPage}>
      <section className={styles.successCard}>
        <div className={styles.iconCircle}>✓</div>

        <p className={styles.eyebrow}>Payment Successful</p>

        <h1>Thank you for your order!</h1>

        <p className={styles.message}>
          Your order has been received, and a confirmation email has been sent.
          Andy’s Bakery will contact you if anything else is needed.
        </p>

        {reference ? (
          <div className={styles.referenceBox}>
            <span>Order Reference</span>
            <strong>#{reference}</strong>
          </div>
        ) : null}

        <div className={styles.nextSteps}>
          <h2>What happens next?</h2>

          <ul>
            <li>Your payment has been recorded.</li>
            <li>The bakery will review the order details.</li>
            <li>You will be contacted if the order needs clarification.</li>
            <li>Please save your confirmation email for your records.</li>
          </ul>
        </div>

        <div className={styles.buttonRow}>
          <Link href="/" className={styles.primaryButton}>
            Back to Home
          </Link>

          <Link href="/services" className={styles.secondaryButton}>
            Place Another Order
          </Link>
        </div>
      </section>
    </main>
  );
}