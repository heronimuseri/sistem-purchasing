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

  // --- Logic for KTU & Manager (Hide Create PR) ---
  if (["ktu", "manager"].includes(userRole)) {
    // Sembunyikan tombol Buat PR Baru
    const createPrLink = document.getElementById("create-pr-link");
    if (createPrLink) createPrLink.style.display = "none";
  }

  // --- Show Summary for All Roles (except maybe generic users if any) ---
  // Allow KTU, Manager, Kerani, Admin to see summary
  if (["ktu", "manager", "kerani", "admin"].includes(userRole)) {
    const summarySection = document.getElementById("ktu-manager-summary");
    if (summarySection) {
      summarySection.classList.remove("hidden");
      fetchPRSummary();
    }
  }

  // --- Show PO Section for relevant roles ---
  // PO Section visible for: purchasing, manager_ho, direktur, kerani (for delivery receipt), admin
  // Also show for ktu and manager for visibility/monitoring
  const poRoles = ["purchasing", "manager_ho", "direktur", "kerani", "ktu", "manager", "admin"];
  if (poRoles.includes(userRole)) {
    const poSection = document.getElementById("po-section");
    if (poSection) {
      poSection.classList.remove("hidden");
    }

    // Show Finance/Invoice Section (Same roles for now as it relates to PO)
    const financeSection = document.getElementById("finance-section");
    if (financeSection) {
      financeSection.classList.remove("hidden");
    }
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

async function fetchPRSummary() {
  try {
    const response = await fetch("/api/requests/summary", { credentials: "include" });
    if (response.ok) {
      const data = await response.json();

      const elements = {
        "summary-total": data.total,
        "summary-pending-ktu": data.pending_ktu,
        "summary-pending-manager": data.pending_manager,
        "summary-approved": data.approved,
        "summary-rejected": data.rejected
      };

      for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || 0;
      }
    }
  } catch (error) {
    console.error("Gagal mengambil summary dashboard:", error);
  }
}
