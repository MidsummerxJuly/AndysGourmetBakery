// app/api/orders/route.ts
import { db } from "@/app/db";
import {customersTable, ordersTable, orderItemsTable } from "@/app/db/schema";
import { NextResponse } from "next/server";


//To route bakery orders//

export async function POST(req: Request) {
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

    await db.transaction(async (tx) => {
      await tx.insert(customersTable).values({
        id: customerId,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
      });

      await tx.insert(ordersTable).values({
        id: orderId,
        customer_id: customerId,
        subtotal_cents: data.subtotal_cents,
        total_cents: data.total_cents,
        payment_status: "pending",
        order_status: "pending",
        fulfillment_type: data.fulfillment_type,
        pickup: data.pickup,
        order_date: data.order_date,
        customer_notes: data.customer_notes,
      });

      await tx.insert(orderItemsTable).values(
        data.items.map((item: any) => ({
          id: crypto.randomUUID(),
          order_id: orderId,

          item_name: item.item_name,
          category: item.category,
          size: item.size,
          quantity: item.quantity,

          unit_price_cents: item.unit_price_cents,
          line_total_cents: item.line_total_cents,

          custom_cake_options_json: item.custom_cake_options_json ?? null,
        }))
      );
    });

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}