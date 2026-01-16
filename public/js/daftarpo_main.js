// daftarpo_main.js - JavaScript for PO List Page
let currentUser = null;
let currentPOId = null;
let allPOData = [];

// ==============================================
// Initialize on page load
// ==============================================
document.addEventListener("DOMContentLoaded", async () => {
    await checkSession();
    await loadPOList();
    await loadNotificationCount();

    if (currentUser.role === "purchasing" || currentUser.role === "admin") {
        document.getElementById("btn-create-po").style.display = "inline-flex";
        document.getElementById("kpi-section").style.display = "flex";
        await loadKPI();
    }

    // Setup event listeners
    document.getElementById("searchInput").addEventListener("input", filterTable);
    document.getElementById("statusFilter").addEventListener("change", filterTable);

    // Modal close handlers
    document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none";
        });
    });
});

// ==============================================
// Session Check
// ==============================================
async function checkSession() {
    try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (!data.loggedIn) {
            window.location.href = "/login.html";
            return;
        }
        currentUser = data.user;

        // Show notification for approvers
        if (["manager_ho", "direktur", "ktu", "manager"].includes(currentUser.role)) {
            document.getElementById("notification-container").style.display = "flex";
        }
    } catch (error) {
        console.error("Session check failed:", error);
        window.location.href = "/login.html";
    }
}

// ==============================================
// Load PO List
// ==============================================
async function loadPOList() {
    try {
        const res = await fetch("/api/po");
        const data = await res.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        allPOData = data.data;
        renderTable(allPOData);
    } catch (error) {
        console.error("Error loading PO:", error);
        document.getElementById("po-table-body").innerHTML =
            `<tr><td colspan="6" class="error-text">Gagal memuat data: ${error.message}</td></tr>`;
    }
}

// ==============================================
// Load KPI (Purchasing only)
// ==============================================
async function loadKPI() {
    try {
        const res = await fetch("/api/po/kpi");
        const data = await res.json();

        if (data.success && data.data) {
            document.getElementById("kpi-total").textContent = data.data.total_po || 0;
            document.getElementById("kpi-ontime").textContent = data.data.on_time || 0;
            document.getElementById("kpi-late").textContent = data.data.late || 0;
            document.getElementById("kpi-avg").textContent =
                data.data.avg_days ? parseFloat(data.data.avg_days).toFixed(1) : "-";
        }
    } catch (error) {
        console.error("Error loading KPI:", error);
    }
}

// ==============================================
// Load Notification Count
// ==============================================
async function loadNotificationCount() {
    try {
        const res = await fetch("/api/notifications/count");
        const data = await res.json();

        const badge = document.getElementById("notification-badge");
        if (data.pendingCount > 0) {
            badge.textContent = data.pendingCount;
            badge.style.display = "flex";
        } else {
            badge.style.display = "none";
        }
    } catch (error) {
        console.error("Error loading notification count:", error);
    }
}

// ==============================================
// Render Table
// ==============================================
function renderTable(poList) {
    const tbody = document.getElementById("po-table-body");

    if (!poList || poList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-text">Tidak ada data Purchase Order.</td></tr>`;
        return;
    }

    tbody.innerHTML = poList.map(po => `
        <tr>
            <td>
                <div class="po-no">${po.po_no}</div>
                <div class="po-date">${formatDate(po.tanggal)}</div>
            </td>
            <td>${po.vendor_nama || "-"}</td>
            <td class="keperluan-cell">${po.keperluan || "-"}</td>
            <td class="amount-cell">${formatCurrency(po.total_amount)}</td>
            <td><span class="status-badge status-${getStatusClass(po.status)}">${po.status}</span></td>
            <td class="action-cell">
                <button class="btn btn-sm btn-info" onclick="viewDetail(${po.id})" title="Lihat Detail">
                    <i class="fa-solid fa-eye"></i>
                </button>
                ${renderActionButtons(po)}
            </td>
        </tr>
    `).join("");
}

