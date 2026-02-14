import "../css/api.css";
console.log("scripti starttaa");

const getItemsBtn = document.querySelector(".get_items"); // etsi nappi hae
const fruitList = document.querySelector(".fruitlist"); // etsi (tyhjä) lista-elementti
const deleteBtn = document.querySelector(".delete-item"); // etsi nappi poista

const getAllItems = async () => {
  // async - await (promise)
  try {
    // try - catch
    const response = await fetch("http://localhost:3000/api/items"); // fetch pyyntö backendiin - await odota

    if (!response.ok) {
      throw new Error("Verkkovastaus ei ollut kunnossa!!");
    }

    const items = await response.json(); // json-data js-taulukoksi - await odota toimintoa
    console.log("Kaikki items:", items);

    fruitList.innerHTML = ""; // tyhjennetään lista

    items.forEach((item) => {
      // käydään jokainen item läpi
      const li = document.createElement("li"); // luodaan jokaisesta uusi lista-alkio
      li.textContent = `id ${item.id} - ${item.name}`; // asetetaan listan tekstiksi 'id', id ja nimi
      fruitList.appendChild(li); // lisätään näin luotu alkio näkyviin sivulle <ul>-elemnttiin
    });
  } catch (error) {
    console.error("Virhe tapahtunut:", error);
  }
};
getItemsBtn.addEventListener("click", getAllItems); // kuuntelija - jos 'click' niin 'getAllItems'

const getItemForm = document.querySelector(".get-item-form"); //haetaan lomake
const itemIdInput = document.querySelector("#itemId"); // arvo kjohdasta 'itemId'

getItemForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const id = itemIdInput.value; // value on senhetkinen arvo
    const response = await fetch(`http://localhost:3000/api/items/${id}`); //sijoitetaan id

    if (!response.ok) {
      throw new Error("Tuotetta ei löytynyt annetulla ID:llä");
    }
    const item = await response.json(); //json to .js
    alert(`id ${item.id} ${item.name}`);
  } catch (error) {
    alert(error.message);
  }
});

deleteBtn.addEventListener("click", async () => {
  const id = itemIdInput.value;

  if (!id) {
    alert("Syötä ID poistaaksesi tuotteen.");
    return;
  }

  if (!confirm("Haluatko varmasti poistaa tuotteen " + id + "?")) return;

  try {
    const response = await fetch("http://localhost:3000/api/items/" + id, {
      method: "DELETE",
	  
	});
	
	if (!response.ok) { 
		throw new Error("Poisto epäonnistui!"); }

  } catch (error) {
    alert(error.message);
  }
});

const addItemForm = document.querySelector(".add-item-form"); 
const nameInput = document.querySelector("#newItemName");
const weightInput = document.querySelector("#newItemWeight");

addItemForm.addEventListener("submit", async (event) => {
	event.preventDefault();
	const name = document.querySelector("#newItemName").value;
	const weight = document.querySelector("#newItemWeight").value;
	const itemData = {
    name: name,
    // Jos paino-kenttä ei ole tyhjä, muutetaan se numeroksi. Muuten laitetaan null.
    weight: weight !== "" ? Number(weight) : null
  };
  	try {
    const response = await fetch("http://localhost:3000/api/items", {
      method: "POST", // Kerrotaan, että ollaan lisäämässä uutta
      headers: {
        "Content-Type": "application/json", // Kerrotaan, että lähetys on JSON-muotoista
      },
      body: JSON.stringify(itemData), // Muutetaan objekti tekstiksi verkkosiirtoa varten
    });

    if (response.ok) {
      const result = await response.json();
      alert(`Lisätty onnistuneesti! Uusi ID on: ${result.item.id}`); // piti mennä .item
      
      // Tyhjennetään lomake seuraavaa hedelmää varten
      addItemForm.reset();
    }
  } catch (error) {
    console.error("Virhe lisäyksessä:", error);
  }

});

const putForm = document.querySelector(".put-item-form");
const putIdInput = document.querySelector("#putItemId");     
const putNameInput = document.querySelector("#putItemName"); 
const loadBtn = document.querySelector(".load-item");        


loadBtn.addEventListener("click", async () => {
  const id = putIdInput.value;
  if (!id) return alert("Syötä ID ensin!");

  try {
    // GET-haku ID:n perusteella
    const response = await fetch(`http://localhost:3000/api/items/${id}`);
    
    if (!response.ok) throw new Error("Itemiä ei löytynyt");

    const item = await response.json();
    
    // Asetetaan haettu nimi suoraan muokkauskentän arvoksi
    putNameInput.value = item.name;
    
  } catch (error) {
    alert(error.message);
  }
});

putForm.addEventListener("submit", async (event) => {
  event.preventDefault(); 
  const id = putIdInput.value;
  
  // Rakennetaan paketti, jossa on uusi nimi
  const updatedData = {
    name: putNameInput.value
  };

  try {
    const response = await fetch(`http://localhost:3000/api/items/${id}`, {
      method: "PUT", // Metodi vaihtuu PUT-muotoon
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData) // Muutetaan paketti tekstiksi
    });
if (response.ok) {
      const result = await response.json();
      
      // Näytetään onnistumisviesti (muistetaan result.item lokero!)
      alert(`Päivitys onnistui! Uusi nimi on: ${result.item.name}`);
      
      // Valinnainen: tyhjennetään lomake
      putForm.reset();
    } else {
      throw new Error("Päivitys epäonnistui");
    }
  } catch (error) {
    alert(error.message);
  }
});

const tableBody = document.querySelector(".tbody");

const renderTable = async () => {
  const response = await fetch("http://localhost:3000/api/items");
  const items = await response.json();
  tableBody.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");

    // Rakennetaan rivin sisältö dynaamisesti
    row.innerHTML = `
      <td>${item.name}</td>
      <td><button class="check" data-id="${item.id}">Info</button></td>
      <td><button class="del" data-id="${item.id}">Delete</button></td>
      <td>${item.id}</td>
    `;

    tableBody.appendChild(row);
  });
};
const getAllBtn = document.querySelector(".get_items_table"); 

getAllBtn.addEventListener("click", () => {
  renderTable(); 
});