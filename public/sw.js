// File: /sw.js

// --- Konfigurasi Cache ---
const CACHE_VERSION = "2.3-xlsx-local"; // FORCE UPDATE - Added local XLSX library
const STATIC_CACHE = `spa-pr-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = "spa-pr-dynamic-v2.3";

// Asset yang akan di-cache saat install (Diperbarui agar sesuai dengan daftarpr.html)
const STATIC_ASSETS = [
  "/",
  "/login.html",
  "/dashboard.html",
  "/daftarpr.html",
  "/pr.html",
  "/laporanpr.html",
  "/manifest.json",
  "/images/logo-icon-192.png",
  "/images/logo-icon-512.png",
  "/css/daftarpr.css",
  "/css/dashboard.css",
  "/css/all.min.css",
  "/js/daftarpr_main.js",
  "/js/dashboard.js",
  "/js/login.js",
  "/js/print_pr.js",
  "/js/pwa.js",
  "/js/laporanpr.js",
  "/js/xlsx.full.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
];

// --- Core Service Worker Events (Install, Activate, Fetch) ---

// Event 'install' - Cache static assets
self.addEventListener("install", (event) => {
  console.log(`[Service Worker] Install version ${CACHE_VERSION}`);

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.error("Error caching static assets:", err);
          // Opsional: Lanjutkan instalasi meskipun beberapa aset gagal di-cache
        });
      })
      .then(() => {
        console.log("[Service Worker] Assets cached, skipping waiting.");
        return self.skipWaiting(); // Aktifkan SW baru segera
      })
  );
});

// Event 'activate' - Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            // Hapus cache lama yang tidak sesuai dengan versi terbaru
            if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
              console.log("[Service Worker] Deleting old cache:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim(); // Ambil alih kontrol segera
      })
  );
});

// Event 'fetch' - Serve cached content when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Handle API requests (Network first strategy)
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache API responses if successful
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For static assets (Cache first strategy)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Cache the new resource if valid (termasuk respon 'opaque' dari CDN seperti FontAwesome)
            if (response && (response.ok || response.type === "opaque")) {
              // Jangan cache permintaan chrome-extension://
              if (event.request.url.startsWith("chrome-extension://")) {
                return response;
              }

              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback jika offline dan tidak ada di cache
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match("/daftarpr.html");
            }
            // Fallback untuk gambar
            if (event.request.url.includes("/images/")) {
              return caches.match("/images/logo-icon-192.png");
            }
          });
      })
    );
  }
});

// --- Push Notifications and Background Sync Events ---

// Event 'push': Dipicu ketika server mengirimkan notifikasi
self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");

  let data = {};
  // Coba parsing data yang dikirim server (disarankan format JSON)
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.warn("[Service Worker] Push data is not JSON, using raw text.");
      data = { body: event.data.text() };
    }
  }

  // Menyiapkan opsi notifikasi
  const title = data.title || "Sinar Permata Agro - Notifikasi";
  const options = {
    body: data.body || "Ada update baru terkait Purchase Request.",
    icon: data.icon || "/images/logo-icon-192.png",
    badge: "/images/logo-icon-192.png", // Badge untuk mobile
    image: data.image || "/images/logo-icon-512.png",
    vibrate: [200, 100, 200],
    data: {
      // URL yang akan dibuka saat notifikasi diklik
      url: data.url || "/daftarpr.html",
      timestamp: Date.now(),
    },
    actions: [
      {
        action: "open",
        title: "Buka Aplikasi",
      },
      {
        action: "close",
        title: "Tutup",
      },
    ],
  };

  // Menampilkan notifikasi sistem
  event.waitUntil(self.registration.showNotification(title, options));
});

// Event 'notificationclick': Dipicu ketika pengguna mengklik notifikasi
self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.", event.action);

  event.notification.close();

  const urlToOpen =
    event.notification.data && event.notification.data.url
      ? event.notification.data.url
      : "/daftarpr.html";

  // Handle notification actions
  if (event.action === "close") {
    return;
  }

  // Buka jendela browser atau fokus ke tab yang sudah terbuka
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // Cari tab yang sudah membuka aplikasi
        const origin = self.location.origin;
        for (const client of clientList) {
          if (client.url.includes(origin) && "focus" in client) {
            client.focus();
            // Jika URL tujuan berbeda, navigasi tab tersebut
            if (client.url !== new URL(urlToOpen, origin).href) {
              return client.navigate(urlToOpen);
            }
            return;
          }
        }
        // Jika tidak ada tab yang terbuka, buka jendela baru
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Event 'notificationclose': Dipicu ketika notifikasi ditutup
self.addEventListener("notificationclose", function (event) {
  console.log("[Service Worker] Notification closed");
});

// Background sync untuk data sync ketika online kembali
self.addEventListener("sync", function (event) {
  console.log("[Service Worker] Background sync:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Implement your background sync logic here (placeholder)
      syncPendingData()
    );
  }
});

// Function untuk background sync (placeholder)
function syncPendingData() {
  return new Promise((resolve, reject) => {
    // Implementasi sync data yang pending
    console.log("[Service Worker] Syncing pending data...");
    // Simulasi sync
    setTimeout(() => {
      console.log("[Service Worker] Background sync completed");
      resolve();
    }, 1000);
  });
}

// Periodic sync (Placeholder - membutuhkan registrasi dari sisi client/pwa.js jika didukung browser)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "content-update") {
    console.log("[Service Worker] Periodic sync triggered");
    // event.waitUntil(updateContent());
  }
});
