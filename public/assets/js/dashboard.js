// public/js/dashboard.js
// Role yang tersedia: kerani, ktu, manager, purchasing, manager_ho, direktur
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

  // --- Permission Configuration Matrix ---
  const permissions = {
    // Role: { create_pr, create_po, create_pay, view_pay, summary, report }
    kerani: { create_pr: true, create_po: false, create_pay: false, view_pay: false, summary: true, report: true },
    kerani_test: { create_pr: true, create_po: false, create_pay: false, view_pay: false, summary: true, report: true },
    ktu: { create_pr: false, create_po: false, create_pay: false, view_pay: true, summary: true, report: true },
    manager: { create_pr: false, create_po: true, create_pay: true, view_pay: true, summary: true, report: true },
    purchasing: { create_pr: true, create_po: true, create_pay: true, view_pay: true, summary: true, report: true },
    manager_ho: { create_pr: false, create_po: true, create_pay: true, view_pay: true, summary: true, report: true },
    direktur: { create_pr: false, create_po: true, create_pay: true, view_pay: true, summary: true, report: true },
    admin: { create_pr: true, create_po: true, create_pay: true, view_pay: true, summary: true, report: true } // Fallback for sysadmin
  };

  const userPerms = permissions[userRole] || {
    create_pr: false, create_po: false, create_pay: false, view_pay: false, summary: false, report: false
  };

  // 1. Create PR
  const createPrLink = document.getElementById("create-pr-link");
  if (createPrLink) createPrLink.style.display = userPerms.create_pr ? "flex" : "none";

  // 2. Create PO
  const createPoLink = document.getElementById("create-po-link");
  if (createPoLink) createPoLink.style.display = userPerms.create_po ? "flex" : "none";

  // 3. Create Payment
  const createPaymentLink = document.getElementById("create-payment-link");
  if (createPaymentLink) createPaymentLink.style.display = userPerms.create_pay ? "flex" : "none";

  // 4. View Payment List
  const viewPaymentLink = document.getElementById("view-payment-link");
  if (viewPaymentLink) viewPaymentLink.style.display = userPerms.view_pay ? "flex" : "none";

  // 5. Summary Section
  const summarySection = document.getElementById("ktu-manager-summary");
  if (summarySection) {
    if (userPerms.summary) {
      summarySection.classList.remove("hidden");
      fetchPRSummary();
    } else {
      summarySection.classList.add("hidden");
    }
  }

  // 6. Laporan (Admin Section)
  const adminSection = document.getElementById("admin-menu-section");
  if (adminSection) {
    if (userPerms.report) {
      adminSection.classList.remove("hidden");
    } else {
      adminSection.classList.add("hidden");
    }
  }

  // Fungsi logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/login.html";
  });

  // --- Badge Notifikasi ---
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
