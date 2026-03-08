let username = localStorage.getItem('name');
document.querySelector('.username').textContent = username ? username : 'Vieras';


// uloskirjautuminen - by Claude
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.location.href = 'login.html';
    });
}