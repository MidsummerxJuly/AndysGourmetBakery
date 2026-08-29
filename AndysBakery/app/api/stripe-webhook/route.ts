import { db } from "@/app/db";
import {
  customersTable,
  ordersTable,
  orderItemsTable,
  paymentTable,
} from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatReference(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(value: string) {
  if (!value) return "No date selected";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${month}/${day}/${year}`;
}

function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature failed:", error);

    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return NextResponse.json(
          { error: "Missing orderId in Stripe metadata" },
          { status: 400 }
        );
      }

      await db.transaction(async (tx) => {
        await tx
          .update(ordersTable)
          .set({
            payment_status: "paid",
            order_status: "received",
          })
          .where(eq(ordersTable.id, orderId));

        await tx
          .update(paymentTable)
          .set({
            status: "paid",
            stripe_payment_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.id,
          })
          .where(eq(paymentTable.order_id, orderId));
      });

      const [orderDetails] = await db
        .select({
          orderId: ordersTable.id,
          totalCents: ordersTable.total_cents,
          paymentStatus: ordersTable.payment_status,
          orderStatus: ordersTable.order_status,
          fulfillmentType: ordersTable.fulfillment_type,
          orderDate: ordersTable.order_date,
          customerNotes: ordersTable.customer_notes,

          customerName: customersTable.customer_name,
          customerPhone: customersTable.customer_phone,
          customerEmail: customersTable.customer_email,
        })
        .from(ordersTable)
        .leftJoin(customersTable, eq(ordersTable.customer_id, customersTable.id))
        .where(eq(ordersTable.id, orderId))
        .limit(1);

      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.order_id, orderId));

      const mailer = getMailer();

      if (mailer && orderDetails) {
        const bakeryEmail = process.env.BAKERY_ORDER_EMAIL;
        const fromEmail = process.env.SMTP_USER;
        const orderReference = formatReference(orderDetails.orderId);

        const itemsHTML = items
          .map((item) => {
            return `
              <tr>
                <td style="padding: 10px; border: 1px solid #eee;">
                  <strong>${item.item_name}</strong><br />
                  ${item.category}${item.size ? ` · ${item.size}` : ""}
                </td>
                <td style="padding: 10px; border: 1px solid #eee; text-align: center;">
                  x${item.quantity}
                </td>
                <td style="padding: 10px; border: 1px solid #eee; text-align: right;">
                  ${formatMoney(item.line_total_cents)}
                </td>
              </tr>
            `;
          })
          .join("");

        const bakeryEmailHTML = `
          <div style="font-family: Arial, sans-serif; color: #3c2a1e; max-width: 650px; margin: 0 auto;">
            <h2>New Paid Bakery Order</h2>

            <p><strong>Order Reference:</strong> ${orderReference}</p>
            <p><strong>Customer:</strong> ${orderDetails.customerName}</p>
            <p><strong>Phone:</strong> ${orderDetails.customerPhone}</p>
            <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>
            <p><strong>Requested Date:</strong> ${formatDate(orderDetails.orderDate)}</p>
            <p><strong>Fulfillment:</strong> ${orderDetails.fulfillmentType}</p>
            <p><strong>Total Paid:</strong> ${formatMoney(orderDetails.totalCents)}</p>

            <h3>Items</h3>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Item</th>
                  <th style="padding: 10px; border: 1px solid #eee;">Qty</th>
                  <th style="padding: 10px; border: 1px solid #eee; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            ${
              orderDetails.customerNotes
                ? `<h3>Customer Notes</h3><p>${orderDetails.customerNotes}</p>`
                : ""
            }

            <p style="margin-top: 24px;">View this order in the admin dashboard.</p>
          </div>
        `;

        const customerEmailHTML = `
          <div style="font-family: Arial, sans-serif; color: #3c2a1e; max-width: 650px; margin: 0 auto;">
            <h2>Thank you for your order!</h2>

            <p>Hi ${orderDetails.customerName},</p>

            <p>Andy&apos;s Bakery received your order and payment successfully.</p>

            <p><strong>Order Reference:</strong> ${orderReference}</p>
            <p><strong>Requested Date:</strong> ${formatDate(orderDetails.orderDate)}</p>
            <p><strong>Total Paid:</strong> ${formatMoney(orderDetails.totalCents)}</p>

            <h3>Your Items</h3>

            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <p style="margin-top: 24px;">
              The bakery will review your order and contact you if anything needs confirmation.
            </p>

            <p>Thank you,<br />Andy&apos;s Bakery</p>
          </div>
        `;

        if (bakeryEmail && fromEmail) {
          await mailer.sendMail({
            from: `"Andy’s Bakery Orders" <${fromEmail}>`,
            to: bakeryEmail,
            subject: `New paid order #${orderReference}`,
            html: bakeryEmailHTML,
          });
        }

        if (fromEmail && orderDetails.customerEmail) {
          await mailer.sendMail({
            from: `"Andy’s Bakery" <${fromEmail}>`,
            to: orderDetails.customerEmail,
            subject: `Your Andy’s Bakery order #${orderReference}`,
            html: customerEmailHTML,
          });
        }
      } else {
        console.log("Email notifications skipped: SMTP not configured.");
      }

      console.log(`Order ${orderId} marked as paid and notification processed.`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook failed:", error);

    return NextResponse.json(
      { error: "Webhook failed to process order" },
      { status: 500 }
    );
  }
}