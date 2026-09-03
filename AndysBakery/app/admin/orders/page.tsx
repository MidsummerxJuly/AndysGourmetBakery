"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLogoutButton from "./AdminLogoutButton";
import styles from "./page.module.css";

type OrderItem = {
  id: string;
  item_name: string;
  category: string | null;
  size: string | null;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  custom_cake_options_json: unknown;
};

type AdminOrder = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  subtotal_cents: number;
  total_cents: number;
  payment_status: string;
  order_status: string;
  fulfillment_type: string | null;
  pickup: boolean | null;
  order_date: string | null;
  customer_notes: string | null;
  created_at: string;
  items: OrderItem[];
};

function formatMoney(cents: number) {
  return `$${((cents ?? 0) / 100).toFixed(2)}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.details || data.message || "Failed to load orders");
        }

        setOrders(data.orders);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  async function updateOrderStatus(orderId: string, orderStatus: string) {
    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.details || data.message || "Failed to update order");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, order_status: orderStatus } : order
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(message);
    }
  }

  return (
    <main className={styles.adminOrdersPage}>
      <header className={styles.adminHeader}>
        <div>
          <p className={styles.eyebrow}>Andy&apos;s Bakery Admin</p>
          <h1>Orders</h1>
        </div>

        <div className={styles.adminActions}>
          <Link href="/">Back to Site</Link>
          <AdminLogoutButton />
        </div>
      </header>

      {loading && <p>Loading orders...</p>}

      {error && (
        <div className={styles.errorBox}>
          <strong>Could not load orders.</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p>No orders found yet.</p>
      )}

      <section className={styles.ordersList}>
        {orders.map((order) => (
          <article key={order.id} className={styles.orderCard}>
            <div className={styles.orderTopRow}>
              <div>
                <h2>{order.customer_name}</h2>
                <p>{order.customer_email}</p>
                <p>{order.customer_phone}</p>
              </div>

              <div>
                <p>
                  <strong>Total:</strong> {formatMoney(order.total_cents)}
                </p>
                <p>
                  <strong>Payment:</strong> {order.payment_status}
                </p>
                <label>
                  <strong>Status:</strong>{" "}
                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </div>
            </div>

            <div className={styles.orderMeta}>
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Fulfillment:</strong>{" "}
                {order.fulfillment_type ?? "Not specified"}
              </p>
              <p>
                <strong>Order date:</strong>{" "}
                {order.order_date ?? "Not specified"}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {order.customer_notes && (
              <div className={styles.notesBox}>
                <strong>Customer notes:</strong>
                <p>{order.customer_notes}</p>
              </div>
            )}

            <div className={styles.itemsList}>
              <h3>Items</h3>

              {order.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div>
                    <strong>{item.item_name}</strong>
                    <p>{item.size ?? "No size"}</p>
                  </div>

                  <div>
                    <p>Qty: {item.quantity}</p>
                    <p>{formatMoney(item.line_total_cents)}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}