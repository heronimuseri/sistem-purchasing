// public/admin.js (Versi Sederhana untuk Navigasi)

function logout() {
    localStorage.clear();
    window.location.href = '/Login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('Akses Ditolak!');
        window.location.href = '/dashboard.html';
        return;
    }
    document.getElementById('admin-name').textContent = localStorage.getItem('userName');
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Logika untuk navigasi menu sidebar (menampilkan konten placeholder)
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');

    navLinks.forEach(link => {
        const targetId = link.getAttribute('data-target');
        // Hanya tambahkan listener jika link memiliki 'data-target' (bukan link Master User atau Logout)
        if (targetId) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                contentSections.forEach(section => section.classList.add('hidden'));
                document.getElementById(targetId).classList.remove('hidden');
                // Hapus kelas 'active' dari semua link dan tambahkan ke yang diklik
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
            });
        }
    });
});