// public/js/pr.js (Final dengan Event Delegation dan PR.No Format)

document.addEventListener("DOMContentLoaded", () => {
  initializeForm();
  document.getElementById("btn-add").addEventListener("click", addRow);
  document.getElementById("prForm").addEventListener("submit", submitToServer);

  // =================================================
  // PERBAIKAN: Event Delegation untuk tombol hapus
  // =================================================
  document
    .getElementById("items-container")
    .addEventListener("click", function (e) {
      if (
        e.target &&
        (e.target.classList.contains("btn-remove") ||
          e.target.closest(".btn-remove"))
      ) {
        const removeBtn = e.target.classList.contains("btn-remove")
          ? e.target
          : e.target.closest(".btn-remove");
        removeBtn.closest(".item-row").remove();
        updateRowNumbers(); // Update nomor urut setelah hapus
      }
    });
});

function initializeForm() {
  document.getElementById("tanggal").value = new Date()
    .toISOString()
    .slice(0, 10);

  // Generate preview PR.No berdasarkan format
  generatePRNoPreview();

  // Event listener untuk update PR.No ketika tanggal atau departemen berubah
  document
    .getElementById("tanggal")
    .addEventListener("change", generatePRNoPreview);
  document
    .getElementById("departemen")
    .addEventListener("change", generatePRNoPreview);

  addRow(); // Tambah satu baris kosong di awal
}

/**
 * Generate preview PR.No berdasarkan format yang sama dengan server
 */
function generatePRNoPreview() {
  const tanggal = document.getElementById("tanggal").value;
  const departemen = document.getElementById("departemen").value;

  if (!tanggal || !departemen) return;

  try {
    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Format bulan Romawi (sama seperti di server)
    const romanMonths = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];

    // Untuk preview, kita gunakan "XXX" sebagai sequence placeholder
    const sequence = "XXX";
    const prNoPreview = `${sequence}/PR-SPA/${departemen}/${romanMonths[month]}/${year}`;

    document.getElementById("pr-no").value = prNoPreview;
    document.getElementById("pr-no").title =
      "Preview - Nomor akhir akan ditentukan oleh server";
  } catch (error) {
    console.error("Error generating PR.No preview:", error);
    document.getElementById("pr-no").value = "Error generating preview";
  }
}

function addRow() {
  const container = document.getElementById("items-container");
  const rowCount = container.children.length;

  const itemDiv = document.createElement("div");
  itemDiv.className = "item-row";
  itemDiv.innerHTML = `
    <div class="row-number">${rowCount + 1}</div>
    <input type="text" name="material" placeholder="Nama & Spesifikasi Barang" required>
    <input type="number" name="qty" placeholder="Qty" required min="0.01" step="0.01">
    <select name="satuan">
      <optgroup label="Jumlah">
        <option value="Pcs" selected>Pcs</option>
        <option value="Buah">Buah</option>
        <option value="Unit">Unit</option>
        <option value="Set">Set</option>
      </optgroup>
      <optgroup label="Berat">
        <option value="Kilogram (Kg)">Kilogram (Kg)</option>
        <option value="Gram">Gram</option>
        <option value="Ton">Ton</option>
      </optgroup>
      <optgroup label="Volume">
        <option value="Liter (Ltr)">Liter (Ltr)</option>
        <option value="Drum">Drum</option>
        <option value="Meter Kubik (m³)">Meter Kubik (m³)</option>
      </optgroup>
      <optgroup label="Wadah & Kemasan">
        <option value="Batang">Batang</option>
        <option value="Box">Box</option>
        <option value="Roll">Roll</option>
        <option value="Sak">Sak</option>
        <option value="Karton">Karton</option>
      </optgroup>
      <optgroup label="Lainnya">
        <option value="Paket">Paket</option>
        <option value="Lembar">Lembar</option>
        <option value="Pasang">Pasang</option>
      </optgroup>
    </select>
    <button type="button" class="btn-sm btn-danger btn-remove" title="Hapus baris ini">
      <i class="fa-solid fa-trash"></i> Hapus
    </button>
  `;
  container.appendChild(itemDiv);
}

/**
 * Update nomor urut baris setelah penambahan atau penghapusan
 */
function updateRowNumbers() {
  const container = document.getElementById("items-container");
  const rows = container.getElementsByClassName("item-row");

  Array.from(rows).forEach((row, index) => {
    const rowNumber = row.querySelector(".row-number");
    if (rowNumber) {
      rowNumber.textContent = index + 1;
    }
  });
}

async function submitToServer(e) {
  e.preventDefault();

  // Validasi form
  const tanggal = document.getElementById("tanggal").value;
  const keperluan = document.getElementById("keperluan").value;
  const departemen = document.getElementById("departemen").value;

  if (!tanggal || !keperluan || !departemen) {
    alert("Harap lengkapi semua field yang wajib diisi.");
    return;
  }

  const items = Array.from(document.querySelectorAll(".item-row"))
    .map((row) => ({
      material: row.querySelector('[name="material"]').value,
      qty: parseFloat(row.querySelector('[name="qty"]').value),
      satuan: row.querySelector('[name="satuan"]').value,
    }))
    .filter((item) => item.material && item.qty > 0);

  if (items.length === 0) {
    alert("Harap isi setidaknya satu baris barang yang valid.");
    return;
  }

  const payload = {
    tanggal: tanggal,
    keperluan: keperluan,
    departemen: departemen,
    items: items,
  };

  console.log("Submitting PR data:", payload);

  // Tampilkan loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
  submitBtn.disabled = true;

  try {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert(
        `✅ ${result.message}\n\nPR berhasil dibuat dan sedang menunggu persetujuan.`
      );
      window.location.href = "/daftarpr.html";
    } else {
      alert(`❌ ${result.message || "Terjadi kesalahan saat mengirim data."}`);
    }
  } catch (error) {
    console.error("Submit error:", error);
    alert(
      "❌ Terjadi kesalahan jaringan saat mengirim data ke server. Periksa koneksi internet Anda."
    );
  } finally {
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}
