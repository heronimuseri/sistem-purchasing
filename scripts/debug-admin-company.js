const pool = require('../src/config/db');

async function debugAdmin() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT id, user, company, HEX(company) as hex_company FROM users WHERE user = 'admin'");

        console.log("Admin Data:", rows[0]);

        // Test query exactly like auth.js
        const testCompany = 'PT SPA';
        const [authCheck] = await connection.query(
            "SELECT * FROM users WHERE LOWER(company) = LOWER(?) AND LOWER(`user`) = LOWER('admin')",
            [testCompany]
        );
        console.log(`Auth Check for '${testCompany}':`, authCheck.length > 0 ? "FOUND" : "NOT FOUND");

        connection.release();
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

debugAdmin();
