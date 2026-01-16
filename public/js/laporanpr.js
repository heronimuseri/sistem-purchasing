// public/js/laporanpr.js (Final - dengan fungsi helper renamed)

// =================================================
// FUNGSI UTAMA LAPORAN PR - DIPERBAIKI
// =================================================

// Variabel global untuk data laporan
let allReportData = [];

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Initializing Laporan PR System");

  // Cek login
  if (!localStorage.getItem("userName")) {
    console.log("No user found, redirecting to login");
    window.location.href = "/Login.html";
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Memuat data laporan
  loadLaporanData();
});

// Setup event listeners khusus laporan
function setupEventListeners() {
  const exportBtn = document.getElementById("export-excel-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportGlobalReport);
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterLaporanTable);
  }
}

// Memuat data laporan - VERSI DIPERBAIKI
async function loadLaporanData() {
  const tableBody = document.getElementById("requests-table-body");
  if (!tableBody) {
    console.error("Error: Element #requests-table-body tidak ditemukan!");
    return;
  }

  // Tampilkan loading spinner
  tableBody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat data laporan detail...</p>
        </div>
      </td>
    </tr>
  `;

  try {
    console.log("Fetching data from: /api/laporan/detail");
    const response = await fetch("/api/laporan/detail", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Laporan detail data received:", data);

    // Debug: tampilkan struktur data pertama
    if (data && data.length > 0) {
      console.log("Sample data structure:", data[0]);
    }

    // Simpan data global untuk export
    allReportData = data;

    // Render tabel
    renderDetailedReport(data, tableBody);

    // Update statistik
    updateStats(data);
  } catch (error) {
    console.error("Error loading Laporan Data:", error);
    showError(tableBody, `Gagal memuat data: ${error.message}`);
  }
}

// Render laporan detail - VERSI DIPERBAIKI
function renderDetailedReport(details, tableBody) {
  console.log("=== START RENDER DETAILED REPORT ===");
  console.log("Total data items to render:", details.length);

  if (!details || details.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <i class="fa-solid fa-inbox"></i>
            <h3>Tidak ada data laporan</h3>
            <p>Belum ada data purchase request yang tersedia.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";

  let renderedCount = 0;
  let skippedCount = 0;

  details.forEach((item, index) => {
    try {
      // Normalisasi data dengan cara yang lebih sederhana
      const data = normalizeLaporanItem(item);

      // Validasi data penting
      if (!data.pr_no || data.pr_no === "-") {
        console.warn(`Skipping row ${index + 1} - missing PR No:`, data);
        skippedCount++;
        return;
      }

      const status = cleanTextLaporan(data.status);
      const formattedDate = formatDateLaporan(data.tanggal);
      const formattedQty = formatQuantityLaporan(data.qty);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="text-align: center;">${index + 1}</td>
        <td><strong>${cleanTextLaporan(data.pr_no)}</strong></td>
        <td>${formattedDate}</td>
        <td>${cleanTextLaporan(data.diminta_oleh)}</td>
        <td>${cleanTextLaporan(data.kebutuhan)}</td>
        <td><span class="status ${getStatusClass(status)}">${status}</span></td>
        <td>${cleanTextLaporan(data.nama_barang)}</td>
        <td style="text-align: right;">${formattedQty}</td>
        <td>${cleanTextLaporan(data.satuan)}</td>
      `;

      tableBody.appendChild(row);
      renderedCount++;
    } catch (error) {
      console.error(`Error rendering row ${index + 1}:`, error, item);
      skippedCount++;
    }
  });

  console.log(`=== RENDER COMPLETED ===`);
  console.log(`Total data: ${details.length}`);
  console.log(`Successfully rendered: ${renderedCount}`);
  console.log(`Skipped: ${skippedCount}`);

  // Jika tidak ada yang berhasil dirender, tampilkan pesan error dengan data mentah
  if (renderedCount === 0 && details.length > 0) {
    showDebugInfo(tableBody, details);
  }
}

// Normalisasi data laporan - VERSI LEBIH SEDERHANA
function normalizeLaporanItem(item) {
  if (!item) return createEmptyItem();

  // Cek struktur data yang mungkin
  const normalized = {
    // Field utama dari API laporan
    pr_no: item["PR No."] || item.pr_no || "-",
    tanggal: item.Tanggal || item.tanggal || "-",
    diminta_oleh: item["Diminta Oleh"] || item.diminta_oleh || "-",
    kebutuhan: item["Untuk Kebutuhan / Uraian"] || item.kebutuhan || "-",
    status: item.Status || item.status || "unknown",
    nama_barang: item["Nama & Spesifikasi Barang"] || item.nama_barang || "-",
    qty: item.Qty || item.qty || "0",
    satuan: item.Satuan || item.satuan || "-",
  };

  return normalized;
}

