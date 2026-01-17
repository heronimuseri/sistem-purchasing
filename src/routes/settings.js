const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/settings - Retrieve all settings
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM system_settings");
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil pengaturan." });
    }
});

// POST /api/settings - Update a setting
router.post("/", async (req, res) => {
    const { key, value } = req.body;
    if (!key) {
        return res.status(400).json({ success: false, message: "Key pengaturan diperlukan." });
    }

    try {
        const query = `
      INSERT INTO system_settings (setting_key, setting_value) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
    `;
        await pool.query(query, [key, value]);
        res.json({ success: true, message: "Pengaturan berhasil disimpan." });
    } catch (error) {
        console.error(`Error updating setting ${key}:`, error);
        res.status(500).json({ success: false, message: "Gagal menyimpan pengaturan." });
    }
});

module.exports = router;
