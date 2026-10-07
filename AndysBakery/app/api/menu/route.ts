import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const menuApiUrl = process.env.NEXT_PUBLIC_ANDY_BAKERY_MENU_API_URL;

export async function GET() {
  if (!menuApiUrl) {
    return NextResponse.json(
      { error: "Menu service is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(menuApiUrl, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Menu service is unavailable." },
        { status: 502 }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Unable to retrieve the bakery menu:", error);

    return NextResponse.json(
      { error: "Menu service is unavailable." },
      { status: 502 }
    );
  }
}
