// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

let pool: Pool | null = null;

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in .env");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
    });
  }

  return pool;
}

export async function GET() {
  try {
    const result = await getPool().query(`
      SELECT
        o.id AS order_id,
        o.subtotal_cents,
        o.total_cents,
        o.payment_status,
        o.order_status,
        o.fulfillment_type,
        o.pickup,
        o.order_date,
        o.customer_notes,
        o.created_at,

        c.customer_name,
        c.customer_phone,
        c.customer_email,

        oi.id AS item_id,
        oi.item_name,
        oi.category,
        oi.size,
        oi.quantity,
        oi.unit_price_cents,
        oi.line_total_cents,
        oi.custom_cake_options_json
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ORDER BY o.created_at DESC, oi.created_at ASC;
    `);

    const ordersMap = new Map();

    for (const row of result.rows) {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.order_id,
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          customer_email: row.customer_email,
          subtotal_cents: row.subtotal_cents,
          total_cents: row.total_cents,
          payment_status: row.payment_status,
          order_status: row.order_status,
          fulfillment_type: row.fulfillment_type,
          pickup: row.pickup,
          order_date: row.order_date,
          customer_notes: row.customer_notes,
          created_at: row.created_at,
          items: [],
        });
      }

      if (row.item_id) {
        ordersMap.get(row.order_id).items.push({
          id: row.item_id,
          item_name: row.item_name,
          category: row.category,
          size: row.size,
          quantity: row.quantity,
          unit_price_cents: row.unit_price_cents,
          line_total_cents: row.line_total_cents,
          custom_cake_options_json: row.custom_cake_options_json,
        });
      }
    }

    return NextResponse.json({
      success: true,
      orders: Array.from(ordersMap.values()),
    });
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin orders",
        details: message,
      },
      { status: 500 }
    );
  }
}