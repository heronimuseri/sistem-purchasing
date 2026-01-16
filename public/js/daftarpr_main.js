// public/js/daftarpr_main.js (Final - tanpa kode laporan)

// =================================================
// FUNGSI HELPER (NORMALISASI & FORMATTING)
// =================================================

/**
 * Menormalisasi data item laporan dari berbagai kemungkinan nama field API.
 * Diekspos secara global (window) agar bisa diakses oleh script inline di laporanpr.html
 */
window.normalizeReportItem = function (item) {
  if (!item) return {};

  const normalized = {
    pr_no:
      item["PR No."] ||
      item.pr_no ||
      item.no_pr ||
      item.prNumber ||
      item.pr_number ||
      "-",
    tanggal:
      item["Tanggal"] ||
      item.tanggal ||
      item.date ||
      item.created_date ||
      item.tgl_pr ||
      "-",
    diminta_oleh:
      item["Diminta Oleh"] ||
      item.diminta_oleh ||
      item.requester_name ||
      item.requester ||
      item.requested_by ||
      item.pemohon ||
      "-",
    kebutuhan:
      item["Untuk Kebutuhan / Uraian"] ||
      item.kebutuhan_uraian ||
      item.keperluan ||
      item.kebutuhan ||
      item.uraian ||
      item.description ||
      item.untuk_kebutuhan ||
      "-",
    status: item["Status"] || item.status || item.state || "unknown",
    nama_barang:
      item["Nama & Spesifikasi Barang"] ||
      item.nama_barang ||
      item.material ||
      item.nama_barang_dan_spesifikasi ||
      item.item_name ||
      item.spesifikasi ||
      item.nama_spesifikasi_barang ||
      "-",
    qty: item["Qty"] || item.qty || item.quantity || item.jumlah || "0",
    satuan: item["Satuan"] || item.satuan || item.unit || "-",
  };

  return normalized;
};

// Helper: Format Date (Rapi) - Format: 01 Okt 2025
const formatDate = (dateString) => {
  if (!dateString || dateString === "-") return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

// Helper: Format Quantity (Rapi) - Format Indonesia (misal: 1.000,50)
const formatQuantity = (qty) => {
  if (!qty || qty === "-") return "0";
  const num = parseFloat(qty);
  if (isNaN(num)) return qty;
  return num.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// Helper: Handle Empty Strings (Rapi)
const cleanText = (text) => {
  if (text === null || text === undefined || text === "") return "-";
  return String(text);
};

// Variabel global untuk mendeteksi konteks halaman
let isLaporanPage = false;
let columnCount = 5;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing Purchase Request System");

  // Cek login
  if (!localStorage.getItem("userName")) {
    console.log("No user found, redirecting to login");
    window.location.href = "/login.html";
    return;
  }

  // Deteksi halaman - untuk daftarpr_main.js, selalu false
  isLaporanPage = false;
  columnCount = 5;
  console.log("Summary Page detected, column count:", columnCount);

  // Event listeners
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterTable);
    console.log("Search input listener added");
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
    console.log("Logout button listener added");
  }

  const requestsTableBody = document.getElementById("requests-table-body");
  if (requestsTableBody) {
    requestsTableBody.addEventListener("click", handleTableButtonClick);
    console.log("Table button click listener added");
  }

  // Memuat data
  console.log("Starting to load purchase requests...");
  loadPurchaseRequests();

  // Inisialisasi Notifikasi
  initializeInAppNotifications();
});

// =================================================
// FUNGSI APLIKASI INTI (UNTUK HALAMAN RINGKASAN)
// =================================================

function logout() {
  console.log("Logging out user");
  localStorage.clear();
  window.location.href = "/Login.html";
}

/**
 * Memuat data Purchase Request untuk halaman ringkasan.
 */
