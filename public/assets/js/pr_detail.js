// public/js/pr_detail.js (Final dengan Perbaikan)

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const prId = params.get("id");

  if (!prId) {
    alert("ID Purchase Request tidak ditemukan!");
    window.location.href = "daftarpr.html";
    return;
  }
  loadPRDetails(prId);
});

async function loadPRDetails(id) {
  try {
    const response = await fetch(`/api/requests/${id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Gagal memuat data PR.");
    }

    // Menggunakan 'data' karena backend mengirimnya dalam format { data: {...} }
    const pr = await response.json();

    // Mengisi data header PR
    document.getElementById("detail-pr-no").textContent = pr.pr_no;
    document.getElementById("detail-tanggal").textContent = new Date(
      pr.tanggal
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    // ## PERBAIKAN NAMA PROPERTI ##
    document.getElementById("detail-requester").textContent = pr.requester_name;
    document.getElementById("detail-keperluan").textContent = pr.keperluan;

    // Mengisi status
    const statusEl = document.getElementById("detail-status");
    statusEl.textContent = pr.status;
    statusEl.className = `status ${pr.status.toLowerCase().replace(/ /g, "-")}`;

    // Tampilkan alasan penolakan jika ada
    const rejectReasonContainer = document.getElementById("detail-reject-reason-container");
    if (pr.status === "Rejected" && pr.reject_reason) {
      document.getElementById("detail-reject-reason").textContent = pr.reject_reason;
      rejectReasonContainer.classList.remove("hidden");
    } else {
      rejectReasonContainer.classList.add("hidden");
    }

    // Mengisi tabel item barang
    const tableBody = document.getElementById("detail-items-body");
    tableBody.innerHTML = "";
    if (pr.items && Array.isArray(pr.items)) {
      pr.items.forEach((item, index) => {
        const row = tableBody.insertRow();
        // ## PERBAIKAN NAMA PROPERTI ##
        row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.material}</td>
                <td>${item.qty}</td>
                <td>${item.satuan}</td>
            `;
      });
    }

    // Tampilkan konten setelah data dimuat
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } catch (error) {
    document.getElementById(
      "loading-text"
    ).textContent = `Error: ${error.message}`;
    document.getElementById("loading-text").style.color = "red";
  }
}
