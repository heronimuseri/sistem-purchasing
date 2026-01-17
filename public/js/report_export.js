// public/js/report_export.js

/**
 * FUNGSI EXPORT EXCEL GLOBAL (Final dengan Sorting, Normalisasi, dan Formatting)
 * Fungsi ini mengakses window.allReportData yang disediakan oleh daftarpr_main.js
 */
window.exportGlobalReport = async function () {
  if (typeof XLSX === "undefined") {
    alert(
      "Library XLSX tidak dimuat. Pastikan Anda terhubung ke internet atau library sudah di-cache."
    );
    return;
  }

  // Mengambil data mentah yang disimpan oleh daftarpr_main.js
  const rawData = window.allReportData;

  if (!rawData || rawData.length === 0) {
    alert("Tidak ada data untuk diekspor atau data masih dimuat.");
    return;
  }

  // 1. Normalisasi Data (Fungsi normalizeReportItem harus sudah didefinisikan di daftarpr_main.js)
  if (typeof window.normalizeReportItem !== "function") {
    alert(
      "Fungsi normalisasi data (normalizeReportItem) tidak ditemukan. Pastikan daftarpr_main.js dimuat sebelum report_export.js."
    );
    return;
  }
  const normalizedData = rawData.map(window.normalizeReportItem);

  // 2. KRUSIAL: Urutkan data berdasarkan PR No. untuk memastikan merge yang benar.
  const data = [...normalizedData].sort((a, b) => {
    const prA = a.pr_no || "";
    const prB = b.pr_no || "";
    if (prA < prB) return -1;
    if (prA > prB) return 1;
    return 0;
  });

  const wb = XLSX.utils.book_new();
  const ws_data = [];

  // Helper untuk format tanggal agar sesuai untuk Excel (Format YYYY-MM-DD)
  const formatDateForExcel = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toISOString().split("T")[0];
    } catch (e) {
      return dateString;
    }
  };

  // --- Pembuatan Header Template ---
  ws_data.push([]); // Row 1 Kosong
  ws_data.push([]); // Row 2 Kosong
  ws_data.push(["", "", "PT SINAR PERMATA"]); // Row 3 (Mulai Kolom C)
  ws_data.push([]); // Row 4 Kosong
  ws_data.push([]); // Row 5 Kosong
  ws_data.push(["", "Laporan Purchase Request (PR)"]); // Row 6 (Mulai Kolom B)
  ws_data.push([]); // Row 7 Kosong

  // 3. Menambahkan Header Tabel (Row 8, Index 7)
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

  // 4. Menambahkan Data Baris dan Logika Merge
  let currentPR = null;
  const DATA_START_ROW_INDEX = 8; // Data mulai di baris 9 (index 8)
  let mergeStartRow = DATA_START_ROW_INDEX;
  const merges = [];

  data.forEach((item, index) => {
    const row = ["", index + 1];

    const pr_no = item.pr_no;
    const qty = parseFloat(item.qty);

    // Cek apakah item ini milik PR yang sama dengan sebelumnya (Untuk Merge)
    if (pr_no !== currentPR) {
      // Jika grup PR sebelumnya selesai, tambahkan merge cell
      if (currentPR !== null) {
        const endRow = index + DATA_START_ROW_INDEX - 1;
        if (endRow > mergeStartRow) {
          // Loop untuk kolom C (Index 2) sampai G (Index 6)
          for (let colIndex = 2; colIndex <= 6; colIndex++) {
            merges.push({
              s: { r: mergeStartRow, c: colIndex },
              e: { r: endRow, c: colIndex },
            });
          }
        }
      }
      // Mulai grup PR baru
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
      // PR sama, biarkan sel kosong agar nanti di-merge
      row.push("", "", "", "", "");
    }

    // Tambahkan detail item
    row.push(item.nama_barang, isNaN(qty) ? item.qty : qty, item.satuan);
    ws_data.push(row);
  });

  // 5. Handle merge untuk grup terakhir
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

  // 6. Mengatur Merge Cells Header
  ws["!merges"] = merges;
  ws["!merges"].push({ s: { r: 2, c: 2 }, e: { r: 2, c: 9 } }); // Merge Header Perusahaan
  ws["!merges"].push({ s: { r: 5, c: 1 }, e: { r: 5, c: 9 } }); // Merge Judul Laporan

  // 7. Menyesuaikan lebar kolom
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

  // 8. Finalisasi dan Download
  XLSX.utils.book_append_sheet(wb, ws, "Laporan PR Detail");

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const filename = `Laporan_Purchasing_Detail_${year}-${month}-${day}.xlsx`;
  XLSX.writeFile(wb, filename, { bookType: "xlsx", type: "binary" });
};
