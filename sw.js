// sw.js (Service Worker)

const CACHE_NAME = "purchasing-spa-cache-v1";
// Daftar file yang akan di-cache saat pertama kali membuka aplikasi
const urlsToCache = [
  "/",
  "/Login.html",
  "/login.css",
  "/dashboard.html",
  "/dashboard.js",
  "/dashboard.css",
  "/pr.html",
  "/pr.css",
  "/daftarpr.html",
  "/daftarpr.js",
  "/daftarpr.css",
  "/admin.html",
  "/admin.js",
  "/admin.css",
  "/admin_user.html",
  "/admin_user.js",
  "/admin_user.css",
  "/images/logo.png",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
];

// Event: Install
// Saat service worker diinstal, cache semua file yang diperlukan
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Event: Fetch
// Saat browser meminta file, cek dulu di cache. Jika ada, berikan dari cache.
// Jika tidak ada, ambil dari network, lalu simpan ke cache untuk lain waktu.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Ambil dari cache
      }
      return fetch(event.request); // Ambil dari network jika tidak ada di cache
    })
  );
});
