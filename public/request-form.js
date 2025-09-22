// public/request-form.js

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi form saat halaman dimuat
    initializeForm();
    
    // Tambahkan event listener untuk tombol dan form
    document.getElementById('btn-add').addEventListener('click', addRow);
    document.getElementById('prForm').addEventListener('submit', submitToServer);
    document.getElementById('btn-print').addEventListener('click', prepareAndPrint);
    document.getElementById('departemen').addEventListener('change', generatePRNumber);
});

// Fungsi untuk inisialisasi awal form
function initializeForm() {
    document.getElementById('tanggal').value = new Date().toISOString().slice(0, 10);
    document.getElementById('departemen').value = 'HO';
    generatePRNumber();
    addRow(); // Tambah satu baris kosong di awal
}

// Fungsi untuk membuat nomor PR otomatis
function generatePRNumber() {
    // Nomor urut akan diambil dari localStorage agar terus berlanjut
    let sequence = parseInt(localStorage.getItem('pr_sequence_v1') || "0") + 1;
    const paddedSequence = String(sequence).padStart(3, '0');
    const dept = document.getElementById('departemen').value.toUpperCase() || 'DEPT';
    const date = new Date();
    const year = date.getFullYear();
    const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const romanMonth = romanMonths[date.getMonth()];
    document.getElementById('pr-no').value = `${paddedSequence}/PR-SPA/${dept}/${romanMonth}/${year}`;
}

// Fungsi untuk menambah baris item baru
function addRow() {
    const container = document.getElementById('items-container');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row';
    itemDiv.innerHTML = `
        <input type="text" name="material" placeholder="Nama & Spek Barang" required>
        <input type="number" name="qty" placeholder="Qty" required min="1">
        <select name="satuan">
            <option>Unit</option><option>Pcs</option><option>Box</option><option>Set</option><option>Kg</option><option>Ton</option><option>Ltr</option><option>Meter</option><option>Roll</option><option>Drum</option><option>Pack</option>
        </select>
        <button type="button" class="btn-sm btn-danger" onclick="this.parentElement.remove()">Hapus</button>
    `;
    container.appendChild(itemDiv);
}

// Fungsi untuk mengirim data form ke server
async function submitToServer(e) {
    e.preventDefault();
    const userName = localStorage.getItem('userName');
    if (!userName) {
        alert('Sesi tidak valid. Silakan login ulang.');
        return window.location.href = '/Login.html';
    }

    const items = Array.from(document.querySelectorAll('.item-row')).map(row => ({
        material: row.querySelector('[name="material"]').value,
        qty: row.querySelector('[name="qty"]').value,
        satuan: row.querySelector('[name="satuan"]').value
    })).filter(item => item.material && item.qty > 0);

    if (items.length === 0) {
        return alert('Harap isi setidaknya satu baris barang yang valid.');
    }
    
    // Simpan nomor urut HANYA JIKA pengajuan akan berhasil
    localStorage.setItem('pr_sequence_v1', parseInt(document.getElementById('pr-no').value.split('/')[0]));

    const payload = { requester: userName, items };
    const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    alert(result.message);
    if (result.success) {
        window.location.href = '/dashboard.html';
    }
}

// Fungsi untuk menyiapkan data dan membuka jendela cetak
async function prepareAndPrint() {
    // 1. Ambil data nama approver dari server
    const approversRes = await fetch('/api/master/approvers');
    const approvers = await approversRes.json();

    // 2. Ambil data dari form di layar
    document.getElementById('print-pr-no').textContent = document.getElementById('pr-no').value;
    document.getElementById('print-tanggal').textContent = new Date(document.getElementById('tanggal').value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const keperluan = document.getElementById('keperluan').value;
    document.getElementById('print-keperluan').textContent = keperluan;

    // 3. Isi nama penandatangan dari master data
    document.getElementById('print-sign-name-1').textContent = approvers['Diminta Oleh'] || '.........................';
    document.getElementById('print-sign-name-2').textContent = approvers['Diperiksa Oleh'] || '.........................';
    document.getElementById('print-sign-name-3').textContent = approvers['Disetujui Oleh'] || '.........................';

    // 4. Salin data item ke tabel cetak
    const printTableBody = document.getElementById('print-items-body');
    printTableBody.innerHTML = '';
    const rows = document.querySelectorAll('.item-row');
    rows.forEach((row, index) => {
        const material = row.querySelector('[name="material"]').value;
        const qty = row.querySelector('[name="qty"]').value;
        if (!material || !qty) return;
        
        const newPrintRow = printTableBody.insertRow();
        newPrintRow.innerHTML = `
            <td>${index + 1}</td>
            <td></td> <td>${material}</td>
            <td>${qty}</td>
            <td>${row.querySelector('[name="satuan"]').value}</td>
            <td>${(index === 0) ? keperluan : ''}</td> `;
    });
    
    // 5. Panggil fungsi print dari browser
    window.print();
}