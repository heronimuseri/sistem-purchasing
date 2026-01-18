import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware.js";

type UserRole =
    | "kerani"
    | "asisten_traksi"
    | "ktu"
    | "manager_estate"
    | "purchasing_ho"
    | "manager_ho"
    | "direktur";

export const requireRoles = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        if (!allowedRoles.includes(req.user.role as UserRole)) {
            throw new AppError("Forbidden: Insufficient permissions", 403);
        }

        next();
    };
};

// Role group helpers
export const ADMIN_ROLES: UserRole[] = ["manager_ho", "direktur"];
export const ESTATE_ROLES: UserRole[] = [
    "kerani",
    "asisten_traksi",
    "ktu",
    "manager_estate",
];
export const HO_ROLES: UserRole[] = ["purchasing_ho", "manager_ho", "direktur"];
export const APPROVER_ROLES: UserRole[] = [
    "asisten_traksi",
    "ktu",
    "manager_estate",
    "manager_ho",
    "direktur",
];
