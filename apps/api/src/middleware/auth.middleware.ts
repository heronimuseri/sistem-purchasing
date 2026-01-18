import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.js";
import { AppError } from "./error.middleware.js";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                companyId: string;
            };
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers as any,
        });

        if (!session || !session.user) {
            throw new AppError("Unauthorized", 401);
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || "",
            role: (session.user as any).role || "",
            companyId: (session.user as any).companyId || "",
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(401).json({ error: "Unauthorized" });
    }
};
