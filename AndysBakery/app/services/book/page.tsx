"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomSheetNav from "@/app/components/BottomSheetNav";
import { useCart } from "@/app/context/cartContext";
import styles from "./page.module.css";

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function toCents(price: number) {
  return Math.round(price * 100);
}

function formatMoneyFromCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getCleanItemName(name: string) {
  return name.split(" - ")[0];
}

function getSizeFromCartName(name: string) {
  return name.includes(" - ") ? name.split(" - ")[1] : "";
}

function getCategoryFromName(name: string) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("custom")) return "Custom Orders";
  if (lowerName.includes("cake")) return "Cakes";
  if (lowerName.includes("croissant") || lowerName.includes("pastry")) return "Pastries";
  if (lowerName.includes("bread") || lowerName.includes("sourdough")) return "Bread";

  return "Bakery Item";
}

export default function Book() {
  const { cart } = useCart();

  const [hasMounted, setHasMounted] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("pickup");
  const [orderMonth, setOrderMonth] = useState("");
  const [orderDay, setOrderDay] = useState("");
  const [orderYear, setOrderYear] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const currentYear = new Date().getFullYear();

  const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const daysInSelectedMonth =
    orderMonth && orderYear
      ? new Date(Number(orderYear), Number(orderMonth), 0).getDate()
      : 31;

  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, index) => {
    const day = index + 1;
    return String(day).padStart(2, "0");
  });

  const orderDate =
    orderMonth && orderDay && orderYear
      ? `${orderYear}-${orderMonth}-${orderDay}`
      : "";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const subtotalCents = cart.reduce((total, item) => {
    return total + toCents(item.price) * item.quantity;
  }, 0);

  const totalCents = subtotalCents;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);

  const isFormReady =
    cart.length > 0 &&
    customerName.trim() !== "" &&
    customerPhone.trim() !== "" &&
    isEmailValid &&
    fulfillmentType.trim() !== "" &&
    orderDate.trim() !== "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormReady) {
      setErrorMessage("Please complete all required fields before continuing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const orderPayload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,

      subtotal_cents: subtotalCents,
      total_cents: totalCents,

      fulfillment_type: fulfillmentType,
      pickup: fulfillmentType === "pickup" ? "Bakery pickup" : "Delivery requested",
      order_date: orderDate,
      customer_notes: customerNotes,

      items: cart.map((item) => ({
        item_name: getCleanItemName(item.name),
        category: getCategoryFromName(item.name),
        size: getSizeFromCartName(item.name),
        quantity: item.quantity,
        unit_price_cents: toCents(item.price),
        line_total_cents: toCents(item.price) * item.quantity,
        custom_cake_options_json: "",
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create order.");
      }

      setOrderId(result.orderId);

        const paymentResponse = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: result.orderId,
          }),
        });

        const paymentResult = await paymentResponse.json();

        if (!paymentResponse.ok || !paymentResult.success) {
          throw new Error(paymentResult.message || "Failed to create payment checkout.");
        }

        window.location.href = paymentResult.checkoutUrl;
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while creating the order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasMounted) {
    return null;
  }

  return (
    <div className={styles.checkoutPage}>
      <main className={styles.checkoutShell}>
        <div className={styles.topRow}>
          <Link href="/services" className={styles.backLink}>
            ← Return to Order Page
          </Link>
        </div>

        <section className={styles.headerSection}>
          <p className={styles.eyebrow}>Checkout</p>
          <h1 className={styles.pageTitle}>Complete Your Bakery Order</h1>
          <p className={styles.pageIntro}>
            Review your basket, add your contact details, and choose your requested pickup date.
          </p>
        </section>

        {cart.length <= 0 && (
          <section className={styles.emptyCard}>
            <h2>Your basket is empty.</h2>
            <p>Please return to the order page and add at least one item before checking out.</p>
            <Link href="/services" className={styles.primaryLink}>
              Start an Order
            </Link>
          </section>
        )}

        {cart.length > 0 && (
          <div className={styles.checkoutGrid}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Your Basket</h2>

              <div className={styles.basketList}>
                {cart.map((item) => {
                  const lineTotalCents = toCents(item.price) * item.quantity;

                  return (
                    <div key={item.id} className={styles.basketItem}>
                      <div>
                        <h3>{item.name}</h3>
                        <p>
                          {item.quantity} × {formatMoneyFromCents(toCents(item.price))}
                        </p>
                      </div>

                      <strong>{formatMoneyFromCents(lineTotalCents)}</strong>
                    </div>
                  );
                })}
              </div>

              <div className={styles.totalBox}>
                <span>Subtotal</span>
                <strong>{formatMoneyFromCents(subtotalCents)}</strong>
              </div>

              <div className={styles.totalBox}>
                <span>Total</span>
                <strong>{formatMoneyFromCents(totalCents)}</strong>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Customer Details</h2>


              <form className={styles.checkoutForm} onSubmit={handleSubmit}>
                <label className={styles.formField}>
                  Name *
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer name"
                  />
                </label>

                <label className={styles.formField}>
                  Phone *
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(formatPhoneNumber(event.target.value))}
                    placeholder="000-000-0000"
                    maxLength={12}
                  />
                </label>

                <label className={styles.formField}>
                  Email *
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="Email address"
                  />
                </label>

                <label className={styles.formField}>
                  Fulfillment *
                  <select
                    value={fulfillmentType}
                    onChange={(event) => setFulfillmentType(event.target.value)}
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery Requested</option>
                  </select>
                </label>

                <div className={styles.formField}>
                  <span>Requested Date *</span>

                  <div className={styles.dateSelectRow}>
                    <select
                      value={orderMonth}
                      onChange={(event) => {
                        setOrderMonth(event.target.value);
                        setOrderDay("");
                      }}
                    >
                      <option value="">Month</option>
                      {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={orderDay}
                      onChange={(event) => setOrderDay(event.target.value)}
                    >
                      <option value="">Day</option>
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    <select
                      value={orderYear}
                      onChange={(event) => {
                        setOrderYear(event.target.value);
                        setOrderDay("");
                      }}
                    >
                      <option value="">Year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className={styles.formField}>
                  Notes
                  <textarea
                    value={customerNotes}
                    onChange={(event) => setCustomerNotes(event.target.value)}
                    placeholder="Add pickup notes, design notes, flavor notes, or any special requests."
                  />
                </label>

                {!isFormReady && (
                  <p className={styles.helperText}>
                    Please complete all required fields before continuing.
                  </p>
                )}

                {errorMessage && (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                )}

               {orderId && (
                  <div className={styles.successBox}>
                    <h3>Order received</h3>

                    <p>
                      Reference:{" "}
                      <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
                    </p>

                    <p className={styles.successText}>
                      Your order has been saved. Payment will be connected next.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isFormReady || isSubmitting || !!orderId}
                >
                  {isSubmitting ? "Creating Order..." : "Save Order & Continue"}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      <BottomSheetNav />
    </div>
  );
}