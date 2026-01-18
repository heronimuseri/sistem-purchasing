import { z } from "zod";

// Common validation schemas
export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Validate request body with Zod schema
export function validateBody<T>(schema: z.ZodSchema<T>) {
    return (data: unknown): T => {
        return schema.parse(data);
    };
}

// Validate query params with Zod schema
export function validateQuery<T>(schema: z.ZodSchema<T>) {
    return (data: unknown): T => {
        return schema.parse(data);
    };
}
