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

async function verify() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [users] = await connection.query("SELECT COUNT(*) as count FROM users");
        const [vendors] = await connection.query("SELECT COUNT(*) as count FROM vendors");
        const [prs] = await connection.query("SELECT COUNT(*) as count FROM purchase_requests");
        const [items] = await connection.query("SELECT COUNT(*) as count FROM pr_items");
        const [invoices] = await connection.query("SELECT COUNT(*) as count FROM invoices");

        console.log("📊 Verification Results:");
        console.log(`- Users: ${users[0].count}`);
        console.log(`- Vendors: ${vendors[0].count}`);
        console.log(`- PRs: ${prs[0].count}`);
        console.log(`- PR Items: ${items[0].count}`);
        console.log(`- Invoices: ${invoices[0].count} (Should be 0)`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (connection) connection.release();
        pool.end();
    }
}

verify();
