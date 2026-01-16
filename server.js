// server.js (Final dengan CSP Diperbaiki)

require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const helmet = require("helmet");
const pool = require("./db");

// Impor rute
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/users");
const masterRoutes = require("./routes/master");
const databaseRoutes = require("./routes/database");
const vendorRoutes = require("./routes/vendors");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================================
// ## MIDDLEWARE CONFIGURATION ##
// ==========================================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        "style-src": [
          "'self'",
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
        ],
        "font-src": [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        "connect-src": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "rahasia-darurat",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 },
  })
);

// ==========================================================
// ## MIDDLEWARE CUSTOM ##
// ==========================================================
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res
    .status(401)
    .json({ success: false, message: "Akses ditolak. Sesi tidak valid." });
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") return next();
  res
    .status(403)
    .json({ success: false, message: "Akses ditolak. Hanya untuk admin." });
};

// ==========================================================
// ## ROUTE REGISTRATION ##
// ==========================================================
app.use("/api", authRoutes);
app.use("/api/requests", isAuthenticated, requestRoutes);
app.use("/api/master", isAuthenticated, masterRoutes);
app.use("/api/admin/users", isAuthenticated, isAdmin, userRoutes);
app.use("/api/admin/database", isAuthenticated, isAdmin, databaseRoutes);
app.use("/api/admin/vendors", isAuthenticated, isAdmin, vendorRoutes);

// ==========================================================
// ## LAPORAN & NOTIFICATION ENDPOINTS ##
// ==========================================================

// Endpoint untuk laporan detail - HANYA SATU VERSI
app.get("/api/laporan/detail", isAuthenticated, async (req, res) => {
  try {
    console.log(
      "Accessing laporan detail endpoint - User:",
      req.session.user.name,
      "Role:",
      req.session.user.role
    );

    const query = `
      SELECT 
        pr.pr_no as 'PR No.',
        pr.tanggal as 'Tanggal',
        pr.requester_name as 'Diminta Oleh',
        pr.keperluan as 'Untuk Kebutuhan / Uraian',
        pr.status as 'Status',
        items.material as 'Nama & Spesifikasi Barang',
        items.qty as 'Qty',
        items.satuan as 'Satuan'
      FROM purchase_requests pr
      JOIN pr_items items ON pr.id = items.pr_id
      ORDER BY pr.tanggal DESC, pr.pr_no
    `;

    const [rows] = await pool.query(query);
    console.log(
      `Laporan detail data fetched: ${rows.length} rows for user ${req.session.user.name}`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching laporan detail:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data laporan detail.",
    });
  }
});

// Endpoint untuk notifikasi count
app.get("/api/notifications/count", isAuthenticated, async (req, res) => {
  try {
    const { role } = req.session.user;
    let query = "";
    let values = [];

    if (role === "ktu") {
      query =
        "SELECT COUNT(*) as pendingCount FROM purchase_requests WHERE status = ?";
      values = ["Pending KTU Approval"];
    } else if (role === "manager") {
      query =
        "SELECT COUNT(*) as pendingCount FROM purchase_requests WHERE status = ?";
      values = ["Pending Manager Approval"];
    } else {
      return res.json({ pendingCount: 0 });
    }

    const [result] = await pool.query(query, values);
    res.json({ pendingCount: result[0].pendingCount });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.json({ pendingCount: 0 });
  }
});

// Rute default untuk menyajikan halaman login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

// Serve manifest.json dengan header yang tepat
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "public", "manifest.json"));
});

// Fallback untuk undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
