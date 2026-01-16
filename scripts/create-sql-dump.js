const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function createDump() {
    console.log('🚀 Generating SQL Dump...');

    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sistem_purchasing'
    });

    try {
        const tables = ['users', 'vendors', 'pr_counters', 'purchase_requests', 'pr_items'];
        let sqlContent = `-- Database Migration Dump\n-- Generated on ${new Date().toISOString()}\n\n`;

        // Disable FK checks for easier import
        sqlContent += `SET FOREIGN_KEY_CHECKS=0;\n\n`;

        for (const table of tables) {
            console.log(`📦 Reading table: ${table}...`);
            const [rows] = await pool.query(`SELECT * FROM ${table}`);

            if (rows.length > 0) {
                sqlContent += `-- Data for table ${table}\n`;

                for (const row of rows) {
                    const keys = Object.keys(row);
                    const values = Object.values(row).map(val => {
                        if (val === null) return 'NULL';
                        if (typeof val === 'number') return val;
                        // Escape single quotes and backslashes
                        return `'${new Date(val).toString() !== 'Invalid Date' && typeof val !== 'string' ? val.toISOString().slice(0, 19).replace('T', ' ') : String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
                    });

                    sqlContent += `INSERT IGNORE INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')});\n`;
                }
                sqlContent += `\n`;
                console.log(`   ✅ Query generated for ${rows.length} rows.`);
            } else {
                console.log(`   ⏭️ Table empty.`);
            }
        }

        sqlContent += `SET FOREIGN_KEY_CHECKS=1;\n`;

        fs.writeFileSync('migration.sql', sqlContent);
        console.log('\n🎉 Success! File "migration.sql" created.');
        console.log('   Please import this file to Railway using DBeaver, TablePlus, or Adminer.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await pool.end();
    }
}

createDump();
