import { Car } from './Car.js';
// , type Rate
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
        const data = await fetch('../src/car-data.json');
        // Vérifie si la requête a réussi (code HTTP 200 OK).
        if (!data.ok) {
            throw new Error(`HTTP error! Status: ${data.status}`);
        }
        // Transforme les données JSON en un objet JavaScript.
        const dataJSON = await data.json();
        // Transforme l'objet JSON en un tableau de marques de voitures avec des voitures converties en objets 'Car'.
        dataArray = createInstanceOfCar(dataJSON);

        await verifyImagesOfCar(dataArray);

        // Trie le tableau de marques de voitures.
        sortData(dataArray);

        // Appelle potentiellement une fonction 'createCarList(dataArray)' pour effectuer d'autres traitements.
        createCarList(dataArray);
    }
    catch (error) {
        // En cas d'erreur lors de l'exécution de l'une des étapes précédentes,
        // cette partie du code sera exécutée.
        console.error("==========================\n⚠️ ↓ ↓ Error detected ↓ ↓ ⚠️\n" + error);
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
    }
    catch (error) {
        // En cas d'erreur lors de l'exécution de getCars(),
        // cette partie du code sera exécutée.
        console.error("==========================\n⚠️ ↓ ↓ Error detected ↓ ↓ ⚠️\n" + error);
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
            const carInstance = new Car(carsOfBrand[car].name, carsOfBrand[car].brandAndName, data[brand].brand, carsOfBrand[car].parameter.rate, carsOfBrand[car].parameter.path, carsOfBrand[car].parameter.availability, carsOfBrand[car].parameter.image);
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
 * et renvoie le même tableau après l'avoir trié par ordre alphabétique de la marque et des voitures par nom.
 * @param {array} data - Tableau de dictionnaire.
 */
function sortData(data) {
    // Trie les données principales par marque (ordre alphabétique)
    sortBrand(data);
    // Trie les voitures de chaque marque par nom (ordre alphabétique)
    for (let brand in data) {
        sortCarInBrand(brand, data);
    }
}
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
// VOIR SI GARDE DANS LIBRARY AU CAS OU
/*function imageExists(urlImage: string) : Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        fetch('../php/check_image.php?url=' + encodeURIComponent(urlImage))
        .then(response => response.text()) // Récupère le texte de la réponse du script PHP
        .then(data => {
            if (data === 'true') {
                resolve(true);
            } else if (data === 'false') {
                resolve(false);
            } else {
                console.log('Réponse inattendue du serveur.');
                // Gérez le cas où la réponse n'est ni 'true' ni 'false'
            }
        })
        .catch(error => {
            console.error(error.message);
        });
    });
}*/
async function verifyImagesOfCar(dataArray) {
    let carImagesArray = new Array();
    for (let brand of dataArray) {
        for (let car of brand.cars) {
            carImagesArray.push(car.imagesCar);
        }
    }
    let jsonCarImages = JSON.stringify(carImagesArray);
    
    await fetch('../php/verify_images.php', {
        method: 'POST',
        body: jsonCarImages
    })
        .then(response => response.json()) // Récupère le texte de la réponse du script PHP
        .then(data => {
        if (data.error) {
            console.log(data.error);
        }
        else {
            let indexArrayJSON = 0;
            for (let brand of dataArray) {
                for (let car of brand["cars"]) {
                    car.imagesCar = data[indexArrayJSON];
                    indexArrayJSON++;
                }
            }
        }
    })
        .catch(error => {
        console.error('Erreur :' + error.message);
    });
}
function createImageSliderString(car) {
    const imagesHTML = car.imagesCar.map((img, index) => {
        const isActive = (index === 0) ? 'active' : ''; // Ajouter la classe 'active' à la première image
        return `<img class="img-slide ${isActive}" src="${img}">`;
    });
    return imagesHTML.join('\n');
}
async function createCarList(carList) {
    let numberOfCar = 0;
    if (carList.length !== 0) {
        for (let brand of carList) {
            for (let car of brand["cars"]) {
                //console.log(car);
                //console.log(car.imagesCar.length);
                let slider = (car.imagesCar.length === 0) ? `<img class="img-slide active" src="../assets/imgs/catalogue/image_not_available.png">` : createImageSliderString(car);
                let swipeRight = "swipeRight(" + numberOfCar + ")";
                let swipeLeft = "swipeLeft(" + numberOfCar + ")";
                const listItem = document.createElement("div");
                listItem.setAttribute("class", "table-item");
                listItem.innerHTML = `
                <div class="container-img">
                    <a href="javascript:void(0)" onclick="${swipeLeft}">
                        <img class=angle src="../assets/imgs/icone/angle-gauche.png">
                    </a>

                    <div class="slider${numberOfCar}">
                        ${slider}
                    </div>
        
                    <a href="javascript:void(0)" onclick="${swipeRight}">
                        <img class="angle" src="../assets/imgs/icone/angle-droit.png">
                    </a>
                </div>

                <div class="car-info">
                    <p class="name">${car.brandCar} ${car.nameCar}</p>
                    <p class="price">À partir de [METTRE A PARTIR DE RATE]</p>
                    <div class="car-disponibilite">
                        <img src=${car.availabilityCar ? "../assets/imgs/icone/disponible.png" : "../assets/imgs/icone/non-disponible.png"}>
                        <p>${car.availabilityCar ? "available" : "unavailable"}</p>
                    </div>
                    <a href="#${car.nameCar}" class="button">En savoir plus →</a>
                </div>
                `;
                numberOfCar++;
                if (searchResult != null) {
                    searchResult.appendChild(listItem);
                }
            }
        }
    }
    else {
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
    }
    else {
        // Si l'un des éléments n'existe pas, lance une erreur avec un message.
        throw new Error("searchResult or searchNoResult null");
    }
    // Récupère la chaîne saisie par l'utilisateur, convertit en minuscules et supprime les espaces blancs
    const searchedString = elementInput.target.value.toLowerCase().replace(/\s/g, "");
    // Crée une copie de dataArray (tableau d'objets Brand)
    let filteredArray = dataArray.map((element) => ({
        brand: element.brand,
        logo: element.logo,
        cars: element.cars
    }));
    // Parcourt chaque objet Brand dans 'filteredArray'
    for (let brand of filteredArray) {
        // Filtre le tableau 'cars' de chaque objet Brand en fonction de la chaîne de recherche
        brand["cars"] = brand["cars"].filter((car) => car.nameCar.toLowerCase().includes(searchedString) ||
            car.brandCar.toLowerCase().includes(searchedString) ||
            `${car.brandCar + car.nameCar}`.toLowerCase().replace(/\s/g, "").includes(searchedString) ||
            `${car.nameCar + car.brandCar}`.toLowerCase().replace(/\s/g, "").includes(searchedString) ||
            `${car.fullNameCar}`.toLowerCase().replace(/\s/g, "").includes(searchedString));
    }
    filteredArray = filteredArray.filter(brand => brand["cars"].length !== 0);
    // Appelle une fonction 'createCarList' avec le tableau 'filteredArray' filtré comme argument
    createCarList(filteredArray);
}
//# sourceMappingURL=script.js.map