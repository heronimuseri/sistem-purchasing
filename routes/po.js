// routes/po.js - API untuk Purchase Order
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { sendWhatsappNotification } = require('./notifications');

// ==============================================
// Helper: Generate PO Number
// ==============================================
async function generatePONumber(connection) {
    const currentYear = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Get or create counter for current year
    await connection.query(`
        INSERT INTO po_counters (year, last_seq) VALUES (?, 0)
        ON DUPLICATE KEY UPDATE year = year
    `, [currentYear]);

    // Increment and get new sequence
    await connection.query(`UPDATE po_counters SET last_seq = last_seq + 1 WHERE year = ?`, [currentYear]);
    const [rows] = await connection.query(`SELECT last_seq FROM po_counters WHERE year = ?`, [currentYear]);
    const seq = String(rows[0].last_seq).padStart(3, '0');

    // Format: 001/PO-SPA/HO/I/2026
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[new Date().getMonth()];

    return `${seq}/PO-SPA/HO/${romanMonth}/${currentYear}`;
}

// ==============================================
// GET /available-pr - PR yang belum dibuatkan PO
// ==============================================
router.get("/available-pr", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT pr.*, 
                   DATEDIFF(NOW(), pr.approval_manager_date) as days_since_approved
            FROM purchase_requests pr
            LEFT JOIN purchase_orders po ON pr.id = po.pr_id
            WHERE pr.status = 'Fully Approved' AND po.id IS NULL
            ORDER BY pr.approval_manager_date ASC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching available PR:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data PR." });
    }
});

// ==============================================
// GET /monitoring - Full lifecycle monitoring
// ==============================================
router.get("/monitoring", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                pr.id as pr_id,
                pr.pr_no,
                pr.tanggal as pr_tanggal,
                pr.keperluan,
                pr.departemen,
                pr.status as pr_status,
                pr.requester_name,
                pr.ktu_name,
                pr.manager_name,
                pr.created_at as pr_created,
                pr.approval_ktu_date,
                pr.approval_manager_date,
                DATEDIFF(pr.approval_ktu_date, pr.created_at) as days_to_ktu,
                DATEDIFF(pr.approval_manager_date, pr.approval_ktu_date) as days_ktu_to_manager,
                po.id as po_id,
                po.po_no,
                po.status as po_status,
                po.purchaser_name,
                po.created_at as po_created,
                po.manager_ho_name,
                po.approval_manager_ho_date,
                po.direktur_name,
                po.approval_direktur_date,
                po.tanggal_kirim,
                po.tanggal_terima,
                po.penerima_name,
                DATEDIFF(po.created_at, pr.approval_manager_date) as days_pr_to_po,
                DATEDIFF(po.approval_manager_ho_date, po.created_at) as days_to_manager_ho,
                DATEDIFF(po.approval_direktur_date, po.approval_manager_ho_date) as days_to_direktur,
                DATEDIFF(po.tanggal_terima, po.tanggal_kirim) as days_delivery,
                v.nama as vendor_nama
            FROM purchase_requests pr
            LEFT JOIN purchase_orders po ON pr.id = po.pr_id
            LEFT JOIN vendors v ON po.vendor_id = v.id
            WHERE pr.status = 'Fully Approved' OR po.id IS NOT NULL
            ORDER BY pr.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching monitoring:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data monitoring." });
    }
});

