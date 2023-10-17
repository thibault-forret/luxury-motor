import { Car } from "./Car.js";

const searchInput = document.querySelector("#search");
const searchResult = document.querySelector(".table-results");
const searchNoResult = document.querySelector(".table-no-results");

// Rajouter fonctionnalité recherche avec des tries
// Checkbox + Prix entre tel et tel attribut

var dataArray = new Array();

/**
 * Cette fonction asynchrone est utilisée pour récupérer des données de voitures à partir d'un fichier JSON.
 */
async function getCars() {
  try {
    // Effectue une requête pour obtenir les données du fichier JSON.
    const data = await fetch("../src/car-data.json");
    // Vérifie si la requête a réussi (code HTTP 200 OK).
    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }
    // Transforme les données JSON en un objet JavaScript.
    const dataJSON = await data.json();
    // Transforme l'objet JSON en un tableau de marques de voitures avec des voitures converties en objets 'Car'.
    dataArray = createInstanceOfCar(dataJSON);
    // ADD COMMENTAIRE
    await verifyImagesOfCar(dataArray);
    // Trie le tableau de marques de voitures.
    sortData(dataArray);
    // Appelle potentiellement une fonction 'createCarList(dataArray)' pour effectuer d'autres traitements.
    createCarList(dataArray);
  } catch (error) {
    // En cas d'erreur lors de l'exécution de l'une des étapes précédentes,
    // cette partie du code sera exécutée.
    console.error(
      "==========================\n⚠️ ↓ ↓ Error detected ↓ ↓ ⚠️\n" + error
    );
    // Affiche l'erreur détaillée dans
  }
}

/**
 * Cette fonction asynchrone est utilisée pour récupérer des données de voitures.
 */
async function fetchData() {
  try {
    // Attend que la fonction getCars() soit résolue (ou complétée).
    await getCars();
  } catch (error) {
    // En cas d'erreur lors de l'exécution de getCars(),
    // cette partie du code sera exécutée.
    console.error(
      "==========================\n⚠️ ↓ ↓ Error detected ↓ ↓ ⚠️\n" + error
    );
    // Affiche l'erreur détaillée dans la console pour le débogage.
  }
}

// Appelez la fonction asynchrone pour récupérer les données
fetchData();

/**
 * Convertit chaque voiture en un objet de type 'Car'
 * et remplace le tableau de voitures d'origine par le nouveau tableau de voitures converties.
 * @param {Array<Brand>} carList - Liste des voitures classées par marque.
 * @returns {Array<Brand>} Liste de voitures transformer en instance de la classe Car.
 */
function createInstanceOfCar(data) {
  var brandArray = [];
  // Boucle à travers la liste des marques de voitures
  for (let brand in data) {
    // Récupère le tableau des voitures de la marque actuelle
    const carsOfBrand = data[brand]["cars"];
    // Crée un nouveau tableau pour stocker les voitures converties en objets 'Car'
    let carListInstance = new Array();
    // Boucle à travers les voitures de la marque actuelle
    for (let car in carsOfBrand) {
      // Crée une instance de la classe 'Car' en utilisant les propriétés de la voiture actuelle
      const carInstance = new Car(
        carsOfBrand[car].name,
        carsOfBrand[car].brandAndName,
        data[brand].brand,
        carsOfBrand[car].parameter.rate,
        carsOfBrand[car].parameter.path,
        carsOfBrand[car].parameter.availability,
        carsOfBrand[car].parameter.image
      );
      // Ajoute l'instance de 'Car' au nouveau tableau
      carListInstance.push(carInstance);
    }
    // Remplace le tableau de voitures d'origine par le nouveau tableau de voitures converties
    data[brand]["cars"] = carListInstance;
    brandArray[brand] = data[brand];
    //brandArray[brand]["logo"] = data[brand]["logo"];
    //brandArray[brand]["cars"] = carListInstance;
  }
  return brandArray; // type brand
}

