// public/js/tagihan.js

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('daftar_tagihan.html')) {
        loadTagihan();
    } else if (window.location.pathname.includes('buat_tagihan.html')) {
        initCreatePage();
    }
});

let currentRole = '';
let currentUserId = '';

// Check Auth & Role
async function getAuth() {
    try {
        const response = await axios.get('/api/auth/me');
        currentRole = response.data.role;
        currentUserId = response.data.id;
        return response.data;
    } catch (error) {
        console.error("Auth check failed", error);
        return null;
    }
}

// Format Currency
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return '-';
    return moment(dateString).format('DD MMM YYYY');
}

// ---------------------------------------------------------
// PAGE: Daftar Tagihan
// ---------------------------------------------------------
async function loadTagihan() {
    try {
        const response = await axios.get('/api/invoices');
        const data = response.data.data;
        const tbody = document.getElementById('tagihanTableBody');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Belum ada data tagihan.</td></tr>`;
            return;
        }

        data.forEach(inv => {
            const statusBadge = getStatusBadge(inv.status);

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900">${inv.invoice_no}</div>
                    <div class="text-xs text-gray-500">${formatDate(inv.tanggal)}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${inv.vendor_nama}</div>
                    <div class="text-xs text-gray-500">${inv.po_count} PO Linked</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">${formatRupiah(inv.total)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-700">${formatDate(inv.jatuh_tempo)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${statusBadge}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="detail_tagihan.html?id=${inv.id}" class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-full">Detail</a>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error loading invoices:", error);
        // Swal.fire('Error', 'Gagal memuat data tagihan.', 'error');
    }
}

// ---------------------------------------------------------
// PAGE: Buat Tagihan
// ---------------------------------------------------------
async function initCreatePage() {
    loadVendors();

    // Vendor Change Event
    $('#vendorSelect').on('select2:select', function (e) {
        const vendorId = e.params.data.id;
        if (vendorId) loadAvailablePO(vendorId);
    });

    // Form Submit
    document.getElementById('createInvoiceForm').addEventListener('submit', handleCreateSubmit);

    // Checkbox All
    document.getElementById('selectAllPO').addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.po-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
        calculateTotal();
    });

    // PPN Checkbox
    document.getElementById('ppnCheckbox').addEventListener('change', calculateTotal);
}

async function loadVendors() {
    try {
        const res = await axios.get('/api/po/vendors'); // Use public/shared vendor list endpoint
        const vendors = res.data; // Assuming direct array or {data: []}
        const select = $('#vendorSelect');
        // Handle different response structures if needed. Assuming array based on previous files.
        const vendorList = Array.isArray(vendors) ? vendors : (vendors.data || []);

        vendorList.forEach(v => {
            const option = new Option(v.nama, v.id, false, false);
            select.append(option);
        });
    } catch (error) {
        console.error("Error loading vendors:", error);
    }
}

async function loadAvailablePO(vendorId) {
    try {
        const tbody = document.getElementById('poListTableBody');
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>`;

        const res = await axios.get('/api/invoices/available-po');
        const allPos = res.data.data;

        // Filter client side by vendor (or serve side ideally, but this works for now)
        const pos = allPos.filter(p => p.vendor_id == vendorId);

        tbody.innerHTML = '';

        if (pos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">Tidak ada PO available untuk vendor ini.</td></tr>`;
            return;
        }

        pos.forEach(po => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-3"><input type="checkbox" class="po-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500" value="${po.id}" data-amount="${po.total_amount}"></td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">${po.po_no}</td>
                <td class="px-4 py-3 text-sm text-gray-500">${po.vendor_nama}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${formatRupiah(po.total_amount)}</td>
                <td class="px-4 py-3 text-sm"><span class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">${po.status}</span></td>
            `;
            tbody.appendChild(tr);
        });

        // Add event listeners to new checkboxes
        document.querySelectorAll('.po-checkbox').forEach(cb => {
            cb.addEventListener('change', calculateTotal);
        });

    } catch (error) {
        console.error("Error loading PO:", error);
        document.getElementById('poListTableBody').innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500">Gagal memuat PO.</td></tr>`;
    }
}

function calculateTotal() {
    let subtotal = 0;
    document.querySelectorAll('.po-checkbox:checked').forEach(cb => {
        subtotal += parseFloat(cb.getAttribute('data-amount') || 0);
    });

    const usePpn = document.getElementById('ppnCheckbox').checked;
    const ppn = usePpn ? subtotal * 0.11 : 0;
    const total = subtotal + ppn;

    document.getElementById('subtotalDisplay').value = formatRupiah(subtotal);
    document.getElementById('subtotalInput').value = subtotal;

    document.getElementById('ppnDisplay').value = formatRupiah(ppn);
    document.getElementById('ppnInput').value = ppn;

    document.getElementById('totalDisplay').textContent = formatRupiah(total);
    document.getElementById('totalInput').value = total;
}

async function handleCreateSubmit(e) {
    e.preventDefault();

    const poIds = Array.from(document.querySelectorAll('.po-checkbox:checked')).map(cb => cb.value);

    if (poIds.length === 0) {
        Swal.fire('Warning', 'Pilih minimal satu PO.', 'warning');
        return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.vendor_id = $('#vendorSelect').val();
    data.po_ids = poIds;

    try {
        const res = await axios.post('/api/invoices', data);
        if (res.data.success) {
            Swal.fire('Sukses', 'Tagihan berhasil dibuat.', 'success')
                .then(() => window.location.href = 'daftar_tagihan.html');
        }
    } catch (error) {
        console.error("Error creating invoice:", error);
        Swal.fire('Error', error.response?.data?.message || 'Gagal membuat tagihan.', 'error');
    }
}

// ---------------------------------------------------------
// PAGE: Detail Tagihan
// ---------------------------------------------------------
async function loadDetailTagihan(id) {
    const user = await getAuth();
    if (!user) return;

    try {
        const res = await axios.get(`/api/invoices/${id}`);
        const inv = res.data.data;

        // Fill Basic Info
        document.getElementById('invNo').textContent = inv.invoice_no;
        document.getElementById('invDate').textContent = formatDate(inv.tanggal);
        document.getElementById('vendorName').textContent = inv.vendor_nama;
        // document.getElementById('vendorPhone').textContent = inv.vendor_hp || '-';
        // document.getElementById('vendorAddress').textContent = inv.vendor_alamat || '-';

        document.getElementById('invPeriode').textContent = inv.periode;
        document.getElementById('invDueDate').textContent = formatDate(inv.jatuh_tempo);
        document.getElementById('invBank').textContent = inv.nama_bank;
        document.getElementById('invRek').textContent = inv.no_rekening;
        document.getElementById('invRekName').textContent = inv.nama_rekening;

        document.getElementById('valSubtotal').textContent = formatRupiah(inv.subtotal);
        document.getElementById('valPpn').textContent = formatRupiah(inv.ppn);
        document.getElementById('valTotal').textContent = formatRupiah(inv.total);

        document.getElementById('creatorName').textContent = inv.purchaser_name;
        document.getElementById('noteText').textContent = inv.keterangan_pembayaran || '-';

        // Render Status Badge
        document.getElementById('statusBadges').innerHTML = getStatusBadge(inv.status);

        // Render Approval Steps
        renderApprovalSteps(inv);

        // Render Linked POs
        const poList = document.getElementById('poList');
        poList.innerHTML = '';
        if (inv.pos && inv.pos.length > 0) {
            inv.pos.forEach(po => {
                poList.innerHTML += `
                    <li class="p-3 flex justify-between items-center">
                        <div>
                            <p class="text-sm font-bold text-gray-900">${po.po_no}</p>
                            <p class="text-xs text-gray-500">${po.keperluan || ''}</p>
                        </div>
                        <span class="text-sm font-semibold">${formatRupiah(po.total_amount)}</span>
                    </li>
                `;
            });
        } else {
            poList.innerHTML = `<li class="p-3 text-sm text-gray-500 text-center">Tidak ada PO linked.</li>`;
        }

        // Render Action Buttons
        renderActionButtons(inv, user);

    } catch (error) {
        console.error("Error detail:", error);
        Swal.fire('Error', 'Gagal memuat detail tagihan.', 'error');
    }
}

function renderApprovalSteps(inv) {
    // Step 1: Manager HO
    const step1Icon = document.getElementById('step1Icon');
    if (inv.manager_ho_name) {
        step1Icon.className = "w-8 h-8 rounded-full flex items-center justify-center text-white bg-green-500";
        step1Icon.innerHTML = `<i class="fas fa-check"></i>`;
        document.getElementById('step1Name').textContent = `Approved by ${inv.manager_ho_name}`;
        document.getElementById('step1Date').textContent = formatDate(inv.approval_manager_ho_date);
    } else if (inv.status === 'Rejected' && inv.rejection_reason && !inv.direktur_name) {
        // Rejected by Mgr HO (assuming simple logic)
        step1Icon.className = "w-8 h-8 rounded-full flex items-center justify-center text-white bg-red-500";
        step1Icon.innerHTML = `<i class="fas fa-times"></i>`;
        document.getElementById('step1Name').textContent = "Rejected";
    } else {
        step1Icon.className = "w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-200";
        step1Icon.innerHTML = `<i class="fas fa-clock"></i>`;
    }

    // Step 2: Direktur
    const step2Icon = document.getElementById('step2Icon');
    if (inv.direktur_name) {
        step2Icon.className = "w-8 h-8 rounded-full flex items-center justify-center text-white bg-green-500";
        step2Icon.innerHTML = `<i class="fas fa-check"></i>`;
        document.getElementById('step2Name').textContent = `Approved by ${inv.direktur_name}`;
        document.getElementById('step2Date').textContent = formatDate(inv.approval_direktur_date);
    } else if (inv.status === 'Rejected' && inv.manager_ho_name) {
        // Rejected by Direktur
        step2Icon.className = "w-8 h-8 rounded-full flex items-center justify-center text-white bg-red-500";
        step2Icon.innerHTML = `<i class="fas fa-times"></i>`;
        document.getElementById('step2Name').textContent = "Rejected";
    } else {
        step2Icon.className = "w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-200";
        step2Icon.innerHTML = `<i class="fas fa-clock"></i>`;
    }

    // Reject Reason
    if (inv.status === 'Rejected') {
        document.getElementById('rejectNote').classList.remove('hidden');
        document.getElementById('rejectReasonText').textContent = inv.rejection_reason || '-';
    }
}

function renderActionButtons(inv, user) {
    const container = document.getElementById('actionButtons');
    container.innerHTML = '';

    // DELETE button (Admin or Purchaser if Pending) - Simple logic
    if (user.role === 'admin' || (inv.status.includes('Pending') && inv.purchaser_id === user.id)) {
        const delBtn = document.createElement('button');
        delBtn.innerHTML = `<i class="fas fa-trash"></i> Hapus`;
        delBtn.className = "px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium";
        delBtn.onclick = () => deleteTagihan(inv.id);
        container.appendChild(delBtn);
    }

    // APPROVE/REJECT buttons
    if (user.role === 'admin' || user.role === 'manager_ho') {
        if (inv.status === 'Pending Manager HO') {
            container.appendChild(createApproveBtn(inv.id, 'approve-manager-ho', 'Approve (Mgr HO)'));
            container.appendChild(createRejectBtn(inv.id));
        }
    }

    if (user.role === 'admin' || user.role === 'direktur') {
        if (inv.status === 'Pending Direktur') {
            container.appendChild(createApproveBtn(inv.id, 'approve-direktur', 'Approve (Direktur)'));
            container.appendChild(createRejectBtn(inv.id));
        }
    }
}

function createApproveBtn(id, endpoint, label) {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="fas fa-check"></i> ${label}`;
    btn.className = "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm";
    btn.onclick = () => processApproval(id, endpoint);
    return btn;
}

function createRejectBtn(id) {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="fas fa-times"></i> Reject`;
    btn.className = "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm";
    btn.onclick = () => rejectTagihan(id);
    return btn;
}

async function deleteTagihan(id) {
    const res = await Swal.fire({
        title: 'Hapus Tagihan?',
        text: "Data tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
    });

    if (res.isConfirmed) {
        try {
            await axios.delete(`/api/invoices/${id}`);
            Swal.fire('Deleted!', 'Tagihan dihapus.', 'success').then(() => window.location = 'daftar_tagihan.html');
        } catch (error) {
            Swal.fire('Error', 'Gagal menghapus.', 'error');
        }
    }
}

async function processApproval(id, action) {
    const res = await Swal.fire({
        title: 'Konfirmasi Approve?',
        text: "Anda akan menyetujui tagihan ini.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Ya, Approve'
    });

    if (res.isConfirmed) {
        try {
            await axios.put(`/api/invoices/${id}/${action}`);
            Swal.fire('Approved!', 'Tagihan berhasil diapprove.', 'success').then(() => location.reload());
        } catch (error) {
            Swal.fire('Error', 'Gagal approve.', 'error');
        }
    }
}

async function rejectTagihan(id) {
    const { value: reason } = await Swal.fire({
        title: 'Tolak Tagihan',
        input: 'textarea',
        inputLabel: 'Alasan Penolakan',
        inputPlaceholder: 'Tulis alasan...',
        inputAttributes: { 'aria-label': 'Tulis alasan penolakan' },
        showCancelButton: true
    });

    if (reason) {
        try {
            await axios.put(`/api/invoices/${id}/reject`, { reason });
            Swal.fire('Rejected', 'Tagihan ditolak.', 'success').then(() => location.reload());
        } catch (error) {
            Swal.fire('Error', 'Gagal reject.', 'error');
        }
    }
}

function getStatusBadge(status) {
    let colorClass, text;
    switch (status) {
        case 'Pending Manager HO': colorClass = 'bg-yellow-100 text-yellow-800'; text = 'Pending Mgr HO'; break;
        case 'Pending Direktur': colorClass = 'bg-orange-100 text-orange-800'; text = 'Pending Direktur'; break;
        case 'Approved': colorClass = 'bg-green-100 text-green-800'; text = 'Approved / Paid'; break;
        case 'Rejected': colorClass = 'bg-red-100 text-red-800'; text = 'Rejected'; break;
        default: colorClass = 'bg-gray-100 text-gray-800'; text = status;
    }
    return `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}">${text}</span>`;
}
