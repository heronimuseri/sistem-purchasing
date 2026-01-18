import { Router } from "express";
import { db } from "../config/database.js";
import { purchaseOrders, poItems } from "../db/schema/purchase-orders.js";
import { purchaseRequests, prItems } from "../db/schema/purchase-requests.js";
import { approvalLogs } from "../db/schema/approval-logs.js";
import { eq, and, desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, HO_ROLES, ADMIN_ROLES } from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { generateDocumentNumber } from "../utils/number-generator.js";
import { z } from "zod";

const router = Router();

// PO item schema
const poItemSchema = z.object({
    prItemId: z.string().uuid().optional(),
    itemName: z.string().min(1).max(255),
    sku: z.string().max(50).optional(),
    unit: z.string().min(1).max(50),
    quantity: z.coerce.number().positive(),
    unitPrice: z.coerce.number().min(0),
});

// Create PO schema
const createPOSchema = z.object({
    prId: z.string().uuid(),
    supplierId: z.string().uuid(),
    estimatedDeliveryDate: z.string().optional(),
    taxType: z.enum(["ppn_11", "non_ppn"]).default("ppn_11"),
    paymentTerms: z.enum(["net_30", "net_14", "cod"]).default("net_30"),
    remarks: z.string().optional(),
    items: z.array(poItemSchema).min(1),
});

