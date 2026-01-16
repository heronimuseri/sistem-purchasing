const pool = require('../db');

async function dropUnique() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        const indices = ['wa_number', 'wa_number_unique'];

        for (const idx of indices) {
            try {
                console.log(`Attempting to drop index: ${idx}`);
                await connection.query(`ALTER TABLE users DROP INDEX ${idx}`);
                console.log(`Success: Dropped index ${idx}`);
            } catch (e) {
                console.log(`Failed to drop ${idx}: ${e.message}`);
            }
        }

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

dropUnique();
