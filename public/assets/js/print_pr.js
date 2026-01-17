// public/js/print_pr.js (Versi Perbaikan Logo)

(function () {
  "use strict";

  // =================================================
  // FUNGSI HELPER
  // =================================================

  /**
   * Mengatur teks pada elemen HTML dengan aman.
   */
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "-";
  };

  /**
   * Memformat tanggal dan waktu ke format lokal Indonesia (WIB).
   */
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return (
        date.toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    } catch (e) {
      console.error("Error formatting datetime:", e);
      return isoString;
    }
  };

  /**
   * Memformat tanggal ke format tanggal panjang Indonesia.
   */
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return isoString;
    }
  };

  /**
   * FUNGSI BARU: Menunggu semua gambar dalam container tertentu selesai dimuat.
   * Ini penting agar logo muncul saat mencetak.
   */
  const waitForImagesToLoad = (container) => {
    if (!container) return Promise.resolve();
    const images = container.querySelectorAll("img");
    if (images.length === 0) {
      return Promise.resolve();
    }

    const promises = [];

    images.forEach((img) => {
      // Jika gambar belum selesai dimuat (misalnya belum di-cache)
      if (!img.complete) {
        promises.push(
          new Promise((resolve) => {
            // Tunggu event 'load' atau 'error'
            img.addEventListener("load", resolve);
            img.addEventListener("error", (e) => {
              console.warn("Gagal memuat gambar saat cetak:", img.src, e);
              resolve(); // Tetap lanjutkan pencetakan meskipun gambar gagal dimuat
            });
          })
        );
      }
    });

    return Promise.all(promises);
  };

  // =================================================
  // FUNGSI POPULASI TEMPLATE
  // =================================================

  /**
   * Mengisi area tanda tangan berdasarkan status approval.
   */
  const populateSignatures = (pr) => {
    const sigCell1 = document.getElementById("signature-cell-1");
    const sigCell2 = document.getElementById("signature-cell-2");
    const sigCell3 = document.getElementById("signature-cell-3");

    // 1. Requester (Kerani)
    if (sigCell1) {
      sigCell1.innerHTML = `
            <div class="signature-space"><div class="stamp requested">REQUESTED</div></div>
            <div class="signature-date">${formatDateTime(pr.tanggal)}</div>
            <div class="signature-name">(<u>&nbsp; ${
              pr.requester_name || "..."
            } &nbsp;</u>)</div>
            <div class="signature-role"><b>Kerani</b></div>
        `;
    }

    // 2. KTU (Checker)
    if (sigCell2) {
      sigCell2.innerHTML = pr.ktu_name
        ? `
            <div class="signature-space"><div class="stamp checked">CHECKED</div></div>
            <div class="signature-date">${formatDateTime(
              pr.approval_ktu_date
            )}</div>
            <div class="signature-name">(<u>&nbsp; ${
              pr.ktu_name
            } &nbsp;</u>)</div>
            <div class="signature-role"><b>Kepala Tata Usaha</b></div>
        `
        : '<div class="signature-space"></div>';
    }

    // 3. Manager (Approver)
    if (sigCell3) {
      sigCell3.innerHTML = pr.manager_name
        ? `
            <div class="signature-space"><div class="stamp approved">APPROVED</div></div>
            <div class="signature-date">${formatDateTime(
              pr.approval_manager_date
            )}</div>
            <div class="signature-name">(<u>&nbsp; ${
              pr.manager_name
            } &nbsp;</u>)</div>
            <div class="signature-role"><b>Estate Manager</b></div>
        `
        : '<div class="signature-space"></div>';
    }
  };

  /**
   * Fungsi utama untuk mengisi template cetak dengan data PR.
   */
  const populatePrintTemplate = (pr) => {
    setText("print-pr-no", pr.pr_no);
    setText("print-tanggal", formatDate(pr.tanggal));
    setText("print-keperluan", pr.keperluan);

    const itemsBody = document.getElementById("print-items-body");
    if (!itemsBody) return;

    itemsBody.innerHTML = "";

    // Validasi Awal Array
    if (!Array.isArray(pr.items) || pr.items.length === 0) {
      const row = itemsBody.insertRow();
      row.innerHTML = `<td colspan="5" style="text-align: center;">-- Tidak ada item dalam permintaan ini --</td>`;
      populateSignatures(pr);
      return;
    }

    // Filter data (menggunakan 'material' dan 'qty')
    const validItems = pr.items.filter((item) => {
      let nama = item.material;
      let jumlahRaw = item.qty;
      const jumlah = parseFloat(jumlahRaw);

      // Kriteria validasi: Nama ada DAN Jumlah > 0
      const isValid =
        nama && nama.trim() !== "" && !isNaN(jumlah) && jumlah > 0;

      if (!isValid) {
        console.warn(`Item diabaikan karena tidak valid:`, item);
      }
      return isValid;
    });

    if (validItems.length > 0) {
      validItems.forEach((item, index) => {
        const row = itemsBody.insertRow();
        row.innerHTML = `
                <td style="text-align: center;">${index + 1}</td>
                <td>${item.kode || ""}</td>
                <td>${item.material}</td>
                <td style="text-align: center;">${item.qty}</td>
                <td>${item.satuan || "Unit"}</td>
            `;
      });
    } else {
      const row = itemsBody.insertRow();
      row.innerHTML = `
          <td colspan="5" style="text-align: center; font-style: italic; color: #888;">
              -- Tidak ada detail barang yang valid (Kriteria: Jumlah > 0) --
          </td>
      `;
    }

    populateSignatures(pr);
  };

  // =================================================
  // FUNGSI PRINT REQUEST (DIMODIFIKASI)
  // =================================================

  /**
   * Mengambil data PR, menyiapkan tampilan, dan memicu dialog cetak.
   */
  async function printRequest(id) {
    // 1. Feedback visual pada tombol
    const printButton = document.querySelector(`.btn-print[data-id="${id}"]`);
    const originalButtonContent = printButton ? printButton.innerHTML : "";
    if (printButton) {
      printButton.disabled = true;
      // Berikan feedback yang lebih jelas
      printButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mempersiapkan...`;
    }

    // Temukan elemen yang relevan
    const screenOnlyAreas = document.querySelectorAll(".screen-only");
    const printArea = document.querySelector(".print-only"); // Dapatkan area cetak

    // 2. Fungsi Cleanup (dipanggil setelah cetak selesai atau gagal)
    const cleanup = () => {
      // Kembalikan visibilitas semua elemen layar
      screenOnlyAreas.forEach((area) => {
        area.style.display = ""; // Kembalikan ke gaya default CSS
      });

      // PERBAIKAN: Kembalikan area cetak ke kondisi semula (reset inline styles)
      if (printArea) {
        printArea.style.display = "";
        printArea.style.visibility = "";
        printArea.style.position = "";
        printArea.style.top = "";
        printArea.style.left = "";
      }

      if (printButton) {
        printButton.disabled = false;
        printButton.innerHTML = originalButtonContent;
      }
      // Hapus listener agar tidak menumpuk
      window.removeEventListener("afterprint", cleanup);
    };

    // Listener untuk mendeteksi saat dialog cetak ditutup
    window.addEventListener("afterprint", cleanup);

    // 3. Proses Pengambilan Data dan Pencetakan
    try {
      // Ambil data PR (dengan cache-busting)
      const response = await fetch(
        `/api/requests/${id}?t=${new Date().getTime()}`
      );
      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => "Tidak ada detail error.");
        throw new Error(
          `Gagal mengambil data: ${response.statusText} - ${errorText}`
        );
      }

      const prData = await response.json();

      // Isi Template
      populatePrintTemplate(prData);

      // --- PERBAIKAN PEMUATAN LOGO START ---

      if (printArea) {
        // A. Ubah display: none menjadi block agar browser mulai memuat gambar.
        printArea.style.display = "block";

        // B. Sembunyikan dari pandangan user dan keluarkan dari flow agar tidak mengganggu layout.
        printArea.style.visibility = "hidden";
        printArea.style.position = "absolute";
        printArea.style.top = "-10000px"; // Pindahkan jauh keluar layar
        printArea.style.left = "-10000px";

        // C. Tunggu hingga gambar di area cetak selesai dimuat
        await waitForImagesToLoad(printArea);

        // D. Siapkan untuk pencetakan: Kembalikan visibilitas dan posisi
        printArea.style.visibility = "visible";
        printArea.style.position = "static";
        // display: block tetap dipertahankan untuk pencetakan
      }

      // --- PERBAIKAN PEMUATAN LOGO END ---

      // Sembunyikan area layar
      screenOnlyAreas.forEach((area) => {
        area.style.display = "none";
      });

      // Tampilkan dialog cetak
      // setTimeout(() => window.print(), 100); // Dihapus, tidak diperlukan lagi
      window.print();
    } catch (error) {
      console.error("Gagal mencetak PR:", error);
      alert(`Tidak dapat mencetak: ${error.message}.`);
      cleanup(); // Panggil cleanup jika terjadi error sebelum cetak
    }
  }

  // Ekspos fungsi agar bisa dipanggil dari file JS lain
  window.printRequest = printRequest;
})();
