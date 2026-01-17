// server.js (Cleaned & Secured)

require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const helmet = require("helmet");
const pool = require("./src/config/db"); // UPDATED PATH

// Impor rute
const authRoutes = require("./src/routes/auth"); // UPDATED PATH
const requestRoutes = require("./src/routes/requests"); // UPDATED PATH
const userRoutes = require("./src/routes/users"); // UPDATED PATH
const masterRoutes = require("./src/routes/master"); // UPDATED PATH
const databaseRoutes = require("./src/routes/database"); // UPDATED PATH
const vendorRoutes = require("./src/routes/vendors"); // UPDATED PATH
const settingsRoutes = require("./src/routes/settings"); // UPDATED PATH
const poRoutes = require("./src/routes/po"); // Import PO routes // UPDATED PATH
const { router: notificationRoutes } = require("./src/routes/notifications"); // Import notification router // UPDATED PATH
const laporanRoutes = require("./src/routes/laporan"); // Import Laporan routes // UPDATED PATH

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
// Serve sw.js from public root (or views if we moved it?)
// We left sw.js in public root (Step 37 showed it there).
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

// Serve Assets
app.use("/assets", express.static(path.join(__dirname, "public/assets"), {
  setHeaders: function (res, path) {
    if (path.endsWith(".css") || path.endsWith(".js")) {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
    }
  }
}));

// Serve Views (HTML) as Root
app.use(express.static(path.join(__dirname, "public/views"), {
  setHeaders: function (res, path) {
    if (path.endsWith(".html")) {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.set("Surrogate-Control", "no-store");
    }
  }
}));

// Serve Public Root (Manifest, etc)
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
app.use("/api/settings", isAuthenticated, settingsRoutes);
app.use("/api/notifications", isAuthenticated, notificationRoutes); // Register notification routes
app.use("/api/po", isAuthenticated, poRoutes); // Register PO routes
app.use("/api/invoices", isAuthenticated, require("./src/routes/invoices")); // Register Invoice routes // UPDATED PATH
app.use("/api/laporan", isAuthenticated, laporanRoutes); // Register Laporan routes

// FAIL-SAFE: Redirect Login.html (Kapital) ke login.html (Huruf kecil)
// Ini menangani cache browser lama yang masih request ke file kapital
app.get("/Login.html", (req, res) => {
  res.redirect("/login.html");
});

// Rute default untuk menyajikan halaman login
app.get("/", (req, res) => {
  // Since we serve public/views as static root, "login.html" is at root.
  // But purely for explicit fallback:
  res.redirect("/login.html");
  // OR res.sendFile(path.join(__dirname, "public/views", "login.html"));
});

// Serve manifest.json dengan header yang tepat (manifest is in public/manifest.json usually, or assets?)
// Keeping manifest in public root is standard for PWA scope.
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
  try {
    const runMigrations = require('./src/utils/dbMigrate'); // UPDATED PATH
    await runMigrations();
  } catch (err) {
    console.error("Migration failed:", err);
  }
});