// ==============================================
// Render Action Buttons based on role
// ==============================================
function renderActionButtons(po) {
    let buttons = "";

    // Approve/Reject for Manager HO
    if (currentUser.role === "manager_ho" && po.status === "Pending Manager HO Approval") {
        buttons += `
            <button class="btn btn-sm btn-success" onclick="approveManagerHO(${po.id})" title="Approve">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="openRejectModal(${po.id}, 'manager_ho')" title="Reject">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
    }

    // Approve/Reject for Direktur
    if (currentUser.role === "direktur" && po.status === "Pending Direktur Approval") {
        buttons += `
            <button class="btn btn-sm btn-success" onclick="approveDirektur(${po.id})" title="Approve">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="openRejectModal(${po.id}, 'direktur')" title="Reject">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
    }

    // Print for Fully Approved
    if (po.status === "Fully Approved" || po.status === "Dikirim" || po.status === "Diterima") {
        buttons += `
            <button class="btn btn-sm btn-secondary" onclick="printPO(${po.id})" title="Cetak PO">
                <i class="fa-solid fa-print"></i>
            </button>
        `;
    }

    // Update Kirim for Purchasing
    if ((currentUser.role === "purchasing" || currentUser.role === "admin") && po.status === "Fully Approved") {
        buttons += `
            <button class="btn btn-sm btn-warning" onclick="updateKirim(${po.id})" title="Update Dikirim">
                <i class="fa-solid fa-truck"></i>
            </button>
        `;
    }

    // Update Terima for Kerani
    if ((currentUser.role === "kerani" || currentUser.role === "admin") && po.status === "Dikirim") {
        buttons += `
            <button class="btn btn-sm btn-success" onclick="updateTerima(${po.id})" title="Barang Diterima">
                <i class="fa-solid fa-box-open"></i>
            </button>
        `;
    }

    return buttons;
}

// ==============================================
// View Detail
// ==============================================
async function viewDetail(poId) {
    window.location.href = `/detail_po.html?id=${poId}`;
}

// ==============================================
// Approval Actions
// ==============================================
async function approveManagerHO(poId) {
    if (!confirm("Approve Purchase Order ini?")) return;

    try {
        const res = await fetch(`/api/po/${poId}/approve-manager-ho`, { method: "PUT" });
        const data = await res.json();

        if (data.success) {
            alert("PO berhasil diapprove!");
            await loadPOList();
            await loadNotificationCount();
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

async function approveDirektur(poId) {
    if (!confirm("Approve (Final) Purchase Order ini?")) return;

    try {
        const res = await fetch(`/api/po/${poId}/approve-direktur`, { method: "PUT" });
        const data = await res.json();

        if (data.success) {
            alert("PO berhasil di-Fully Approved!");
            await loadPOList();
            await loadNotificationCount();
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ==============================================
// Reject Actions
// ==============================================
let rejectLevel = "";

function openRejectModal(poId, level) {
    currentPOId = poId;
    rejectLevel = level;
    document.getElementById("reject-reason").value = "";
    document.getElementById("reject-modal").style.display = "flex";
}

function closeRejectModal() {
    document.getElementById("reject-modal").style.display = "none";
}

async function submitReject() {
    const reason = document.getElementById("reject-reason").value.trim();
    if (!reason) {
        alert("Alasan penolakan wajib diisi!");
        return;
    }

    const endpoint = rejectLevel === "manager_ho"
        ? `/api/po/${currentPOId}/reject-manager-ho`
        : `/api/po/${currentPOId}/reject-direktur`;

    try {
        const res = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason })
        });
        const data = await res.json();

        if (data.success) {
            alert("PO berhasil ditolak!");
            closeRejectModal();
            await loadPOList();
            await loadNotificationCount();
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ==============================================
// Delivery Tracking
// ==============================================
async function updateKirim(poId) {
    const tanggal = prompt("Masukkan tanggal kirim (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    if (!tanggal) return;

    try {
        const res = await fetch(`/api/po/${poId}/kirim`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanggal_kirim: tanggal })
        });
        const data = await res.json();

        if (data.success) {
            alert("Status pengiriman berhasil diupdate!");
            await loadPOList();
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

async function updateTerima(poId) {
    const tanggal = prompt("Masukkan tanggal terima (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    if (!tanggal) return;

    try {
        const res = await fetch(`/api/po/${poId}/terima`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanggal_terima: tanggal })
        });
        const data = await res.json();

        if (data.success) {
            alert("Barang berhasil diterima!");
            await loadPOList();
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ==============================================
// Print PO
// ==============================================
function printPO(poId) {
    window.open(`/print_po.html?id=${poId}`, "_blank");
}

// ==============================================
// Filter Table
// ==============================================
function filterTable() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;

    const filtered = allPOData.filter(po => {
        const matchSearch = !search ||
            po.po_no.toLowerCase().includes(search) ||
            (po.keperluan && po.keperluan.toLowerCase().includes(search)) ||
            (po.vendor_nama && po.vendor_nama.toLowerCase().includes(search));
        const matchStatus = !status || po.status === status;
        return matchSearch && matchStatus;
    });

    renderTable(filtered);
}

// ==============================================
// Utility Functions
// ==============================================
function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function formatCurrency(amount) {
    if (!amount) return "Rp 0";
    return `Rp ${parseFloat(amount).toLocaleString("id-ID")}`;
}

function getStatusClass(status) {
    const map = {
        "Pending Manager HO Approval": "pending",
        "Pending Direktur Approval": "pending-direktur",
        "Fully Approved": "approved",
        "Dikirim": "dikirim",
        "Diterima": "diterima",
        "Rejected": "rejected"
    };
    return map[status] || "default";
}
