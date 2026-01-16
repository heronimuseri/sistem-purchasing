const pool = require('../db');

async function runMigrations() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('[MIGRATION] Checking database schema...');

    // 1. Existing System Settings Migration
    await connection.query(`
            CREATE TABLE IF NOT EXISTS system_settings (
                setting_key VARCHAR(50) PRIMARY KEY,
                setting_value TEXT,
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

    await connection.query(`
            INSERT IGNORE INTO system_settings (setting_key, setting_value, description)
            VALUES ('wa_notifications_enabled', 'true', 'Enable or disable WhatsApp notifications globally')
        `);

    // 2. Reject Reason Column
    const [columns] = await connection.query(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'purchase_requests' AND COLUMN_NAME = 'reject_reason'
        `);

    if (columns.length === 0) {
      console.log('[MIGRATION] Adding reject_reason column...');
      await connection.query(`ALTER TABLE purchase_requests ADD COLUMN reject_reason TEXT DEFAULT NULL AFTER status`);
    }

    // 3. PO SYSTEM MIGRATION (Read from file)
    const fs = require('fs');
    const path = require('path');
    const migrationPath = path.join(__dirname, '../database/po_migration.sql');

    if (fs.existsSync(migrationPath)) {
      console.log('[MIGRATION] Running PO System Migration from file...');
      const sqlContent = fs.readFileSync(migrationPath, 'utf8');

      // Remove comments and split by semicolon
      // Simple regex to remove -- comments
      const cleanedSql = sqlContent.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

      const statements = cleanedSql.split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        // Skip SET FOREIGN_KEY_CHECKS if causing issues, but usually fine
        try {
          await connection.query(statement);
        } catch (err) {
          // Ignore "Table already exists" errors or similar minor issues
          if (!err.message.includes("already exists")) {
            console.warn(`[MIGRATION] Warning executing statement: ${statement.substring(0, 50)}... - ${err.message}`);
          }
        }
      }
      console.log(`[MIGRATION] Executed ${statements.length} statements from po_migration.sql`);
    } else {
      console.warn('[MIGRATION] po_migration.sql not found! Skipping PO migration.');
    }

    console.log('[MIGRATION] Database check completed successfully.');

  } catch (error) {
    console.error('[MIGRATION] Error during migration:', error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = runMigrations;
