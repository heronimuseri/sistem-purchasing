import { Router } from "express";
import { db } from "../config/database.js";
import { users } from "../db/schema/users.js";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, ADMIN_ROLES } from "../middleware/role.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import { z } from "zod";

const router = Router();

// Create user schema
const createUserSchema = z.object({
    companyId: z.string().uuid(),
    name: z.string().min(1).max(255),
    email: z.string().email(),
    phone: z.string().max(50).optional(),
    role: z.enum([
        "kerani",
        "asisten_traksi",
        "ktu",
        "manager_estate",
        "purchasing_ho",
        "manager_ho",
        "direktur",
    ]),
    department: z.string().max(100).optional(),
    estateId: z.string().max(50).optional(),
});

// Get current user
router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.id, req.user!.id))
            .limit(1);

        if (result.length === 0) {
            throw new AppError("User not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// List all users (filtered by company)
router.get("/", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.companyId, req.user!.companyId))
            .orderBy(users.name);

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Get single user
router.get("/:id", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const result = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.id, req.params.id),
                    eq(users.companyId, req.user!.companyId)
                )
            )
            .limit(1);

        if (result.length === 0) {
            throw new AppError("User not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Create user
router.post("/", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const data = createUserSchema.parse(req.body);

        const result = await db.insert(users).values({
            ...data,
            emailVerified: false,
        }).returning();

        res.status(201).json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Update user
router.patch("/:id", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const data = createUserSchema.partial().parse(req.body);

        const result = await db
            .update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(
                and(
                    eq(users.id, req.params.id),
                    eq(users.companyId, req.user!.companyId)
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("User not found", 404);
        }

        res.json({ data: result[0] });
    } catch (error) {
        next(error);
    }
});

// Delete (deactivate) user
router.delete("/:id", authMiddleware, requireRoles(...ADMIN_ROLES), async (req, res, next) => {
    try {
        const result = await db
            .update(users)
            .set({ isActive: false, updatedAt: new Date() })
            .where(
                and(
                    eq(users.id, req.params.id),
                    eq(users.companyId, req.user!.companyId)
                )
            )
            .returning();

        if (result.length === 0) {
            throw new AppError("User not found", 404);
        }

        res.json({ message: "User deactivated successfully" });
    } catch (error) {
        next(error);
    }
});

export { router as usersRouter };
