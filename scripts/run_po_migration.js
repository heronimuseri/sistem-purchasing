const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const migrationFile = path.join(__dirname, '../database/po_migration.sql');

async function runMigration() {
    console.log('Reading migration file...');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    // Simple split by semicolon might fail on complex bodies, but for this migration it should be fine.
    // However, the migration file I wrote previously might have delimiters or be a single block.
    // Let's check the migration file content first if needed.
    // Assuming standard SQL statements separated by ;

    const statements = sql.split(';').filter(s => s.trim().length > 0);

    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sistem_purchasing',
            multipleStatements: true
        });

        console.log('Executing migration...');

        // Use single query if multipleStatements is true
        await connection.query(sql);

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

runMigration();
