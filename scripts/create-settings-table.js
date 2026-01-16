const pool = require('../db');

async function createSettingsTable() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        const sql = `
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

        await connection.query(sql);
        console.log('Table system_settings created successfully.');

        // Insert default value for WA Notifications if not exists
        const insertDefault = `
      INSERT IGNORE INTO system_settings (setting_key, setting_value, description)
      VALUES ('wa_notifications_enabled', 'true', 'Enable or disable WhatsApp notifications globally')
    `;

        await connection.query(insertDefault);
        console.log('Default setting wa_notifications_enabled initialized.');

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error creating settings table:', error);
        process.exit(1);
    }
}

createSettingsTable();