function createEmptyItem() {
  return {
    pr_no: "-",
    tanggal: "-",
    diminta_oleh: "-",
    kebutuhan: "-",
    status: "unknown",
    nama_barang: "-",
    qty: "0",
    satuan: "-",
  };
}

function getStatusClass(status) {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("approved")) return "approved";
  if (statusLower.includes("rejected")) return "rejected";
  if (statusLower.includes("pending")) return "pending";
  return "unknown";
}

// Update statistik laporan - VERSI DIPERBAIKI
function updateStats(data) {
  if (!data || data.length === 0) {
    resetStats();
    return;
  }

  try {
    // Hitung jumlah PR unik
    const uniquePRs = [
      ...new Set(
        data.map((item) => {
          const normalized = normalizeLaporanItem(item);
          return normalized.pr_no;
        })
      ),
    ].filter((pr) => pr && pr !== "-");

    const totalPR = uniquePRs.length;

    // Untuk statistik, kita hitung berdasarkan PR unik
    const prStatusMap = {};
    data.forEach((item) => {
      const normalized = normalizeLaporanItem(item);
      if (normalized.pr_no && normalized.pr_no !== "-") {
        prStatusMap[normalized.pr_no] = normalized.status;
      }
    });

    // Reset counts
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    Object.values(prStatusMap).forEach((status) => {
      const statusLower = status.toLowerCase();
      if (statusLower.includes("pending")) {
        pendingCount++;
      } else if (statusLower.includes("approved")) {
        approvedCount++;
      } else if (statusLower.includes("rejected")) {
        rejectedCount++;
      }
    });

    document.getElementById("total-pr").textContent = totalPR;
    document.getElementById("pending-count").textContent = pendingCount;
    document.getElementById("approved-count").textContent = approvedCount;
    document.getElementById("rejected-count").textContent = rejectedCount;
  } catch (error) {
    console.error("Error updating stats:", error);
    resetStats();
  }
}

function resetStats() {
  document.getElementById("total-pr").textContent = "0";
  document.getElementById("pending-count").textContent = "0";
  document.getElementById("approved-count").textContent = "0";
  document.getElementById("rejected-count").textContent = "0";
}

// Filter tabel laporan
function filterLaporanTable() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const filter = searchInput.value.toUpperCase();
  const tableBody = document.getElementById("requests-table-body");
  if (!tableBody) return;

  const rows = tableBody.getElementsByTagName("tr");
  let visibleCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let showRow = false;

    for (let j = 1; j < cells.length; j++) {
      const cell = cells[j];
      if (cell) {
        const textValue = cell.textContent || cell.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
          showRow = true;
          break;
        }
      }
    }

    rows[i].style.display = showRow ? "" : "none";
    if (showRow) visibleCount++;
  }

  console.log(`Filter result: ${visibleCount} rows visible`);
}

// Tampilkan error
function showError(tableBody, message) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="empty-state" style="color: #ef4444;">
          <i class="fa-solid fa-exclamation-triangle"></i>
          <h3>Terjadi Kesalahan</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="dashboard-btn" style="margin-top: 15px;">
            <i class="fa-solid fa-refresh"></i> Coba Lagi
          </button>
        </div>
      </td>
    </tr>
  `;
}

// Tampilkan info debug ketika render gagal
function showDebugInfo(tableBody, data) {
  const sampleData = data.slice(0, 3); // Ambil 3 data pertama untuk debug
  tableBody.innerHTML = `
    <tr>
      <td colspan="9">
        <div class="empty-state" style="text-align: left; color: orange;">
          <i class="fa-solid fa-bug"></i>
          <h3>Debug Information</h3>
          <p>Data diterima tetapi gagal dirender. Berikut sample data mentah:</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 12px; text-align: left;">
