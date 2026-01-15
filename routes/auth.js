// routes/auth.js (Dengan Log di Paling Atas)
const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  // ==========================================================
  // ## LOG BARU: Cek apakah request masuk ke fungsi ini ##
  // ==========================================================
  console.log("\n--- LOGIN ROUTE REACHED ---");
  console.log("Request Body Diterima:", req.body);
  console.log("---------------------------\n");
  // ==========================================================

  const { company, user, password } = req.body;
  const query = "SELECT * FROM users WHERE company = ? AND `user` = ?";

  try {
    const [rows] = await pool.query(query, [company, user]);

    if (rows.length > 0) {
      const foundUser = rows[0];
      const match = await bcrypt.compare(password, foundUser.pass);

      console.log("Hasil bcrypt.compare:", match); // Tambahan log untuk hasil

      if (match) {
        req.session.user = {
          id: foundUser.id,
          name: foundUser.name,
          role: foundUser.role,
        };
        res.json({
          success: true,
          user: { role: foundUser.role, name: foundUser.name },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Kredensial tidak valid." });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Kredensial tidak valid." });
    }
  } catch (error) {
    console.error("Database error during login:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// ... rute logout
module.exports = router;
