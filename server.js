// server.js (Final dengan Nama Approver Dinamis dari Master User)
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/sw.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "sw.js"));
});
// --- DATABASE DUMMY ---
let users = [
  {
    id: 1,
    company: "SPA_70",
    user: "admin",
    pass: "admin123",
    role: "admin",
    name: "Admin Utama",
  },
  {
    id: 2,
    company: "SPA_70",
    user: "kerani",
    pass: "kerani123",
    role: "kerani",
    name: "Nelly Napitupulu",
  },
  {
    id: 3,
    company: "SPA_70",
    user: "ktu",
    pass: "ktu123",
    role: "ktu",
    name: "Josua M Siregar",
  },
  {
    id: 4,
    company: "SPA_70",
    user: "em",
    pass: "em123",
    role: "manager",
    name: "Binron Pasaribu",
  },
];
let userIdCounter = users.length;

let purchaseRequests = [
  {
    id: 1,
    prNo: "001/PR-SPA/HO/IX/2025",
    tanggal: "2025-09-20",
    keperluan: "Perbaikan jalan",
    requestedBy: "Nelly Napitupulu",
    items: [{ material: "Batu Base Course", qty: 10, satuan: "Ton" }],
    status: "Fully Approved",
    approvals: { ktu: "2025-09-21T10:00:00Z", manager: "2025-09-22T09:00:00Z" },
  },
  {
    id: 2,
    prNo: "002/PR-SPA/HO/IX/2025",
    tanggal: "2025-09-21",
    keperluan: "Kebutuhan ATK",
    requestedBy: "Nelly Napitupulu",
    items: [{ material: "Kertas A4", qty: 5, satuan: "Rim" }],
    status: "Pending KTU Approval",
    approvals: {},
  },
  {
    id: 3,
    prNo: "003/PR-SPA/HO/IX/2025",
    tanggal: "2025-09-22",
    keperluan: "Perawatan Mesin",
    requestedBy: "Nelly Napitupulu",
    items: [{ material: "Oli Mesin", qty: 2, satuan: "Drum" }],
    status: "Pending Manager Approval",
    approvals: { ktu: "2025-09-22T11:00:00Z" },
  },
];
// --------------------

// === API ENDPOINTS ===

// Login
app.post("/api/login", (req, res) => {
  const { company, user, password } = req.body;
  const foundUser = users.find(
    (u) => u.company === company && u.user === user && u.pass === password
  );
  if (foundUser)
    res.json({
      success: true,
      user: { role: foundUser.role, name: foundUser.name },
    });
  else
    res
      .status(401)
      .json({ success: false, message: "Kredensial tidak valid." });
});

// Daftar PR berdasarkan Role
app.get("/api/requests", (req, res) => {
  const { userName, userRole } = req.query;
  if (!userName || !userRole) return res.status(400).json([]);
  let requestsToShow = [];
  if (userRole === "ktu")
    requestsToShow = purchaseRequests.filter(
      (pr) => pr.status === "Pending KTU Approval"
    );
  else if (userRole === "manager")
    requestsToShow = purchaseRequests.filter(
      (pr) => pr.status === "Pending Manager Approval"
    );
  else if (userRole === "admin") requestsToShow = purchaseRequests;
  else
    requestsToShow = purchaseRequests.filter(
      (pr) => pr.requestedBy === userName
    );
  res.json(requestsToShow.slice().reverse());
});

// Membuat PR baru
app.post("/api/requests", (req, res) => {
  const { requester, prNo, tanggal, keperluan, items } = req.body;
  const validItems = items.filter((item) => item.material && item.qty > 0);
  if (validItems.length === 0)
    return res
      .status(400)
      .json({ success: false, message: "Tidak ada item yang valid." });
  const newRequest = {
    id: purchaseRequests.length + 1,
    prNo,
    tanggal,
    keperluan,
    requestedBy: requester,
    items: validItems,
    status: "Pending KTU Approval",
    approvals: {},
  };
  purchaseRequests.push(newRequest);
  res.json({ success: true, message: `Berhasil mengajukan PR #${prNo}` });
});