// CHANGER COMMENTAIRE ORDERLIST
/**
 * Prend un tableau d'objets de type 'Brand' en entrée
 * et trie le tableau par ordre alphabétique de la marque et des voitures par nom.
 * @param {array} data - Tableau de dictionnaire de type Brand.
 */
function sortData(data) {
  // Trie les données principales par marque (ordre alphabétique)
  sortBrand(data);
  // Trie les voitures de chaque marque par nom (ordre alphabétique)
  for (let brand in data) {
    sortCarInBrand(brand, data);
  }
}

/**
 * Trie le tableau de données par marque (ordre alphabétique).
 * @param {array} data - Tableau de dictionnaire de type Brand.
 */
function sortBrand(data) {
  data.sort((a, b) => {
    const currentBrand = a.brand.toLowerCase();
    const nextBrand = b.brand.toLowerCase();
    // Compare les marques pour déterminer l'ordre de tri
    if (currentBrand < nextBrand) {
      return -1; // a est avant b
    }
    if (currentBrand > nextBrand) {
      return 1; // a est après b
    }
    return 0; // les marques sont égales
  });
}

/**
 * Trie le tableau de voitures d'une marque spécifique par nom (ordre alphabétique).
 * @param {string/number} brand - Marque que l'on souhaite trier.
 * @param {array} data - Tableau de dictionnaire de type Brand.
 */
function sortCarInBrand(brand, data) {
  // Récupère le tableau des voitures de la marque actuelle
  const carsOfBrand = data[brand]["cars"];
  // Trie les voitures par nom (ordre alphabétique)
  carsOfBrand.sort((a, b) => {
    const currentBrandAndName = a.fullNameCar.toLowerCase(); // brand and name
    const nextBrandAndName = b.fullNameCar.toLowerCase();
    // Compare les noms des voitures pour déterminer l'ordre de tri
    if (currentBrandAndName < nextBrandAndName) {
      return -1; // a est avant b
    }
    if (currentBrandAndName > nextBrandAndName) {
      return 1; // a est après b
    }
    return 0; // les noms sont égaux
  });
}

