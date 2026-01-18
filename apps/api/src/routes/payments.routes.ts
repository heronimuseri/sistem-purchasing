import { Router } from "express";
import { db } from "../config/database.js";
import { payments } from "../db/schema/payments.js";
import { goodsReceipts } from "../db/schema/goods-receipts.js";
import { purchaseOrders } from "../db/schema/purchase-orders.js";
import { eq, and, desc } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, HO_ROLES } from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { generateDocumentNumber } from "../utils/number-generator.js";
import { z } from "zod";

const router = Router();

// Create payment schema
const createPaymentSchema = z.object({
    grId: z.string().uuid(),
    poId: z.string().uuid(),
    supplierId: z.string().uuid(),
    amount: z.coerce.number().positive(),
    paymentMethod: z.enum(["bank_transfer", "cash", "cheque"]).default("bank_transfer"),
    bankName: z.string().max(100).optional(),
    transactionReference: z.string().max(100).optional(),
    paymentDate: z.string(),
    proofOfPayment: z.string().optional(),
    remarks: z.string().optional(),
});

// Get pending payments (GRs with pending_payment status)
router.get("/pending", authMiddleware, requireRoles(...HO_ROLES), async (req, res, next) => {
    try {
        const result = await db.query.goodsReceipts.findMany({
            where: eq(goodsReceipts.status, "pending_payment"),
            with: {
                purchaseOrder: {
                    columns: { id: true, poNumber: true, grandTotal: true },
                    with: {
                        supplier: {
                            columns: { id: true, name: true, type: true },
                        },
                    },
                },
                creator: {
                    columns: { id: true, name: true },
                },
            },
            orderBy: [desc(goodsReceipts.receivedDate)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get payment history
router.get("/history", authMiddleware, requireRoles(...HO_ROLES), async (req, res, next) => {
    try {
        const result = await db.query.payments.findMany({
            where: eq(payments.status, "completed"),
            with: {
                purchaseOrder: {
                    columns: { id: true, poNumber: true },
                },
                supplier: {
                    columns: { id: true, name: true },
                },
                processor: {
                    columns: { id: true, name: true },
                },
            },
            orderBy: [desc(payments.paymentDate)],
        });

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single payment
router.get("/:id", authMiddleware, requireRoles(...HO_ROLES), async (req, res, next) => {
    try {
        const result = await db.query.payments.findFirst({
            where: eq(payments.id, req.params.id),
            with: {
                goodsReceipt: {
                    with: { items: true },
                },
                purchaseOrder: {
                    with: {
                        items: true,
                        supplier: true,
                    },
                },
                processor: {
                    columns: { id: true, name: true, email: true },
                },
            },
        });

        if (!result) {
            throw new AppError("Payment not found", 404);
        }

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Process payment
router.post("/", authMiddleware, requireRoles(...HO_ROLES), async (req, res, next) => {
    try {
        const data = createPaymentSchema.parse(req.body);
        const voucherNumber = await generateDocumentNumber("PV");

        const result = await db.transaction(async (tx) => {
            // Create payment
            const [payment] = await tx
                .insert(payments)
                .values({
                    voucherNumber,
                    grId: data.grId,
                    poId: data.poId,
                    supplierId: data.supplierId,
                    amount: String(data.amount),
                    paymentMethod: data.paymentMethod,
                    bankName: data.bankName,
                    transactionReference: data.transactionReference,
                    paymentDate: data.paymentDate,
                    proofOfPayment: data.proofOfPayment,
                    remarks: data.remarks,
                    status: "completed",
                    processedBy: req.user!.id,
                })
                .returning();

            // Update GR status to paid
            await tx
                .update(goodsReceipts)
                .set({ status: "paid", updatedAt: new Date() })
                .where(eq(goodsReceipts.id, data.grId));

            // Update PO status to paid
            await tx
                .update(purchaseOrders)
                .set({ status: "paid", updatedAt: new Date() })
                .where(eq(purchaseOrders.id, data.poId));

            return payment;
        });

        res.status(201).json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get payment voucher (for printing)
router.get("/:id/voucher", authMiddleware, requireRoles(...HO_ROLES), async (req, res, next) => {
    try {
        const result = await db.query.payments.findFirst({
            where: eq(payments.id, req.params.id),
            with: {
                goodsReceipt: true,
                purchaseOrder: {
                    with: {
                        items: true,
                        supplier: true,
                        purchaseRequest: true,
                    },
                },
                processor: {
                    columns: { id: true, name: true },
                },
            },
        });

        if (!result) {
            throw new AppError("Payment not found", 404);
        }

        // Return voucher data for frontend rendering
        res.json({
            data: {
                voucherNumber: result.voucherNumber,
                paymentDate: result.paymentDate,
                amount: result.amount,
                paymentMethod: result.paymentMethod,
                bankName: result.bankName,
                transactionReference: result.transactionReference,
                remarks: result.remarks,
                supplier: result.purchaseOrder?.supplier,
                poNumber: result.purchaseOrder?.poNumber,
                items: result.purchaseOrder?.items,
                processedBy: result.processor,
            },
        });
    } catch (error) {
        next(error);
    }
});

export { router as paymentsRouter };
