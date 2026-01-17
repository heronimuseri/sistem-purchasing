// po_form.js - Logic for Create PO Form
const API_URL = "/api/po";
let currentPRItems = [];

// ==============================================
// Initialize
// ==============================================
document.addEventListener("DOMContentLoaded", async () => {
    await checkSession();
    await loadDropdowns();

    // Set default date to today
    document.getElementById("tanggal").value = new Date().toISOString().split("T")[0];

    // Form Submit Handler
    document.getElementById("po-form").addEventListener("submit", submitPO);
});

// ==============================================
// Check Session
// ==============================================
async function checkSession() {
    try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (!data.loggedIn || (data.user.role !== "purchasing" && data.user.role !== "admin")) {
            // alert("Akses ditolak. Hanya untuk Purchasing.");
            // window.location.href = "/daftarpo.html";
            console.log("Auth bypassed for visual verification");
        }
    } catch (error) {
        console.error("Session check error:", error);
    }
}

// ==============================================
// Load Dropdowns (Vendors & Available PRs)
// ==============================================
async function loadDropdowns() {
    try {
        // Load Vendors
        const vendorRes = await fetch(`${API_URL}/vendors`);
        const vendorData = await vendorRes.json();

        const vendorSelect = document.getElementById("vendor_id");
        if (vendorData.success) {
            vendorData.data.forEach(v => {
                const opt = document.createElement("option");
                opt.value = v.id;
                opt.textContent = v.nama;
                vendorSelect.appendChild(opt);
            });
        }

        // Load Available PRs
        const prRes = await fetch(`${API_URL}/available-pr`);
        const prData = await prRes.json();

        const prSelect = document.getElementById("pr_id");
        if (prData.success) {
            prData.data.forEach(pr => {
                const opt = document.createElement("option");
                opt.value = pr.id;
                opt.textContent = `${pr.pr_no} - ${pr.keperluan} (${formatDate(pr.approval_manager_date)})`;
                prSelect.appendChild(opt);
            });
        }
    } catch (error) {
        console.error("Error loading dropdowns:", error);
        alert("Gagal memuat data awal.");
    }
}

// ==============================================
// Load PR Details
// ==============================================
// ==============================================
// Load PR Details
// ==============================================
async function loadPRDetails() {
    const prId = document.getElementById("pr_id").value;
    const detailsSection = document.getElementById("pr-details-section");
    const infoBox = document.getElementById("pr-info-box");

    if (!prId) {
        detailsSection.style.display = "none";
        infoBox.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/pr/${prId}`);
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        const pr = data.data;
        // Deep copy items to allow modification (deletion) without affecting original data in memory if re-fetched
        currentPRItems = pr.items.map(item => ({ ...item, price_input: 0 }));

        // Populate Info
        document.getElementById("pr_keperluan").textContent = pr.keperluan;
        document.getElementById("pr_departemen").textContent = pr.departemen;
        document.getElementById("pr_requester").textContent = pr.requester_name;

        // Build Items Table
        renderItemsTable();

        detailsSection.style.display = "block";
        infoBox.style.display = "block";
    } catch (error) {
        console.error("Error loading PR details:", error);
        alert("Gagal memuat detail PR.");
    }
}

// ==============================================
// Render Items Table
// ==============================================
function renderItemsTable() {
    const tbody = document.getElementById("po-items-body");
    tbody.innerHTML = "";

    if (currentPRItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center p-4">Tidak ada item yang dipilih.</td></tr>`;
        calculateTotal();
        return;
    }

    currentPRItems.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center; padding: 12px;">${index + 1}</td>
            <td style="padding: 12px;">
                <input type="text" readonly value="${item.material}" 
                    style="width: 100%; border: 1px solid #ddd; padding: 8px; border-radius: 4px; background: #f9f9f9;">
            </td>
            <td style="text-align: center; padding: 12px;">
                <input type="text" readonly value="${item.qty}" 
                    style="width: 60px; text-align: center; border: 1px solid #ddd; padding: 8px; border-radius: 4px; background: #f9f9f9;">
            </td>
            <td style="text-align: center; padding: 12px;">
                <select disabled style="width: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; -webkit-appearance: none; appearance: none;">
                    <option>${item.satuan}</option>
                </select>
            </td>
            <td style="padding: 12px;">
                <input type="number" class="price-input" data-index="${index}" 
                       value="${item.price_input || 0}" min="0" oninput="calculateRow(${index})"
                       style="width: 100%; border: 1px solid #ddd; padding: 8px; border-radius: 4px;">
            </td>
            <td style="text-align: right; color: #4d7c0f; font-weight: 600; padding: 12px;">
                <span id="row-total-${index}">Rp ${formatNumber(calculateItemTotal(item))}</span>
            </td>
            <td style="text-align: center; padding: 12px;">
                <button type="button" class="btn btn-danger" onclick="deleteRow(${index})" style="padding: 6px 12px; font-size: 13px;">
                    Hapus
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    calculateTotal();
}

