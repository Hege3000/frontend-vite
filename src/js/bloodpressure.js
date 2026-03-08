// AI-assisted: tiedoston rakenne ja logiikka toteutettu AI:n avulla
import { fetchData } from './fetch.js';

const API_URL = 'http://localhost:3000/api';
const bpContainer = document.querySelector('.bp-card-area');

// näyttää onnistumis- tai virheviestin käyttäjälle
const showMessage = (elementId, message, isError = false) => {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = isError ? 'error' : 'success';
};

// hakee tokenin localStoragesta ja palauttaa Authorization-otsikon
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// verenpaineen tila värikoodin mukaan
const getBpStatus = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return { label: 'Normaali', css: 'bp-normal' };
    if (systolic < 130 && diastolic < 80) return { label: 'Koholla', css: 'bp-elevated' };
    return { label: 'Korkea', css: 'bp-high' };
};

// Dialog
const dialog = document.querySelector('.bp_dialog');
document.getElementById('closeBpDialog').addEventListener('click', () => dialog.close());

// Uuden mittauksen lomake
const addBpBtn = document.querySelector('.add_bp_btn');
const addBpForm = document.getElementById('addBpForm');
document.getElementById('cancelBp').addEventListener('click', () => {
    addBpForm.style.display = 'none';
});
addBpBtn.addEventListener('click', () => {
    addBpForm.style.display = 'block';
});

// Kortit
const renderCards = (measurements) => {
    bpContainer.innerHTML = '';

    if (measurements.length === 0) {
        bpContainer.innerHTML = '<p>Ei mittauksia.</p>';
        return;
    }

    measurements.forEach((bp) => {
        const status = getBpStatus(bp.systolic, bp.diastolic);
        const date = bp.measured_at
            ? new Date(bp.measured_at).toLocaleString('fi-FI')
            : '-';

        const card = document.createElement('div');
        card.classList.add('bp-card');
        card.innerHTML = `
                <img src="./img/verenpaine.jpg" alt="verenpaine" style="width:100%; height:180px; object-fit:cover;" />
                <div class="bp-card-text">
                <p class="bp-value ${status.css}">${bp.systolic}/${bp.diastolic} mmHg</p>
                <p><strong>Tila:</strong> <span class="${status.css}">${status.label}</span></p>
                <p><strong>Pulssi:</strong> ${bp.pulse ? bp.pulse + ' bpm' : '-'}</p>
                <p><strong>Aika:</strong> ${date}</p>
                <p><strong>Muistiinpanot:</strong> ${bp.notes || '-'}</p>
            </div>
            <div class="bp-card-actions">
                <button class="editBpBtn" data-id="${bp.bp_id}">Muokkaa</button>
                <button class="deleteBpBtn" data-id="${bp.bp_id}">Poista</button>
            </div>
        `;

        card.querySelector('.editBpBtn').addEventListener('click', () => openEditDialog(bp));
        card.querySelector('.deleteBpBtn').addEventListener('click', async () => {
            if (!confirm('Haluatko varmasti poistaa tämän mittauksen?')) return;
            await deleteBp(bp.bp_id);
        });

        bpContainer.appendChild(card);
    });
};

// hae kaikki mittaukset
const getBp = async (params = '') => {
    const response = await fetchData(`${API_URL}/bloodpressure${params}`, {
        headers: getAuthHeaders(),
    });

    if (response.error) {
        bpContainer.innerHTML = '<p>Kirjaudu sisään nähdäksesi mittaukset.</p>';
        return;
    }
    renderCards(response);
};

// Hae-nappi
document.querySelector('.get_bp').addEventListener('click', () => getBp());

// Päivämääräsuodatus
document.getElementById('filterBtn').addEventListener('click', () => {
    const from = document.getElementById('filterFrom').value;
    const to = document.getElementById('filterTo').value;

    if (from && to) {
        getBp(`?from=${from}&to=${to}`);
    } else if (from) {
        getBp(`?date=${from}`);
    } else {
        getBp();
    }
});

document.getElementById('clearFilterBtn').addEventListener('click', () => {
    document.getElementById('filterFrom').value = '';
    document.getElementById('filterTo').value = '';
    getBp();
});

// Lisää uusi mittaus
document.querySelector('.bpForm').addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const newBp = {
        systolic: Number(document.getElementById('systolic').value),
        diastolic: Number(document.getElementById('diastolic').value),
        pulse: document.getElementById('pulse').value ? Number(document.getElementById('pulse').value) : null,
        measured_at: document.getElementById('measured_at').value || null,
        notes: document.getElementById('notes').value || null,
    };

    const response = await fetchData(`${API_URL}/bloodpressure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newBp),
    });

    if (response.error) {
        showMessage('bpMessage', 'Virhe: ' + response.error, true);
        return;
    }

    showMessage('bpMessage', 'Mittaus lisätty!');
    document.querySelector('.bpForm').reset();
    addBpForm.style.display = 'none';
    await getBp();
});

// Poista mittaus
const deleteBp = async (id) => {
    const response = await fetchData(`${API_URL}/bloodpressure/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (response.error) {
        alert('Poisto epäonnistui: ' + response.error);
        return;
    }
    await getBp();
};

// Avaa dialog muokkausta varten
const openEditDialog = (bp) => {
    document.getElementById('editBpId').value = bp.bp_id;
    document.getElementById('editSystolic').value = bp.systolic || '';
    document.getElementById('editDiastolic').value = bp.diastolic || '';
    document.getElementById('editPulse').value = bp.pulse || '';
    document.getElementById('editMeasuredAt').value = bp.measured_at
        ? new Date(bp.measured_at).toISOString().slice(0, 16)
        : '';
    document.getElementById('editNotes').value = bp.notes || '';
    dialog.showModal();
};

// Tallenna muokattu mittaus
document.querySelector('.editBpForm').addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const id = document.getElementById('editBpId').value;
    const updatedBp = {
        systolic: Number(document.getElementById('editSystolic').value) || null,
        diastolic: Number(document.getElementById('editDiastolic').value) || null,
        pulse: document.getElementById('editPulse').value ? Number(document.getElementById('editPulse').value) : null,
        measured_at: document.getElementById('editMeasuredAt').value || null,
        notes: document.getElementById('editNotes').value || null,
    };

    const response = await fetchData(`${API_URL}/bloodpressure/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updatedBp),
    });

    if (response.error) {
        showMessage('editBpMessage', 'Virhe: ' + response.error, true);
        return;
    }

    showMessage('editBpMessage', 'Mittaus päivitetty!');
    setTimeout(() => {
        dialog.close();
        getBp();
    }, 1500);
});

// Haetaan automaattisesti jos token on olemassa
if (localStorage.getItem('token')) {
    getBp();
}