// ==============================================
// GET /kpi - KPI Purchasing (PO < 3 hari)
// ==============================================
router.get("/kpi", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_po,
                SUM(CASE WHEN DATEDIFF(po.created_at, pr.approval_manager_date) <= 3 THEN 1 ELSE 0 END) as on_time,
                SUM(CASE WHEN DATEDIFF(po.created_at, pr.approval_manager_date) > 3 THEN 1 ELSE 0 END) as late,
                AVG(DATEDIFF(po.created_at, pr.approval_manager_date)) as avg_days
            FROM purchase_orders po
            JOIN purchase_requests pr ON po.pr_id = pr.id
        `);
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Error fetching KPI:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data KPI." });
    }
});

// ==============================================
// GET /vendors - List Vendor for Dropdown (MUST BE BEFORE /:id)
// ==============================================
router.get("/vendors", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nama FROM vendors ORDER BY nama ASC");
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data vendor." });
    }
});

// ==============================================
// GET /pr/:id - Get PR Detail & Items for PO Creation (MUST BE BEFORE /:id)
// ==============================================
router.get("/pr/:id", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM purchase_requests WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "PR tidak ditemukan." });
        }

        const [items] = await pool.query(`SELECT * FROM pr_items WHERE pr_id = ?`, [req.params.id]);

        res.json({ success: true, data: { ...rows[0], items } });
    } catch (error) {
        console.error("Error fetching PR detail:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil detail PR." });
    }
});

// ==============================================
// GET / - Daftar PO (filtered by role)
// ==============================================
router.get("/", async (req, res) => {
    try {
        const { role } = req.session.user;
        let whereClause = "";

        // Filter based on role
        if (role === "purchasing") {
            whereClause = "WHERE po.purchaser_id = " + req.session.user.id;
        } else if (role === "manager_ho") {
            whereClause = "WHERE po.status IN ('Pending Manager HO Approval', 'Pending Direktur Approval', 'Fully Approved', 'Dikirim', 'Diterima', 'Rejected')";
        } else if (role === "direktur") {
            whereClause = "WHERE po.status IN ('Pending Direktur Approval', 'Fully Approved', 'Dikirim', 'Diterima', 'Rejected')";
        }

        const [rows] = await pool.query(`
            SELECT po.*, 
                   pr.pr_no, pr.keperluan, pr.departemen,
                   v.nama as vendor_nama,
                   (SELECT COUNT(*) FROM po_items WHERE po_id = po.id) as item_count
            FROM purchase_orders po
            JOIN purchase_requests pr ON po.pr_id = pr.id
            JOIN vendors v ON po.vendor_id = v.id
            ${whereClause}
            ORDER BY po.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching PO list:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil daftar PO." });
    }
});

// ==============================================
// GET /:id - Detail PO
// ==============================================
router.get("/:id", async (req, res) => {
    try {
        const [poRows] = await pool.query(`
            SELECT po.*, 
                   pr.pr_no, pr.keperluan, pr.departemen,
                   v.nama as vendor_nama, v.alamat as vendor_alamat, v.no_hp as vendor_hp
            FROM purchase_orders po
            JOIN purchase_requests pr ON po.pr_id = pr.id
            JOIN vendors v ON po.vendor_id = v.id
            WHERE po.id = ?
        `, [req.params.id]);

        if (poRows.length === 0) {
            return res.status(404).json({ success: false, message: "PO tidak ditemukan." });
        }

        const [items] = await pool.query(`SELECT * FROM po_items WHERE po_id = ?`, [req.params.id]);

        res.json({ success: true, data: { ...poRows[0], items } });
    } catch (error) {
        console.error("Error fetching PO detail:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil detail PO." });
    }
});



