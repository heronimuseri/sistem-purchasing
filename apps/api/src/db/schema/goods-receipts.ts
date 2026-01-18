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
import { purchaseOrders, poItems } from "./purchase-orders.js";

export const grStatusEnum = pgEnum("gr_status", [
    "draft",
    "pending_payment",
    "paid",
]);

export const grItemConditionEnum = pgEnum("gr_item_condition", [
    "good",
    "damaged",
]);

export const goodsReceipts = pgTable("goods_receipts", {
    id: uuid("id").defaultRandom().primaryKey(),
    bpbNumber: varchar("bpb_number", { length: 50 }).notNull().unique(),
    poId: uuid("po_id")
        .references(() => purchaseOrders.id)
        .notNull(),
    vendorDeliveryNote: varchar("vendor_delivery_note", { length: 100 }),
    receivedDate: date("received_date").notNull(),
    deliveryNotePhoto: text("delivery_note_photo"),
    goodsPhoto: text("goods_photo"),
    notes: text("notes"),
    status: grStatusEnum("status").default("draft").notNull(),
    createdBy: uuid("created_by")
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const goodsReceiptsRelations = relations(
    goodsReceipts,
    ({ one, many }) => ({
        purchaseOrder: one(purchaseOrders, {
            fields: [goodsReceipts.poId],
            references: [purchaseOrders.id],
        }),
        creator: one(users, {
            fields: [goodsReceipts.createdBy],
            references: [users.id],
        }),
        items: many(grItems),
    })
);

export const grItems = pgTable("gr_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    grId: uuid("gr_id")
        .references(() => goodsReceipts.id, { onDelete: "cascade" })
        .notNull(),
    poItemId: uuid("po_item_id").references(() => poItems.id),
    itemName: varchar("item_name", { length: 255 }).notNull(),
    quantityOrdered: decimal("quantity_ordered", { precision: 10, scale: 2 }).notNull(),
    quantityReceived: decimal("quantity_received", { precision: 10, scale: 2 }).notNull(),
    unit: varchar("unit", { length: 50 }).notNull(),
    condition: grItemConditionEnum("condition").default("good").notNull(),
    damageNotes: text("damage_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const grItemsRelations = relations(grItems, ({ one }) => ({
    goodsReceipt: one(goodsReceipts, {
        fields: [grItems.grId],
        references: [goodsReceipts.id],
    }),
    poItem: one(poItems, {
        fields: [grItems.poItemId],
        references: [poItems.id],
    }),
}));

export type GoodsReceipt = typeof goodsReceipts.$inferSelect;
export type NewGoodsReceipt = typeof goodsReceipts.$inferInsert;
export type GrItem = typeof grItems.$inferSelect;
export type NewGrItem = typeof grItems.$inferInsert;

export const insertGoodsReceiptSchema = createInsertSchema(goodsReceipts);
export const selectGoodsReceiptSchema = createSelectSchema(goodsReceipts);
export const insertGrItemSchema = createInsertSchema(grItems);
export const selectGrItemSchema = createSelectSchema(grItems);
