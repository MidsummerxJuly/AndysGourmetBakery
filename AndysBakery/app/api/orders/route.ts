// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const data = await req.json();

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order must include at least one item" },
        { status: 400 }
      );
    }

    const customerId = crypto.randomUUID();
    const orderId = crypto.randomUUID();

    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO customers (
        id,
        customer_name,
        customer_phone,
        customer_email
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        customerId,
        data.customer_name,
        data.customer_phone,
        data.customer_email,
      ]
    );

    await client.query(
      `
      INSERT INTO orders (
        id,
        customer_id,
        subtotal_cents,
        total_cents,
        payment_status,
        order_status,
        fulfillment_type,
        pickup,
        order_date,
        customer_notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        orderId,
        customerId,
        data.subtotal_cents ?? 0,
        data.total_cents ?? 0,
        "pending",
        "pending",
        data.fulfillment_type ?? null,
        data.pickup ?? null,
        data.order_date ?? null,
        data.customer_notes ?? null,
      ]
    );

    for (const item of data.items) {
      const customOptions =
        item.custom_cake_options_json
          ? JSON.stringify(item.custom_cake_options_json)
          : null;

      await client.query(
        `
        INSERT INTO order_items (
          id,
          order_id,
          item_name,
          category,
          size,
          quantity,
          unit_price_cents,
          line_total_cents,
          custom_cake_options_json
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
        `,
        [
          crypto.randomUUID(),
          orderId,
          item.item_name,
          item.category ?? null,
          item.size ?? null,
          item.quantity ?? 1,
          item.unit_price_cents ?? 0,
          item.line_total_cents ?? 0,
          customOptions,
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to create order:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        details: message,
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}