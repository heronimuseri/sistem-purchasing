import { Router } from "express";
import { db } from "../config/database.js";
import { purchaseRequests, prItems } from "../db/schema/purchase-requests.js";
import { approvalLogs } from "../db/schema/approval-logs.js";
import { eq, and, desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    requireRoles,
    ESTATE_ROLES,
    APPROVER_ROLES,
} from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { generateDocumentNumber } from "../utils/number-generator.js";
import { z } from "zod";

const router = Router();

// Create PR item schema
const prItemSchema = z.object({
    itemName: z.string().min(1).max(255),
    quantity: z.coerce.number().positive(),
    unit: z.string().min(1).max(50),
    category: z.enum(["pupuk", "herbisida", "bbm", "sparepart", "umum"]).default("umum"),
});

// Create PR schema
const createPRSchema = z.object({
    department: z.string().min(1).max(100),
    estateId: z.string().max(50).optional(),
    requestDate: z.string(),
    priority: z.enum(["normal", "high"]).default("normal"),
    justification: z.string().optional(),
    items: z.array(prItemSchema).min(1),
});

// List all PRs (filtered by role and company)
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query.purchaseRequests.findMany({
            where: eq(purchaseRequests.companyId, req.user!.companyId),
            with: {
                items: true,
                creator: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [desc(purchaseRequests.createdAt)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single PR with items
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query.purchaseRequests.findFirst({
            where: and(
                eq(purchaseRequests.id, req.params.id),
                eq(purchaseRequests.companyId, req.user!.companyId)
            ),
            with: {
                items: true,
                creator: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!result) {
            throw new AppError("Purchase Request not found", 404);
        }

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Create PR
router.post("/", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        const data = createPRSchema.parse(req.body);
        const prNumber = await generateDocumentNumber("PR");

        // Start transaction
        const result = await db.transaction(async (tx) => {
            // Create PR
            const [pr] = await tx
                .insert(purchaseRequests)
                .values({
                    companyId: req.user!.companyId,
                    prNumber,
                    department: data.department,
                    estateId: data.estateId,
                    requestDate: data.requestDate,
                    priority: data.priority,
                    justification: data.justification,
                    status: "draft",
                    createdBy: req.user!.id,
                })
                .returning();

            // Create PR items
            const items = await tx
                .insert(prItems)
                .values(
                    data.items.map((item) => ({
                        prId: pr.id,
                        itemName: item.itemName,
                        quantity: String(item.quantity),
                        unit: item.unit,
                        category: item.category,
                    }))
                )
                .returning();

            return { ...pr, items };
        });

        res.status(201).json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Update PR (draft only)
router.patch("/:id", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        // Check if PR exists and is draft
        const existing = await db
            .select()
            .from(purchaseRequests)
            .where(
                and(
                    eq(purchaseRequests.id, req.params.id),
                    eq(purchaseRequests.companyId, req.user!.companyId),
                    eq(purchaseRequests.status, "draft")
                )
            )
            .limit(1);

        if (existing.length === 0) {
            throw new AppError("PR not found or cannot be edited", 404);
        }

        const data = createPRSchema.partial().parse(req.body);

        const result = await db
            .update(purchaseRequests)
            .set({
                ...data,
                items: undefined, // Remove items from update data
                updatedAt: new Date(),
            })
            .where(eq(purchaseRequests.id, req.params.id))
            .returning();

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Submit PR for approval
router.post("/:id/submit", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        const result = await db
            .update(purchaseRequests)
            .set({
                status: "pending_approval_l1",
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(purchaseRequests.id, req.params.id),
                    eq(purchaseRequests.companyId, req.user!.companyId),
                    eq(purchaseRequests.status, "draft")
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("PR not found or cannot be submitted", 404);
        }

        res.json({ data: result[0], message: "PR submitted for approval" });
    } catch (error) {
        next(error);
    }
});

// Approve PR
router.post("/:id/approve", authMiddleware, requireRoles(...APPROVER_ROLES), async (req, res, next) => {
    try {
        const { comments } = req.body;

        const [pr] = await db
            .select()
            .from(purchaseRequests)
            .where(
                and(
                    eq(purchaseRequests.id, req.params.id),
                    eq(purchaseRequests.companyId, req.user!.companyId)
                )
            )
            .limit(1);

        if (!pr) {
            throw new AppError("PR not found", 404);
        }

        // Determine next status based on current status and user role
        let nextStatus: "pending_approval_l2" | "approved";
        let approvalLevel: number;

        if (pr.status === "pending_approval_l1") {
            nextStatus = "pending_approval_l2";
            approvalLevel = 1;
        } else if (pr.status === "pending_approval_l2") {
            nextStatus = "approved";
            approvalLevel = 2;
        } else {
            throw new AppError("PR cannot be approved in current status", 400);
        }

        // Update PR and log approval
        await db.transaction(async (tx) => {
            await tx
                .update(purchaseRequests)
                .set({ status: nextStatus, updatedAt: new Date() })
                .where(eq(purchaseRequests.id, req.params.id));

            await tx.insert(approvalLogs).values({
                entityType: "purchase_request",
                entityId: req.params.id,
                approvalLevel,
                action: "approved",
                comments,
                approvedBy: req.user!.id,
            });
        });

        res.json({ message: `PR approved at level ${approvalLevel}` });
    } catch (error) {
        next(error);
    }
});

// Reject PR
router.post("/:id/reject", authMiddleware, requireRoles(...APPROVER_ROLES), async (req, res, next) => {
    try {
        const { comments } = req.body;

        const [pr] = await db
            .select()
            .from(purchaseRequests)
            .where(
                and(
                    eq(purchaseRequests.id, req.params.id),
                    eq(purchaseRequests.companyId, req.user!.companyId)
                )
            )
            .limit(1);

        if (!pr) {
            throw new AppError("PR not found", 404);
        }

        const approvalLevel = pr.status === "pending_approval_l1" ? 1 : 2;

        await db.transaction(async (tx) => {
            await tx
                .update(purchaseRequests)
                .set({ status: "rejected", updatedAt: new Date() })
                .where(eq(purchaseRequests.id, req.params.id));

            await tx.insert(approvalLogs).values({
                entityType: "purchase_request",
                entityId: req.params.id,
                approvalLevel,
                action: "rejected",
                comments,
                approvedBy: req.user!.id,
            });
        });

        res.json({ message: "PR rejected" });
    } catch (error) {
        next(error);
    }
});

// Delete PR (draft only)
router.delete("/:id", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        // First delete items, then PR
        await db.transaction(async (tx) => {
            await tx.delete(prItems).where(eq(prItems.prId, req.params.id));

            const result = await tx
                .delete(purchaseRequests)
                .where(
                    and(
                        eq(purchaseRequests.id, req.params.id),
                        eq(purchaseRequests.companyId, req.user!.companyId),
                        eq(purchaseRequests.status, "draft")
                    )
                )
                .returning();

            if (result.length === 0) {
                throw new AppError("PR not found or cannot be deleted", 404);
            }
        });

        res.json({ message: "PR deleted successfully" });
    } catch (error) {
        next(error);
    }
});

export { router as purchaseRequestsRouter };