// Get approved PRs for PO creation
router.get("/approved-prs", authMiddleware, requireRoles("purchasing_ho"), async (req, res, next) => {
    try {
        const result = await db.query.purchaseRequests.findMany({
            where: and(
                eq(purchaseRequests.companyId, req.user!.companyId),
                eq(purchaseRequests.status, "approved")
            ),
            with: {
                items: true,
                creator: {
                    columns: { id: true, name: true },
                },
            },
            orderBy: [desc(purchaseRequests.createdAt)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// List all POs
router.get("/", authMiddleware, requireRoles(...HO_ROLES), async (req, res, next) => {
    try {
        const result = await db.query.purchaseOrders.findMany({
            where: eq(purchaseOrders.companyId, req.user!.companyId),
            with: {
                items: true,
                supplier: {
                    columns: { id: true, name: true },
                },
                purchaseRequest: {
                    columns: { id: true, prNumber: true },
                },
                creator: {
                    columns: { id: true, name: true },
                },
            },
            orderBy: [desc(purchaseOrders.createdAt)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single PO
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query.purchaseOrders.findFirst({
            where: and(
                eq(purchaseOrders.id, req.params.id),
                eq(purchaseOrders.companyId, req.user!.companyId)
            ),
            with: {
                items: true,
                supplier: true,
                purchaseRequest: {
                    with: { items: true },
                },
                creator: {
                    columns: { id: true, name: true, email: true },
                },
            },
        });

        if (!result) {
            throw new AppError("Purchase Order not found", 404);
        }

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Create PO from approved PR
router.post("/", authMiddleware, requireRoles("purchasing_ho"), async (req, res, next) => {
    try {
        const data = createPOSchema.parse(req.body);
        const poNumber = await generateDocumentNumber("PO");

        // Calculate totals
        let subtotal = 0;
        for (const item of data.items) {
            subtotal += item.quantity * item.unitPrice;
        }
        const taxAmount = data.taxType === "ppn_11" ? subtotal * 0.11 : 0;
        const grandTotal = subtotal + taxAmount;

        const result = await db.transaction(async (tx) => {
            // Create PO
            const [po] = await tx
                .insert(purchaseOrders)
                .values({
                    companyId: req.user!.companyId,
                    poNumber,
                    prId: data.prId,
                    supplierId: data.supplierId,
                    estimatedDeliveryDate: data.estimatedDeliveryDate,
                    taxType: data.taxType,
                    subtotal: String(subtotal),
                    taxAmount: String(taxAmount),
                    grandTotal: String(grandTotal),
                    paymentTerms: data.paymentTerms,
                    remarks: data.remarks,
                    status: "draft",
                    createdBy: req.user!.id,
                })
                .returning();

            // Create PO items
            const items = await tx
                .insert(poItems)
                .values(
                    data.items.map((item) => ({
                        poId: po.id,
                        prItemId: item.prItemId,
                        itemName: item.itemName,
                        sku: item.sku,
                        unit: item.unit,
                        quantity: String(item.quantity),
                        unitPrice: String(item.unitPrice),
                        subtotal: String(item.quantity * item.unitPrice),
                    }))
                )
                .returning();

            // Update PR status to converted
            await tx
                .update(purchaseRequests)
                .set({ status: "converted", updatedAt: new Date() })
                .where(eq(purchaseRequests.id, data.prId));

            return { ...po, items };
        });

        res.status(201).json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Submit PO for approval
router.post("/:id/submit", authMiddleware, requireRoles("purchasing_ho"), async (req, res, next) => {
    try {
        const result = await db
            .update(purchaseOrders)
            .set({ status: "pending_approval_l1", updatedAt: new Date() })
            .where(
                and(
                    eq(purchaseOrders.id, req.params.id),
                    eq(purchaseOrders.companyId, req.user!.companyId),
                    eq(purchaseOrders.status, "draft")
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("PO not found or cannot be submitted", 404);
        }

        res.json({ data: result[0], message: "PO submitted for approval" });
    } catch (error) {
        next(error);
    }
});

// Approve PO
router.post("/:id/approve", authMiddleware, requireRoles("manager_ho", "direktur"), async (req, res, next) => {
    try {
        const { comments } = req.body;

        const [po] = await db
            .select()
            .from(purchaseOrders)
            .where(
                and(
                    eq(purchaseOrders.id, req.params.id),
                    eq(purchaseOrders.companyId, req.user!.companyId)
                )
            )
            .limit(1);

        if (!po) {
            throw new AppError("PO not found", 404);
        }

        let nextStatus: "pending_approval_l2" | "approved";
        let approvalLevel: number;

        if (po.status === "pending_approval_l1") {
            nextStatus = "pending_approval_l2";
            approvalLevel = 1;
        } else if (po.status === "pending_approval_l2") {
            nextStatus = "approved";
            approvalLevel = 2;
        } else {
            throw new AppError("PO cannot be approved in current status", 400);
        }

        await db.transaction(async (tx) => {
            await tx
                .update(purchaseOrders)
                .set({ status: nextStatus, updatedAt: new Date() })
                .where(eq(purchaseOrders.id, req.params.id));

            await tx.insert(approvalLogs).values({
                entityType: "purchase_order",
                entityId: req.params.id,
                approvalLevel,
                action: "approved",
                comments,
                approvedBy: req.user!.id,
            });
        });

        res.json({ message: `PO approved at level ${approvalLevel}` });
    } catch (error) {
        next(error);
    }
});

// Reject PO
router.post("/:id/reject", authMiddleware, requireRoles("manager_ho", "direktur"), async (req, res, next) => {
    try {
        const { comments } = req.body;

        const [po] = await db
            .select()
            .from(purchaseOrders)
            .where(
                and(
                    eq(purchaseOrders.id, req.params.id),
                    eq(purchaseOrders.companyId, req.user!.companyId)
                )
            )
            .limit(1);

        if (!po) {
            throw new AppError("PO not found", 404);
        }

        const approvalLevel = po.status === "pending_approval_l1" ? 1 : 2;

        await db.transaction(async (tx) => {
            await tx
                .update(purchaseOrders)
                .set({ status: "draft", updatedAt: new Date() })
                .where(eq(purchaseOrders.id, req.params.id));

            await tx.insert(approvalLogs).values({
                entityType: "purchase_order",
                entityId: req.params.id,
                approvalLevel,
                action: "rejected",
                comments,
                approvedBy: req.user!.id,
            });
        });

        res.json({ message: "PO rejected" });
    } catch (error) {
        next(error);
    }
});

// Mark PO as sent to vendor
router.post("/:id/mark-sent", authMiddleware, requireRoles("purchasing_ho"), async (req, res, next) => {
    try {
        const result = await db
            .update(purchaseOrders)
            .set({ status: "sent", updatedAt: new Date() })
            .where(
                and(
                    eq(purchaseOrders.id, req.params.id),
                    eq(purchaseOrders.companyId, req.user!.companyId),
                    eq(purchaseOrders.status, "approved")
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("PO not found or not approved", 404);
        }

        res.json({ data: result[0], message: "PO marked as sent" });
    } catch (error) {
        next(error);
    }
});

export { router as purchaseOrdersRouter };
