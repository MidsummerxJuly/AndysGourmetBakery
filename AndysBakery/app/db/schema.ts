import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const customersTable = sqliteTable('customers', {
    //Main primary key//
    id: text('id').primaryKey(),
    //customers communication info//
    customer_name: text('customer_name').notNull(),
    customer_phone: text('customer_phone').notNull(),
    customer_email: text('customer_email').notNull(),

    time_created: integer('time_created').default(sql`(strftime('%s', 'now') * 1000)`).notNull(),

    });


export const ordersTable = sqliteTable('orders', {
    //primary key//
    id: text('id').primaryKey(),
    //foreign key that references customerTable primary key//
    customer_id: text('customer_id').notNull().references(() => customersTable.id),
    //payment stuatus & costs//
    subtotal_cents: integer('subtotal_cents').notNull(),
    total_cents: integer('total_cents').notNull(),
    payment_status: text('payment_status').notNull().default('pending'),
    order_status: text('order_status').notNull().default('pending'),
    //pickup & order notes//
    fulfillment_type: text('fulfillment_type').notNull(),
    pickup: text('pickup').notNull(),
    order_date: text('order_date').notNull(),
    customer_notes: text('customer_notes'),
    created_time: integer('created_time').default(sql`(strftime('%s', 'now') * 1000)`).notNull(),
});


export const orderItemsTable = sqliteTable('order_items', {
    //primary key//
    id: text('id').primaryKey(),
    //foreign key referencing ordersTable primary key//
    order_id: text('order_id').notNull().references(() => ordersTable.id),
    //item info//
    item_name: text('item_name').notNull(),
    category: text('category').notNull(),
    size: text('size'),
    quantity: integer('quantity').notNull(),
    //cost//
    unit_price_cents: integer('unit_price_cents').notNull(),
    line_total_cents: integer('line_total_cents').notNull(),
    //customer cake stuff//
    custom_cake_options_json: text('custom_cake_options_json'),


});


export const paymentTable = sqliteTable('payments', {
    //primary key//
    id: text('id').primaryKey(),
    //foreign key that references customerTable primary key//
    order_id: text('order_id').notNull().references(() => ordersTable.id),
    // payment info & cost//
    stripe_payment_id: text('stripe_payment_id'),
    amount_cents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('usd'),
    //status & time created//
    status: text('status').notNull().default('pending'),
    //time payment was made//
    created_time: integer('created_time').default(sql`(strftime('%s', 'now') * 1000)`).notNull(),
});


export const consentTable = sqliteTable('userConsent', {
    consent_id: text('consent_id').notNull().references(() => customersTable.id),
    email: text('email').notNull().unique(),
    name: text('name').notNull(), 
    phone_number: text('phone_number').notNull(),
    consent_version: text('consent_version').notNull(),
    signed_at: integer('signed_at').default(sql`(strftime('%s', 'now')* 1000)`).notNull(),
    typed_signature: text('typed_signature').notNull(),
    agreed: integer('agreed', {mode: 'boolean'}).notNull().default(false),
    ip_address: text('ip_address').notNull(),
    pdf_path: text('pdf_path').notNull(),
    // consentFormSigned: integer('consentFormSigned', {mode: 'boolean'}).notNull().default(false),
})


export type InsertCustomer = typeof customersTable.$inferInsert;
export type SelectCustomer = typeof customersTable.$inferSelect;

export type InsertOrder = typeof ordersTable.$inferInsert;
export type SelectOrder = typeof ordersTable.$inferSelect;

export type InsertOrderItem = typeof orderItemsTable.$inferInsert;
export type SelectOrderItem = typeof orderItemsTable.$inferSelect;

export type InsertPayment = typeof paymentTable.$inferInsert;
export type SelectPayment = typeof paymentTable.$inferSelect;

export type InsertUserConsent = typeof consentTable.$inferInsert;
export type SelectUserConsent= typeof consentTable.$inferSelect;
