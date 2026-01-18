import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";

// Import routes
import { usersRouter } from "./routes/users.routes.js";
import { suppliersRouter } from "./routes/suppliers.routes.js";
import { purchaseRequestsRouter } from "./routes/purchase-requests.routes.js";
import { purchaseOrdersRouter } from "./routes/purchase-orders.routes.js";
import { goodsReceiptsRouter } from "./routes/goods-receipts.routes.js";
import { paymentsRouter } from "./routes/payments.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";
import { companiesRouter } from "./routes/companies.routes.js";

// Import middleware
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Better Auth handler - handles all /api/auth/* routes
app.all("/api/auth/*", toNodeHandler(auth));

// API routes
app.use("/api/companies", companiesRouter);
app.use("/api/users", usersRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/purchase-requests", purchaseRequestsRouter);
app.use("/api/purchase-orders", purchaseOrdersRouter);
app.use("/api/goods-receipts", goodsReceiptsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/reports", reportsRouter);

// Error handling middleware
app.use(errorHandler);

export { app };
