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

async function testInsert() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("Testing PR Insert...");

        await connection.query(`
            INSERT INTO purchase_requests 
            (id, pr_no, tanggal, requester_id, requester_name, departemen, keperluan, status, ktu_name, approval_ktu_date, manager_name, approval_manager_date, reject_reason, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            99999,
            'TEST-PR',
            new Date(),
            1,
            'Test Requester',
            'IT',
            'Test',
            'Pending',
            null,
            null,
            null,
            null,
            null,
            new Date()
        ]);

        console.log("✅ Insert Success!");
        await connection.query("DELETE FROM purchase_requests WHERE id = 99999");

    } catch (error) {
        console.error("❌ Insert Error:", error.sqlMessage);
    } finally {
        if (connection) connection.release();
        pool.end();
    }
}

testInsert();