// Approval & Reject
app.post("/api/requests/:id/approve", (req, res) => {
  const { userRole } = req.body;
  const request = purchaseRequests.find(
    (r) => r.id === parseInt(req.params.id)
  );
  if (!request)
    return res
      .status(404)
      .json({ success: false, message: "Permintaan tidak ditemukan." });
  let nextStatus = "";
  const approvalTime = new Date().toISOString();
  if (request.status === "Pending KTU Approval" && userRole === "ktu") {
    nextStatus = "Pending Manager Approval";
    request.approvals.ktu = approvalTime;
  } else if (
    request.status === "Pending Manager Approval" &&
    userRole === "manager"
  ) {
    nextStatus = "Fully Approved";
    request.approvals.manager = approvalTime;
  } else {
    return res
      .status(403)
      .json({
        success: false,
        message: "Anda tidak memiliki hak untuk menyetujui tahap ini.",
      });
  }
  request.status = nextStatus;
  res.json({ success: true, message: `Permintaan #${request.id} disetujui.` });
});
app.post("/api/requests/:id/reject", (req, res) => {
  const request = purchaseRequests.find(
    (r) => r.id === parseInt(req.params.id)
  );
  if (request) {
    request.status = "Rejected";
    request.approvals = {};
    res.json({ success: true, message: `Permintaan #${request.id} ditolak.` });
  } else
    res
      .status(404)
      .json({ success: false, message: "Permintaan tidak ditemukan." });
});

// Ambil detail 1 PR (untuk print)
app.get("/api/requests/:id", (req, res) => {
  const request = purchaseRequests.find(
    (r) => r.id === parseInt(req.params.id)
  );
  if (request) res.json(request);
  else res.status(404).json({ message: "Permintaan tidak ditemukan" });
});

// === ADMIN & MASTER DATA ===

// API Master Approver SEKARANG DINAMIS
app.get("/api/master/approvers", (req, res) => {
  const kerani = users.find((u) => u.role === "kerani");
  const ktu = users.find((u) => u.role === "ktu");
  const manager = users.find((u) => u.role === "manager");

  const approvers = {
    "Diminta Oleh": kerani ? kerani.name : "N/A",
    "Diperiksa Oleh": ktu ? ktu.name : "N/A",
    "Disetujui Oleh": manager ? manager.name : "N/A",
  };
  res.json(approvers);
});

// Master User CRUD
app.get("/api/admin/users", (req, res) =>
  res.json(users.map(({ pass, ...user }) => user))
);
app.get("/api/admin/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (user) {
    const { pass, ...userData } = user;
    res.json(userData);
  } else {
    res.status(404).json({ success: false, message: "User tidak ditemukan." });
  }
});
app.post("/api/admin/users", (req, res) => {
  const { name, company, user, pass, role } = req.body;
  if (!name || !user || !pass || !role)
    return res
      .status(400)
      .json({ success: false, message: "Semua field wajib diisi." });
  userIdCounter++;
  const newUser = {
    id: userIdCounter,
    company: company || "SPA_70",
    user,
    pass,
    role,
    name,
  };
  users.push(newUser);
  res.json({ success: true, message: "User baru berhasil ditambahkan." });
});
app.put("/api/admin/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, user, pass, role } = req.body;
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res
      .status(404)
      .json({ success: false, message: "User tidak ditemukan." });
  if (!name || !user || !role)
    return res
      .status(400)
      .json({
        success: false,
        message: "Nama, User ID, dan Peran wajib diisi.",
      });

  users[userIndex].name = name;
  users[userIndex].user = user;
  users[userIndex].role = role;
  if (pass) users[userIndex].pass = pass;

  res.json({ success: true, message: "Data user berhasil diperbarui." });
});
app.delete("/api/admin/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((u) => u.id !== userId);
  res.json({ success: true, message: "User berhasil dihapus." });
});

// Default Route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "Login.html"))
);

// Start server
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
