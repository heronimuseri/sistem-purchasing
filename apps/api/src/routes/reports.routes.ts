import { Router } from "express";
import { db } from "../config/database.js";
import { purchaseOrders } from "../db/schema/purchase-orders.js";
import { purchaseRequests } from "../db/schema/purchase-requests.js";
import { payments } from "../db/schema/payments.js";
import { suppliers } from "../db/schema/suppliers.js";
import { eq, and, sql, desc, gte, lte } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles, HO_ROLES, ADMIN_ROLES } from "../middleware/role.middleware.js";

const router = Router();

// Purchasing summary report
router.get("/purchasing", authMiddleware, requireRoles(...HO_ROLES, ...ADMIN_ROLES), async (req, res, next) => {
    try {
        const companyId = req.user!.companyId;

        // Get counts
        const prCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(purchaseRequests)
            .where(eq(purchaseRequests.companyId, companyId));

        const poCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(purchaseOrders)
            .where(eq(purchaseOrders.companyId, companyId));

        const totalPaid = await db
            .select({ sum: sql<number>`COALESCE(sum(amount::numeric), 0)` })
            .from(payments)
            .where(eq(payments.status, "completed"));

        const pendingPayments = await db
            .select({ count: sql<number>`count(*)` })
            .from(payments)
            .where(eq(payments.status, "pending"));

        res.json({
            data: {
                totalPR: prCount[0]?.count || 0,
                totalPO: poCount[0]?.count || 0,
                totalPaid: totalPaid[0]?.sum || 0,
                pendingPayments: pendingPayments[0]?.count || 0,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Detailed purchasing report
router.get("/purchasing/detail", authMiddleware, requireRoles(...HO_ROLES, ...ADMIN_ROLES), async (req, res, next) => {
    try {
        const { startDate, endDate, status } = req.query;

        let query = db.query.purchaseOrders.findMany({
            where: eq(purchaseOrders.companyId, req.user!.companyId),
            with: {
                items: true,
                supplier: {
                    columns: { id: true, name: true },
                },
                purchaseRequest: {
                    columns: { id: true, prNumber: true, department: true },
                },
            },
            orderBy: [desc(purchaseOrders.createdAt)],
        });

        const result = await query;

        res.json({ data: result });
    } catch (error) {
        next(error);
    }
});

// Monthly purchasing report
router.get("/purchasing/monthly", authMiddleware, requireRoles(...HO_ROLES, ...ADMIN_ROLES), async (req, res, next) => {
    try {
        const year = parseInt(req.query.year as string) || new Date().getFullYear();

        // Get monthly totals
        const monthlyData = await db.execute(sql`
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as po_count,
        COALESCE(SUM(grand_total::numeric), 0) as total_amount
      FROM purchase_orders
      WHERE company_id = ${req.user!.companyId}
        AND EXTRACT(YEAR FROM created_at) = ${year}
      GROUP BY EXTRACT(MONTH FROM created_at)
      ORDER BY month
    `);

        res.json({
            data: {
                year,
                months: monthlyData.rows,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Vendor-based report
router.get("/purchasing/vendor", authMiddleware, requireRoles(...HO_ROLES, ...ADMIN_ROLES), async (req, res, next) => {
    try {
        const vendorStats = await db.execute(sql`
      SELECT 
        s.id,
        s.name,
        s.type,
        COUNT(po.id) as po_count,
        COALESCE(SUM(po.grand_total::numeric), 0) as total_amount
      FROM suppliers s
      LEFT JOIN purchase_orders po ON s.id = po.supplier_id
      WHERE s.company_id = ${req.user!.companyId}
        AND s.is_active = true
      GROUP BY s.id, s.name, s.type
      ORDER BY total_amount DESC
    `);

        res.json({ data: vendorStats.rows });
    } catch (error) {
        next(error);
    }
});

export { router as reportsRouter };
