// BMI-laskurin logiikka
const lowBmi = `Jos painoindeksi on alle 18,5, se merkitsee liiallista laihuutta. Sen syynä voi olla jokin pitkällinen sairaus tai laihuushäiriö. Jos paino on laskenut alle 18,5:n, pitää hakeutua lääkäriin.`;
const normalBmi = `Normaaliksi on valittu se painoindeksin alue, jossa ihmisen terveys on parhaimmillaan. Normaali painoindeksin alue on välillä 18,5–25.`;
const highBmi = `Kun painoindeksi ylittää 25, ollaan liikapainon puolella. Liikakilojen määrä voi vaihdella erittäin paljon, muutamasta kilosta moniin kymmeniin kiloihin.`;

// nollaa BMI-tulosten tyylit ja oletusteksti 
const analysis = document.querySelector('.analysis');
const bmiForm = document.querySelector('.bmi-form');

// näyttää BMI-tuloksen ja korostaa oikean alueen - suoraan esimerkkikoodista
const resetBMIStyles = () => {
    analysis.textContent = 'Syötä pituus ja paino laskeaksesi BMI.';
    document.querySelector('.bmi0-19').classList.remove('lowBmi');
    document.querySelector('.bmi19-25').classList.remove('normalBmi');
    document.querySelector('.bmi25-30').classList.remove('highBmi');
};

const showResult = (bmi) => {
    document.querySelector('.bmi-score').textContent = bmi;
    if (bmi < 18.5) {
        document.querySelector('.bmi0-19').classList.add('lowBmi');
        analysis.textContent = lowBmi;
    } else if (bmi < 25) {
        document.querySelector('.bmi19-25').classList.add('normalBmi');
        analysis.textContent = normalBmi;
    } else {
        document.querySelector('.bmi25-30').classList.add('highBmi');
        analysis.textContent = highBmi;
    }
};

/**
 * Laskee BMI:n valitulla menetelmällä.
 * Perinteinen kaava: paino / pituus²
 * Trefethenin korjattu kaava: 1.3 * paino / pituus^2.5
 * Lähde: Nick Trefethen, Oxford (2013) - https://people.maths.ox.ac.uk/trefethen/bmi.html
 * AI-assisted: kaavan nimi ja muoto selvitetty ChatGPT:n avulla
 */
const calculateBMI = (weight, height) => {
    const heightM = height / 100;
    const method = document.querySelector('input[name="bmiMethod"]:checked').value;

    if (method === 'traditional') {
        const bmi = (weight / heightM ** 2).toFixed(1);
        document.querySelector('.bmi-comparison').style.display = 'none';
        showResult(bmi);
    } else {
        const traditional = (weight / heightM ** 2).toFixed(1);
        const bmi = (1.3 * weight / heightM ** 2.5).toFixed(1);
        const diff = (bmi - traditional).toFixed(1);
        document.querySelector('.bmi-comparison').style.display = 'block';
        document.querySelector('.traditional-score').textContent = traditional;
        document.querySelector('.diff-score').textContent = diff > 0 ? `+${diff}` : diff;
        showResult(bmi);
    }
};

// ehdotetaan Trefethenin kaavaa jos pituus yli 175 cm
document.querySelector('#height').addEventListener('input', (evt) => {
    const height = Number(evt.target.value);
    document.querySelector('.bmi-suggestion').style.display = height > 175 ? 'block' : 'none';
});

// vaihda Trefethenin kaavaan napista
document.querySelector('#switchToTrefethen').addEventListener('click', () => {
    document.querySelector('input[value="trefethen"]').checked = true;
});

bmiForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const weight = Number(document.querySelector('#weight').value);
    const height = Number(document.querySelector('#height').value);
    resetBMIStyles();
    calculateBMI(weight, height);
});