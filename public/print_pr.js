// public/print_pr.js

/**
 * Mengambil data detail PR, mengisi template cetak, dan memanggil fungsi print.
 * @param {string} id - ID dari Purchase Request yang akan dicetak.
 */
async function printRequest(id) {
  // Tampilkan overlay loading saat proses cetak dimulai
  showPrintLoading();

  try {
    const [reqRes, approversRes] = await Promise.all([
      fetch(`/api/requests/${id}`),
      fetch("/api/master/approvers"),
    ]);
    if (!reqRes.ok) throw new Error("Data PR tidak ditemukan untuk dicetak.");

    const request = await reqRes.json();
    const approvers = await approversRes.json();

    // Fungsi helper untuk memastikan elemen ada
    const checkElement = (elId) => {
      const el = document.getElementById(elId);
      if (!el) throw new Error(`Elemen HTML '${elId}' tidak ditemukan.`);
      return el;
    };

    // Mengisi data utama ke elemen cetak
    checkElement("print-pr-no").textContent = request.prNo;
    checkElement("print-tanggal").textContent = new Date(
      request.tanggal
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    checkElement("print-keperluan").textContent = request.keperluan;
    checkElement("print-name-1").textContent = approvers["Diminta Oleh"] || " ";
    checkElement("print-name-2").textContent =
      approvers["Diperiksa Oleh"] || " ";
    checkElement("print-name-3").textContent =
      approvers["Disetujui Oleh"] || " ";

    // Mengisi stempel dan tanggal approval
    const stampKTU = checkElement("stamp-ktu");
    if (request.approvals && request.approvals.ktu) {
      const date = new Date(request.approvals.ktu);
      const formattedDate =
        date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
      stampKTU.style.opacity = 1;
      stampKTU.innerHTML = `<div class="stamp">APPROVED</div><div class="approval-date">${formattedDate}</div>`;
    } else {
      stampKTU.innerHTML = "";
      stampKTU.style.opacity = 0;
    }

    const stampManager = checkElement("stamp-manager");
    if (request.approvals && request.approvals.manager) {
      const date = new Date(request.approvals.manager);
      const formattedDate =
        date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
      stampManager.style.opacity = 1;
      stampManager.innerHTML = `<div class="stamp">APPROVED</div><div class="approval-date">${formattedDate}</div>`;
    } else {
      stampManager.innerHTML = "";
      stampManager.style.opacity = 0;
    }

    // Mengisi tabel item
    const printTableBody = checkElement("print-items-body");
    printTableBody.innerHTML = "";
    request.items.forEach((item, index) => {
      const newRow = printTableBody.insertRow();
      newRow.innerHTML = `<td>${index + 1}</td><td></td><td>${
        item.material
      }</td><td>${item.qty}</td><td>${item.satuan}</td><td>${
        index === 0 ? request.keperluan : ""
      }</td>`;
    });

    // Tunggu sebentar agar data ter-render, lalu panggil print
    setTimeout(() => {
      hidePrintLoading();
      window.print();
    }, 250);
  } catch (error) {
    console.error("Kesalahan di fungsi printRequest:", error);
    alert(`Gagal menyiapkan data cetak: ${error.message}`);
    hidePrintLoading();
  }
}

// Fungsi untuk menampilkan dan menyembunyikan overlay loading
function showPrintLoading() {
  let overlay = document.getElementById("print-loading-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "print-loading-overlay";
    overlay.innerHTML =
      '<div class="print-loading-spinner"></div><p>Menyiapkan dokumen...</p>';
    document.body.appendChild(overlay);
  }
  overlay.style.display = "flex";
}

function hidePrintLoading() {
  const overlay = document.getElementById("print-loading-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}
