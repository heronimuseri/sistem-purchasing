import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users.js";

export const approvalEntityTypeEnum = pgEnum("approval_entity_type", [
    "purchase_request",
    "purchase_order",
]);

export const approvalActionEnum = pgEnum("approval_action", [
    "approved",
    "rejected",
]);

export const approvalLogs = pgTable("approval_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: approvalEntityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    approvalLevel: integer("approval_level").notNull(),
    action: approvalActionEnum("action").notNull(),
    comments: text("comments"),
    approvedBy: uuid("approved_by")
        .references(() => users.id)
        .notNull(),
    approvedAt: timestamp("approved_at").defaultNow().notNull(),
});

export const approvalLogsRelations = relations(approvalLogs, ({ one }) => ({
    approver: one(users, {
        fields: [approvalLogs.approvedBy],
        references: [users.id],
    }),
}));

export type ApprovalLog = typeof approvalLogs.$inferSelect;
export type NewApprovalLog = typeof approvalLogs.$inferInsert;

export const insertApprovalLogSchema = createInsertSchema(approvalLogs);
export const selectApprovalLogSchema = createSelectSchema(approvalLogs);

// System settings table
export const systemSettings = pgTable("system_settings", {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;

export const insertSystemSettingSchema = createInsertSchema(systemSettings);
export const selectSystemSettingSchema = createSelectSchema(systemSettings);
