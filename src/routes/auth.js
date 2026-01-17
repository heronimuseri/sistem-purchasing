// routes/auth.js (Dengan Log di Paling Atas)
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  // ==========================================================
  // ## LOG BARU: Cek apakah request masuk ke fungsi ini ##
  // ==========================================================
  // ==========================================================
  const fs = require('fs');
  const logStream = fs.createWriteStream('./server.log', { flags: 'a' });
  const logToFile = (msg) => {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] ${msg}\n`);
    console.log(msg);
  };

  logToFile("\n--- LOGIN ROUTE REACHED ---");
  logToFile(`Request Body Diterima: ${JSON.stringify(req.body)}`);
  // ==========================================================

  const { company, user, password } = req.body;
  // Gunakan fungsi LOWER untuk pencarian case-insensitive agar lebih toleran
  const query = "SELECT * FROM users WHERE LOWER(company) = LOWER(?) AND LOWER(`user`) = LOWER(?)";

  try {
    const [rows] = await pool.query(query, [company, user]);

    if (rows.length > 0) {
      const foundUser = rows[0];
      const match = await bcrypt.compare(password, foundUser.pass);

      console.log("User found:", foundUser.user);
      console.log("DB Hash:", foundUser.pass);
      console.log("Input Password:", password);
      console.log("Match Result:", match);

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
        console.log("LOGIN FAIL: Password mismatch");
        res
          .status(401)
          .json({ success: false, message: "Kredensial tidak valid. (Pass Mismatch)" });
      }
    } else {
      console.log("LOGIN FAIL: User not found for", company, user);
      res
        .status(401)
        .json({ success: false, message: "Kredensial tidak valid. (User Not Found)" });
    }
  } catch (error) {
    console.error("Database error during login:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// ... rute logout
// Endpoint Check Session
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Endpoint Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal logout" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;
