// Script untuk verifikasi database Railway
const mysql = require('mysql2/promise');

const MYSQL_URL = 'mysql://root:uFmkZtcqVPimfZMCsTblEJojVjjpSpXq@ballast.proxy.rlwy.net:33503/railway';

async function verifyDatabase() {
    const url = new URL(MYSQL_URL);

    const connection = await mysql.createConnection({
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
    });

    console.log('🔗 Terhubung ke Railway MySQL...\n');

    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tabel yang ada:');
    tables.forEach(t => console.log('   -', Object.values(t)[0]));

    // Check users
    console.log('\n👥 Data Users:');
    const [users] = await connection.query('SELECT id, company, `user`, role, name FROM users');
    if (users.length === 0) {
        console.log('   ❌ Tidak ada user!');
    } else {
        users.forEach(u => console.log(`   - ID:${u.id} | User:${u.user} | Role:${u.role} | Name:${u.name}`));
    }

    await connection.end();
}

verifyDatabase().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
