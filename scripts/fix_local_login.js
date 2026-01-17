const pool = require('../src/config/db');

async function fixLogin() {
    try {
        console.log("Updating admin user...");
        // Update company to SPA_70 and password hash from migration.sql
        const [result] = await pool.query(`
            UPDATE users 
            SET company = 'SPA_70', 
                pass = '$2b$10$Gf0lUkNfXp6Nf8SK8tCbZuhMgxPwYo7fIA0aRMaHevO67Yrt7QLPS',
                role = 'admin'
            WHERE user = 'admin'
        `);

        console.log(`Updated ${result.affectedRows} rows.`);

        const [rows] = await pool.query("SELECT * FROM users WHERE user = 'admin'");
        console.log("Current admin user:", rows[0]);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixLogin();
