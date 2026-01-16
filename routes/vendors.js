// routes/vendors.js - API untuk Master Vendor
const express = require("express");
const router = express.Router();
const pool = require("../db");

// ==============================================
// GET / - Ambil semua vendors
// ==============================================
router.get("/", async (req, res) => {
    try {
        const [vendors] = await pool.query(
            "SELECT * FROM vendors ORDER BY CAST(kode AS UNSIGNED) ASC"
        );
        res.json(vendors);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data vendor."
        });
    }
});

// ==============================================
// GET /:id - Ambil vendor by ID
// ==============================================
router.get("/:id", async (req, res) => {
    try {
        const [vendors] = await pool.query(
            "SELECT * FROM vendors WHERE id = ?",
            [req.params.id]
        );
        if (vendors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor tidak ditemukan."
            });
        }
        res.json(vendors[0]);
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data vendor."
        });
    }
});

// ==============================================
// POST / - Tambah vendor baru
// ==============================================
router.post("/", async (req, res) => {
    const { kode, nama, pic, no_hp, alamat } = req.body;

    if (!kode || !nama) {
        return res.status(400).json({
            success: false,
            message: "Kode dan Nama Vendor wajib diisi."
        });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO vendors (kode, nama, pic, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
            [kode, nama, pic || "", no_hp || "", alamat || ""]
        );

        res.status(201).json({
            success: true,
            message: "Vendor berhasil ditambahkan.",
            id: result.insertId
        });
    } catch (error) {
        console.error("Error creating vendor:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Kode vendor sudah ada."
            });
        }
        res.status(500).json({
            success: false,
            message: "Gagal menambahkan vendor."
        });
    }
});

// ==============================================
// PUT /:id - Update vendor
// ==============================================
router.put("/:id", async (req, res) => {
    const { kode, nama, pic, no_hp, alamat } = req.body;

    if (!kode || !nama) {
        return res.status(400).json({
            success: false,
            message: "Kode dan Nama Vendor wajib diisi."
        });
    }

    try {
        const [result] = await pool.query(
            "UPDATE vendors SET kode = ?, nama = ?, pic = ?, no_hp = ?, alamat = ? WHERE id = ?",
            [kode, nama, pic || "", no_hp || "", alamat || "", req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor tidak ditemukan."
            });
        }

        res.json({
            success: true,
            message: "Vendor berhasil diperbarui."
        });
    } catch (error) {
        console.error("Error updating vendor:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                success: false,
                message: "Kode vendor sudah digunakan."
            });
        }
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui vendor."
        });
    }
});

// ==============================================
// DELETE /:id - Hapus vendor
// ==============================================
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM vendors WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor tidak ditemukan."
            });
        }

        res.json({
            success: true,
            message: "Vendor berhasil dihapus."
        });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menghapus vendor."
        });
    }
});

// ==============================================
// POST /init - Inisialisasi tabel dan data
// ==============================================
router.post("/init", async (req, res) => {
    try {
        // Create table if not exists
        await pool.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kode VARCHAR(10) NOT NULL UNIQUE,
        nama VARCHAR(255) NOT NULL,
        pic VARCHAR(255),
        no_hp VARCHAR(50),
        alamat TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        // Check if data exists
        const [existing] = await pool.query("SELECT COUNT(*) as count FROM vendors");

        if (existing[0].count === 0) {
            // Insert initial data
            await pool.query(`
        INSERT INTO vendors (kode, nama, pic, no_hp, alamat) VALUES
        ('1', 'SIAGIAN AGRO MANDIRI', 'Rizky Rinaldi Hasibuan', '6285216080886', 'Dusun Cinta Makmur Aek Batu Kab.Labuhan Batu Selatan'),
        ('2', 'MULTIAPLIKASI ABADI SUKSES', 'Vincent Irfandy', '6282388899333', 'Jl Imam No. 332 RT 004 RW 010 Tangkerang Lanual Bukit Raya Kota Pekanbaru Riau 28992'),
        ('3', 'MITSUBISHI MOTOR', '', '', ''),
        ('4', '88 MOTOR', '', '', ''),
        ('5', 'BINTANG SURYA BANGUNAN', '', '', ''),
        ('6', 'BINTANG MAKMUR ABADI', '', '', ''),
        ('7', 'TOKO STARINDO', '', '', ''),
        ('8', 'NYANMAR DISEL', '', '', ''),
        ('9', 'SAMARINDA DIESEL', '', '', ''),
        ('10', 'BENGKEL SINAR MUDA', '', '', ''),
        ('11', 'BINTANG MAKMUR ABADI 2', '', '', ''),
        ('12', 'BINA CANTIK 3', '', '', ''),
        ('13', 'AA BESI', '', '', ''),
        ('14', 'USAHA TANI', '', '', ''),
        ('15', 'CIPTO PANGLONG', '', '', ''),
        ('16', 'BINTANG BANGUNAN', '', '', ''),
        ('17', 'SINAR TANI MAKMUR', '', '', ''),
        ('18', 'YANMAR DIESEL', '', '', '')
      `);

            res.json({
                success: true,
                message: "Tabel vendors berhasil dibuat dan data awal ditambahkan."
            });
        } else {
            res.json({
                success: true,
                message: "Tabel vendors sudah ada dengan " + existing[0].count + " data."
            });
        }
    } catch (error) {
        console.error("Error initializing vendors:", error);
        res.status(500).json({
            success: false,
            message: "Gagal menginisialisasi vendors: " + error.message
        });
    }
});

