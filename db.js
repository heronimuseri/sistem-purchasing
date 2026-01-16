// db.js (Railway Compatible - Fixed)

// Gunakan 'mysql2/promise' agar kita bisa memakai async/await
const mysql = require("mysql2/promise");

// Konfigurasi koneksi ke database
// Support Railway MySQL (via MYSQL_URL) atau environment variables terpisah
let poolConfig;

if (process.env.MYSQL_URL) {
  // Railway MySQL menggunakan URL connection string
  // Format: mysql://user:password@host:port/database
  const url = new URL(process.env.MYSQL_URL);
  poolConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading "/"
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  console.log("📡 Menggunakan MYSQL_URL untuk koneksi database (Railway)");
  console.log(`   Host: ${url.hostname}, Database: ${url.pathname.slice(1)}`);
} else {
  // Fallback ke environment variables terpisah (development lokal)
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sistem_purchasing",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  console.log("🏠 Menggunakan konfigurasi lokal untuk database");
}

const pool = mysql.createPool(poolConfig);

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
