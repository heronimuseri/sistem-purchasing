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
            alert("Akses ditolak. Hanya untuk Purchasing.");
            window.location.href = "/daftarpo.html";
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
async function loadPRDetails() {
    const prId = document.getElementById("pr_id").value;
    const detailsSection = document.getElementById("pr-details-section");

    if (!prId) {
        detailsSection.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/pr/${prId}`);
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        const pr = data.data;
        currentPRItems = pr.items;

        // Populate Info
        document.getElementById("pr_keperluan").textContent = pr.keperluan;
        document.getElementById("pr_departemen").textContent = pr.departemen;
        document.getElementById("pr_requester").textContent = pr.requester_name;

        // Build Items Table
        renderItemsTable(pr.items);

        detailsSection.style.display = "block";
    } catch (error) {
        console.error("Error loading PR details:", error);
        alert("Gagal memuat detail PR.");
    }
}

// ==============================================
// Render Items Table
// ==============================================
function renderItemsTable(items) {
    const tbody = document.getElementById("po-items-body");
    tbody.innerHTML = "";

    items.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="text-align: center;">${index + 1}</td>
            <td>${item.material}</td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: center;">${item.satuan}</td>
            <td>
                <input type="number" class="price-input" data-index="${index}" 
                       value="0" min="0" oninput="calculateRow(${index})">
            </td>
            <td style="text-align: right;">
                <span id="row-total-${index}">Rp 0</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    calculateTotal();
}

// ==============================================
// Calculate Row Total
// ==============================================
window.calculateRow = function (index) {
    const item = currentPRItems[index];
    const priceInput = document.querySelector(`.price-input[data-index="${index}"]`);
    const price = parseFloat(priceInput.value) || 0;
    const total = price * parseFloat(item.qty);

    document.getElementById(`row-total-${index}`).textContent = formatCurrency(total);
    calculateTotal();
};

// ==============================================
// Calculate Grand Total
// ==============================================
window.calculateTotal = function () {
    let subtotal = 0;
    const priceInputs = document.querySelectorAll(".price-input");

    priceInputs.forEach((input, index) => {
        const price = parseFloat(input.value) || 0;
        const qty = parseFloat(currentPRItems[index].qty);
        subtotal += price * qty;
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

    if (!confirm("Pastikan data sudah benar. Buat PO?")) return;

    const prId = document.getElementById("pr_id").value;
    const vendorId = document.getElementById("vendor_id").value;
    const tanggal = document.getElementById("tanggal").value;
    const includePPN = document.getElementById("include_ppn").checked;

    // Collect items with prices
    const items = [];
    const priceInputs = document.querySelectorAll(".price-input");

    for (let i = 0; i < priceInputs.length; i++) {
        const price = parseFloat(priceInputs[i].value);
        if (price <= 0) {
            alert(`Harga untuk item baris ${i + 1} belum diisi!`);
            return;
        }

        items.push({
            material: currentPRItems[i].material,
            qty: currentPRItems[i].qty,
            satuan: currentPRItems[i].satuan,
            harga_satuan: price
        });
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pr_id: prId,
                vendor_id: vendorId,
                tanggal: tanggal,
                include_ppn: includePPN,
                items: items
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

function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
