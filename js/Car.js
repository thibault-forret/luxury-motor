export class Car {
  /** Nom de la voiture. */
  nameCar;
  /** Nom complet (marque + nom) de la voiture. */
  fullNameCar;
  /** Marque de la voiture. */
  brandCar;
  /** Dictionnaire comportant les tarifs de la voiture. */
  rateCar;
  /** Chemin vers le lien HTML. */
  pathToHtmlLink;
  /** Disponibilité de la voiture. */
  availabilityCar;
  /** Dictionnaire comportant les images de la voiture. */
  imagesCar; // ou string[]
  /** Numéro du slide actuel. */
  currentSlideNumber;
  /** Nombre maximum de slide. */
  maxNumberSlide;
  /**
   * Constructeur de la classe Car.
   * @param {string} name - Nom du véhicule.
   * @param {string} fullName - Nom complet du véhicule.
   * @param {string} brand - Marque du véhicule.
   * @param {object} rate - Tarifs du véhicule (dictionnaire).
   * @param {string} path - Chemin HTML du véhicule.
   * @param {boolean} availability - Disponibilité du véhicule.
   * @param {Array<string>} images - Tableau des images du véhicule.
   */
  constructor(name, fullName, brand, rate, path, availability, images) {
    this.nameCar = name;
    this.fullNameCar = fullName;
    this.brandCar = brand;
    this.rateCar = rate;
    this.pathToHtmlLink = path;
    this.availabilityCar = availability;
    this.imagesCar = images;
    this.currentIndexSlide = 0;
    this.maxIndexSlide = this.imagesCar.length - 1;
  }
  /**
   * Cette méthode sauvegarde le numéro du slide en fonction du bouton pressé (gauche ou droite).
   * @param {string} pressedButtonSide - Le côté du bouton pressé ("left" ou "right").
   */
  changeAndSaveNumberOfSlide(pressedButtonSide) {
    if (pressedButtonSide.toLowerCase() == "right") {
      // Vérifie si le numéro de slide actuel est inférieur au maximum
      if (this.currentIndexSlide < this.maxIndexSlide) {
        // Incrémente le numéro de slide actuel
        this.currentIndexSlide += 1;
      } else {
        // Réinitialise le numéro de slide à zéro si on atteint le maximum
        this.currentIndexSlide = 0;
      }
    } else {
      // Vérifie si le numéro de slide actuel est supérieur à zéro
      if (this.currentIndexSlide > 0) {
        // Décrémente le numéro de slide actuel
        this.currentIndexSlide -= 1;
      } else {
        // Affecte le numéro de slide maximum si on atteint zéro
        this.currentIndexSlide = this.maxIndexSlide;
      }
    }
  }
}
// Exporte la classe Car en tant qu'export par défaut
export * from "./Car.js";
//# sourceMappingURL=Car.js.map