async function verifyImagesOfCar(dataArray) {
  let carImagesArray = new Array();
  for (let brand of dataArray) {
    for (let car of brand.cars) {
      carImagesArray.push(car.imagesCar);
    }
  }
  let jsonCarImages = JSON.stringify(carImagesArray);
  await fetch("../php/verify_images.php", {
    method: "POST",
    body: jsonCarImages,
  })
    .then((response) => response.json()) // Récupère le texte de la réponse du script PHP
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        let indexArrayJSON = 0;
        for (let brand of dataArray) {
          for (let car of brand.cars) {
            car.imagesCar = data[indexArrayJSON];
            indexArrayJSON++;
            car.maxIndexSlide = car.imagesCar.length - 1;
            if (car.imagesCar.length === 0) {
              car.currentIndexSlide = 0;
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error("Erreur :" + error.message);
    });
}

function createImageSliderString(car) {
  const imagesHTML = car.imagesCar.map((img, index) => {
    const isActive = index === 0 ? "img-active" : ""; // Ajouter la classe 'active' à la première image
    return `<img class="img-slide ${isActive}" src="${img}">`;
  });
  // Remise de currentIndexSlide à 0 pour éviter le décalage lors de la recherche
  car.currentIndexSlide = 0;
  return imagesHTML.join("\n");
}

function swipeImagesOfSlider(pressedButton, indiceBrand, indiceCarInBrand) {
  let carElement = dataArray[indiceBrand]["cars"][indiceCarInBrand];

  const className = `.slider_${indiceBrand}_${indiceCarInBrand} img`;

  let slider = document.querySelectorAll(className);

  slider[carElement.currentIndexSlide].classList.remove("img-active");

  carElement.changeAndSaveNumberOfSlide(pressedButton);

  slider[carElement.currentIndexSlide].classList.add("img-active");
}

window.swipeImagesOfSlider = swipeImagesOfSlider;

function showCarListInBrand(idBrand) {
  const idName = "id_brand_" + idBrand;

  var element = document.getElementById(idName);
  element.classList.toggle("container-car-active");
  /*
  if (element !== null) {
    if (element.style.display === "grid") {
      element.style.display = "none";
    } else {
      element.style.display = "grid";
    }
  }
*/
  const className = ".brand_" + idBrand;
  let imgCloseOpen = document.querySelector(className);

  if (imgCloseOpen.length !== null) {
    let imgElements = imgCloseOpen.querySelectorAll("img");

    if (imgElements.length === 2) {
      // Vérifiez s'il y a exactement deux images
      // Inversez les classes des images
      imgElements[0].classList.toggle("brand-img-active");
      imgElements[1].classList.toggle("brand-img-active");
    }
  }
}

window.showCarListInBrand = showCarListInBrand;

// Décomposer en plusieurs fonction
function createCarList(carList) {
  if (carList.length !== 0) {
    let noImagesAvailable = `<img class="img-slide img-active" src="../assets/imgs/catalogue/image_not_available.png">`;

    for (let brand in carList) {
      const divTableItem = document.createElement("div");
      divTableItem.setAttribute("class", "table-item scroll-target");
      divTableItem.setAttribute("id", `id_${brand}`);

      const divTableBrand = document.createElement("div");
      divTableBrand.setAttribute("class", "table-brand");
      divTableBrand.innerHTML = `
            <div class="container-logo-brand"> 
                <img class="brand-logo" src="${carList[brand]["logo"]}">
            </div>

            <div class="brand-info">
                <div class="brand-name">${carList[brand]["brand"]}</div>
                <div class="nbr-resultat">Nombre de résultat : ${carList[brand]["cars"].length}</div>
            </div>
            `;

      const divVoirPlus = document.createElement("div");
      divVoirPlus.setAttribute("class", "table-voir-plus");

      divVoirPlus.innerHTML = `
            <a href="#id_${brand}" class="brand_${brand}" onclick="window.showCarListInBrand(${brand})">
                <img class="brand-button brand-img-active" src="../assets/imgs/catalogue/voir_plus_open.png">
                <img class="brand-button" src="../assets/imgs/catalogue/voir_plus_close.png">
            </a>
            `;

      const divContainerBrandCar = document.createElement("div");
      divContainerBrandCar.setAttribute("class", "table-container-brand-car");

      const divContainerCar = document.createElement("div");
      divContainerCar.setAttribute("class", "table-container-car");
      divContainerCar.setAttribute("id", `id_brand_${brand}`);

      let numberOfCar = 0;
      for (let car of carList[brand]["cars"]) {
        let slider =
          car.imagesCar.length === 0
            ? noImagesAvailable
            : createImageSliderString(car);

        let swipeRight = `window.swipeImagesOfSlider('right', ${brand}, ${numberOfCar})`;
        let swipeLeft = `window.swipeImagesOfSlider('left', ${brand}, ${numberOfCar})`;

        let containerImg;
        if (car.imagesCar.length === 0) {
          containerImg = noImagesAvailable;
        } else {
          containerImg = `
                    <a href="javascript:void(0)" onclick="${swipeLeft}">
                        <img class=angle src="../assets/imgs/icone/angle-gauche.png">
                    </a>

                    <div class="slider_${brand}_${numberOfCar}">
                        ${slider}
                    </div>

                    <a href="javascript:void(0)" onclick="${swipeRight}">
                        <img class="angle" src="../assets/imgs/icone/angle-droit.png">
                    </a>
                    `;
        }

        const divCar = document.createElement("div");
        divCar.setAttribute("class", "table-car");
        divCar.innerHTML = `
                <div class="container-img">
                    ${containerImg}
                </div>

                <div class="car-info">
                    <p class="name">${car.brandCar} ${car.nameCar}</p>
                    <p class="price">À partir de [METTRE A PARTIR DE RATE]</p>
                    <div class="car-disponibilite">
                        <img src=${
                          car.availabilityCar
                            ? "../assets/imgs/icone/disponible.png"
                            : "../assets/imgs/icone/non-disponible.png"
                        }>
                        <p>${
                          car.availabilityCar ? "available" : "unavailable"
                        }</p>
                    </div>
                    <a href="#${
                      car.nameCar
                    }" class="button">En savoir plus →</a>
                </div>
                `;
        numberOfCar++;
        if (divContainerCar !== null) {
          divContainerCar.appendChild(divCar);
        }
      }
      if (divTableItem !== null) {
        divContainerBrandCar.appendChild(divTableBrand);
        divContainerBrandCar.appendChild(divContainerCar);
        divTableItem.appendChild(divContainerBrandCar);

        /*divTableItem.appendChild(divTableBrand);
        divTableItem.appendChild(divContainerCar);*/
        divTableItem.appendChild(divVoirPlus);

        if (searchResult !== null) {
          searchResult.appendChild(divTableItem);
        }
      }
    }
  } else {
    const listItem = document.createElement("div");
    listItem.setAttribute("class", "table-noresults");
    listItem.innerHTML = `
            Aucun résultat correspondant à votre recherche.
        `;
    if (searchNoResult != null) {
      searchNoResult.appendChild(listItem);
    }
  }
}

// Vérifie si l'élément DOM avec l'ID 'searchInput' existe
if (searchInput != null) {
  // Si 'searchInput' existe, ajoute un écouteur d'événement 'input' qui
  // déclenchera la fonction 'filterData' lorsqu'un utilisateur saisit dans l'input.
  searchInput.addEventListener("input", filterData);
}

// Définition de la fonction 'filterData' qui sera appelée en réponse à l'événement 'input'
/**
 * Fonction permettant de filtrer les résultats en fonction d'un texte entré.
 * @param elementInput - Contient des informations sur l'événement lui-même
 */
function filterData(elementInput) {
  // Vérifie si les éléments DOM avec les ID 'searchResult' et 'searchNoResult' existent
  if (searchResult != null && searchNoResult != null) {
    // Si ces éléments existent, vide leur contenu.
    searchResult.innerHTML = "";
    searchNoResult.innerHTML = "";
  } else {
    // Si l'un des éléments n'existe pas, lance une erreur avec un message.
    throw new Error("searchResult or searchNoResult null");
  }
  // Récupère la chaîne saisie par l'utilisateur, convertit en minuscules et supprime les espaces blancs
  const searchedString = elementInput.target.value
    .toLowerCase()
    .replace(/\s/g, "");
  // Crée une copie de dataArray (tableau d'objets Brand)
  let filteredArray = dataArray.map((element) => ({
    brand: element.brand,
    logo: element.logo,
    cars: element.cars,
  }));
  // Parcourt chaque objet Brand dans 'filteredArray'
  for (let brand of filteredArray) {
    // Filtre le tableau 'cars' de chaque objet Brand en fonction de la chaîne de recherche
    brand["cars"] = brand["cars"].filter(
      (car) =>
        car.nameCar.toLowerCase().includes(searchedString) ||
        car.brandCar.toLowerCase().includes(searchedString) ||
        `${car.brandCar + car.nameCar}`
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchedString) ||
        `${car.nameCar + car.brandCar}`
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchedString) ||
        `${car.fullNameCar}`
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchedString)
    );
  }
  filteredArray = filteredArray.filter((brand) => brand["cars"].length !== 0);
  // Appelle une fonction 'createCarList' avec le tableau 'filteredArray' filtré comme argument
  createCarList(filteredArray);
}

function showNavbar() {
  var element = document.getElementById("links");
  if (element !== null) {
    if (element.style.display == "block") {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
}

window.showNavbar = showNavbar;
