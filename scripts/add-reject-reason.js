const pool = require('../db');

async function migrate() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Connected to database. Checking for reject_reason column...');

        // Check if column exists
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'railway'}' 
      AND TABLE_NAME = 'purchase_requests' 
      AND COLUMN_NAME = 'reject_reason'
    `);

        if (columns.length === 0) {
            console.log('Adding reject_reason column...');
            await connection.query(`
        ALTER TABLE purchase_requests 
        ADD COLUMN reject_reason TEXT DEFAULT NULL AFTER status
      `);
            console.log('Migration successful: reject_reason column added.');
        } else {
            console.log('Column reject_reason already exists. Skipping...');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

migrate();