${JSON.stringify(sampleData, null, 2)}
          </pre>
          <p>Periksa console browser untuk detail error.</p>
          <button onclick="location.reload()" class="dashboard-btn" style="margin-top: 15px;">
            <i class="fa-solid fa-refresh"></i> Coba Lagi
          </button>
        </div>
      </td>
    </tr>
  `;
}

// Helper functions untuk laporan - GUNAKAN NAMA BERBEDA
function formatDateLaporan(dateString) {
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
}

function formatQuantityLaporan(qty) {
  if (!qty || qty === "-") return "0";
  const num = parseFloat(qty);
  if (isNaN(num)) return qty;
  return num.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function cleanTextLaporan(text) {
  if (text === null || text === undefined || text === "") return "-";
  return String(text);
}

// Export function untuk laporan - VERSI DIPERBAIKI
async function exportGlobalReport() {
  console.log("Starting Excel export process...");

  if (typeof XLSX === "undefined") {
    console.error("XLSX library not loaded. Attempting to load dynamically...");
    // Try to load dynamically as fallback
    try {
      await loadXLSXLibrary();
    } catch (e) {
      alert("Library XLSX gagal dimuat. Coba refresh halaman (Ctrl+Shift+R).");
      return;
    }
  }

  if (!allReportData || allReportData.length === 0) {
    alert("Tidak ada data untuk diekspor. Pastikan data sudah dimuat.");
    return;
  }

  console.log("Data for export:", allReportData);

  try {
    // Normalisasi Data
    const normalizedData = allReportData.map(normalizeLaporanItem);

    // Urutkan data berdasarkan PR No.
    const data = [...normalizedData].sort((a, b) => {
      const prA = a.pr_no || "";
      const prB = b.pr_no || "";
      return prA.localeCompare(prB);
    });

    const wb = XLSX.utils.book_new();
    const ws_data = [];

    // Header Template
    ws_data.push([]);
    ws_data.push([]);
    ws_data.push(["", "", "PT SINAR PERMATA AGRO"]);
    ws_data.push([]);
    ws_data.push([]);
    ws_data.push(["", "Laporan Purchase Request (PR)"]);
    ws_data.push([]);

    // Header Tabel
    ws_data.push([
      "",
      "No",
      "PR No.",
      "Tanggal",
      "Diminta Oleh",
      "Untuk Kebutuhan / Uraian",
      "Status",
      "Nama & Spesifikasi Barang",
      "Qty",
      "Satuan",
    ]);

    // Data Baris
    let currentPR = null;
    const DATA_START_ROW_INDEX = 8;
    let mergeStartRow = DATA_START_ROW_INDEX;
    const merges = [];

    data.forEach((item, index) => {
      const row = ["", index + 1];
      const pr_no = item.pr_no;

      // Format Qty
      const qty = parseFloat(item.qty);

      if (pr_no !== currentPR) {
        if (currentPR !== null) {
          const endRow = index + DATA_START_ROW_INDEX - 1;
          if (endRow > mergeStartRow) {
            for (let colIndex = 2; colIndex <= 6; colIndex++) {
              merges.push({
                s: { r: mergeStartRow, c: colIndex },
                e: { r: endRow, c: colIndex },
              });
            }
          }
        }
        currentPR = pr_no;
        mergeStartRow = index + DATA_START_ROW_INDEX;
        row.push(
          pr_no,
          formatDateForExcel(item.tanggal),
          item.diminta_oleh,
          item.kebutuhan,
          item.status
        );
      } else {
        row.push("", "", "", "", "");
      }

      row.push(item.nama_barang, isNaN(qty) ? item.qty : qty, item.satuan);
      ws_data.push(row);
    });

    // Handle merge untuk grup terakhir
    if (currentPR !== null) {
      const endRow = data.length + DATA_START_ROW_INDEX - 1;
      if (endRow > mergeStartRow) {
        for (let colIndex = 2; colIndex <= 6; colIndex++) {
          merges.push({
            s: { r: mergeStartRow, c: colIndex },
            e: { r: endRow, c: colIndex },
          });
        }
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data, { cellDates: true });

    // Mengatur Merge Cells
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push(...merges);
    ws["!merges"].push({ s: { r: 2, c: 2 }, e: { r: 2, c: 9 } });
    ws["!merges"].push({ s: { r: 5, c: 1 }, e: { r: 5, c: 9 } });

    // Menyesuaikan lebar kolom
    ws["!cols"] = [
      { wch: 2 },
      { wch: 5 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 35 },
      { wch: 15 },
      { wch: 45 },
      { wch: 10 },
      { wch: 10 },
    ];

    // Finalisasi dan Download
    XLSX.utils.book_append_sheet(wb, ws, "Laporan PR Detail");

    const date = new Date();
    const filename = `Laporan_Purchasing_Detail_${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}.xlsx`;

    XLSX.writeFile(wb, filename);
    console.log("Excel export completed successfully");
  } catch (exportError) {
    console.error("Error during Excel export:", exportError);
    alert("Terjadi kesalahan saat mengekspor file Excel.");
  }
}

function formatDateForExcel(dateString) {
  if (!dateString || dateString === "-") return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split("T")[0];
  } catch (e) {
    return dateString;
  }
}

// Dynamic XLSX library loader (fallback)
function loadXLSXLibrary() {
  return new Promise((resolve, reject) => {
    if (typeof XLSX !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "/js/xlsx.full.min.js";
    script.onload = () => {
      console.log("XLSX library loaded dynamically");
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Failed to load XLSX library"));
    };
    document.head.appendChild(script);
  });
}

// Ekspos fungsi ke global scope
window.exportGlobalReport = exportGlobalReport;
window.loadLaporanData = loadLaporanData;

