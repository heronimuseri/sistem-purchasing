// routes/users.js (Final & Lengkap dengan kolom wa_number dan password edit)
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// GET: Mendapatkan semua user untuk ditampilkan di tabel
router.get("/", async (req, res) => {
  try {
    // MENAMBAH WA_NUMBER di SELECT
    const query =
      "SELECT id, company, `user`, role, name, wa_number FROM users ORDER BY id";
    const [users] = await pool.query(query);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data pengguna." });
  }
});

// POST: Membuat user baru
router.post("/", async (req, res) => {
  // MENAMBAH WA_NUMBER di destructuring
  const { name, user, role, pass, company, waNumber } = req.body;
  if (!name || !user || !role || !pass || !waNumber) {
    // Menambahkan waNumber di validasi
    return res
      .status(400)
      .json({ success: false, message: "Semua field wajib diisi." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);
    const query =
      "INSERT INTO users (name, company, `user`, pass, role, wa_number) VALUES (?, ?, ?, ?, ?, ?)"; // MENAMBAH wa_number di INSERT
    await pool.query(query, [
      name,
      company || null,
      user,
      hashedPassword,
      role,
      waNumber,
    ]);
    res
      .status(201)
      .json({ success: true, message: "User baru berhasil dibuat." });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "User ID atau Nomor WA sudah terdaftar.", // Memperbarui pesan error
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Gagal menyimpan data pengguna." });
  }
});

// PUT: Mengupdate data user (TIDAK TERMASUK PASSWORD)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  // MENAMBAH WA_NUMBER di destructuring
  const { name, user, role, company, waNumber } = req.body;

  if (!name || !user || !role || !waNumber) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Nama, Username, Role, dan WA wajib diisi.",
      });
  }

  try {
    // HANYA UPDATE DATA BIASA (PASSWORD di endpoint PATCH terpisah)
    const query =
      "UPDATE users SET name = ?, company = ?, `user` = ?, role = ?, wa_number = ? WHERE id = ?"; // MENAMBAH wa_number di UPDATE
    await pool.query(query, [name, company || null, user, role, waNumber, id]);

    res.json({ success: true, message: "Data user berhasil diperbarui." });
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "User ID atau Nomor WA sudah terdaftar.",
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Gagal memperbarui data pengguna." });
  }
});

// PATCH: Mengupdate Password (ENDPOINT BARU UNTUK ADMIN.JS)
router.patch("/:id/password", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password baru wajib diisi." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const query = "UPDATE users SET pass = ? WHERE id = ?";
    await pool.query(query, [hashedPassword, id]);

    res.json({ success: true, message: "Password user berhasil diubah." });
  } catch (error) {
    console.error(`Error changing password for user ${id}:`, error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengubah password." });
  }
});

// DELETE: Menghapus user (TIDAK ADA PERUBAHAN)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User berhasil dihapus." });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    res
      .status(500)
      .json({ success: false, message: "Gagal menghapus pengguna." });
  }
});

module.exports = router;
