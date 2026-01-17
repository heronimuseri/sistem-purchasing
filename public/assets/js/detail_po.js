// public/js/detail_po.js

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
        loadDetailPO(id);
    } else {
        Swal.fire("Error", "ID PO tidak ditemukan", "error").then(() => {
            window.location.href = "/daftarpo.html";
        });
    }
});

let currentPO = null;
let currentUser = null; // Will be set after auth check or fetching from API if included

async function getAuth() {
    try {
        const res = await fetch("/api/session");
        const data = await res.json();
        return data.user || null;
    } catch (e) {
        return null; // Assume not logged in or error
    }
}

async function loadDetailPO(id) {
    try {
        const [auth, poRes] = await Promise.all([
            getAuth(),
            fetch(`/api/po/${id}`).then(r => r.json())
        ]);

        currentUser = auth;
        if (!poRes.success) throw new Error(poRes.message);

        currentPO = poRes.data;
        renderPO(currentPO);

    } catch (error) {
        console.error("Error loading PO:", error);
        Swal.fire("Error", "Gagal memuat data PO: " + error.message, "error");
    } finally {
        document.getElementById("loading").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }
}

function renderPO(po) {
    // Header Info
    document.getElementById("po-no").textContent = po.po_no;
    document.getElementById("po-status-badge").textContent = po.status;
    document.getElementById("po-status-badge").className = `status-badge status-${getStatusClass(po.status)}`;

    // Vendor Info
    document.getElementById("vendor-name").textContent = po.vendor_nama || "-";
    document.getElementById("vendor-phone").textContent = po.vendor_hp || "-";
    document.getElementById("vendor-address").textContent = po.vendor_alamat || "-";

    // Doc Info
    document.getElementById("pr-no").textContent = po.pr_no || "-";
    document.getElementById("po-date").textContent = formatDate(po.tanggal);
    document.getElementById("po-keperluan").textContent = po.keperluan || "-";
    document.getElementById("po-creator").textContent = po.purchaser_name || "-";

    // Approval Steps Visualization
    renderApprovalSteps(po);

    // Rejection Reason
    if (po.status === 'Rejected' && po.rejection_reason) {
        document.getElementById("rejection-alert").style.display = "block";
        document.getElementById("rejection-reason-text").textContent = po.rejection_reason;
    }

    // Items
    const tbody = document.getElementById("items-table-body");
    tbody.innerHTML = po.items.map((item, idx) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px;">${idx + 1}</td>
            <td style="padding: 12px;">${item.material}</td>
            <td style="padding: 12px;">${item.qty}</td>
            <td style="padding: 12px;">${item.satuan}</td>
            <td style="padding: 12px; text-align: right;">${formatCurrency(item.harga_satuan)}</td>
            <td style="padding: 12px; text-align: right;">${formatCurrency(item.total_harga)}</td>
        </tr>
    `).join("");

    // Totals
    // Assuming backend sends total_amount. If we need subtotal/ppn breakdown we might need to calc it or check if backend sends it.
    // Based on po_migration.sql, we have included_ppn boolean.
    // We can assume total_amount is final.
    // If include_ppn is true, displayed total includes PPN.
    // Let's rely on total_amount from DB.
    // If we want to show PPN breakdown separately if applicable:
    // (Simpler: just show total for now as per previous modal implementation)
    document.getElementById("po-total").textContent = formatCurrency(po.total_amount);

    if (po.include_ppn) {
        // Simple back calculation for display if needed, or just say Includes PPN
        // document.getElementById("ppn-row").style.display = "table-row";
        // document.getElementById("po-ppn").textContent = "Included";
    }

    // Delivery Info
    if (po.tanggal_kirim || po.tanggal_terima) {
        document.getElementById("delivery-section").style.display = "block";
        document.getElementById("delivery-date").textContent = formatDate(po.tanggal_kirim) || "-";
        document.getElementById("receive-date").textContent = formatDate(po.tanggal_terima) || "-";
        document.getElementById("receiver-name").textContent = po.penerima_name || "-";
    }

    // Action Buttons
    renderActionButtons(po);
}

function renderApprovalSteps(po) {
    // Created
    const stepCreated = document.getElementById("step-created");
    const stepCreatedIcon = stepCreated.querySelector(".step-icon");
    stepCreatedIcon.style.background = "#22c55e"; // Green
    document.getElementById("step-created-by").textContent = po.purchaser_name;

    // Manager
    const stepManager = document.getElementById("step-manager");
    const stepManagerIcon = stepManager.querySelector(".step-icon");
    if (po.approval_manager_ho_date) {
        stepManagerIcon.style.background = "#22c55e";
        document.getElementById("step-manager-by").textContent = `${po.manager_ho_name}\n${formatDate(po.approval_manager_ho_date)}`;
    } else if (po.status === 'Rejected' && !po.approval_manager_ho_date && !po.approval_direktur_date) { // Rejected by Manager
        stepManagerIcon.style.background = "#ef4444"; // Red
        document.getElementById("step-manager-by").textContent = "Rejected";
    }

    // Direktur
    const stepDirektur = document.getElementById("step-direktur");
    const stepDirekturIcon = stepDirektur.querySelector(".step-icon");
    if (po.approval_direktur_date) {
        stepDirekturIcon.style.background = "#22c55e";
        document.getElementById("step-direktur-by").textContent = `${po.direktur_name}\n${formatDate(po.approval_direktur_date)}`;
    } else if (po.status === 'Rejected' && po.approval_manager_ho_date) { // Rejected by Direktur
        stepDirekturIcon.style.background = "#ef4444";
        document.getElementById("step-direktur-by").textContent = "Rejected";
    }
}

function renderActionButtons(po) {
    const container = document.getElementById("action-buttons");
    container.innerHTML = "";

    if (!currentUser) return;
    const role = currentUser.role;

    // Approve/Reject for Manager HO
    if (role === "manager_ho" && po.status === "Pending Manager HO Approval") {
        container.innerHTML += `
            <button class="btn" style="background: #22c55e; color: white; padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer;" onclick="processApproval(${po.id}, 'manager_ho')">
                <i class="fa-solid fa-check"></i> Approve
            </button>
            <button class="btn" style="background: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer;" onclick="rejectPO(${po.id}, 'manager_ho')">
                <i class="fa-solid fa-xmark"></i> Reject
            </button>
        `;
    }

    // Approve/Reject for Direktur
    if (role === "direktur" && po.status === "Pending Direktur Approval") {
        container.innerHTML += `
            <button class="btn" style="background: #22c55e; color: white; padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer;" onclick="processApproval(${po.id}, 'direktur')">
                <i class="fa-solid fa-check"></i> Approve (Final)
            </button>
            <button class="btn" style="background: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 4px; border: none; cursor: pointer;" onclick="rejectPO(${po.id}, 'direktur')">
                <i class="fa-solid fa-xmark"></i> Reject
            </button>
        `;
    }

    // Print
    if (["Fully Approved", "Dikirim", "Diterima"].includes(po.status)) {
        container.innerHTML += `
            <a href="/print_po.html?id=${po.id}" target="_blank" class="btn" style="background: #64748b; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-print"></i> Cetak PO
            </a>
        `;
    }

    // Delete (Admin/Purchasing Only if not active)
    // Optional: Add delete button if needed
}

async function processApproval(id, level) {
    const title = level === 'manager_ho' ? "Approve sebagai Manager HO?" : "Approve Final sebagai Direktur?";
    const result = await Swal.fire({
        title: 'Konfirmasi Approval',
        text: title,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Approve!'
    });

    if (result.isConfirmed) {
        try {
            const endpoint = level === 'manager_ho'
                ? `/api/po/${id}/approve-manager-ho`
                : `/api/po/${id}/approve-direktur`;

            const res = await fetch(endpoint, { method: "PUT" });
            const data = await res.json();

            if (data.success) {
                Swal.fire('Berhasil!', 'PO telah diapprove.', 'success').then(() => location.reload());
            } else {
                Swal.fire('Gagal', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }
}

async function rejectPO(id, level) {
    const { value: reason } = await Swal.fire({
        title: 'Tolak PO',
        input: 'textarea',
        inputLabel: 'Alasan Penolakan',
        inputPlaceholder: 'Tuliskan alasan penolakan disini...',
        inputAttributes: {
            'aria-label': 'Tuliskan alasan penolakan'
        },
        showCancelButton: true
    });

    if (reason) {
        try {
            const endpoint = level === 'manager_ho'
                ? `/api/po/${id}/reject-manager-ho`
                : `/api/po/${id}/reject-direktur`;

            const res = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason })
            });
            const data = await res.json();

            if (data.success) {
                Swal.fire('Ditolak!', 'PO telah ditolak.', 'success').then(() => location.reload());
            } else {
                Swal.fire('Gagal', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }
}

// Helpers
function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
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
