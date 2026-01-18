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
import { companies } from "./companies.js";
import { users } from "./users.js";
import { suppliers } from "./suppliers.js";
import { purchaseRequests, prItems } from "./purchase-requests.js";

export const poTaxTypeEnum = pgEnum("po_tax_type", ["ppn_11", "non_ppn"]);

export const poPaymentTermsEnum = pgEnum("po_payment_terms", [
    "net_30",
    "net_14",
    "cod",
]);

export const poStatusEnum = pgEnum("po_status", [
    "draft",
    "pending_approval_l1",
    "pending_approval_l2",
    "approved",
    "sent",
    "received",
    "paid",
]);

export const purchaseOrders = pgTable("purchase_orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
        .references(() => companies.id)
        .notNull(),
    poNumber: varchar("po_number", { length: 50 }).notNull().unique(),
    prId: uuid("pr_id")
        .references(() => purchaseRequests.id)
        .notNull(),
    supplierId: uuid("supplier_id")
        .references(() => suppliers.id)
        .notNull(),
    estimatedDeliveryDate: date("estimated_delivery_date"),
    taxType: poTaxTypeEnum("tax_type").default("ppn_11").notNull(),
    subtotal: decimal("subtotal", { precision: 15, scale: 2 })
        .default("0")
        .notNull(),
    taxAmount: decimal("tax_amount", { precision: 15, scale: 2 })
        .default("0")
        .notNull(),
    grandTotal: decimal("grand_total", { precision: 15, scale: 2 })
        .default("0")
        .notNull(),
    paymentTerms: poPaymentTermsEnum("payment_terms").default("net_30").notNull(),
    remarks: text("remarks"),
    status: poStatusEnum("status").default("draft").notNull(),
    createdBy: uuid("created_by")
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const purchaseOrdersRelations = relations(
    purchaseOrders,
    ({ one, many }) => ({
        company: one(companies, {
            fields: [purchaseOrders.companyId],
            references: [companies.id],
        }),
        purchaseRequest: one(purchaseRequests, {
            fields: [purchaseOrders.prId],
            references: [purchaseRequests.id],
        }),
        supplier: one(suppliers, {
            fields: [purchaseOrders.supplierId],
            references: [suppliers.id],
        }),
        creator: one(users, {
            fields: [purchaseOrders.createdBy],
            references: [users.id],
        }),
        items: many(poItems),
    })
);

export const poItems = pgTable("po_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    poId: uuid("po_id")
        .references(() => purchaseOrders.id, { onDelete: "cascade" })
        .notNull(),
    prItemId: uuid("pr_item_id").references(() => prItems.id),
    itemName: varchar("item_name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 50 }),
    unit: varchar("unit", { length: 50 }).notNull(),
    quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
    unitPrice: decimal("unit_price", { precision: 15, scale: 2 })
        .default("0")
        .notNull(),
    subtotal: decimal("subtotal", { precision: 15, scale: 2 })
        .default("0")
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const poItemsRelations = relations(poItems, ({ one }) => ({
    purchaseOrder: one(purchaseOrders, {
        fields: [poItems.poId],
        references: [purchaseOrders.id],
    }),
    prItem: one(prItems, {
        fields: [poItems.prItemId],
        references: [prItems.id],
    }),
}));

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
export type PoItem = typeof poItems.$inferSelect;
export type NewPoItem = typeof poItems.$inferInsert;

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders);
export const selectPurchaseOrderSchema = createSelectSchema(purchaseOrders);
export const insertPoItemSchema = createInsertSchema(poItems);
export const selectPoItemSchema = createSelectSchema(poItems);
