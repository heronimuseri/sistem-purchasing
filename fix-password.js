// Fix password untuk user admin
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function fixPassword() {
    const conn = await mysql.createConnection('mysql://root:uFmkZtcqVPimfZMCsTblEJojVjjpSpXq@ballast.proxy.rlwy.net:33503/railway');

    // Generate hash yang benar untuk password "admin123"
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Generated hash:', hashedPassword);

    await conn.query("UPDATE users SET pass = ? WHERE id = 1", [hashedPassword]);
    console.log('✅ Password updated successfully!');

    // Verify
    const [rows] = await conn.query('SELECT id, company, `user`, name, pass FROM users WHERE id = 1');
    console.log('👤 Admin user:');
    console.log('   Company:', rows[0].company);
    console.log('   User:', rows[0].user);
    console.log('   Name:', rows[0].name);
    console.log('   Pass hash length:', rows[0].pass.length);

    await conn.end();
    console.log('\n🎉 Done! Try login with: SPA_70 / admin / admin123');
}

fixPassword().catch(console.error);
