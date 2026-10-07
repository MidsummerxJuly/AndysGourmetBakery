import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const menuApiUrl = process.env.NEXT_PUBLIC_ANDY_BAKERY_MENU_API_URL;
const bakeryApiBaseUrl =
  process.env.ANDY_BAKERY_API_BASE_URL ??
  menuApiUrl?.replace(/\/menu\/?$/, "");

export async function POST(request: Request) {
  let orderId: unknown;

  try {
    ({ orderId } = await request.json());
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ message: "An order ID is required." }, { status: 400 });
  }

  if (!bakeryApiBaseUrl) {
    return NextResponse.json(
      { message: "Bakery API is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${bakeryApiBaseUrl}/orders/${encodeURIComponent(orderId)}/checkout`,
      {
        method: "POST",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to start checkout." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unable to create Stripe checkout session:", error);

    return NextResponse.json(
      { message: "Unable to start checkout." },
      { status: 502 }
    );
  }
}
