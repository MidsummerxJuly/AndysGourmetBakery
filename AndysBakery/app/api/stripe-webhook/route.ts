// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

export const runtime = "nodejs";

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in .env");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return pool;
}

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, message: "Missing STRIPE_SECRET_KEY in .env" },
        { status: 500 }
      );
    }

    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, message: "Missing STRIPE_WEBHOOK_SECRET in .env" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing Stripe signature" },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        await getPool().query(
          `
          UPDATE orders
          SET payment_status = $1
          WHERE id = $2
          `,
          ["paid", orderId]
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Stripe webhook failed",
        details: message,
      },
      { status: 500 }
    );
  }
}