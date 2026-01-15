// public/js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  if (!userName) {
    // Jika tidak ada data user, kembali ke halaman login
    window.location.href = "/Login.html";
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
    window.location.href = "/Login.html";
  });
});
