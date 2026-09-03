// app/api/payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, message: "Missing STRIPE_SECRET_KEY in .env" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const data = await req.json();

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items provided" },
        { status: 400 }
      );
    }

    const lineItems = data.items.map((item: any) => {
  const itemName = item.item_name ?? item.name ?? "Bakery Item";
  const itemSize = item.size ? ` - ${item.size}` : "";

    const unitAmount =
      item.unit_price_cents ?? Math.round(Number(item.price ?? 0) * 100);

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${itemName}${itemSize}`,
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity ?? 1,
        };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/payment/success`,
      cancel_url: `${appUrl}/payment/cancel`,
      metadata: {
        source: "andys-bakery",
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Failed to create payment:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment",
        details: message,
      },
      { status: 500 }
    );
  }
}