async function loadPurchaseRequests() {
  const tableBody = document.getElementById("requests-table-body");
  if (!tableBody) {
    console.error("Error: Element #requests-table-body tidak ditemukan!");
    return;
  }

  // Tampilkan indikator loading
  tableBody.innerHTML = `<tr><td colspan="${columnCount}" class="loading-text">Memuat data...</td></tr>`;

  try {
    const userRole = localStorage.getItem("userRole");
    console.log("User role:", userRole);

    // Halaman regular - gunakan endpoint biasa
    console.log("Fetching data from: /api/requests");
    const response = await fetch("/api/requests", { credentials: "include" });

    if (!response.ok) {
      const errText = await response
        .text()
        .catch(() => "Tidak ada detail error.");
      throw new Error(`Gagal mengambil data: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    console.log("Regular data received:", data.length, "items");

    if (data && data.length > 0) {
      console.log("Sample data item:", data[0]);
    }

    tableBody.innerHTML = ""; // Kosongkan tabel

    if (!data || data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${columnCount}" class="loading-text">Tidak ada data PR saat ini.</td></tr>`;
      return;
    }

    renderSummaryView(data, tableBody, userRole);
  } catch (error) {
    console.error("Error loading Purchase Requests:", error);
    tableBody.innerHTML = `<tr><td colspan="${columnCount}" class="loading-text" style="color:red;">
      Error: ${error.message}<br>
      <small style="font-size: 12px;">
        <button onclick="location.reload()" class="btn btn-sm" style="margin: 5px;">Coba Lagi</button>
        <button onclick="window.location.href='/dashboard.html'" class="btn btn-sm btn-secondary">Kembali ke Dashboard</button>
      </small>
    </td></tr>`;
  }
}

/**
 * Renders the standard summary view (daftarpr.html)
 */
function renderSummaryView(requests, tableBody, userRole) {
  console.log("Rendering summary view with", requests.length, "items");

  requests.forEach((req, index) => {
    const actionButtons = generateActionButtons(req, userRole);
    const itemCount = req.item_count || 0;
    const status = cleanText(req.status);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${cleanText(req.pr_no)}</strong></td>
      <td>${cleanText(req.keperluan)}</td>
      <td style="text-align:center;">${itemCount} item</td>
      <td><span class="status ${status
        .toLowerCase()
        .replace(/ /g, "-")}">${status}</span></td>
      <td class="action-cell">${actionButtons}</td>
    `;
    tableBody.appendChild(row);
  });

  console.log("Summary view rendering completed");
}

/**
 * Membuat HTML untuk tombol aksi (Hanya digunakan di daftarpr.html).
 */
function generateActionButtons(req, userRole) {
  const isApproved = req.status === "Fully Approved";
  const canApprove =
    (req.status === "Pending KTU Approval" && userRole === "ktu") ||
    (req.status === "Pending Manager Approval" && userRole === "manager");

  if (canApprove) {
    return `
      <a href="/pr_detail.html?id=${req.id}" class="btn btn-sm btn-review" title="Lihat Detail">
        <i class="fa-solid fa-eye"></i> Review
      </a>
      <button class="btn btn-sm btn-approve" data-action="approve" data-id="${req.id}" title="Setujui">
        <i class="fa-solid fa-check"></i> Approve
      </button>
      <button class="btn btn-sm btn-reject" data-action="reject" data-id="${req.id}" title="Tolak">
        <i class="fa-solid fa-times"></i> Reject
      </button>
    `;
  }

  return `
    <a href="/pr_detail.html?id=${req.id
    }" class="btn btn-sm btn-review" title="Lihat Detail">
      <i class="fa-solid fa-eye"></i> Detail
    </a>
    <button class="btn btn-sm btn-print" data-action="print" data-id="${req.id
    }" 
      ${isApproved ? "" : "disabled"} title="Cetak PR">
      <i class="fa-solid fa-print"></i> Cetak
    </button>
  `;
}

/**
 * Menangani klik tombol di dalam tabel (Hanya digunakan di daftarpr.html).
 */
function handleTableButtonClick(event) {
  const target = event.target.closest("button");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  console.log(`Button clicked: ${action} for ID: ${id}`);

  if (action === "approve") {
    updateRequestStatus(id, "approve", "MENYETUJUI");
  } else if (action === "reject") {
    updateRequestStatus(id, "reject", "MENOLAK");
  } else if (action === "print") {
    if (typeof window.printRequest === "function") {
      window.printRequest(id);
    } else {
      alert(
        "Gagal mencetak: Fungsi cetak tidak tersedia. Pastikan print_pr.js sudah dimuat."
      );
    }
  }
}

/**
 * Mengirim permintaan approve/reject ke server.
 */
async function updateRequestStatus(id, action, confirmText) {
  if (!confirm(`Anda yakin ingin ${confirmText} permintaan ini?`)) return;

  try {
    console.log(`Sending ${action} request for ID: ${id}`);
    const response = await fetch(`/api/requests/${id}/${action}`, {
      method: "POST",
      credentials: "include",
    });

    const result = await response.json();
    console.log("Server response:", result);

    alert(result.message);

    if (response.ok) {
      loadPurchaseRequests();
      fetchNotificationCount();
    }
  } catch (error) {
    console.error(`Gagal ${action} permintaan:`, error);
    alert("Terjadi kesalahan jaringan saat memperbarui status.");
  }
}

/**
 * Menyaring isi tabel untuk halaman ringkasan.
 */
function filterTable() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const filter = searchInput.value.toUpperCase();
  const tableBody = document.getElementById("requests-table-body");
  if (!tableBody) return;

  const rows = tableBody.getElementsByTagName("tr");
  console.log(
    `Filtering table with keyword: ${filter}, Rows to check: ${rows.length}`
  );

  let visibleCount = 0;

  for (const row of rows) {
    let textValue = "";

    // Halaman Ringkasan: Cari di PR No (0) dan Uraian (1)
    const prNoCell = row.cells[0];
    const uraianCell = row.cells[1];
    if (prNoCell && uraianCell) {
      textValue =
        (prNoCell.textContent || prNoCell.innerText) +
        (uraianCell.textContent || uraianCell.innerText);
    }

    if (textValue) {
      const isVisible = textValue.toUpperCase().indexOf(filter) > -1;
      row.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    }
  }

  console.log(`Filter result: ${visibleCount} rows visible`);
}

// =================================================
// FUNGSI NOTIFIKASI DALAM APLIKASI (POLLING)
// =================================================

function initializeInAppNotifications() {
  const userRole = localStorage.getItem("userRole");
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  // Aktifkan untuk approver
  if (userRole === "ktu" || userRole === "manager") {
    if (notificationContainer) {
      notificationContainer.style.display = "block";
      notificationContainer.addEventListener("click", () => {
        console.log("Notification icon clicked. Refreshing data...");
        loadPurchaseRequests();
        fetchNotificationCount();
      });
    }
    startNotificationPolling();
  }
}

function startNotificationPolling() {
  console.log("Starting notification polling");
  fetchNotificationCount();
  // setInterval(fetchNotificationCount, 60000); // Aktifkan jika polling real-time diperlukan
}

async function fetchNotificationCount() {
  try {
    console.log("Fetching notification count...");
    const response = await fetch(`/api/notifications/count`, {
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Gagal mengambil data notifikasi. Status:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Notification count received:", data.pendingCount);
    updateNotificationBadge(data.pendingCount || 0);
  } catch (error) {
    console.error("Error jaringan saat memeriksa notifikasi:", error);
  }
}

function updateNotificationBadge(count) {
  const badge = document.getElementById("notification-badge");
  const body = document.body;

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = "block";
      if (body) body.classList.add("has-notification");
      console.log(`Notification badge updated: ${count} pending`);
    } else {
      badge.style.display = "none";
      if (body) body.classList.remove("has-notification");
      console.log("Notification badge hidden - no pending items");
    }
  }
}
