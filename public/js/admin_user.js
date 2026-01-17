// public/admin_user.js (Final dengan Tombol Edit yang Benar)

function logout() {
    localStorage.clear();
    window.location.href = '/Login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Keamanan: Cek apakah yang login adalah admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('Akses Ditolak! Halaman ini hanya untuk Admin.');
        window.location.href = '/dashboard.html';
        return;
    }
    // Muat data pengguna
    loadUsers();

    // --- Event Listeners ---
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('add-user-btn').addEventListener('click', () => showUserModal());
    document.getElementById('cancel-btn').addEventListener('click', hideUserModal);
    document.getElementById('user-form').addEventListener('submit', handleFormSubmit);
    // Event listener utama untuk tombol di dalam tabel
    document.getElementById('users-table-body').addEventListener('click', handleTableActions);
});


// === FUNGSI MODAL (Hanya untuk Tambah User) ===
const modalOverlay = document.getElementById('user-modal-overlay');
const userForm = document.getElementById('user-form');
const modalTitle = document.getElementById('modal-title');

function showUserModal() {
    userForm.reset();
    modalTitle.textContent = 'Tambah User Baru';
    document.getElementById('user-id').value = '';
    document.getElementById('user-password').placeholder = "Password wajib diisi";
    document.getElementById('user-password').required = true;
    modalOverlay.classList.remove('hidden');
}

function hideUserModal() {
    modalOverlay.classList.add('hidden');
}

// === FUNGSI INTERAKSI API (CRUD) ===
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = '';
        users.forEach(user => {
            // Pastikan kedua tombol memiliki data-id
            const actionButtons = `
                <button class="btn-sm btn-secondary" data-action="edit" data-id="${user.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-sm btn-danger" data-action="delete" data-id="${user.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
            `;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td><td>${user.name}</td><td>${user.company}</td>
                <td>${user.user}</td><td><span class="status ${user.role}">${user.role}</span></td>
                <td class="action-cell">${actionButtons}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) { console.error("Gagal memuat data user:", error); }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    // Fungsi ini hanya untuk MENAMBAH user baru
    const userData = {
        name: document.getElementById('user-name').value,
        user: document.getElementById('user-userid').value,
        role: document.getElementById('user-role').value,
        pass: document.getElementById('user-password').value
    };
    if (!userData.pass) return alert('Password wajib diisi untuk user baru.');

    try {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            hideUserModal();
            loadUsers();
        }
    } catch (error) { alert("Terjadi kesalahan. Gagal menyimpan data."); }
}

// FUNGSI AKSI TABEL (DIPERBARUI)
function handleTableActions(e) {
    const target = e.target.closest('button');
    if (!target) return;
    
    const action = target.dataset.action;
    const id = target.dataset.id;

    if (action === 'edit') {
        // PERBAIKAN UTAMA: Arahkan ke halaman edit_user.html dengan membawa ID pengguna
        window.location.href = `/edit_user.html?id=${id}`;
    }
    if (action === 'delete') {
        if (confirm(`Anda yakin ingin menghapus user dengan ID ${id}?`)) {
            deleteUser(id);
        }
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            loadUsers();
        }
    } catch (error) { alert("Gagal menghapus user."); }
}