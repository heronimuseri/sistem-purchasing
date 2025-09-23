// PASTIKAN BARIS INI ADA DI PALING ATAS
require("dotenv").config();

const { Pool } = require("pg");

// Cek apakah DATABASE_URL berhasil dimuat
if (!process.env.DATABASE_URL) {
  console.error("Error: Variabel DATABASE_URL tidak ditemukan di file .env");
  process.exit(1); // Keluar dari aplikasi jika URL tidak ada
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getAllProducts() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT * FROM products ORDER BY id");
    console.log("Data Produk:", result.rows);
    return result.rows;
  } catch (err) {
    console.error("Gagal mengambil data produk:", err);
  } finally {
    if (client) {
      client.release();
    }
  }
}

getAllProducts();
