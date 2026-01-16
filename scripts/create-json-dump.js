const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function createJsonDump() {
    console.log('🚀 Generating JSON Dump...');

    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sistem_purchasing'
    });

    try {
        const tables = ['users', 'vendors', 'pr_counters', 'purchase_requests', 'pr_items'];
        const fullBackup = {};

        for (const table of tables) {
            console.log(`📦 Reading table: ${table}...`);
            const [rows] = await pool.query(`SELECT * FROM ${table}`);
            fullBackup[table] = rows;
            console.log(`   ✅ Loaded ${rows.length} rows.`);
        }

        const filename = 'full_backup.json';
        fs.writeFileSync(filename, JSON.stringify(fullBackup, null, 2));

        console.log(`\n🎉 Success! File "${filename}" created.`);
        console.log('   You can now upload this file to the Admin Panel on Railway.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

createJsonDump();
