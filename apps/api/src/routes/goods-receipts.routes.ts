import { Router } from "express";
import { db } from "../config/database.js";
import { goodsReceipts, grItems } from "../db/schema/goods-receipts.js";
import { purchaseOrders, poItems } from "../db/schema/purchase-orders.js";
import { eq, and, desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, ESTATE_ROLES } from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { generateDocumentNumber } from "../utils/number-generator.js";
import { z } from "zod";

const router = Router();

// GR item schema
const grItemSchema = z.object({
    poItemId: z.string().uuid().optional(),
    itemName: z.string().min(1).max(255),
    quantityOrdered: z.coerce.number().positive(),
    quantityReceived: z.coerce.number().min(0),
    unit: z.string().min(1).max(50),
    condition: z.enum(["good", "damaged"]).default("good"),
    damageNotes: z.string().optional(),
});

// Create GR schema
const createGRSchema = z.object({
    poId: z.string().uuid(),
    vendorDeliveryNote: z.string().max(100).optional(),
    receivedDate: z.string(),
    deliveryNotePhoto: z.string().optional(),
    goodsPhoto: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(grItemSchema).min(1),
});

// Get POs pending receipt
router.get("/pending-pos", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        const result = await db.query.purchaseOrders.findMany({
            where: and(
                eq(purchaseOrders.companyId, req.user!.companyId),
                eq(purchaseOrders.status, "sent")
            ),
            with: {
                items: true,
                supplier: {
                    columns: { id: true, name: true, address: true },
                },
            },
            orderBy: [desc(purchaseOrders.createdAt)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// List all goods receipts
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query.goodsReceipts.findMany({
            with: {
                items: true,
                purchaseOrder: {
                    columns: { id: true, poNumber: true },
                    with: {
                        supplier: {
                            columns: { id: true, name: true },
                        },
                    },
                },
                creator: {
                    columns: { id: true, name: true },
                },
            },
            orderBy: [desc(goodsReceipts.createdAt)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single goods receipt
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const result = await db.query.goodsReceipts.findFirst({
            where: eq(goodsReceipts.id, req.params.id),
            with: {
                items: true,
                purchaseOrder: {
                    with: {
                        items: true,
                        supplier: true,
                    },
                },
                creator: {
                    columns: { id: true, name: true, email: true },
                },
            },
        });

        if (!result) {
            throw new AppError("Goods Receipt not found", 404);
        }

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Create goods receipt (BPB)
router.post("/", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        const data = createGRSchema.parse(req.body);
        const bpbNumber = await generateDocumentNumber("BPB");

        const result = await db.transaction(async (tx) => {
            // Create goods receipt
            const [gr] = await tx
                .insert(goodsReceipts)
                .values({
                    bpbNumber,
                    poId: data.poId,
                    vendorDeliveryNote: data.vendorDeliveryNote,
                    receivedDate: data.receivedDate,
                    deliveryNotePhoto: data.deliveryNotePhoto,
                    goodsPhoto: data.goodsPhoto,
                    notes: data.notes,
                    status: "draft",
                    createdBy: req.user!.id,
                })
                .returning();

            // Create GR items
            const items = await tx
                .insert(grItems)
                .values(
                    data.items.map((item) => ({
                        grId: gr.id,
                        poItemId: item.poItemId,
                        itemName: item.itemName,
                        quantityOrdered: String(item.quantityOrdered),
                        quantityReceived: String(item.quantityReceived),
                        unit: item.unit,
                        condition: item.condition,
                        damageNotes: item.damageNotes,
                    }))
                )
                .returning();

            return { ...gr, items };
        });

        res.status(201).json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Confirm goods receipt
router.post("/:id/confirm", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        const result = await db.transaction(async (tx) => {
            // Update GR status
            const [gr] = await tx
                .update(goodsReceipts)
                .set({ status: "pending_payment", updatedAt: new Date() })
                .where(
                    and(
                        eq(goodsReceipts.id, req.params.id),
                        eq(goodsReceipts.status, "draft")
                    )
                )
                .returning();

            if (!gr) {
                throw new AppError("GR not found or already confirmed", 404);
            }

            // Update PO status to received
            await tx
                .update(purchaseOrders)
                .set({ status: "received", updatedAt: new Date() })
                .where(eq(purchaseOrders.id, gr.poId));

            return gr;
        });

        res.json({ data: result, message: "Goods receipt confirmed" });
    } catch (error) {
        next(error);
    }
});

// Update goods receipt (draft only)
router.patch("/:id", authMiddleware, requireRoles("kerani"), async (req, res, next) => {
    try {
        const data = createGRSchema.partial().parse(req.body);

        const result = await db
            .update(goodsReceipts)
            .set({
                ...data,
                items: undefined,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(goodsReceipts.id, req.params.id),
                    eq(goodsReceipts.status, "draft")
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("GR not found or cannot be edited", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

export { router as goodsReceiptsRouter };
