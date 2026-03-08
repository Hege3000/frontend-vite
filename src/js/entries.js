import { fetchData } from './fetch.js';

const API_URL = 'http://localhost:3000/api';
const diaryContainer = document.querySelector('.diary-card-area');

// näytetään viesti
const showMessage = (elementId, message, isError = false) => {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = isError ? 'error' : 'success';
};

// haetaan token localStoragesta ja palauttaa Auth.-otsikon? - Gemini  
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Dialog
const dialog = document.querySelector('.diary_dialog');
const closeDialog = document.getElementById('closeDialog');
closeDialog.addEventListener('click', () => dialog.close());

// Uuden merkinnän lomakkeen näyttäminen/piilottaminen
const addEntryBtn = document.querySelector('.add_entry_btn');
const addEntryForm = document.getElementById('addEntryForm');
const cancelEntry = document.getElementById('cancelEntry');

addEntryBtn.addEventListener('click', () => {
    addEntryForm.style.display = 'block';
});

cancelEntry.addEventListener('click', () => {
    addEntryForm.style.display = 'none';
});

// Haetaan kaikki merkinnät ja luodaan kortit
const getEntries = async () => {
    const response = await fetchData(`${API_URL}/entries`, {
        headers: getAuthHeaders(),
    });

    if (response.error) {
        diaryContainer.innerHTML = '<p>Kirjaudu sisään nähdäksesi merkinnät.</p>';
        return;
    }

    diaryContainer.innerHTML = '';

    response.forEach((entry) => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Muotoillaan päivämäärä
        const date = new Date(entry.entry_date).toLocaleDateString('fi-FI');

        card.innerHTML = `
            <img src="./img/paivakirja.jpg" alt="päiväkirja" style="width:100%; height:180px; object-fit:cover;" />
            <div class="card-text">
                <p><strong>Päivämäärä:</strong> ${date}</p>
                <p><strong>Mieliala:</strong> ${entry.mood || '-'}</p>
                <p><strong>Paino:</strong> ${entry.weight ? entry.weight + ' kg' : '-'}</p>
                <p><strong>Uni:</strong> ${entry.sleep_hours ? entry.sleep_hours + ' h' : '-'}</p>
                <p><strong>Muistiinpanot:</strong> ${entry.notes || '-'}</p>
            </div>
            <div class="card-actions">
                <button class="editBtn" data-id="${entry.entry_id}">Muokkaa</button>
                <button class="deleteBtn" data-id="${entry.entry_id}">Poista</button>
            </div>
        `;

        // Muokkaa-nappi avaa dialogin
        card.querySelector('.editBtn').addEventListener('click', () => {
            openEditDialog(entry);
        });

        // Poista-nappi
        card.querySelector('.deleteBtn').addEventListener('click', async () => {
            if (!confirm('Haluatko varmasti poistaa tämän merkinnän?')) return;
            await deleteEntry(entry.entry_id);
        });

        diaryContainer.appendChild(card);
    });
};

// Lisätään uusi merkintä
const entryForm = document.querySelector('.entryForm');
entryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newEntry = {
    entry_date: document.getElementById('entry_date').value,
    mood: document.getElementById('mood').value || null,
    weight: document.getElementById('weight').value ? Number(document.getElementById('weight').value) : null,
    sleep_hours: document.getElementById('sleep_hours').value ? Number(document.getElementById('sleep_hours').value) : null,
    notes: document.getElementById('notes').value || null,
};

    const response = await fetchData(`${API_URL}/entries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(newEntry),
    });

    if (response.error) {
    showMessage('entryMessage', 'Virhe: ' + (response.error.message || response.error), true);
    return;
}

    showMessage('entryMessage', 'Merkintä lisätty!');
    entryForm.reset();
    addEntryForm.style.display = 'none';
    // päivitetään kortit
    await getEntries();
});

// Poistetaan merkintä
const deleteEntry = async (id) => {
    const response = await fetchData(`${API_URL}/entries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (response.error) {
        alert('Poisto epäonnistui: ' + response.error);
        return;
    }

    // päivitetään kortit
    await getEntries();
};

// Avataan dialog muokkausta varten
const openEditDialog = (entry) => {
    document.getElementById('editId').value = entry.entry_id;
    document.getElementById('editDate').value = entry.entry_date?.split('T')[0] || '';
    document.getElementById('editMood').value = entry.mood || '';
    document.getElementById('editWeight').value = entry.weight || '';
    document.getElementById('editSleep').value = entry.sleep_hours || '';
    document.getElementById('editNotes').value = entry.notes || '';
    dialog.showModal();
};

// Tallennetaan muokattu merkintä
const editForm = document.querySelector('.editForm');
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const updatedEntry = {
        entry_date: document.getElementById('editDate').value,
        mood: document.getElementById('editMood').value,
        weight: document.getElementById('editWeight').value || null,
        sleep_hours: document.getElementById('editSleep').value || null,
        notes: document.getElementById('editNotes').value,
    };

    const response = await fetchData(`${API_URL}/entries/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedEntry),
    });

    if (response.error) {
        showMessage('editMessage', 'Virhe: ' + response.error, true);
        return;
    }

    showMessage('editMessage', 'Merkintä päivitetty!');
    setTimeout(() => {
        dialog.close();
        getEntries();
    }, 1500);
});

// Haetaan merkinnät sivun latautuessa
const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);

// Haetaan automaattisesti jos token on olemassa
if (localStorage.getItem('token')) {
    getEntries();
}