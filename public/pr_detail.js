// public/pr_detail.js
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
    const response = await fetch(`/api/requests/${id}`);
    if (!response.ok) throw new Error("Gagal memuat data PR.");

    const pr = await response.json();

    document.getElementById("detail-pr-no").textContent = pr.prNo;
    document.getElementById("detail-tanggal").textContent = new Date(
      pr.tanggal
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    document.getElementById("detail-requester").textContent = pr.requestedBy;
    const statusEl = document.getElementById("detail-status");
    statusEl.textContent = pr.status;
    statusEl.className = `status ${pr.status.toLowerCase().replace(/ /g, "-")}`;
    document.getElementById("detail-keperluan").textContent = pr.keperluan;

    const tableBody = document.getElementById("detail-items-body");
    tableBody.innerHTML = "";
    pr.items.forEach((item, index) => {
      const row = `<tr><td>${index + 1}</td><td>${item.material}</td><td>${
        item.qty
      }</td><td>${item.satuan}</td></tr>`;
      tableBody.innerHTML += row;
    });

    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("main-content").classList.remove("hidden");
  } catch (error) {
    document.getElementById("loading-text").textContent = error.message;
  }
}
