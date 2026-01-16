// scripts/create-vendors-table.js
// Script untuk membuat tabel vendors dan mengisi data awal

const pool = require("../db");

async function createVendorsTable() {
    console.log("🔧 Creating vendors table...");

    try {
        // Create table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kode VARCHAR(10) NOT NULL UNIQUE,
        nama VARCHAR(255) NOT NULL,
        pic VARCHAR(255),
        no_hp VARCHAR(50),
        alamat TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log("✅ Table vendors created successfully!");

        // Check if data exists
        const [existing] = await pool.query("SELECT COUNT(*) as count FROM vendors");

        if (existing[0].count === 0) {
            console.log("📥 Inserting initial vendor data...");

            await pool.query(`
        INSERT INTO vendors (kode, nama, pic, no_hp, alamat) VALUES
        ('1', 'SIAGIAN AGRO MANDIRI', 'Rizky Rinaldi Hasibuan', '6285216080886', 'Dusun Cinta Makmur Aek Batu Kab.Labuhan Batu Selatan'),
        ('2', 'MULTIAPLIKASI ABADI SUKSES', 'Vincent Irfandy', '6282388899333', 'Jl Imam No. 332 RT 004 RW 010 Tangkerang Lanual Bukit Raya Kota Pekanbaru Riau 28992'),
        ('3', 'MITSUBISHI MOTOR', '', '', ''),
        ('4', '88 MOTOR', '', '', ''),
        ('5', 'BINTANG SURYA BANGUNAN', '', '', ''),
        ('6', 'BINTANG MAKMUR ABADI', '', '', ''),
        ('7', 'TOKO STARINDO', '', '', ''),
        ('8', 'NYANMAR DISEL', '', '', ''),
        ('9', 'SAMARINDA DIESEL', '', '', ''),
        ('10', 'BENGKEL SINAR MUDA', '', '', ''),
        ('11', 'BINTANG MAKMUR ABADI 2', '', '', ''),
        ('12', 'BINA CANTIK 3', '', '', ''),
        ('13', 'AA BESI', '', '', ''),
        ('14', 'USAHA TANI', '', '', ''),
        ('15', 'CIPTO PANGLONG', '', '', ''),
        ('16', 'BINTANG BANGUNAN', '', '', ''),
        ('17', 'SINAR TANI MAKMUR', '', '', ''),
        ('18', 'YANMAR DIESEL', '', '', '')
      `);

            console.log("✅ 18 vendors inserted successfully!");
        } else {
            console.log(`ℹ️ Table already has ${existing[0].count} vendors.`);
        }

        // Verify
        const [vendors] = await pool.query("SELECT * FROM vendors ORDER BY kode ASC");
        console.log(`\n📋 Total vendors in database: ${vendors.length}`);
        console.log("==================================");
        vendors.forEach((v) => {
            console.log(`  ${v.kode}. ${v.nama}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

createVendorsTable();
