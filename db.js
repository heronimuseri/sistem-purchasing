// db.js (Final)

// Gunakan 'mysql2/promise' agar kita bisa memakai async/await
const mysql = require("mysql2/promise");

// Konfigurasi koneksi ke database Anda
// Membaca konfigurasi dari environment variables untuk keamanan
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistem_purchasing",
  waitForConnections: true,
  connectionLimit: 10, // Jumlah maksimum koneksi
  queueLimit: 0,
});

// (Opsional) Tambahkan kode ini untuk mengecek apakah koneksi berhasil saat server pertama kali jalan
pool
  .getConnection()
  .then((connection) => {
    console.log("🚀 Berhasil terhubung ke database MySQL!");
    connection.release(); // Lepaskan koneksi setelah selesai
  })
  .catch((err) => {
    console.error("❌ GAGAL terhubung ke database:", err.message);
  });

// Ekspor 'pool' agar bisa digunakan di file lain (seperti server.js)
module.exports = pool;
