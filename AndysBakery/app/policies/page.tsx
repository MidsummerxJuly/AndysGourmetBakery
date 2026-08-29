import Link from "next/link";
import styles from "./page.module.css";
import BottomSheetNav from "../components/BottomSheetNav";

const policies = [
  {
    title: "Online Orders",
    details: [
      "Orders submitted through the website are reviewed by Andy’s Bakery after payment is completed.",
      "Customers should include accurate contact information so the bakery can follow up if anything needs clarification.",
      "Submitting an order does not guarantee changes can be made after payment, especially close to the selected pickup date.",
    ],
  },
  {
    title: "Payments",
    details: [
      "Website orders require payment at checkout before the order is marked as paid.",
      "Unpaid or canceled checkout orders are not considered confirmed.",
      "If there is an issue during payment, customers should contact the bakery before submitting a duplicate order.",
    ],
  },
  {
    title: "Custom Cakes",
    details: [
      "Custom cake prices may vary depending on size, flavor, filling, decorations, and design complexity.",
      "Customers should include design notes, theme ideas, colors, and serving size when placing a custom order.",
      "Andy’s Bakery may contact the customer if a requested design needs to be adjusted.",
    ],
  },
  {
    title: "Pickup",
    details: [
      "Customers are responsible for picking up orders on the selected date unless another arrangement has been confirmed.",
      "Pickup details may be confirmed by email, phone, or text.",
      "Orders should be handled carefully after pickup, especially cakes and decorated desserts.",
    ],
  },
  {
    title: "Changes and Cancellations",
    details: [
      "Order changes should be requested as early as possible.",
      "Some changes may not be available after preparation has started.",
      "Cancellation and refund decisions may depend on the order type, ingredients purchased, and preparation progress.",
    ],
  },
  {
    title: "Allergens",
    details: [
      "Bakery items may contain or come into contact with common allergens including wheat, milk, eggs, soy, peanuts, and tree nuts.",
      "Customers with allergies should contact the bakery before ordering.",
      "Andy’s Bakery cannot guarantee that items are completely free from cross-contact.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <main className={styles.policiesPage}>
      <BottomSheetNav />
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Andy’s Bakery</p>
        <h1>Order Policies</h1>
        <p>
          Please review these policies before placing an order. They help keep
          the ordering process clear for both customers and the bakery.
        </p>
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
        <h2>Questions before ordering?</h2>
        <p>
          Contact Andy’s Bakery before submitting your order if you need help
          with sizing, flavors, pickup details, or custom design questions.
        </p>

        <div className={styles.buttonRow}>
          <Link href="/contact" className={styles.primaryButton}>
            Contact Us
          </Link>

          <Link href="/services" className={styles.secondaryButton}>
            Start an Order
          </Link>
        </div>
      </section>
    </main>
  );
}