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

async function checkSchema() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [userCols] = await connection.query(`SHOW COLUMNS FROM users`);
        console.log("Users:", JSON.stringify(userCols.map(c => c.Field), null, 2));

        const [vendorCols] = await connection.query(`SHOW COLUMNS FROM vendors`);
        console.log("Vendors:", JSON.stringify(vendorCols.map(c => c.Field), null, 2));

        const [prCols] = await connection.query(`SHOW COLUMNS FROM purchase_requests`);
        console.log("PR:", JSON.stringify(prCols.map(c => c.Field), null, 2));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (connection) connection.release();
        pool.end();
    }
}

checkSchema();
