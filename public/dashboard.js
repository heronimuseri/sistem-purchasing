// public/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    if (!userName || !userRole) return logout();

    document.getElementById('welcome-message').textContent = `Selamat datang, ${userRole}!`;
    document.getElementById('logout-btn').addEventListener('click', logout);

    const approvalMenu = document.getElementById('menu-approval');
    // Sembunyikan menu admin jika role BUKAN admin
    if (userRole !== 'admin') {
        if(approvalMenu) approvalMenu.style.display = 'none';
    }
});

function logout() {
    localStorage.clear();
    window.location.href = '/Login.html';
}