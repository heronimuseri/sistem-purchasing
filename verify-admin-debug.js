const pool = require('./db');
const bcrypt = require('bcrypt');

async function verifyLastAdmin() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM users WHERE user = 'admin'");

        if (rows.length === 0) {
            console.log("User 'admin' does NOT exist.");
        } else {
            const user = rows[0];
            console.log("User 'admin' found.");
            console.log("Company:", user.company);
            console.log("Hash:", user.pass);

            const match = await bcrypt.compare('admin123', user.pass);
            console.log("Password 'admin123' match:", match);

            // Re-hash to be sure
            if (!match) {
                const newHash = await bcrypt.hash('admin123', 10);
                console.log("Generating new hash for 'admin123':", newHash);
                await connection.query("UPDATE users SET pass = ? WHERE user = 'admin'", [newHash]);
                console.log("Password updated.");
            }
        }

        connection.release();
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

verifyLastAdmin();
