// App Shell Logic
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Highlight active menu
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // User Profile
    const user = JSON.parse(localStorage.getItem('user'));
    const userDisplay = document.getElementById('user-display');

    if (user && userDisplay) {
        userDisplay.textContent = user.username || 'User';
        // Role handling for visibility
        if (user.role) {
            handleRoleVisibility(user.role);
        }
    }
});

function handleRoleVisibility(role) {
    // Hide admin sections if not admin
    if (role !== 'admin') {
        const adminElements = document.querySelectorAll('.role-admin');
        adminElements.forEach(el => el.style.display = 'none');
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}
