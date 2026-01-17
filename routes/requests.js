// routes/requests.js (Final dengan Struktur Database yang Benar)
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Helper untuk mengambil nama dari sesi, dengan fallback jika perlu
const getApproverName = (req) =>
  req.session.user ? req.session.user.name : "SYSTEM";

// --- RUTE UNTUK MELIHAT DAFTAR PR ---
router.get("/", async (req, res) => {
  const { role, name } = req.session.user;
  let query = "";
  let values = [];

  // Query untuk mengambil jumlah item untuk setiap PR
  const baseQuery = `
    SELECT pr.*, (SELECT COUNT(*) FROM pr_items WHERE pr_id = pr.id) as item_count
    FROM purchase_requests pr
  `;

  try {
    if (role === "ktu") {
      query = `${baseQuery} WHERE pr.status = ? ORDER BY pr.created_at DESC`;
      values = ["Pending KTU Approval"];
    } else if (role === "manager") {
      query = `${baseQuery} WHERE pr.status = ? ORDER BY pr.created_at DESC`;
      values = ["Pending Manager Approval"];
    } else if (role === "admin") {
      query = `${baseQuery} ORDER BY pr.created_at DESC`;
    } else {
      // Requester, Kerani, dll.
      query = `${baseQuery} WHERE pr.requester_name = ? ORDER BY pr.created_at DESC`;
      values = [name];
    }

    const [requests] = await pool.query(query, values);
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data." });
  }
});

// --- RUTE UNTUK MELIHAT DETAIL SATU PR ---
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [prRows] = await pool.query(
      "SELECT * FROM purchase_requests WHERE id = ?",
      [id]
    );
    if (prRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "PR tidak ditemukan." });
    }
    const [itemRows] = await pool.query(
      "SELECT * FROM pr_items WHERE pr_id = ?",
      [id]
    );

    const response = prRows[0];
    response.items = itemRows; // Gabungkan item ke dalam hasil PR

    res.json(response);
  } catch (error) {
    console.error(`Error fetching PR #${id}:`, error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil detail PR." });
  }
});

// --- RUTE UNTUK MEMBUAT PR BARU ---
router.post("/", async (req, res) => {
  console.log("\n--- CREATE PR ROUTE REACHED ---");
  console.log("Request Body Diterima:", req.body);
  console.log("----------------------------------\n");
  const { tanggal, keperluan, departemen, items } = req.body;
  const { id: requesterId, name: requesterName } = req.session.user;
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Insert data utama PR
    const prQuery =
      "INSERT INTO purchase_requests (tanggal, keperluan, departemen, status, requester_id, requester_name) VALUES (?, ?, ?, ?, ?, ?)";
    const [prResult] = await connection.query(prQuery, [
      tanggal,
      keperluan,
      departemen,
      "Pending KTU Approval",
      requesterId,
      requesterName,
    ]);
    const prId = prResult.insertId;

    // 2. Generate Nomor PR (Ini akan menggunakan tabel pr_counters)
    const year = new Date(tanggal).getFullYear();
    await connection.query(
      `INSERT INTO pr_counters (year, last_seq) VALUES (?, 1) ON DUPLICATE KEY UPDATE last_seq = last_seq + 1`,
      [year]
    );
    const [counterRows] = await connection.query(
      "SELECT last_seq FROM pr_counters WHERE year = ?",
      [year]
    );
    const sequence = String(counterRows[0].last_seq).padStart(3, "0");
    const romanMonths = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];
    const prNo = `${sequence}/PR-SPA/${departemen}/${
      romanMonths[new Date(tanggal).getMonth()]
    }/${year}`;

    // 3. Update PR dengan nomor yang baru dibuat
    await connection.query(
      "UPDATE purchase_requests SET pr_no = ? WHERE id = ?",
      [prNo, prId]
    );

    // 4. Insert semua item ke pr_items
    if (items && items.length > 0) {
      const itemValues = items.map((item) => [
        prId,
        item.material,
        item.qty,
        item.satuan,
      ]);
      await connection.query(
        "INSERT INTO pr_items (pr_id, material, qty, satuan) VALUES ?",
        [itemValues]
      );
    }

    await connection.commit();
    res
      .status(201)
      .json({ success: true, message: `PR #${prNo} berhasil dibuat.` });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error creating PR:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error saat membuat PR." });
  } finally {
    if (connection) connection.release();
  }
});

// --- RUTE UNTUK PROSES APPROVAL ---
router.post("/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { role } = req.session.user;
  const approverName = getApproverName(req);

  try {
    const [rows] = await pool.query(
      "SELECT status FROM purchase_requests WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "PR tidak ditemukan." });

    const currentStatus = rows[0].status;
    let nextStatus = "";
    let queryUpdate = "";

    if (role === "ktu" && currentStatus === "Pending KTU Approval") {
      nextStatus = "Pending Manager Approval";
      queryUpdate =
        "UPDATE purchase_requests SET status = ?, ktu_name = ?, approval_ktu_date = NOW() WHERE id = ?";
    } else if (
      role === "manager" &&
      currentStatus === "Pending Manager Approval"
    ) {
      nextStatus = "Fully Approved";
      queryUpdate =
        "UPDATE purchase_requests SET status = ?, manager_name = ?, approval_manager_date = NOW() WHERE id = ?";
    } else {
      return res.status(403).json({
        success: false,
        message: "Anda tidak berhak menyetujui tahap ini.",
      });
    }

    await pool.query(queryUpdate, [nextStatus, approverName, id]);
    res.json({ success: true, message: "PR berhasil disetujui." });
  } catch (error) {
    console.error(`Error approving PR #${id}:`, error);
    res
      .status(500)
      .json({ success: false, message: "Server error saat menyetujui PR." });
  }
});

// --- RUTE UNTUK PROSES REJECT ---
router.post("/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE purchase_requests SET status = 'Rejected' WHERE id = ?",
      [id]
    );
    res.json({ success: true, message: "PR berhasil ditolak." });
  } catch (error) {
    console.error(`Error rejecting PR #${id}:`, error);
    res.status(500).json({ success: false, message: "Gagal menolak PR." });
  }
});

module.exports = router;
