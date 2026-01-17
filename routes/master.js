// routes/master.js
const express = require("express");
const router = express.Router();

// sementara hardcode; nanti bisa tarik dari DB jika perlu
router.get("/approvers", (req, res) => {
  res.json({
    "Diminta Oleh": "Kerani",
    "Diperiksa Oleh": "Kepala Tata Usaha",
    "Disetujui Oleh": "Estate Manager",
  });
});

module.exports = router;
