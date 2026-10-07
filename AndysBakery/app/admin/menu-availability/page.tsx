"use client";

import { useEffect, useState } from "react";

type Batch = {
  id: string;
  name: string;
  status: string;
  is_current: boolean;
};

type AvailabilityItem = {
  menu_item_size_id: number;
  menu_item_id: number;
  item_name: string;
  size_id: number;
  size_name: string;
  price_cents: number;
  batch_availability_id: string | null;
  quantity_available: number;
  made_this_batch: boolean;
};

export default function MenuAvailabilityPage() {
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [availabilityItems, setAvailabilityItems] = useState<AvailabilityItem[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadAvailability() {
    try {
      setIsPageLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/admin/batch-availability");

      if (!response.ok) {
        throw new Error("Failed to load menu availability.");
      }

      const data = await response.json();

      setCurrentBatch(data.batch);
      setAvailabilityItems(data.items ?? []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not load menu availability.");
    } finally {
      setIsPageLoading(false);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  function updateMadeThisBatch(menuItemSizeId: number, madeThisBatch: boolean) {
    setAvailabilityItems((currentItems) =>
      currentItems.map((item) => {
        if (item.menu_item_size_id !== menuItemSizeId) {
          return item;
        }

        return {
          ...item,
          made_this_batch: madeThisBatch,
          quantity_available: madeThisBatch ? item.quantity_available : 0,
        };
      })
    );
  }

  function updateQuantity(menuItemSizeId: number, value: string) {
    const nextQuantity = Math.max(0, Math.floor(Number(value) || 0));

    setAvailabilityItems((currentItems) =>
      currentItems.map((item) => {
        if (item.menu_item_size_id !== menuItemSizeId) {
          return item;
        }

        return {
          ...item,
          quantity_available: nextQuantity,
        };
      })
    );
  }

  async function publishChanges() {
    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/admin/batch-availability", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: availabilityItems.map((item) => ({
            menu_item_size_id: item.menu_item_size_id,
            made_this_batch: item.made_this_batch,
            quantity_available: item.quantity_available,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish menu availability.");
      }

      const data = await response.json();

      setSuccessMessage(`Published ${data.updatedCount} availability updates.`);
      await loadAvailability();
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not publish menu availability.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isPageLoading) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Menu Availability</h1>
        <p>Loading current batch...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>Menu Availability</h1>
        <p>Set menu availability for the current batch.</p>

        {currentBatch && (
          <p>
            <strong>Current Batch:</strong> {currentBatch.name}{" "}
            <span style={{ opacity: 0.7 }}>({currentBatch.status})</span>
          </p>
        )}
      </header>

      {errorMessage && (
        <div style={{ marginBottom: "1rem", color: "crimson" }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: "1rem", color: "green" }}>
          {successMessage}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Size</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Made This Batch</th>
              <th style={thStyle}>Quantity Available</th>
              <th style={thStyle}>Customer Status</th>
            </tr>
          </thead>

          <tbody>
            {availabilityItems.map((item) => {
              const status = !item.made_this_batch
                ? "Unavailable this batch"
                : item.quantity_available === 0
                  ? "Sold out"
                  : item.quantity_available <= 3
                    ? `Only ${item.quantity_available} left`
                    : "Available";

              return (
                <tr key={item.menu_item_size_id}>
                  <td style={tdStyle}>{item.item_name}</td>
                  <td style={tdStyle}>{item.size_name}</td>
                  <td style={tdStyle}>
                    ${(item.price_cents / 100).toFixed(2)}
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="checkbox"
                      checked={item.made_this_batch}
                      onChange={(event) =>
                        updateMadeThisBatch(
                          item.menu_item_size_id,
                          event.target.checked
                        )
                      }
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      min="0"
                      value={item.quantity_available}
                      disabled={!item.made_this_batch}
                      onChange={(event) =>
                        updateQuantity(item.menu_item_size_id, event.target.value)
                      }
                      style={{ width: "90px" }}
                    />
                  </td>
                  <td style={tdStyle}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={publishChanges}
        disabled={isSaving}
        style={{
          marginTop: "1.5rem",
          padding: "0.8rem 1.2rem",
          cursor: isSaving ? "not-allowed" : "pointer",
        }}
      >
        {isSaving ? "Publishing..." : "Publish Changes"}
      </button>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "0.75rem",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "0.75rem",
};