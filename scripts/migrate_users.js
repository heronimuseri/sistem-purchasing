const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("✅ Connected to database.");

        // Check columns
        const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'wa_number'`);
        if (columns.length === 0) {
            console.log("⚠️ Column 'wa_number' missing. Adding it...");
            await connection.query(`ALTER TABLE users ADD COLUMN wa_number VARCHAR(20) DEFAULT NULL`);
            console.log("✅ Column 'wa_number' added.");
        } else {
            console.log("ℹ️ Column 'wa_number' already exists.");
        }

    } catch (error) {
        console.error("❌ Migration Error:", error);
    } finally {
        if (connection) connection.release();
        pool.end();
    }
}

migrate();
