// public/edit_user.js (Final Lengkap)

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    // Keamanan: jika tidak ada ID di URL, kembali ke halaman daftar user
    if (!userId) {
        alert('ID User tidak ditemukan!');
        window.location.href = 'admin_user.html';
        return;
    }

    // Ambil data user yang akan di-edit dan isi form-nya
    fetchUserData(userId);

    // Tambahkan event listener untuk tombol "Simpan Perubahan"
    const form = document.getElementById('edit-user-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(userId);
        });
    }
});

// Fungsi untuk mengambil data satu user dari server
async function fetchUserData(id) {
    try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (!response.ok) {
            throw new Error('Gagal memuat data user. Mungkin user tidak ada.');
        }
        const user = await response.json();
        
        // Isi setiap field di form dengan data yang didapat dari server
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-userid').value = user.user;
        document.getElementById('user-role').value = user.role;

        // Tampilkan form dan sembunyikan teks "memuat"
        document.getElementById('form-content').classList.remove('hidden');
        document.getElementById('loading-text').classList.add('hidden');

    } catch (error) {
        document.getElementById('loading-text').textContent = error.message;
        alert(error.message);
    }
}

// Fungsi yang dijalankan saat form di-submit
async function handleFormSubmit(id) {
    // Kumpulkan data yang sudah diubah dari form
    const updatedUserData = {
        name: document.getElementById('user-name').value,
        user: document.getElementById('user-userid').value,
        role: document.getElementById('user-role').value,
        pass: document.getElementById('user-password').value // Akan diabaikan oleh server jika kosong
    };

    // Kirim data ke server menggunakan method PUT
    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUserData)
        });
        const result = await response.json();
        alert(result.message);
        
        if (result.success) {
            // Jika berhasil, kembali ke halaman daftar user
            window.location.href = 'admin_user.html';
        }
    } catch (error) {
        alert('Terjadi kesalahan saat menyimpan data.');
        console.error("Update error:", error);
    }
}