"use strict";
let count = 0;
let classNameLog = "";
// A OPTI AVEC ATTRIBUT CLASS CAR 
function swipeRight(indiceClass) {
    const className = ".slider" + indiceClass + " img";
    if (classNameLog != className && classNameLog != "") {
        const ancienSlider = document.querySelectorAll(classNameLog);
        ancienSlider[0].classList.add('active');
        if (count != 0) {
            ancienSlider[count].classList.remove('active');
        }
        count = 0;
    }
    classNameLog = className;
    const slider = document.querySelectorAll(className); // '.slider${indiceClass} img'
    console.log(slider);
    const nbSlide = slider.length;
    slider[count].classList.remove('active');
    if (count < nbSlide - 1) {
        count++;
    }
    else {
        count = 0;
    }
    slider[count].classList.add('active');
}
function swipeLeft(indiceClass) {
    const className = ".slider" + indiceClass + " img";
    const slider = document.querySelectorAll(className);
    const nbSlide = slider.length;
    if (classNameLog != className) {
        const ancienSlider = document.querySelectorAll(classNameLog);
        ancienSlider[0].classList.add('active');
        if (count != 0) {
            ancienSlider[count].classList.remove('active');
        }
        count = 0;
    }
    classNameLog = className;
    slider[count].classList.remove('active');
    if (count > 0) {
        count--;
    }
    else {
        count = nbSlide - 1;
    }
    slider[count].classList.add('active');
}
// Menu Burger
// Navbar - Mobile

//# sourceMappingURL=swipe.js.map