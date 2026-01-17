// public/request-form.js (Versi Perbaikan Final)

document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  document.getElementById("btn-add").addEventListener("click", addRow);
  document.getElementById("prForm").addEventListener("submit", submitToServer);
});

// Fungsi untuk inisialisasi awal form
function initializeForm() {
  document.getElementById("tanggal").value = new Date()
    .toISOString()
    .slice(0, 10);
  // Nomor PR sekarang dibuat oleh server, jadi kita hanya tampilkan placeholder
  document.getElementById("pr-no").value = "(Akan dibuat otomatis oleh server)";
  document.getElementById("pr-no").disabled = true; // Nonaktifkan field agar tidak bisa diubah
  addRow(); // Tambah satu baris kosong di awal
}

// Fungsi untuk menambah baris item baru
function addRow() {
  const container = document.getElementById("items-container");
  const itemDiv = document.createElement("div");
  itemDiv.className = "item-row";
  itemDiv.innerHTML = `
        <input type="text" name="material" placeholder="Nama & Spek Barang" required>
        <input type="number" name="qty" placeholder="Qty" required min="1">
        <select name="satuan">
            <option>Unit</option><option>Pcs</option><option>Box</option><option>Set</option><option>Kg</option><option>Ton</option><option>Liter (Ltr)</option><option>Meter</option><option>Roll</option><option>Drum</option><option>Pack</option>
        </select>
        <button type="button" class="btn-sm btn-danger" onclick="this.parentElement.remove()">Hapus</button>
    `;
  container.appendChild(itemDiv);
}

// Fungsi untuk mengirim data form ke server
async function submitToServer(e) {
  e.preventDefault();

  // Ambil semua data yang dibutuhkan dari form
  const tanggal = document.getElementById("tanggal").value;
  const keperluan = document.getElementById("keperluan").value;
  const company = document.getElementById("departemen").value; // Asumsi departemen adalah ID perusahaan

  const items = Array.from(document.querySelectorAll(".item-row"))
    .map((row) => ({
      material: row.querySelector('[name="material"]').value,
      qty: parseInt(row.querySelector('[name="qty"]').value, 10), // Pastikan qty adalah angka
      satuan: row.querySelector('[name="satuan"]').value,
    }))
    .filter((item) => item.material && item.qty > 0);

  if (items.length === 0) {
    return alert("Harap isi setidaknya satu baris barang yang valid.");
  }

  // DIUBAH: Buat payload lengkap sesuai kebutuhan backend
  const payload = {
    tanggal,
    keperluan,
    items,
    company,
  };

  try {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    alert(result.message);
    if (result.success) {
      window.location.href = "/daftarpr.html"; // Arahkan ke daftar PR setelah berhasil
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert("Terjadi kesalahan saat mengirim data ke server.");
  }
}
