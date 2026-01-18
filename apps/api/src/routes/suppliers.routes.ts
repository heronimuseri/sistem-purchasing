import { Router } from "express";
import { db } from "../config/database.js";
import { suppliers } from "../db/schema/suppliers.js";
import { eq, and, ilike, or } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, HO_ROLES, ADMIN_ROLES } from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { z } from "zod";

const router = Router();

// Create supplier schema
const createSupplierSchema = z.object({
    name: z.string().min(1).max(255),
    type: z.string().max(100).optional(),
    address: z.string().optional(),
    contactPerson: z.string().max(255).optional(),
    phone: z.string().max(50).optional(),
    whatsapp: z.string().max(50).optional(),
    email: z.string().email().optional(),
});

// List all suppliers (filtered by company)
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const search = req.query.search as string | undefined;

        let query = db
            .select()
            .from(suppliers)
            .where(
                and(
                    eq(suppliers.companyId, req.user!.companyId),
                    eq(suppliers.isActive, true)
                )
            )
            .orderBy(suppliers.name);

        // Add search filter if provided
        if (search) {
            query = db
                .select()
                .from(suppliers)
                .where(
                    and(
                        eq(suppliers.companyId, req.user!.companyId),
                        eq(suppliers.isActive, true),
                        or(
                            ilike(suppliers.name, `%${search}%`),
                            ilike(suppliers.contactPerson, `%${search}%`),
                            ilike(suppliers.address, `%${search}%`)
                        )
                    )
                )
                .orderBy(suppliers.name);
        }

        const result = await query;
        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single supplier
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const result = await db
            .select()
            .from(suppliers)
            .where(
                and(
                    eq(suppliers.id, req.params.id),
                    eq(suppliers.companyId, req.user!.companyId)
                )
            )
            .limit(1);

        if (result.length === 0) {
            throw new AppError("Supplier not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Create supplier
router.post("/", authMiddleware, requireRoles(...HO_ROLES, ...ADMIN_ROLES), async (req, res, next) => {
    try {
        const data = createSupplierSchema.parse(req.body);

        const result = await db.insert(suppliers).values({
            ...data,
            companyId: req.user!.companyId,
        }).returning();

        res.status(201).json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Update supplier
router.patch("/:id", authMiddleware, requireRoles(...HO_ROLES, ...ADMIN_ROLES), async (req, res, next) => {
    try {
        const data = createSupplierSchema.partial().parse(req.body);

        const result = await db
            .update(suppliers)
            .set({ ...data, updatedAt: new Date() })
            .where(
                and(
                    eq(suppliers.id, req.params.id),
                    eq(suppliers.companyId, req.user!.companyId)
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("Supplier not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Delete (deactivate) supplier
router.delete("/:id", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const result = await db
            .update(suppliers)
            .set({ isActive: false, updatedAt: new Date() })
            .where(
                and(
                    eq(suppliers.id, req.params.id),
                    eq(suppliers.companyId, req.user!.companyId)
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("Supplier not found", 404);
        }

        res.json({ message: "Supplier deactivated successfully" });
    } catch (error) {
        next(error);
    }
});

export { router as suppliersRouter };
