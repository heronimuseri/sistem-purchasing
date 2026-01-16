// Update company untuk user admin
const mysql = require('mysql2/promise');

async function updateCompany() {
    const conn = await mysql.createConnection('mysql://root:uFmkZtcqVPimfZMCsTblEJojVjjpSpXq@ballast.proxy.rlwy.net:33503/railway');

    await conn.query("UPDATE users SET company = 'SPA_70' WHERE id = 1");
    console.log('✅ Updated company to SPA_70');

    const [rows] = await conn.query('SELECT id, company, `user`, name FROM users');
    console.log('👥 Users sekarang:');
    rows.forEach(r => console.log(`   - ${r.company} | ${r.user} | ${r.name}`));

    await conn.end();
}

updateCompany().catch(console.error);
