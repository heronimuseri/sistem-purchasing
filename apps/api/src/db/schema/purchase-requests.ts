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

export const prPriorityEnum = pgEnum("pr_priority", ["normal", "high"]);

export const prStatusEnum = pgEnum("pr_status", [
    "draft",
    "pending_approval_l1",
    "pending_approval_l2",
    "approved",
    "rejected",
    "converted",
]);

export const prItemCategoryEnum = pgEnum("pr_item_category", [
    "pupuk",
    "herbisida",
    "bbm",
    "sparepart",
    "umum",
]);

export const purchaseRequests = pgTable("purchase_requests", {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
        .references(() => companies.id)
        .notNull(),
    prNumber: varchar("pr_number", { length: 50 }).notNull().unique(),
    department: varchar("department", { length: 100 }).notNull(),
    estateId: varchar("estate_id", { length: 50 }),
    requestDate: date("request_date").notNull(),
    priority: prPriorityEnum("priority").default("normal").notNull(),
    justification: text("justification"),
    status: prStatusEnum("status").default("draft").notNull(),
    createdBy: uuid("created_by")
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const purchaseRequestsRelations = relations(
    purchaseRequests,
    ({ one, many }) => ({
        company: one(companies, {
            fields: [purchaseRequests.companyId],
            references: [companies.id],
        }),
        creator: one(users, {
            fields: [purchaseRequests.createdBy],
            references: [users.id],
        }),
        items: many(prItems),
    })
);

export const prItems = pgTable("pr_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    prId: uuid("pr_id")
        .references(() => purchaseRequests.id, { onDelete: "cascade" })
        .notNull(),
    itemName: varchar("item_name", { length: 255 }).notNull(),
    quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
    unit: varchar("unit", { length: 50 }).notNull(),
    category: prItemCategoryEnum("category").default("umum").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prItemsRelations = relations(prItems, ({ one }) => ({
    purchaseRequest: one(purchaseRequests, {
        fields: [prItems.prId],
        references: [purchaseRequests.id],
    }),
}));

export type PurchaseRequest = typeof purchaseRequests.$inferSelect;
export type NewPurchaseRequest = typeof purchaseRequests.$inferInsert;
export type PrItem = typeof prItems.$inferSelect;
export type NewPrItem = typeof prItems.$inferInsert;

export const insertPurchaseRequestSchema = createInsertSchema(purchaseRequests);
export const selectPurchaseRequestSchema = createSelectSchema(purchaseRequests);
export const insertPrItemSchema = createInsertSchema(prItems);
export const selectPrItemSchema = createSelectSchema(prItems);
