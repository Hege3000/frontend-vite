import { fetchData } from './fetch.js';

const API_URL = 'http://localhost:3000/api';

// Näytetään viesti lomakkeen alla
const showMessage = (elementId, message, isError = false) => {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = isError ? 'error' : 'success';
};

// kirjautuminen - lähettää tunnukset backendille 
// AI-assisted Gemini
const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetchData(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.error) {
    showMessage('loginMessage', 'Kirjautuminen epäonnistui: ' + response.error, true);
    return;
  }

  // tallennetaan token ja käyttäjänimi localStorageen - Gemini
  localStorage.setItem('token', response.token);
  localStorage.setItem('name', response.user.username);

  showMessage('loginMessage', 'Kirjautuminen onnistui! Ohjataan päiväkirjaan...');

  // ohjataan päiväkirjasivulle 2 sekunnin kuluttua - Gemini
  setTimeout(() => {
    window.location.href = 'paivakirja.html';
  }, 2000);
});

// rekisteröityminen - lähettää uuden käyttäjän tiedot backendille
const registerForm = document.querySelector('.registerForm');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const response = await fetchData(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.error) {
    showMessage('registerMessage', 'Rekisteröityminen epäonnistui: ' + response.error, true);
    return;
  }
  if (response.message) {
  showMessage('registerMessage', 'Rekisteröityminen onnistui! Voit nyt kirjautua sisään.');
  registerForm.reset();
  }
});