// ==============================================
// GET /template - Download template Excel
// ==============================================
router.get("/template/download", async (req, res) => {
    try {
        // Template data with headers and example rows
        const templateData = [
            ["KODE", "MASTER VENDOR", "PIC", "NO HP/TELP", "ALAMAT"],
            ["1", "NAMA VENDOR CONTOH", "Nama PIC", "6281234567890", "Alamat lengkap vendor"],
            ["2", "VENDOR LAINNYA", "PIC 2", "6289876543210", "Jl. Contoh No. 123"],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""]
        ];

        // Create workbook using SheetJS-style JSON format for frontend
        res.json({
            success: true,
            template: templateData,
            filename: "template_vendor.xlsx",
            instructions: [
                "Kolom KODE dan MASTER VENDOR wajib diisi",
                "Kolom PIC, NO HP/TELP, dan ALAMAT bersifat opsional",
                "Hapus baris contoh sebelum import",
                "Format nomor HP: 62xxxxxxxxxx (tanpa + atau 0)"
            ]
        });
    } catch (error) {
        console.error("Error generating template:", error);
        res.status(500).json({
            success: false,
            message: "Gagal membuat template."
        });
    }
});
// ==============================================
// POST /sync - Sinkronisasi data dari Excel (Add/Update/Delete)
// ==============================================
router.post("/sync", async (req, res) => {
    const { vendors: importedVendors } = req.body;

    if (!importedVendors || !Array.isArray(importedVendors)) {
        return res.status(400).json({
            success: false,
            message: "Data vendors tidak valid."
        });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Get existing vendors
        const [existingVendors] = await connection.query("SELECT * FROM vendors");
        const existingKodes = new Set(existingVendors.map(v => v.kode));
        const importedKodes = new Set(importedVendors.map(v => v.kode));

        let added = 0;
        let updated = 0;
        let deleted = 0;

        // Add or Update vendors from Excel
        for (const vendor of importedVendors) {
            if (!vendor.kode || !vendor.nama) continue;

            const existing = existingVendors.find(v => v.kode === vendor.kode);

            if (existing) {
                // Update existing
                await connection.query(
                    "UPDATE vendors SET nama = ?, pic = ?, no_hp = ?, alamat = ? WHERE kode = ?",
                    [vendor.nama, vendor.pic || "", vendor.no_hp || "", vendor.alamat || "", vendor.kode]
                );
                updated++;
            } else {
                // Insert new
                await connection.query(
                    "INSERT INTO vendors (kode, nama, pic, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
                    [vendor.kode, vendor.nama, vendor.pic || "", vendor.no_hp || "", vendor.alamat || ""]
                );
                added++;
            }
        }

        // Delete vendors not in Excel
        for (const existing of existingVendors) {
            if (!importedKodes.has(existing.kode)) {
                await connection.query("DELETE FROM vendors WHERE kode = ?", [existing.kode]);
                deleted++;
            }
        }

        await connection.commit();

        res.json({
            success: true,
            message: `Sinkronisasi berhasil: ${added} ditambah, ${updated} diupdate, ${deleted} dihapus.`,
            stats: { added, updated, deleted }
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error syncing vendors:", error);
        res.status(500).json({
            success: false,
            message: "Gagal sinkronisasi: " + error.message
        });
    } finally {
        connection.release();
    }
});

module.exports = router;


