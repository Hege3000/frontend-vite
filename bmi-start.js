import './bmi.css';


// Painoindeksitiedot
const lowBmi = `Jos painoindeksi on alle 18,5, se merkitsee liiallista laihuutta. Sen syynä voi olla jokin pitkällinen sairaus tai laihuushäiriö eli anoreksia. Jos varsinaista sairautta ei ole, mutta painoindeksi on laskenut alle 18,5:n, pitää hakeutua lääkäriin. Jos paino muutamassa kuukaudessa on laskenut yli 20:n tasolta reilusti, on varminta mennä lääkäriin jo painoindeksin lähestyessä 19:ää.`;

const normalBmi = `Normaaliksi on valittu se painoindeksin alue, jossa ihmisen terveys on parhaimmillaan. Normaali painoindeksin alue on välillä 18,5–25. Jos painoindeksi on pienempi kuin 18,5 tai suurempi kuin 25, sairauksien vaara suurenee. Painoindeksiä voidaan käyttää 18 vuoden iästä lähtien.`;

const highBmi = `Kun painoindeksi ylittää 25, ollaan liikapainon puolella. Liikakilojen määrä voi vaihdella erittäin paljon, muutamasta kilosta moniin kymmeniin kiloihin. Siksi on hyödyllistä täsmentää, kuinka suuresta ylipainosta on kyse.`;
const analysis = document.querySelector('.analysis');
// Haetaan DOM-elementit kerran





const bmiForm = document.querySelector('form');
// lisää muut

// Näytä analyysialueen  oletusviesti

// Painoindeksilaskuri
bmiForm.addEventListener('submit', (evt) => {
  // Estä normaali formin lähettäminen
  evt.preventDefault();
  // Hae formin arvot

  // yleensä UIsta saadaan aina lähtökohtaisesti string elementti
  // Number yrittää muuntaa merkkijonon numeroksi. Jos muunnos epäonnistuu, funktio palauttaa erityisen arvon NaN (Not-a-Number).
const weightInput = document.querySelector('#weight');
console.log(weightInput.value);
const weight = Number(weightInput.value);

const heightInput = document.querySelector('#height');
console.log(heightInput.value);
const height = Number(heightInput.value)


  resetBMIStyles();
  calculateBMI(weight, height);
});

// Tyylien nollaus
const resetBMIStyles = () => {
analysis.innerHTML = '';
document.querySelector('.bmi0-19').classList.remove('lowBmi');
document.querySelector('.bmi19-25').classList.remove('normalBmi');
document.querySelector('.bmi25-30').classList.remove('highBmi');


  // hae elementit ja poista classList remove tyylit
};

// BMI:n laskenta ja analyysin päivitys

  // näytä sivullal laskettu BMI arvo
  // tee pieni if/else jossa bmin mukaan
  // annat halutulle taulukon riville oikea teksti
  // sekä luokan joka värjää taustan


const calculateBMI = (weight, height) => {
   const bmi = (weight / (height / 100) ** 2).toFixed(1);
   console.log('BMI',bmi)
  const bmiElem = document.querySelector('.bmi-score');
  console.log(bmiElem);
  bmiElem.textContent = bmi;

  if (bmi < 18.9) {
    console.log('Olet alipainoinen');
    document.querySelector('.bmi0-19').classList.add('lowBmi');
    analysis.textContent = lowBmi;


  } else if (bmi < 25 ) {
      console.log('olet normaalipainoinen');
    document.querySelector('.bmi19-25').classList.add('normalBmi');
    analysis.textContent = normalBmi;


  } else {
    console.log('ylipaino');
    document.querySelector('.bmi25-30').classList.add('highBmi');
    analysis.textContent = highBmi;

  }
  
      


};