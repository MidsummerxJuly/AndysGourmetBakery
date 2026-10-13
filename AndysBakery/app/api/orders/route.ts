import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const menuApiUrl = process.env.NEXT_PUBLIC_ANDY_BAKERY_MENU_API_URL;
const bakeryApiBaseUrl =
  process.env.ANDY_BAKERY_API_BASE_URL ??
  menuApiUrl?.replace(/\/menu\/?$/, "");

export async function POST(request: Request) {
  if (!bakeryApiBaseUrl) {
    return NextResponse.json(
      { message: "Bakery API is not configured." },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();
    const response = await fetch(`${bakeryApiBaseUrl}/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to create your order." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unable to create bakery order:", error);

    return NextResponse.json(
      { message: "Unable to create your order." },
      { status: 502 }
    );
  }
}
