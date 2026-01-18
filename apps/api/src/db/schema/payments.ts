import {
    pgTable,
    uuid,
    varchar,
    text,
    date,
    timestamp,
    decimal,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users.js";
import { suppliers } from "./suppliers.js";
import { purchaseOrders } from "./purchase-orders.js";
import { goodsReceipts } from "./goods-receipts.js";

export const paymentMethodEnum = pgEnum("payment_method", [
    "bank_transfer",
    "cash",
    "cheque",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "completed",
]);

export const payments = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    voucherNumber: varchar("voucher_number", { length: 50 }).notNull().unique(),
    grId: uuid("gr_id")
        .references(() => goodsReceipts.id)
        .notNull(),
    poId: uuid("po_id")
        .references(() => purchaseOrders.id)
        .notNull(),
    supplierId: uuid("supplier_id")
        .references(() => suppliers.id)
        .notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method")
        .default("bank_transfer")
        .notNull(),
    bankName: varchar("bank_name", { length: 100 }),
    transactionReference: varchar("transaction_reference", { length: 100 }),
    paymentDate: date("payment_date"),
    proofOfPayment: text("proof_of_payment"),
    remarks: text("remarks"),
    status: paymentStatusEnum("status").default("pending").notNull(),
    processedBy: uuid("processed_by")
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
    goodsReceipt: one(goodsReceipts, {
        fields: [payments.grId],
        references: [goodsReceipts.id],
    }),
    purchaseOrder: one(purchaseOrders, {
        fields: [payments.poId],
        references: [purchaseOrders.id],
    }),
    supplier: one(suppliers, {
        fields: [payments.supplierId],
        references: [suppliers.id],
    }),
    processor: one(users, {
        fields: [payments.processedBy],
        references: [users.id],
    }),
}));

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
