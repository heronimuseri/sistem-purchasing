// routes/database.js - Database Management API
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Tabel sistem yang tidak boleh diakses
const SYSTEM_TABLES = ["information_schema", "mysql", "performance_schema", "sys"];

// ==============================================
// GET /status - Cek status koneksi database
// ==============================================
router.get("/status", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT VERSION() as version, DATABASE() as database_name");
        connection.release();

        res.json({
            success: true,
            connected: true,
            version: rows[0].version,
            database: rows[0].database_name,
            host: process.env.DB_HOST || "localhost",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database status check failed:", error);
        res.json({
            success: false,
            connected: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// ==============================================
// GET /tables - List semua tabel dengan row count
// ==============================================
router.get("/tables", async (req, res) => {
    try {
        const [tables] = await pool.query(`
      SELECT 
        TABLE_NAME as name,
        TABLE_ROWS as row_count,
        DATA_LENGTH as data_size,
        CREATE_TIME as created_at,
        UPDATE_TIME as updated_at
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);

        res.json({
            success: true,
            tables: tables
        });
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil daftar tabel.",
            error: error.message
        });
    }
});

// ==============================================
// GET /tables/:name - Get data dari tabel tertentu
// ==============================================
router.get("/tables/:name", async (req, res) => {
    const tableName = req.params.name;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Validasi nama tabel (hanya alphanumeric dan underscore)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return res.status(400).json({
            success: false,
            message: "Nama tabel tidak valid."
        });
    }

    try {
        // Get total count
        const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM \`${tableName}\``);
        const total = countResult[0].total;

        // Get data with pagination
        const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` LIMIT ? OFFSET ?`, [limit, offset]);

        // Get column info
        const [columns] = await pool.query(`
      SELECT 
        COLUMN_NAME as name,
        DATA_TYPE as type,
        IS_NULLABLE as nullable,
        COLUMN_KEY as key_type,
        COLUMN_DEFAULT as default_value
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [tableName]);

        res.json({
            success: true,
            table: tableName,
            columns: columns,
            data: rows,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        res.status(500).json({
            success: false,
            message: `Gagal mengambil data dari tabel ${tableName}.`,
            error: error.message
        });
    }
});

// ==============================================
// PUT /tables/:name/:id - Update row di tabel
// ==============================================
router.put("/tables/:name/:id", async (req, res) => {
    const tableName = req.params.name;
    const id = req.params.id;
    const updateData = req.body;

    // Validasi nama tabel
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return res.status(400).json({
            success: false,
            message: "Nama tabel tidak valid."
        });
    }

    // Jangan izinkan update kolom sensitif
    delete updateData.id;
    delete updateData.pass; // Password harus diubah via endpoint khusus

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Tidak ada data untuk diupdate."
        });
    }

    try {
        // Build update query dynamically
        const columns = Object.keys(updateData);
        const values = Object.values(updateData);
        const setClause = columns.map(col => `\`${col}\` = ?`).join(", ");

        const query = `UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`;
        values.push(id);

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan atau tidak ada perubahan."
            });
        }

        res.json({
            success: true,
            message: "Data berhasil diupdate.",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error(`Error updating ${tableName}:`, error);
        res.status(500).json({
            success: false,
            message: `Gagal mengupdate data di tabel ${tableName}.`,
            error: error.message
        });
    }
});

// ==============================================
// GET /config - Get current DB config (tanpa password)
// ==============================================
router.get("/config", async (req, res) => {
    res.json({
        success: true,
        config: {
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || "root",
            database: process.env.DB_NAME || "sistem_purchasing",
            // Password tidak ditampilkan untuk keamanan
            hasPassword: !!(process.env.DB_PASSWORD),
            usingMySQLUrl: !!process.env.MYSQL_URL
        }
    });
});

// ==============================================
// POST /config/test - Test koneksi dengan config baru
// ==============================================
router.post("/config/test", async (req, res) => {
    const { host, port, user, password, database } = req.body;

    const mysql = require("mysql2/promise");

    try {
        const testConnection = await mysql.createConnection({
            host: host || "localhost",
            port: parseInt(port) || 3306,
            user: user || "root",
            password: password || "",
            database: database || "sistem_purchasing"
        });

        await testConnection.query("SELECT 1");
        await testConnection.end();

        res.json({
            success: true,
            message: "Koneksi berhasil! Konfigurasi valid."
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Koneksi gagal: " + error.message
        });
    }
});

// ==============================================
// DELETE /tables/:name/:id - Delete row dari tabel
// ==============================================
router.delete("/tables/:name/:id", async (req, res) => {
    const tableName = req.params.name;
    const id = req.params.id;

    // Validasi nama tabel
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
        return res.status(400).json({
            success: false,
            message: "Nama tabel tidak valid."
        });
    }

    try {
        const [result] = await pool.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Data tidak ditemukan."
            });
        }

        res.json({
            success: true,
            message: "Data berhasil dihapus.",
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        res.status(500).json({
            success: false,
            message: `Gagal menghapus data dari tabel ${tableName}.`,
            error: error.message
        });
    }
});

module.exports = router;
