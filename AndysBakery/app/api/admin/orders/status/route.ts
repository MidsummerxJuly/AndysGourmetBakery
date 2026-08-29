import { db } from "@/app/db";
import { ordersTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const allowedStatuses = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "canceled",
];

function isAdmin(request: NextRequest) {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  const adminCookie = request.cookies.get("andy_admin_session")?.value;

  return !!sessionToken && adminCookie === sessionToken;
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { orderId, orderStatus } = await request.json();

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, message: "Missing orderId or orderStatus" },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    await db
      .update(ordersTable)
      .set({
        order_status: orderStatus,
      })
      .where(eq(ordersTable.id, orderId));

    return NextResponse.json({
      success: true,
      orderStatus,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}