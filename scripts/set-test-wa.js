const pool = require('../db');

async function updateWANumbers() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database.');

        const testNumber = '62812717788';
        const roles = ['ktu', 'manager', 'kerani'];

        console.log(`Updating WA Number for roles: ${roles.join(', ')} to ${testNumber}...`);

        const [result] = await connection.query(
            `UPDATE users SET wa_number = ? WHERE role IN (?)`,
            [testNumber, roles]
        );

        console.log(`Success! Updated ${result.changedRows} rows.`);
        console.log('Users with roles KTU, Manage, and Kerani are now set to receive notifications at:', testNumber);

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error updating WA numbers:', error);
        process.exit(1);
    }
}

updateWANumbers();