// ==============================================
// POST / - Buat PO baru
// ==============================================
router.post("/", async (req, res) => {
    const { pr_id, vendor_id, tanggal, include_ppn, items } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Get PR data
        const [prRows] = await connection.query(`SELECT * FROM purchase_requests WHERE id = ? AND status = 'Fully Approved'`, [pr_id]);
        if (prRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: "PR tidak valid atau belum Fully Approved." });
        }

        // Generate PO number
        const poNo = await generatePONumber(connection);

        // Calculate totals
        let totalAmount = 0;
        for (const item of items) {
            totalAmount += parseFloat(item.harga_satuan) * parseFloat(item.qty);
        }

        // Insert PO
        const [result] = await connection.query(`
            INSERT INTO purchase_orders (
                po_no, pr_id, tanggal, vendor_id, keperluan, departemen,
                status, include_ppn, purchaser_id, purchaser_name, total_amount
            ) VALUES (?, ?, ?, ?, ?, ?, 'Pending Manager HO Approval', ?, ?, ?, ?)
        `, [
            poNo, pr_id, tanggal, vendor_id,
            prRows[0].keperluan, prRows[0].departemen,
            include_ppn, req.session.user.id, req.session.user.name, totalAmount
        ]);

        const poId = result.insertId;

        // Insert items
        for (const item of items) {
            const totalHarga = parseFloat(item.harga_satuan) * parseFloat(item.qty);
            await connection.query(`
                INSERT INTO po_items (po_id, material, qty, satuan, harga_satuan, total_harga)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [poId, item.material, item.qty, item.satuan, item.harga_satuan, totalHarga]);
        }

        await connection.commit();

        // Send notification to Manager HO
        await sendWhatsappNotification('manager_ho', null,
            `📋 *PO Baru Menunggu Approval*\n\nNo. PO: ${poNo}\nKeperluan: ${prRows[0].keperluan}\nTotal: Rp ${totalAmount.toLocaleString('id-ID')}\n\nSilakan review di sistem.`
        );

        res.json({ success: true, message: "PO berhasil dibuat.", data: { id: poId, po_no: poNo } });
    } catch (error) {
        await connection.rollback();
        console.error("Error creating PO:", error);
        res.status(500).json({ success: false, message: "Gagal membuat PO." });
    } finally {
        connection.release();
    }
});

// ==============================================
// PUT /:id/approve-manager-ho - Approve by Manager HO
// ==============================================
router.put("/:id/approve-manager-ho", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        if (role !== "manager_ho" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Tidak memiliki akses." });
        }

        const [result] = await pool.query(`
            UPDATE purchase_orders 
            SET status = 'Pending Direktur Approval',
                manager_ho_name = ?,
                approval_manager_ho_date = NOW()
            WHERE id = ? AND status = 'Pending Manager HO Approval'
        `, [name, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "PO tidak valid atau sudah diproses." });
        }

        // Get PO data for notification
        const [poRows] = await pool.query(`SELECT * FROM purchase_orders WHERE id = ?`, [req.params.id]);

        // Send notification to Direktur
        await sendWhatsappNotification('direktur', null,
            `📋 *PO Menunggu Final Approval*\n\nNo. PO: ${poRows[0].po_no}\nDiapprove oleh: ${name}\n\nSilakan review di sistem.`
        );

        res.json({ success: true, message: "PO berhasil diapprove." });
    } catch (error) {
        console.error("Error approving PO:", error);
        res.status(500).json({ success: false, message: "Gagal approve PO." });
    }
});

// ==============================================
// PUT /:id/reject-manager-ho - Reject by Manager HO
// ==============================================
router.put("/:id/reject-manager-ho", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        const { reason } = req.body;

        if (role !== "manager_ho" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Tidak memiliki akses." });
        }

        const [result] = await pool.query(`
            UPDATE purchase_orders 
            SET status = 'Rejected',
                manager_ho_name = ?,
                rejection_reason = ?
            WHERE id = ? AND status = 'Pending Manager HO Approval'
        `, [name, reason, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "PO tidak valid atau sudah diproses." });
        }

        // Get PO and notify Purchasing
        const [poRows] = await pool.query(`SELECT * FROM purchase_orders WHERE id = ?`, [req.params.id]);
        await sendWhatsappNotification(null, poRows[0].purchaser_id,
            `❌ *PO Ditolak*\n\nNo. PO: ${poRows[0].po_no}\nAlasan: ${reason}\n\nSilakan revisi dan ajukan ulang.`
        );

        res.json({ success: true, message: "PO berhasil ditolak." });
    } catch (error) {
        console.error("Error rejecting PO:", error);
        res.status(500).json({ success: false, message: "Gagal reject PO." });
    }
});

// ==============================================
// PUT /:id/approve-direktur - Final Approve by Direktur
// ==============================================
router.put("/:id/approve-direktur", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        if (role !== "direktur" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Tidak memiliki akses." });
        }

        const [result] = await pool.query(`
            UPDATE purchase_orders 
            SET status = 'Fully Approved',
                direktur_name = ?,
                approval_direktur_date = NOW()
            WHERE id = ? AND status = 'Pending Direktur Approval'
        `, [name, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "PO tidak valid atau sudah diproses." });
        }

        // Get PO data
        const [poRows] = await pool.query(`SELECT * FROM purchase_orders WHERE id = ?`, [req.params.id]);

        // Notify Purchasing, Kerani, KTU, Manager
        const notifMessage = `✅ *PO Fully Approved*\n\nNo. PO: ${poRows[0].po_no}\nDiapprove oleh: ${name}\n\nBarang siap diproses pengadaan.`;

        await sendWhatsappNotification(null, poRows[0].purchaser_id, notifMessage);
        await sendWhatsappNotification('kerani', null, notifMessage);
        await sendWhatsappNotification('ktu', null, notifMessage);
        await sendWhatsappNotification('manager', null, notifMessage);

        res.json({ success: true, message: "PO berhasil diapprove." });
    } catch (error) {
        console.error("Error approving PO:", error);
        res.status(500).json({ success: false, message: "Gagal approve PO." });
    }
});

// ==============================================
// PUT /:id/reject-direktur - Reject by Direktur
// ==============================================
router.put("/:id/reject-direktur", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        const { reason } = req.body;

        if (role !== "direktur" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Tidak memiliki akses." });
        }

        const [result] = await pool.query(`
            UPDATE purchase_orders 
            SET status = 'Rejected',
                direktur_name = ?,
                rejection_reason = ?
            WHERE id = ? AND status = 'Pending Direktur Approval'
        `, [name, reason, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "PO tidak valid atau sudah diproses." });
        }

        // Notify Purchasing
        const [poRows] = await pool.query(`SELECT * FROM purchase_orders WHERE id = ?`, [req.params.id]);
        await sendWhatsappNotification(null, poRows[0].purchaser_id,
            `❌ *PO Ditolak oleh Direktur*\n\nNo. PO: ${poRows[0].po_no}\nAlasan: ${reason}`
        );

        res.json({ success: true, message: "PO berhasil ditolak." });
    } catch (error) {
        console.error("Error rejecting PO:", error);
        res.status(500).json({ success: false, message: "Gagal reject PO." });
    }
});

// ==============================================
// PUT /:id/kirim - Update status Dikirim (Purchasing)
// ==============================================
router.put("/:id/kirim", async (req, res) => {
    try {
        const { tanggal_kirim } = req.body;

        const [result] = await pool.query(`
            UPDATE purchase_orders 
            SET status = 'Dikirim',
                tanggal_kirim = ?
            WHERE id = ? AND status = 'Fully Approved'
        `, [tanggal_kirim, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "PO tidak valid atau belum Fully Approved." });
        }

        res.json({ success: true, message: "Status pengiriman berhasil diupdate." });
    } catch (error) {
        console.error("Error updating kirim:", error);
        res.status(500).json({ success: false, message: "Gagal update status kirim." });
    }
});

// ==============================================
// PUT /:id/terima - Update status Diterima (Kerani)
// ==============================================
router.put("/:id/terima", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        const { tanggal_terima } = req.body;

        if (role !== "kerani" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Tidak memiliki akses." });
        }

        const [result] = await pool.query(`
            UPDATE purchase_orders 
            SET status = 'Diterima',
                tanggal_terima = ?,
                penerima_name = ?
            WHERE id = ? AND status = 'Dikirim'
        `, [tanggal_terima, name, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "PO tidak valid atau belum dikirim." });
        }

        res.json({ success: true, message: "Barang berhasil diterima." });
    } catch (error) {
        console.error("Error updating terima:", error);
        res.status(500).json({ success: false, message: "Gagal update status terima." });
    }
});

// ==============================================
// DELETE /:id - Hapus PO (Purchasing only)
// ==============================================
router.delete("/:id", async (req, res) => {
    try {
        const { role, id: userId } = req.session.user;

        // Check ownership
        const [poRows] = await pool.query(`SELECT * FROM purchase_orders WHERE id = ?`, [req.params.id]);
        if (poRows.length === 0) {
            return res.status(404).json({ success: false, message: "PO tidak ditemukan." });
        }

        if (role !== "admin" && poRows[0].purchaser_id !== userId) {
            return res.status(403).json({ success: false, message: "Tidak memiliki akses." });
        }

        if (poRows[0].status !== "Pending Manager HO Approval") {
            return res.status(400).json({ success: false, message: "Hanya PO dengan status Pending yang dapat dihapus." });
        }

        await pool.query(`DELETE FROM purchase_orders WHERE id = ?`, [req.params.id]);

        res.json({ success: true, message: "PO berhasil dihapus." });
    } catch (error) {
        console.error("Error deleting PO:", error);
        res.status(500).json({ success: false, message: "Gagal menghapus PO." });
    }
});

module.exports = router;
