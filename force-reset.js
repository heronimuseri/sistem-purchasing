const pool = require('./db');
const bcrypt = require('bcrypt');

async function forceReset() {
    try {
        const connection = await pool.getConnection();
        const hash = await bcrypt.hash('admin123', 10);
        console.log("New Hash:", hash);

        await connection.query("UPDATE users SET pass = ?, company = 'PT SPA' WHERE user = 'admin'", [hash]);
        console.log("Admin password forced to 'admin123'");

        connection.release();
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

forceReset();
