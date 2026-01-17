// server.js (Cleaned & Secured)

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
const settingsRoutes = require("./routes/settings");
const poRoutes = require("./routes/po"); // Import PO routes
const { router: notificationRoutes } = require("./routes/notifications"); // Import notification router

const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs'); // Import fs

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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// --- DYNAMIC SERVICE WORKER ---
// Serve sw.js with dynamic version to force update
app.get('/sw.js', (req, res) => {
  const swPath = path.join(__dirname, 'public', 'sw.js');
  fs.readFile(swPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading sw.js:", err);
      return res.status(500).send("Error loading Service Worker");
    }

    // Inject server start time as version
    // Use a global variable for version to keep it consistent across requests until restart
    const version = global.SERVER_START_TIME || Date.now();
    const swContent = data.replace('{{VERSION}}', version);

    res.set("Content-Type", "application/javascript");
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.send(swContent);
  });
});

app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: function (res, path) {
    if (path.endsWith(".html") || path.endsWith(".css") || path.endsWith(".js")) {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.set("Surrogate-Control", "no-store");
    }
  }
}));

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
app.use("/api/settings", isAuthenticated, settingsRoutes);
app.use("/api/notifications", isAuthenticated, notificationRoutes); // Register notification routes
app.use("/api/po", isAuthenticated, poRoutes); // Register PO routes
app.use("/api/invoices", isAuthenticated, require("./routes/invoices")); // Register Invoice routes


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
    } else if (role === "manager_ho") {
      query =
        "SELECT COUNT(*) as pendingCount FROM purchase_orders WHERE status = ?";
      values = ["Pending Manager HO Approval"];
    } else if (role === "direktur") {
      query =
        "SELECT COUNT(*) as pendingCount FROM purchase_orders WHERE status = ?";
      values = ["Pending Direktur Approval"];
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

// FAIL-SAFE: Redirect Login.html (Kapital) ke login.html (Huruf kecil)
// Ini menangani cache browser lama yang masih request ke file kapital
app.get("/Login.html", (req, res) => {
  res.redirect("/login.html");
});

// Rute default untuk menyajikan halaman login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
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
app.listen(PORT, async () => {
  global.SERVER_START_TIME = Date.now(); // Set server start time for SW versioning
  console.log(`Server berjalan di http://localhost:${PORT} (Start Time: ${global.SERVER_START_TIME})`);

  // Auto-run migrations on startup
  const runMigrations = require('./utils/dbMigrate');
  await runMigrations();
});
