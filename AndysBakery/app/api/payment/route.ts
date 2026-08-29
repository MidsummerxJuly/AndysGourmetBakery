import { db } from "@/app/db";
import { ordersTable, paymentTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Missing orderId" },
        { status: 400 }
      );
    }

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.total_cents <= 0) {
      return NextResponse.json(
        { success: false, message: "Order total must be greater than zero" },
        { status: 400 }
      );
    }

    const shortOrderRef = order.id.slice(0, 8).toUpperCase();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Andy’s Bakery Order ${shortOrderRef}`,
            },
            unit_amount: order.total_cents,
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/payment/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel?order_id=${orderId}`,

      metadata: {
        orderId: order.id,
      },

      payment_intent_data: {
        metadata: {
          orderId: order.id,
        },
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { success: false, message: "Stripe checkout URL was not created" },
        { status: 500 }
      );
    }

    await db.insert(paymentTable).values({
      id: crypto.randomUUID(),
      order_id: order.id,
      stripe_payment_id: checkoutSession.id,
      amount_cents: order.total_cents,
      currency: "usd",
      status: "checkout_created",
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error("Payment route error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create payment checkout" },
      { status: 500 }
    );
  }
}