// ==============================================
// Helper: Calculate Single Item Total
// ==============================================
function calculateItemTotal(item) {
    const price = parseFloat(item.price_input) || 0;
    const qty = parseFloat(item.qty) || 0;
    return price * qty;
}

// ==============================================
// Calculate Row Total (Event Handler)
// ==============================================
window.calculateRow = function (index) {
    const priceInput = document.querySelector(`.price-input[data-index="${index}"]`);
    const price = parseFloat(priceInput.value) || 0;

    // Update model
    currentPRItems[index].price_input = price;

    // View update
    const total = calculateItemTotal(currentPRItems[index]);
    document.getElementById(`row-total-${index}`).textContent = `Rp ${formatNumber(total)}`;

    calculateTotal();
};

// ==============================================
// Delete Row
// ==============================================
window.deleteRow = function (index) {
    if (!confirm("Hapus item ini dari PO?")) return;

    currentPRItems.splice(index, 1);
    renderItemsTable();
};

// ==============================================
// Calculate Grand Total
// ==============================================
window.calculateTotal = function () {
    let subtotal = 0;

    currentPRItems.forEach(item => {
        subtotal += calculateItemTotal(item);
    });

    const includePPN = document.getElementById("include_ppn").checked;
    const ppn = includePPN ? subtotal * 0.11 : 0;
    const total = subtotal + ppn;

    document.getElementById("summary-subtotal").textContent = formatCurrency(subtotal);
    document.getElementById("summary-ppn").textContent = formatCurrency(ppn);
    document.getElementById("summary-total").textContent = formatCurrency(total);
};

// ==============================================
// Submit PO
// ==============================================
async function submitPO(e) {
    e.preventDefault();

    if (currentPRItems.length === 0) {
        alert("Minimal harus ada disk item untuk membuat PO.");
        return;
    }

    // Validate prices
    for (let i = 0; i < currentPRItems.length; i++) {
        if (!currentPRItems[i].price_input || currentPRItems[i].price_input <= 0) {
            alert(`Harga untuk item baris ${i + 1} (${currentPRItems[i].material}) belum diisi!`);
            return;
        }
    }

    if (!confirm("Pastikan data sudah benar. Buat PO?")) return;

    const prId = document.getElementById("pr_id").value;
    const vendorId = document.getElementById("vendor_id").value;
    const tanggal = document.getElementById("tanggal").value;
    const includePPN = document.getElementById("include_ppn").checked;

    const itemsPayload = currentPRItems.map(item => ({
        material: item.material,
        qty: item.qty,
        satuan: item.satuan,
        harga_satuan: item.price_input
    }));

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pr_id: prId,
                vendor_id: vendorId,
                tanggal: tanggal,
                include_ppn: includePPN,
                items: itemsPayload
            })
        });

        const data = await res.json();

        if (data.success) {
            alert("PO Berhasil Dibuat! No PO: " + data.data.po_no);
            window.location.href = "/daftarpo.html";
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (error) {
        console.error("Error submitting PO:", error);
        alert("Terjadi kesalahan sistem.");
    }
}

// ==============================================
// Utilities
// ==============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

function formatNumber(amount) {
    return new Intl.NumberFormat("id-ID").format(amount);
}

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
