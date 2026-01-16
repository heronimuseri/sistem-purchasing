const pool = require('../db');

async function runMigrations() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('[MIGRATION] Checking database schema...');

        // 1. Create table system_settings
        await connection.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        // 2. Insert default setting
        await connection.query(`
      INSERT IGNORE INTO system_settings (setting_key, setting_value, description)
      VALUES ('wa_notifications_enabled', 'true', 'Enable or disable WhatsApp notifications globally')
    `);

        // 3. Add reject_reason column to purchase_requests if missing
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'purchase_requests' 
      AND COLUMN_NAME = 'reject_reason'
    `);

        if (columns.length === 0) {
            console.log('[MIGRATION] Adding reject_reason column...');
            await connection.query(`
        ALTER TABLE purchase_requests 
        ADD COLUMN reject_reason TEXT DEFAULT NULL AFTER status
      `);
        }

        console.log('[MIGRATION] Database check completed successfully.');

    } catch (error) {
        console.error('[MIGRATION] Error during migration:', error);
        // Kita tidak throw error agar server tetap mencoba jalan, 
        // tapi idealnya process should exit if DB is critical.
        // However, existing tables might be fine.
    } finally {
        if (connection) connection.release();
    }
}

module.exports = runMigrations;
