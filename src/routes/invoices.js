const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { sendWhatsappNotification } = require('./notifications');

// ==============================================
// Helper: Generate Invoice Number
// ==============================================
async function generateInvoiceNumber(connection) {
    const currentYear = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Get or create counter for current year
    await connection.query(`
        INSERT INTO invoice_counters (year, last_seq) VALUES (?, 0)
        ON DUPLICATE KEY UPDATE year = year
    `, [currentYear]);

    // Increment and get new sequence
    await connection.query(`UPDATE invoice_counters SET last_seq = last_seq + 1 WHERE year = ?`, [currentYear]);
    const [rows] = await connection.query(`SELECT last_seq FROM invoice_counters WHERE year = ?`, [currentYear]);
    const seq = String(rows[0].last_seq).padStart(3, '0');

    // Format: 001/INV-SPA/I/2026
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[new Date().getMonth()];

    return `${seq}/INV-SPA/${romanMonth}/${currentYear}`;
}

// ==============================================
// GET / - Daftar Invoice (Filtered by role)
// ==============================================
router.get("/", async (req, res) => {
    try {
        const { role } = req.session.user;
        let whereClause = "";

        // Filter based on role (Similar to PO)
        if (role === "manager_ho") {
            whereClause = "WHERE i.status IN ('Pending Manager HO', 'Pending Direktur', 'Approved', 'Rejected')";
        } else if (role === "direktur") {
            whereClause = "WHERE i.status IN ('Pending Direktur', 'Approved', 'Rejected')";
        }
        // Admin and Purchasing see all (or filter if needed)

        const [rows] = await pool.query(`
            SELECT i.*, 
                   v.nama as vendor_nama,
                   (SELECT COUNT(*) FROM invoice_po WHERE invoice_id = i.id) as po_count
            FROM invoices i
            JOIN vendors v ON i.vendor_id = v.id
            ${whereClause}
            ORDER BY i.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching invoice list:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil daftar tagihan." });
    }
});

// ==============================================
// GET /available-po - PO Available for Invoicing (Fully Approved or Diterima)
// ==============================================
router.get("/available-po", async (req, res) => {
    try {
        // Find POs that are 'Fully Approved' or 'Diterima' (assuming Invoice can be created then)
        // And NOT yet linked to any Invoice (or partial? assuming 1 PO -> 1 Invoice for simplicity usually, or Many PO -> 1 Invoice)
        // Logic: Free POs

        const [rows] = await pool.query(`
            SELECT po.*, v.nama as vendor_nama
            FROM purchase_orders po
            JOIN vendors v ON po.vendor_id = v.id
            LEFT JOIN invoice_po ip ON po.id = ip.po_id
            WHERE po.status IN ('Fully Approved', 'Dikirim', 'Diterima') 
            AND ip.id IS NULL
            ORDER BY po.created_at DESC
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error fetching available PO:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data PO." });
    }
});

// ==============================================
// GET /:id - Detail Invoice
// ==============================================
router.get("/:id", async (req, res) => {
    try {
        const [invRows] = await pool.query(`
            SELECT i.*, 
                   v.nama as vendor_nama, v.alamat as vendor_alamat, v.no_hp as vendor_hp
            FROM invoices i
            JOIN vendors v ON i.vendor_id = v.id
            WHERE i.id = ?
        `, [req.params.id]);

        if (invRows.length === 0) {
            return res.status(404).json({ success: false, message: "Tagihan tidak ditemukan." });
        }

        // Get Linked POs
        const [poRows] = await pool.query(`
            SELECT po.* 
            FROM purchase_orders po
            JOIN invoice_po ip ON po.id = ip.po_id
            WHERE ip.invoice_id = ?
        `, [req.params.id]);

        res.json({ success: true, data: { ...invRows[0], pos: poRows } });
    } catch (error) {
        console.error("Error fetching invoice detail:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil detail tagihan." });
    }
});

// ==============================================
// POST / - Buat Tagihan Baru
// ==============================================
router.post("/", async (req, res) => {
    const {
        vendor_id, periode, nama_rekening, no_rekening, nama_bank,
        keterangan_pembayaran, tanggal, jatuh_tempo,
        subtotal, ppn, total, po_ids
    } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const invoiceNo = await generateInvoiceNumber(connection);

        // Insert Invoice
        const [result] = await connection.query(`
            INSERT INTO invoices (
                invoice_no, periode, vendor_id, nama_rekening, no_rekening, nama_bank,
                keterangan_pembayaran, tanggal, jatuh_tempo, status,
                subtotal, ppn, total, purchaser_id, purchaser_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Manager HO', ?, ?, ?, ?, ?)
        `, [
            invoiceNo, periode, vendor_id, nama_rekening, no_rekening, nama_bank,
            keterangan_pembayaran, tanggal, jatuh_tempo,
            subtotal, ppn, total, req.session.user.id, req.session.user.name
        ]);

        const invoiceId = result.insertId;

        // Link POs
        if (po_ids && po_ids.length > 0) {
            for (const poId of po_ids) {
                await connection.query(`INSERT INTO invoice_po (invoice_id, po_id) VALUES (?, ?)`, [invoiceId, poId]);
            }
        }

        await connection.commit();

        // Notify Manager HO
        await sendWhatsappNotification('manager_ho', null,
            `💸 *Tagihan Baru Menunggu Approval*\n\nNo. Inv: ${invoiceNo}\nTotal: Rp ${parseFloat(total).toLocaleString('id-ID')}\n\nSilakan review.`
        );

        res.json({ success: true, message: "Tagihan berhasil dibuat.", data: { id: invoiceId, invoice_no: invoiceNo } });

    } catch (error) {
        await connection.rollback();
        console.error("Error creating invoice:", error);
        res.status(500).json({ success: false, message: "Gagal membuat tagihan." });
    } finally {
        connection.release();
    }
});

