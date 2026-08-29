"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

const statusOptions = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "canceled",
];

type OrderStatusControlsProps = {
  orderId: string;
  currentStatus: string;
};

export default function OrderStatusControls({
  orderId,
  currentStatus,
}: OrderStatusControlsProps) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleStatusChange(newStatus: string) {
    setSelectedStatus(newStatus);
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderStatus: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update order status.");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setSelectedStatus(currentStatus);
      setErrorMessage("Could not update status.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.statusControlBox}>
      <label>
        Update Status
        <select
          value={selectedStatus}
          onChange={(event) => handleStatusChange(event.target.value)}
          disabled={isSaving}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </label>

      {isSaving && <p className={styles.savingText}>Saving...</p>}
      {errorMessage && <p className={styles.statusError}>{errorMessage}</p>}
    </div>
  );
}