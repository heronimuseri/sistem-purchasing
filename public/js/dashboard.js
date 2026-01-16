// public/js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  if (!userName) {
    // Jika tidak ada data user, kembali ke halaman login
    window.location.href = "/login.html";
    return;
  }

  // Tampilkan nama user yang login
  document.getElementById(
    "user-info"
  ).textContent = `Selamat datang, ${userName}`;

  // Tampilkan menu admin jika rolenya adalah 'admin'
  if (userRole === "admin") {
    document.getElementById("admin-menu-section").classList.remove("hidden");
  }

  // Fungsi logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/login.html";
  });

  // --- Badge Notifikasi (New) ---
  updateDashboardBadge();
});

async function updateDashboardBadge() {
  const badge = document.getElementById("dashboard-badge");
  if (!badge) return;

  try {
    const response = await fetch("/api/notifications/count", { credentials: "include" });
    if (response.ok) {
      const data = await response.json();
      const count = data.pendingCount || 0;

      if (count > 0) {
        badge.textContent = count;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Gagal mengambil notifikasi untuk dashboard:", error);
  }
}