// ==============================================
// PUT /:id/approve-manager-ho
// ==============================================
router.put("/:id/approve-manager-ho", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        if (role !== "manager_ho" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Akses ditolak." });
        }

        const [result] = await pool.query(`
            UPDATE invoices 
            SET status = 'Pending Direktur',
                manager_ho_name = ?,
                approval_manager_ho_date = NOW()
            WHERE id = ? AND status = 'Pending Manager HO'
        `, [name, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Sudah diapprove atau status tidak valid." });
        }

        // Get Invoice Info for Notif
        const [invRows] = await pool.query("SELECT * FROM invoices WHERE id = ?", [req.params.id]);

        await sendWhatsappNotification('direktur', null,
            `💸 *Tagihan Menunggu Final Approval*\n\nNo. Inv: ${invRows[0].invoice_no}\nTotal: Rp ${parseFloat(invRows[0].total).toLocaleString('id-ID')}\n\nSilakan review.`
        );

        res.json({ success: true, message: "Tagihan berhasil diapprove (Mgr HO)." });
    } catch (error) {
        console.error("Error approving Invoice:", error);
        res.status(500).json({ success: false, message: "Gagal approve tagihan." });
    }
});

// ==============================================
// PUT /:id/approve-direktur
// ==============================================
router.put("/:id/approve-direktur", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        if (role !== "direktur" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Akses ditolak." });
        }

        const [result] = await pool.query(`
            UPDATE invoices 
            SET status = 'Approved',
                direktur_name = ?,
                approval_direktur_date = NOW()
            WHERE id = ? AND status = 'Pending Direktur'
        `, [name, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Sudah diapprove atau status tidak valid." });
        }

        const [invRows] = await pool.query("SELECT * FROM invoices WHERE id = ?", [req.params.id]);

        // Notify Purchasing/Pembuat
        await sendWhatsappNotification(null, invRows[0].purchaser_id,
            `✅ *Tagihan Disetujui (Siap Bayar)*\n\nNo. Inv: ${invRows[0].invoice_no}\nTotal: Rp ${parseFloat(invRows[0].total).toLocaleString('id-ID')}`
        );

        res.json({ success: true, message: "Tagihan berhasil diapprove (Direktur)." });
    } catch (error) {
        console.error("Error approving Invoice:", error);
        res.status(500).json({ success: false, message: "Gagal approve tagihan." });
    }
});

// ==============================================
// PUT /:id/reject
// ==============================================
router.put("/:id/reject", async (req, res) => {
    try {
        const { role, name } = req.session.user;
        const { reason } = req.body;

        // Allow Mgr HO or Direktur to reject
        if (role !== "manager_ho" && role !== "direktur" && role !== "admin") {
            return res.status(403).json({ success: false, message: "Akses ditolak." });
        }

        // Check if status is pending for them
        // Simplified: Just reject if not fully approved
        const [result] = await pool.query(`
            UPDATE invoices 
            SET status = 'Rejected',
                rejection_reason = ?
            WHERE id = ? AND status IN ('Pending Manager HO', 'Pending Direktur')
        `, [reason, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Gagal reject (Mungkin sudah diapprove/reject)." });
        }

        const [invRows] = await pool.query("SELECT * FROM invoices WHERE id = ?", [req.params.id]);

        await sendWhatsappNotification(null, invRows[0].purchaser_id,
            `❌ *Tagihan Ditolak*\n\nNo. Inv: ${invRows[0].invoice_no}\nAlasan: ${reason}`
        );

        res.json({ success: true, message: "Tagihan berhasil ditolak." });
    } catch (error) {
        console.error("Error rejecting Invoice:", error);
        res.status(500).json({ success: false, message: "Gagal reject tagihan." });
    }
});


// ==============================================
// DELETE /:id
// ==============================================
router.delete("/:id", async (req, res) => {
    try {
        const { role } = req.session.user;
        if (role !== "admin") {
            // Check own ownership maybe? For now safe to admin only or pending status
        }

        // Only allow delete if pending
        const [result] = await pool.query(`DELETE FROM invoices WHERE id = ? AND status = 'Pending Manager HO'`, [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Gagal hapus (Hanya status pending yang bisa dihapus)." });
        }

        res.json({ success: true, message: "Tagihan berhasil dihapus." });
    } catch (error) {
        console.error("Error deleting Invoice:", error);
        res.status(500).json({ success: false, message: "Gagal menghapus tagihan." });
    }
});

module.exports = router;
