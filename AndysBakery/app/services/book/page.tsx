"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomSheetNav from "@/app/components/BottomSheetNav";
import { useCart } from "@/app/context/cartContext";
import { useLanguage } from "@/app/context/LanguageContext";
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

function getMenuItemSizeId(cartItemId: string) {
  const sizeId = Number(cartItemId.split(":")[1]);

  return Number.isSafeInteger(sizeId) && sizeId > 0 ? sizeId : null;
}

function getCreatedOrderId(result: unknown) {
  if (!result || typeof result !== "object") return null;

  const payload = result as Record<string, unknown>;
  const order = payload.order as Record<string, unknown> | undefined;
  const id = payload.orderId ?? payload.id ?? order?.id;

  return typeof id === "string" ? id : null;
}

export default function Book() {
  const { t } = useLanguage();
  const { cart } = useCart();

  const [hasMounted, setHasMounted] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("pickup");
  const [orderMonth, setOrderMonth] = useState("");
  const [orderDay, setOrderDay] = useState("");
  const [orderYear, setOrderYear] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const currentYear = new Date().getFullYear();

  const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

  const monthOptions = [
    { value: "01", label: t("book.january") },
    { value: "02", label: t("book.february") },
    { value: "03", label: t("book.march") },
    { value: "04", label: t("book.april") },
    { value: "05", label: t("book.may") },
    { value: "06", label: t("book.june") },
    { value: "07", label: t("book.july") },
    { value: "08", label: t("book.august") },
    { value: "09", label: t("book.september") },
    { value: "10", label: t("book.october") },
    { value: "11", label: t("book.november") },
    { value: "12", label: t("book.december") },
  ];

  const daysInSelectedMonth =
    orderMonth && orderYear
      ? new Date(Number(orderYear), Number(orderMonth), 0).getDate()
      : 31;

  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, index) => {
    const day = index + 1;
    return String(day).padStart(2, "0");
  });

  useEffect(() => {
    if (!orderMonth || !orderYear || !orderDay) return;

    const maxDay = new Date(
      Number(orderYear),
      Number(orderMonth),
      0
    ).getDate();

    if (Number(orderDay) > maxDay) {
      setOrderDay(String(maxDay).padStart(2, "0"));
    }
  }, [orderMonth, orderYear, orderDay]);

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
    orderDate.trim() !== "" &&
    (fulfillmentType !== "pickup" || pickupTime !== "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormReady) {
      setErrorMessage(t("book.helperText"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const items = cart.map((item) => ({
      menuItemSizeId: getMenuItemSizeId(item.id),
      quantity: item.quantity,
      customCakeOptions: {},
    }));

    if (items.some((item) => item.menuItemSizeId === null)) {
      setErrorMessage("One or more basket items are invalid. Please add them again.");
      return;
    }

    const isPickup = fulfillmentType === "pickup";
    const orderPayload = {
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
      },
      items: items.map((item) => ({
        menuItemSizeId: item.menuItemSizeId as number,
        quantity: item.quantity,
        customCakeOptions: item.customCakeOptions,
      })),
      fulfillmentType,
      pickup: isPickup,
      pickupDate: isPickup ? orderDate : null,
      pickupTime: isPickup ? pickupTime : null,
      requestedDatetime:
        isPickup && pickupTime ? `${orderDate}T${pickupTime}:00` : null,
      scheduleNotes: null,
      customerNotes: customerNotes.trim() || null,
      orderDate,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error("Failed to create order.");
      }

      const createdOrderId = getCreatedOrderId(result);

      if (!createdOrderId) {
        throw new Error("Order service did not return an order ID.");
      }

      setOrderId(createdOrderId);

      const paymentResponse = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: createdOrderId,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.message || "Failed to create payment checkout.");
      }

      const checkoutUrl =
        paymentResult.checkoutUrl ?? paymentResult.checkout_url ?? paymentResult.url;

      if (typeof checkoutUrl !== "string") {
        throw new Error("Payment service did not return a checkout URL.");
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error(error);
      setErrorMessage(t("book.errorMessage"));
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
            ← {t("book.backToOrder")}
          </Link>
        </div>

        <section className={styles.headerSection}>
          <p className={styles.eyebrow}>{t("book.eyebrow")}</p>
          <h1 className={styles.pageTitle}>{t("book.headline")}</h1>
          <p className={styles.pageIntro}>{t("book.intro")}</p>
        </section>

        {cart.length <= 0 && (
          <section className={styles.emptyCard}>
            <h2>{t("book.emptyTitle")}</h2>
            <p>{t("book.emptyText")}</p>
            <Link href="/services" className={styles.primaryLink}>
              {t("book.startOrder")}
            </Link>
          </section>
        )}

        {cart.length > 0 && (
          <div className={styles.checkoutGrid}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>{t("book.basketTitle")}</h2>

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
                <span>{t("book.subtotal")}</span>
                <strong>{formatMoneyFromCents(subtotalCents)}</strong>
              </div>

              <div className={styles.totalBox}>
                <span>{t("services.total")}</span>
                <strong>{formatMoneyFromCents(totalCents)}</strong>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>{t("book.customerTitle")}</h2>

              <form className={styles.checkoutForm} onSubmit={handleSubmit}>
                <label className={styles.formField}>
                  {t("book.nameLabel")}
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder={t("book.namePlaceholder")}
                  />
                </label>

                <label className={styles.formField}>
                  {t("book.phoneLabel")}
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(formatPhoneNumber(event.target.value))}
                    placeholder={t("book.phonePlaceholder")}
                    maxLength={12}
                  />
                </label>

                <label className={styles.formField}>
                  {t("book.emailLabel")}
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder={t("book.emailPlaceholder")}
                  />
                </label>

                <label className={styles.formField}>
                  {t("book.fulfillmentLabel")}
                  <select
                    value={fulfillmentType}
                    onChange={(event) => setFulfillmentType(event.target.value)}
                  >
                    <option value="pickup">{t("book.pickup")}</option>
                    <option value="delivery">{t("book.deliveryRequested")}</option>
                  </select>
                </label>

                <div className={styles.formField}>
                  <span>{t("book.dateLabel")}</span>

                  <div className={styles.dateSelectRow}>
                    <select
                      value={orderMonth}
                      onChange={(event) => {
                        setOrderMonth(event.target.value);
                        setOrderDay("");
                      }}
                    >
                      <option value="">{t("book.month")}</option>
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
                      <option value="">{t("book.day")}</option>
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
                      }}
                    >
                      <option value="">{t("book.year")}</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {fulfillmentType === "pickup" && (
                  <label className={styles.formField}>
                    Pickup time
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(event) => setPickupTime(event.target.value)}
                      required
                    />
                  </label>
                )}

                <label className={styles.formField}>
                  {t("book.notesLabel")}
                  <textarea
                    value={customerNotes}
                    onChange={(event) => setCustomerNotes(event.target.value)}
                    placeholder={t("book.notesPlaceholder")}
                  />
                </label>

                {!isFormReady && (
                  <p className={styles.helperText}>{t("book.helperText")}</p>
                )}

                {errorMessage && (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                )}

                {orderId && (
                  <div className={styles.successBox}>
                    <h3>{t("book.orderReceived")}</h3>

                    <p>
                      {t("book.reference")}:{" "}
                      <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
                    </p>

                    <p className={styles.successText}>{t("book.orderSaved")}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isFormReady || isSubmitting || !!orderId}
                >
                  {isSubmitting ? t("book.submitting") : t("book.submit")}
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
