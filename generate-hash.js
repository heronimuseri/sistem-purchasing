// generate-hash.js
const bcrypt = require("bcrypt");

// Ambil password dari argumen baris perintah
const password = process.argv[2];

// Fungsi utama untuk membuat hash
async function generateHash() {
  // Pastikan password diberikan saat menjalankan skrip
  if (!password) {
    console.error("Kesalahan: Harap masukkan password.");
    console.log("Contoh penggunaan: node generate-hash.js password123");
    return;
  }

  try {
    const saltRounds = 10; // Faktor kompleksitas, 10 adalah standar
    const hash = await bcrypt.hash(password, saltRounds);

    console.log(`Password Asli: ${password}`);
    console.log("-----------------------------------------");
    console.log("Hasil Hash (untuk disalin):");
    console.log(hash);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Gagal membuat hash:", error);
  }
}

// Jalankan fungsi
generateHash();
