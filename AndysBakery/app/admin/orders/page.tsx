import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/app/db";
import {
  customersTable,
  orderItemsTable,
  ordersTable,
} from "@/app/db/schema";
import AdminLogoutButton from "./AdminLogoutButton";
import OrderStatusControls from "./OrderStatusControls";
import styles from "./page.module.css";

type AdminOrdersPageProps = {
  searchParams?: Promise<{
    range?: string | string[];
    payment?: string | string[];
    status?: string | string[];
    q?: string | string[];
  }>;
};

const dateFilters = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Past 7 Days", value: "7d" },
  { label: "Past 14 Days", value: "14d" },
  { label: "Past 30 Days", value: "30d" },
];

const paymentFilters = [
  { label: "All Payments", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending Payment", value: "pending" },
];

const statusFilters = [
  { label: "All Statuses", value: "all" },
  { label: "Received", value: "received" },
  { label: "Accepted", value: "accepted" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
];

function getFilterLabel(
  filters: { label: string; value: string }[],
  value: string
) {
  return filters.find((filter) => filter.value === value)?.label || value;
}

function getSingleValue(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function isAllowed(value: string, allowedValues: string[]) {
  return allowedValues.includes(value);
}

function getRangeStart(range: string) {
  const now = new Date();

  if (range === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }

  if (range === "7d") {
    return now.getTime() - 7 * 24 * 60 * 60 * 1000;
  }

  if (range === "14d") {
    return now.getTime() - 14 * 24 * 60 * 60 * 1000;
  }

  if (range === "30d") {
    return now.getTime() - 30 * 24 * 60 * 60 * 1000;
  }

  return 0;
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatOrderDate(dateValue: string) {
  if (!dateValue) return "No date selected";

  const [year, month, day] = dateValue.split("-");
  if (!year || !month || !day) return dateValue;

  return `${month}/${day}/${year}`;
}

function formatCreatedTime(createdTime: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdTime));
}

function formatReference(orderId: string) {
  return orderId.slice(0, 8).toUpperCase();
}

function paymentStatusClass(status: string) {
  if (status === "paid") return `${styles.badge} ${styles.paidBadge}`;
  return `${styles.badge} ${styles.pendingBadge}`;
}

function orderStatusClass(status: string) {
  if (status === "received") return `${styles.badge} ${styles.receivedBadge}`;
  if (status === "accepted") return `${styles.badge} ${styles.acceptedBadge}`;
  if (status === "preparing") return `${styles.badge} ${styles.preparingBadge}`;
  if (status === "ready") return `${styles.badge} ${styles.readyBadge}`;
  if (status === "completed") return `${styles.badge} ${styles.completedBadge}`;
  if (status === "canceled") return `${styles.badge} ${styles.canceledBadge}`;
  return styles.badge;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = searchParams ? await searchParams : {};

  const rawRange = getSingleValue(params.range, "all");
  const rawPayment = getSingleValue(params.payment, "all");
  const rawStatus = getSingleValue(params.status, "all");

  const searchQuery = getSingleValue(params.q, "").trim();
  const normalizedSearchQuery = searchQuery.toLowerCase();
  const searchDigits = searchQuery.replace(/\D/g, "");

  const range = isAllowed(
    rawRange,
    dateFilters.map((filter) => filter.value)
  )
    ? rawRange
    : "all";

  const payment = isAllowed(
    rawPayment,
    paymentFilters.map((filter) => filter.value)
  )
    ? rawPayment
    : "all";

  const status = isAllowed(
    rawStatus,
    statusFilters.map((filter) => filter.value)
  )
    ? rawStatus
    : "all";

  const orderRows = await db
    .select({
      orderId: ordersTable.id,
      customerName: customersTable.customer_name,
      customerEmail: customersTable.customer_email,
      customerPhone: customersTable.customer_phone,
      subtotalCents: ordersTable.subtotal_cents,
      totalCents: ordersTable.total_cents,
      paymentStatus: ordersTable.payment_status,
      orderStatus: ordersTable.order_status,
      fulfillmentType: ordersTable.fulfillment_type,
      pickup: ordersTable.pickup,
      orderDate: ordersTable.order_date,
      customerNotes: ordersTable.customer_notes,
      createdTime: ordersTable.created_time,
    })
    .from(ordersTable)
    .innerJoin(customersTable, eq(ordersTable.customer_id, customersTable.id))
    .orderBy(desc(ordersTable.created_time));

  const itemRows = await db
    .select({
      orderId: orderItemsTable.order_id,
      itemName: orderItemsTable.item_name,
      category: orderItemsTable.category,
      size: orderItemsTable.size,
      quantity: orderItemsTable.quantity,
      unitPriceCents: orderItemsTable.unit_price_cents,
      lineTotalCents: orderItemsTable.line_total_cents,
      customCakeOptionsJson: orderItemsTable.custom_cake_options_json,
    })
    .from(orderItemsTable);

  const itemsByOrder = new Map<string, typeof itemRows>();

  for (const item of itemRows) {
    const existingItems = itemsByOrder.get(item.orderId) || [];
    existingItems.push(item);
    itemsByOrder.set(item.orderId, existingItems);
  }

  const rangeStart = getRangeStart(range);

    const filteredOrders = orderRows.filter((order) => {
    const orderItems = itemsByOrder.get(order.orderId) || [];

    const searchableText = [
      order.orderId,
      formatReference(order.orderId),
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.orderDate,
      order.paymentStatus,
      order.orderStatus,
      ...orderItems.map(
        (item) => `${item.itemName} ${item.category} ${item.size || ""}`
      ),
    ]
      .join(" ")
      .toLowerCase();

    const customerPhoneDigits = order.customerPhone.replace(/\D/g, "");

    const matchesSearch =
      !searchQuery ||
      searchableText.includes(normalizedSearchQuery) ||
      Boolean(searchDigits && customerPhoneDigits.includes(searchDigits));

    const matchesRange = range === "all" || order.createdTime >= rangeStart;
    const matchesPayment =
      payment === "all" || order.paymentStatus === payment;
    const matchesStatus = status === "all" || order.orderStatus === status;

    return matchesSearch && matchesRange && matchesPayment && matchesStatus;
  });

  const totalOrders = filteredOrders.length;
  const paidOrders = filteredOrders.filter(
    (order) => order.paymentStatus === "paid"
  );
  const pendingOrders = filteredOrders.filter(
    (order) => order.paymentStatus !== "paid"
  );

  const paidRevenueCents = paidOrders.reduce(
    (sum, order) => sum + order.totalCents,
    0
  );

    function buildFilterHref(updates: {
      range?: string;
      payment?: string;
      status?: string;
      q?: string;
    }) {
    const nextFilters = {
      range,
      payment,
      status,
      q: searchQuery,
      ...updates,
    };

    const query = new URLSearchParams();

    if (nextFilters.range !== "all") {
      query.set("range", nextFilters.range);
    }

    if (nextFilters.payment !== "all") {
      query.set("payment", nextFilters.payment);
    }

    if (nextFilters.status !== "all") {
      query.set("status", nextFilters.status);
    }

    if (nextFilters.q.trim()) {
      query.set("q", nextFilters.q.trim());
    }

    const queryString = query.toString();
    return queryString ? `/admin/orders?${queryString}` : "/admin/orders";
  }

  function filterButtonClass(isActive: boolean) {
    return isActive
      ? `${styles.filterButton} ${styles.activeFilterButton}`
      : styles.filterButton;
  }

  return (
    <main className={styles.adminPage}>
      <section className={styles.adminHeader}>
        <div>
          <p className={styles.eyebrow}>Andy’s Bakery Admin</p>
          <h1>Orders Dashboard</h1>
          <p className={styles.headerText}>
            Filter orders by date, payment, and order status.
          </p>
        </div>

        <AdminLogoutButton />
      </section>

      <section className={styles.searchCard}>
        <form className={styles.searchForm} action="/admin/orders" method="get">
          {range !== "all" ? (
            <input type="hidden" name="range" value={range} />
          ) : null}

          {payment !== "all" ? (
            <input type="hidden" name="payment" value={payment} />
          ) : null}

          {status !== "all" ? (
            <input type="hidden" name="status" value={status} />
          ) : null}

          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, phone, email, order #, or item"
            aria-label="Search orders"
          />

          <button type="submit">Search</button>

          {searchQuery ? (
            <Link href={buildFilterHref({ q: "" })} className={styles.clearSearchButton}>
              Clear Search
            </Link>
          ) : null}
        </form>
      </section>

     <details className={styles.filtersCard}>
      <summary className={styles.filterSummary}>
        <div>
          <span className={styles.filterSummaryTitle}>Filter Orders</span>
          <span className={styles.filterSummaryText}>
            {getFilterLabel(dateFilters, range)} •{" "}
            {getFilterLabel(paymentFilters, payment)} •{" "}
            {getFilterLabel(statusFilters, status)}
          </span>
        </div>

        <span className={styles.filterSummaryIcon}>⌄</span>
      </summary>

      <div className={styles.filtersPanel}>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Date Range</p>
          <div className={styles.filterButtons}>
            {dateFilters.map((filter) => (
              <Link
                key={filter.value}
                href={buildFilterHref({ range: filter.value })}
                className={filterButtonClass(range === filter.value)}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Payment</p>
          <div className={styles.filterButtons}>
            {paymentFilters.map((filter) => (
              <Link
                key={filter.value}
                href={buildFilterHref({ payment: filter.value })}
                className={filterButtonClass(payment === filter.value)}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Order Status</p>
          <div className={styles.filterButtons}>
            {statusFilters.map((filter) => (
              <Link
                key={filter.value}
                href={buildFilterHref({ status: filter.value })}
                className={filterButtonClass(status === filter.value)}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.clearFiltersRow}>
          <Link href="/admin/orders" className={styles.clearFiltersButton}>
            Clear Filters
          </Link>
        </div>
      </div>
    </details>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p>Showing Orders</p>
          <strong>{totalOrders}</strong>
        </div>

        <div className={styles.statCard}>
          <p>Paid Orders</p>
          <strong>{paidOrders.length}</strong>
        </div>

        <div className={styles.statCard}>
          <p>Pending Payment</p>
          <strong>{pendingOrders.length}</strong>
        </div>

        <div className={styles.statCard}>
          <p>Paid Revenue</p>
          <strong>{formatMoney(paidRevenueCents)}</strong>
        </div>
      </section>

      <section className={styles.ordersSection}>
        <div className={styles.ordersHeader}>
          <h2>Orders</h2>
          <p>
            Showing {filteredOrders.length} of {orderRows.length} total orders.
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No orders found</h3>
            <p>Try clearing the filters or choosing a wider date range.</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const orderItems = itemsByOrder.get(order.orderId) || [];

              return (
               <article key={order.orderId} className={styles.orderCard}>
                <details className={styles.orderDetails}>
                  <summary className={styles.orderSummary}>
                    <div className={styles.summaryMain}>
                      <p className={styles.orderReference}>
                        Order #{formatReference(order.orderId)}
                      </p>
                      <h3>{order.customerName}</h3>
                      <p className={styles.summaryDate}>
                        Needed {formatOrderDate(order.orderDate)}
                      </p>
                    </div>

                    <div className={styles.summaryMeta}>
                      <div className={styles.orderBadges}>
                        <span className={paymentStatusClass(order.paymentStatus)}>
                          {order.paymentStatus}
                        </span>
                        <span className={orderStatusClass(order.orderStatus)}>
                          {order.orderStatus}
                        </span>
                      </div>

                      <strong className={styles.summaryTotal}>
                        {formatMoney(order.totalCents)}
                      </strong>

                      <span className={styles.viewDetailsText}>View Details</span>
                    </div>
                  </summary>

                  <div className={styles.expandedOrderContent}>
                    <p className={styles.createdTime}>
                      Created {formatCreatedTime(order.createdTime)}
                    </p>

                    <div className={styles.customerGrid}>
                      <div>
                        <p className={styles.detailLabel}>Phone</p>
                        <p>{order.customerPhone}</p>
                      </div>

                      <div>
                        <p className={styles.detailLabel}>Email</p>
                        <p>{order.customerEmail}</p>
                      </div>

                      <div>
                        <p className={styles.detailLabel}>Date Needed</p>
                        <p>{formatOrderDate(order.orderDate)}</p>
                      </div>

                      <div>
                        <p className={styles.detailLabel}>Fulfillment</p>
                        <p>
                          {order.fulfillmentType} — {order.pickup}
                        </p>
                      </div>
                    </div>

                    <div className={styles.itemsBox}>
                      <p className={styles.detailLabel}>Items</p>

                      {orderItems.length === 0 ? (
                        <p>No items found for this order.</p>
                      ) : (
                        <ul className={styles.itemsList}>
                          {orderItems.map((item, index) => (
                            <li key={`${order.orderId}-${index}`}>
                              <div>
                                <strong>
                                  {item.quantity}× {item.itemName}
                                </strong>
                                <span>
                                  {item.category}
                                  {item.size ? ` • ${item.size}` : ""}
                                </span>
                              </div>

                              <span>{formatMoney(item.lineTotalCents)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {order.customerNotes ? (
                      <div className={styles.notesBox}>
                        <p className={styles.detailLabel}>Customer Notes</p>
                        <p>{order.customerNotes}</p>
                      </div>
                    ) : null}

                    <div className={styles.orderBottomRow}>
                      <div>
                        <p className={styles.detailLabel}>Total</p>
                        <strong className={styles.orderTotal}>
                          {formatMoney(order.totalCents)}
                        </strong>
                      </div>

                      <OrderStatusControls
                        orderId={order.orderId}
                        currentStatus={order.orderStatus}
                      />
                    </div>
                  </div>
                </details>
              </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}