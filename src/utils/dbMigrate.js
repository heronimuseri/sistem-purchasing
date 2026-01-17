const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runSQLFile(connection, filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[MIGRATION] File not found: ${filePath}`);
    return;
  }

  console.log(`[MIGRATION] Executing ${path.basename(filePath)}...`);
  const sqlContent = fs.readFileSync(filePath, 'utf8');

  // Remove comments and split by semicolon
  const statements = sqlContent
    .replace(/--.*$/gm, '') // Remove single line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    // Skip empty statements or simple transaction controls if needed
    if (statement.toUpperCase() === 'BEGIN' || statement.toUpperCase() === 'COMMIT') continue;

    try {
      await connection.query(statement);
    } catch (err) {
      // Ignore benign errors
      if (err.message.includes("already exists") || err.message.includes("Duplicate column name")) {
        // fine
      } else {
        console.warn(`[MIGRATION] Warning in ${path.basename(filePath)}: ${err.message}`);
        // console.warn(`Statement: ${statement.substring(0, 50)}...`);
      }
    }
  }
}

async function runMigrations() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('[MIGRATION] Starting database migration...');

    // 1. Core Schema (Users, PRs)
    await runSQLFile(connection, path.join(__dirname, '../database/schema.sql'));

    // 2. Vendors
    await runSQLFile(connection, path.join(__dirname, '../database/migration_vendors.sql'));

    // 3. PO System & Invoices
    await runSQLFile(connection, path.join(__dirname, '../database/po_migration.sql'));

    // 4. Additional System Settings (Legacy/Special)
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

    // 5. Ensure reject_reason exists on PR (Migration fix)
    try {
      const [columns] = await connection.query(`
                SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'purchase_requests' AND COLUMN_NAME = 'reject_reason'
            `);
      if (columns.length === 0) {
        await connection.query(`ALTER TABLE purchase_requests ADD COLUMN reject_reason TEXT DEFAULT NULL AFTER status`);
      }
    } catch (e) {
      // ignore if table doesn't exist yet (though schema should have created it)
    }

    console.log('[MIGRATION] Database migration completed successfully.');

  } catch (error) {
    console.error('[MIGRATION] Critical Error:', error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = runMigrations;
