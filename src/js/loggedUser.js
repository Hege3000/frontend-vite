// näyttää kirjautuneen käyttäjän nimen navigaatiossa
let username = localStorage.getItem('name');
document.querySelector('.username').textContent = username ? username : 'Vieras';


// uloskirjautuminen - poistaa tokenin ja ohjaa uloskirjautumissivulle
// AI - assisted Claude
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.location.href = 'login.html';
    });
}