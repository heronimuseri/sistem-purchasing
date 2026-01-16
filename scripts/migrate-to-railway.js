const mysql = require('mysql2/promise');
require('dotenv').config();

// Konfigurasi Railway DB
const RAILWAY_URL = process.env.MYSQL_URL || 'mysql://root:uFmkZtcqVPimfZMCsTblEJojVjjpSpXq@ballast.proxy.rlwy.net:33503/railway';

async function migrate() {
    console.log('🚀 Memulai migrasi database...');
    console.log('   Target:', RAILWAY_URL.replace(/:[^:@]*@/, ':****@')); // Hide password in log

    let localConnection;
    let remoteConnection;

    try {
        // 1. Koneksi ke LOCAL
        localConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sistem_purchasing'
        });
        console.log('✅ Terhubung ke Local DB');

        // 2. Koneksi ke RAILWAY (Single Connection)
        console.log('⏳ Menghubungkan ke Railway...');
        remoteConnection = await mysql.createConnection(RAILWAY_URL);
        console.log('✅ Terhubung ke Railway DB');

        // Daftar tabel
        const tables = ['users', 'vendors', 'pr_counters', 'purchase_requests', 'pr_items'];

        for (const table of tables) {
            console.log(`\n📦 Memindahkan tabel: ${table}...`);

            // Cek apakah tabel ada di destination
            try {
                await remoteConnection.query(`SELECT 1 FROM ${table} LIMIT 1`);
            } catch (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    console.log(`   ⚠️ Tabel ${table} belum ada di Railway. Membuat tabel...`);
                    // Skip creation logic here to keep it simple, assume setup-railway-db.js run or user setup manually
                    // But wait, if user didn't run setup, we fail.
                    // Let's just warn for now.
                    console.log(`   ❌ ERROR: Tabel tidak ditemukan. Jalankan setup-railway-db.js dulu!`);
                    continue;
                }
                throw err;
            }

            const [rows] = await localConnection.query(`SELECT * FROM ${table}`);

            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                const placeholders = columns.map(() => '?').join(', ');
                const sql = `INSERT IGNORE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

                let inserted = 0;
                // Batch insert to be faster/safer? No, loop is fine for small data
                for (const row of rows) {
                    await remoteConnection.execute(sql, Object.values(row));
                    inserted++;
                }
                console.log(`   ✅ Berhasil sync ${inserted} baris.`);
            } else {
                console.log(`   ⏭️ Tabel kosong.`);
            }
        }

        console.log('\n🎉 Migrasi Selesai!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('   Saran: Cek koneksi internet atau firewall.');
        }
    } finally {
        if (localConnection) await localConnection.end();
        if (remoteConnection) await remoteConnection.end();
    }
}

migrate();
