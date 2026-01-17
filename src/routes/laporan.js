const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Endpoint untuk laporan detail
router.get("/detail", async (req, res) => {
    try {
        console.log(
            "Accessing laporan detail endpoint - User:",
            req.session.user.name,
            "Role:",
            req.session.user.role
        );

        const query = `
      SELECT 
        pr.pr_no as 'PR No.',
        pr.tanggal as 'Tanggal',
        pr.requester_name as 'Diminta Oleh',
        pr.keperluan as 'Untuk Kebutuhan / Uraian',
        pr.status as 'Status',
        items.material as 'Nama & Spesifikasi Barang',
        items.qty as 'Qty',
        items.satuan as 'Satuan'
      FROM purchase_requests pr
      JOIN pr_items items ON pr.id = items.pr_id
      ORDER BY pr.tanggal DESC, pr.pr_no
    `;

        const [rows] = await pool.query(query);
        console.log(
            `Laporan detail data fetched: ${rows.length} rows for user ${req.session.user.name}`
        );

        res.json(rows);
    } catch (error) {
        console.error("Error fetching laporan detail:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data laporan detail.",
        });
    }
});

module.exports = router;
