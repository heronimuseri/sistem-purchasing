import { Router } from "express";
import { db } from "../config/database.js";
import { companies } from "../db/schema/companies.js";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, ADMIN_ROLES } from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { z } from "zod";

const router = Router();

// Create company schema
const createCompanySchema = z.object({
    code: z.string().min(1).max(50),
    name: z.string().min(1).max(255),
    address: z.string().optional(),
    phone: z.string().max(50).optional(),
});

// List all companies
router.get("/", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const result = await db.select().from(companies).orderBy(companies.name);
        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single company
router.get("/:id", authMiddleware, async (req, res, next) => {
    try {
        const result = await db
            .select()
            .from(companies)
            .where(eq(companies.id, req.params.id))
            .limit(1);

        if (result.length === 0) {
            throw new AppError("Company not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Create company
router.post("/", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const data = createCompanySchema.parse(req.body);

        const result = await db.insert(companies).values(data).returning();

        res.status(201).json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Update company
router.patch("/:id", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const data = createCompanySchema.partial().parse(req.body);

        const result = await db
            .update(companies)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(companies.id, req.params.id))
            .returning();

        if (result.length === 0) {
            throw new AppError("Company not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Delete company
router.delete("/:id", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const result = await db
            .update(companies)
            .set({ isActive: false, updatedAt: new Date() })
            .where(eq(companies.id, req.params.id))
            .returning();

        if (result.length === 0) {
            throw new AppError("Company not found", 404);
        }

        res.json({ message: "Company deactivated successfully" });
    } catch (error) {
        next(error);
    }
});

export { router as companiesRouter };
