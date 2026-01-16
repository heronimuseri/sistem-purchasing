// routes/requests.js (Final dengan Struktur Database yang Benar)
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Helper untuk mengambil nama dari sesi, dengan fallback jika perlu
const getApproverName = (req) =>
  req.session.user ? req.session.user.name : "SYSTEM";

const axios = require("axios");

// ... (kode lain)

// --- FUNGSI HELPER NOTIFIKASI (FONNTE IMPLEMENTATION) ---
const sendWhatsappNotification = async (targetRole, targetUser, message) => {
  console.log("\n[WHATSAPP NOTIFICATION START]");

  // CHECK: Apakah notifikasi diaktifkan di pengaturan?
  try {
    const [rows] = await pool.query(
      "SELECT setting_value FROM system_settings WHERE setting_key = 'wa_notifications_enabled'"
    );
    if (rows.length > 0 && rows[0].setting_value === 'false') {
      console.log("Skipping: Notifications are disabled in system settings.");
      return;
    }
  } catch (err) {
    console.error("Error checking notification settings:", err);
    // Lanjut saja jika error check setting (fail open atau fail close? fail open for now)
  }

  if (!targetUser || !targetUser.wa_number) {
    console.log("Skipping: User has no WA number.");
    return;
  }

  // Bersihkan format nomor WA (opsional, Fonnte biasanya bisa handle 62/08)
  // Kebutuhan Fonnte: 08xx atau 628xx
  let targetNumber = targetUser.wa_number;

  console.log(`Target: ${targetUser.name} (${targetNumber})`);

  try {
    const token = process.env.FONNTE_TOKEN;
    if (!token) {
      console.error("ERROR: FONNTE_TOKEN is missing in .env");
      return;
    }

    const response = await axios.post(
      "https://api.fonnte.com/send",
      {
        target: targetNumber,
        message: `${message}\n\nLink: ${process.env.APP_URL || ''}/login.html`,
        countryCode: "62", // Default Indonesia
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("Fonnte Response:", response.data);
  } catch (error) {
    console.error("Fonnte API Error:", error.response ? error.response.data : error.message);
  }
  console.log("------------------------------------\n");
};

// Helper: Ambil data user target notifikasi
const getTargetUsers = async (role) => {
  if (!role) return [];
  try {
    const [users] = await pool.query("SELECT name, wa_number FROM users WHERE role = ?", [role]);
    return users;
  } catch (error) {
    console.error("Error fetching target users for notification:", error);
    return [];
  }
};

const getRequesterData = async (prId) => {
  try {
    const [rows] = await pool.query("SELECT requester_id, requester_name FROM purchase_requests WHERE id = ?", [prId]);
    if (rows.length === 0) return null;
    const [users] = await pool.query("SELECT name, wa_number FROM users WHERE id = ?", [rows[0].requester_id]);
    return users.length > 0 ? users[0] : { name: rows[0].requester_name, wa_number: null };
  } catch (error) {
    console.error("Error fetching requester data:", error);
    return null;
  }
};


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

// --- RUTE UNTUK RINGKASAN DASHBOARD (KTU/MANAGER) ---
router.get("/summary", async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Pending KTU Approval' THEN 1 ELSE 0 END) as pending_ktu,
        SUM(CASE WHEN status = 'Pending Manager Approval' THEN 1 ELSE 0 END) as pending_manager,
        SUM(CASE WHEN status = 'Fully Approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
      FROM purchase_requests
    `;
    const [rows] = await pool.query(query);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil ringkasan." });
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
    const prNo = `${sequence}/PR-SPA/${departemen}/${romanMonths[new Date(tanggal).getMonth()]
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

    const { sendPushToRole, sendPushToUser } = require('./notifications');

    // ... (Existing notification logic) ...

    // --- PUSH NOTIFICATION: PR Baru ---
    const pushPayload = {
      title: "PR Baru Menunggu Approval",
      body: `${requesterName}: ${keperluan}`,
      url: `/pr_detail.html?id=${prId}`,
      icon: "/images/logo-icon-192.png"
    };
    sendPushToRole('ktu', pushPayload);

    // --- NOTIFIKASI: PR Baru dibuat -> Kirim ke KTU ---
    try {
      const ktuUsers = await getTargetUsers('ktu');
      const msg = `[SISTEM PURCHASING]
Terdapat PR Baru yang membutuhkan persetujuan Anda.
No PR: ${prNo}
Requester: ${requesterName}
Keperluan: ${keperluan}
Silakan cek aplikasi untuk detailnya.`;

      for (const user of ktuUsers) {
        await sendWhatsappNotification('kt', user, msg); // Typo 'kt' -> harusnya 'ktu' tapi tidak fatal di log
      }
    } catch (notifError) {
      console.error("Gagal mengirim notifikasi PR Baru:", notifError);
    }

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
      "SELECT * FROM purchase_requests WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "PR tidak ditemukan." });

    const currentStatus = rows[0].status;
    const prNo = rows[0].pr_no;
    let nextStatus = "";
    let queryUpdate = "";
    let notifTargetRole = ""; // Role target notifikasi selanjutnya

    if (role === "ktu" && currentStatus === "Pending KTU Approval") {
      nextStatus = "Pending Manager Approval";
      queryUpdate =
        "UPDATE purchase_requests SET status = ?, ktu_name = ?, approval_ktu_date = NOW() WHERE id = ?";
      notifTargetRole = "manager";
    } else if (
      role === "manager" &&
      currentStatus === "Pending Manager Approval"
    ) {
      nextStatus = "Fully Approved";
      queryUpdate =
        "UPDATE purchase_requests SET status = ?, manager_name = ?, approval_manager_date = NOW() WHERE id = ?";
      notifTargetRole = "requester";
    } else {
      return res.status(403).json({
        success: false,
        message: "Anda tidak berhak menyetujui tahap ini.",
      });
    }

    await pool.query(queryUpdate, [nextStatus, approverName, id]);

    // --- NOTIFIKASI ---
    if (notifTargetRole === "manager") {
      // Push to Manager
      sendPushToRole('manager', {
        title: "Approval PR Diperlukan",
        body: `PR ${prNo} dari KTU`,
        url: `/pr_detail.html?id=${id}`
      });

      const managers = await getTargetUsers("manager");
      const msg = `[SISTEM PURCHASING]
PR telah disetujui KTU dan menunggu persetujuan Manager.
No PR: ${prNo}
KTU Approver: ${approverName}
Silakan cek aplikasi.`;
      for (const mgr of managers) sendWhatsappNotification("manager", mgr, msg);

    } else if (notifTargetRole === "requester") {
      // Push to Requester
      if (rows[0].requester_id) {
        sendPushToUser(rows[0].requester_id, {
          title: "PR Disetujui!",
          body: `PR ${prNo} telah disetujui Manager`,
          url: `/pr_detail.html?id=${id}`
        });
      }

      const requester = await getRequesterData(id);
      if (requester) {
        const msg = `[SISTEM PURCHASING]
Selamat! PR Anda telah disetujui sepenuhnya (Fully Approved).
No PR: ${prNo}
Manager Approver: ${approverName}
Silakan proses lebih lanjut.`;
        sendWhatsappNotification("requester", requester, msg);
      }
    }

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
  const { reason } = req.body;

  try {
    // SECURITY CHECK: Pastikan user session valid
    if (!req.session || !req.session.user) {
      return res.status(401).json({ success: false, message: "Sesi tidak valid. Silakan login ulang." });
    }

    const { name: rejecterName, role: rejecterRole } = req.session.user;

    // Ambil data PR dulu untuk notifikasi
    const [rows] = await pool.query("SELECT pr_no FROM purchase_requests WHERE id = ?", [id]);
    const prNo = rows.length > 0 ? rows[0].pr_no : "-";

    await pool.query(
      "UPDATE purchase_requests SET status = 'Rejected', reject_reason = ? WHERE id = ?",
      [reason || null, id]
    );

    // --- NOTIFIKASI KE REQUESTER ---
    try {
      // Push notification
      const [prData] = await pool.query("SELECT requester_id FROM purchase_requests WHERE id = ?", [id]);
      if (prData.length > 0 && prData[0].requester_id) {
        sendPushToUser(prData[0].requester_id, {
          title: "PR Ditolak",
          body: `PR ${prNo} ditolak: ${reason}`,
          url: `/pr_detail.html?id=${id}`
        });
      }

      const requester = await getRequesterData(id);
      if (requester) {
        const msg = `[SISTEM PURCHASING]
Mohon Maaf, PR Anda telah DITOLAK.
No PR: ${prNo}
Ditolak Oleh: ${rejecterName} (${rejecterRole})
Alasan: ${reason || "Tidak ada alasan spesifik."}
Silakan perbaiki atau hubungi atasan terkait.`;

        // Fire and forget, but catch errors to prevent unhandled rejection
        sendWhatsappNotification("requester", requester, msg).catch(err =>
          console.error("Error sending reject notification:", err)
        );
      }
    } catch (notifErr) {
      console.error("Failed to prepare rejection notification:", notifErr);
    }

    res.json({ success: true, message: "PR berhasil ditolak." });
  } catch (error) {
    console.error(`Error rejecting PR #${id}:`, error);
    res.status(500).json({ success: false, message: "Gagal menolak PR: " + (error.message || "Server Error") });
  }
});

module.exports = router;
