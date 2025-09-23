// public/daftarpr.js (Final dengan Tombol Review)

document.addEventListener("DOMContentLoaded", () => {
  loadPurchaseRequests();
  document.getElementById("searchInput").addEventListener("keyup", filterTable);
  document.getElementById("logout-btn").addEventListener("click", logout);
});

function logout() {
  localStorage.clear();
  window.location.href = "/Login.html";
}

async function loadPurchaseRequests() {
  const tableBody = document.getElementById("requests-table-body");
  tableBody.innerHTML =
    '<tr><td colspan="5" class="loading-text">Memuat data...</td></tr>';

  try {
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
    if (!userName || !userRole) return logout();

    const response = await fetch(
      `/api/requests?userName=${encodeURIComponent(
        userName
      )}&userRole=${userRole}`
    );
    if (!response.ok) throw new Error("Gagal mengambil data dari server.");

    const requests = await response.json();
    tableBody.innerHTML = "";

    if (requests.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="loading-text">Tidak ada data PR untuk Anda saat ini.</td></tr>';
    } else {
      requests.forEach((req) => {
        let actionButtons = "";
        const canApprove =
          (req.status === "Pending KTU Approval" && userRole === "ktu") ||
          (req.status === "Pending Manager Approval" && userRole === "manager");

        // --- LOGIKA UTAMA UNTUK MENAMPILKAN TOMBOL ---
        if (canApprove) {
          // Untuk KTU & EM, tampilkan tombol Review, Approve, dan Reject
          actionButtons = `
                        <a href="/pr_detail.html?id=${req.id}" class="btn btn-sm btn-review"><i class="fa-solid fa-eye"></i> Review</a>
                        <button class="btn-sm btn-approve" onclick="approveRequest(${req.id})"><i class="fa-solid fa-check"></i> Approve</button>
                        <button class="btn-sm btn-reject" onclick="rejectRequest(${req.id})"><i class="fa-solid fa-times"></i> Reject</button>
                    `;
        } else {
          // Untuk user lain (Kerani), tampilkan tombol Cetak
          const buttonClass =
            req.status === "Fully Approved" ? "btn-sm btn-print" : "btn-sm";
          actionButtons = `<button class="${buttonClass}" onclick="printRequest(${
            req.id
          })" ${
            req.status !== "Fully Approved" ? "disabled" : ""
          }><i class="fa-solid fa-print"></i> Cetak</button>`;
        }

        const row = `
                    <tr>
                        <td><strong>${req.prNo}</strong></td>
                        <td>${req.keperluan}</td>
                        <td>${req.items.length} item</td>
                        <td><span class="status ${req.status
                          .toLowerCase()
                          .replace(/ /g, "-")}">${req.status}</span></td>
                        <td class="action-cell">${actionButtons}</td>
                    </tr>
                `;
        tableBody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error("Error:", error);
    tableBody.innerHTML = `<tr><td colspan="5" class="loading-text" style="color:red;">${error.message}</td></tr>`;
  }
}

function filterTable() {
  const filter = document.getElementById("searchInput").value.toUpperCase();
  const rows = document
    .getElementById("requests-table-body")
    .getElementsByTagName("tr");
  for (let row of rows) {
    if (row.getElementsByTagName("td").length > 1) {
      const prNoCell = row.getElementsByTagName("td")[0];
      const uraianCell = row.getElementsByTagName("td")[1];
      const textValue =
        (prNoCell.textContent || prNoCell.innerText) +
        (uraianCell.textContent || uraianCell.innerText);
      row.style.display =
        textValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
  }
}

async function approveRequest(id) {
  const userRole = localStorage.getItem("userRole");
  YYYY;
  if (!confirm(`Anda yakin ingin MENYETUJUI permintaan ini?`)) return;
  const response = await fetch(`/api/requests/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userRole: userRole }),
  });
  const result = await response.json();
  alert(result.message);
  if (result.success) loadPurchaseRequests();
}

async function rejectRequest(id) {
  if (!confirm(`Anda yakin ingin MENOLAK permintaan ini?`)) return;
  const response = await fetch(`/api/requests/${id}/reject`, {
    method: "POST",
  });
  const result = await response.json();
  alert(result.message);
  if (result.success) loadPurchaseRequests();
}

async function printRequest(id) {
  try {
    const [reqRes, approversRes] = await Promise.all([
      fetch(`/api/requests/${id}`),
      fetch("/api/master/approvers"),
    ]);
    if (!reqRes.ok) throw new Error("Data PR tidak ditemukan untuk dicetak.");

    const request = await reqRes.json();
    const approvers = await approversRes.json();

    const checkElement = (elId) => {
      const el = document.getElementById(elId);
      if (!el)
        throw new Error(`Elemen HTML dengan ID '${elId}' tidak ditemukan.`);
      return el;
    };

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

    window.print();
  } catch (error) {
    console.error("Kesalahan di fungsi printRequest:", error);
    alert(`Gagal menyiapkan data cetak: ${error.message}`);
  }
}
