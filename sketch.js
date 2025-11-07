// Copyright (c) 2019 ml5
// MIT License

let dcgan;
let button;
let cnv;
let clicks = 0;

const imageNumber = 7;
const firstAndLastOffset = 100;
const offset = 350;

// Dimensions "print" A4
const BASE_W = 2400;
const BASE_H = 3508;

function preload() {
  dcgan = ml5.DCGAN("model/fullData/manifest.json");
}

function setup() {
  // Canvas haute def
  cnv = createCanvas(BASE_W, BASE_H);
  background(255);
  smooth();

  // Ajuste l'échelle d'affichage
  updatePreviewScale();

  // Bouton ancré en bas
  button = createButton("Générer le poster");
  button.mousePressed(GANGeneration);

  button.style('position', 'fixed');
  button.style('bottom', '20px');
  button.style('left', '50%');
  button.style('transform', 'translateX(-50%)');
  button.style('z-index', '9999');
  button.style('padding', '12px 20px');
  button.style('font-family', 'sans-serif');
  button.style('font-size', '14px');
}

function draw() {
  textSize(40);
  textStyle(ITALIC);
  textFont("Times");
  textAlign(LEFT);
  text("À la Recherche", 60, width + 40);

  textAlign(CENTER);
  textStyle(NORMAL);
  text("Génération", width / 2, width + 40);

  textAlign(RIGHT);
  textStyle(NORMAL);
  stroke(255);
  strokeWeight(20);
  text(clicks, width - 60, width + 40);
  noStroke();
}

function keyPressed() {
  if (keyCode === 83) {
    save(clicks + "_Generations_ÀlaRecherche.jpg");
  }
}

function GANGeneration() {
  button.attribute('disabled', '');
  drawNextImage(0);
}

function drawNextImage(drawingIndex) {
  dcgan.generate(displayImageGeneric(drawingIndex)).then(() => {
    if (drawingIndex < imageNumber - 1) {
      drawNextImage(drawingIndex + 1);
    } else {
      button.removeAttribute('disabled');
    }
  });
}

function displayImageGeneric(index) {
  return function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    clicks++;
    imageMode(CENTER);
    let size = width - offset * index;
    if (index === 0 || index === imageNumber - 1) size -= firstAndLastOffset;
    image(result.image, width / 2, width / 2, size, size);
  };
}

// === Responsive ===

function updatePreviewScale() {
  const margin = 30;
  const buttonHeight = 70; // espace réservé au bouton + marge
  const availableW = windowWidth - margin * 2;
  const availableH = windowHeight - margin * 2 - buttonHeight;

  // On garde le ratio A4
  const scalePreview = Math.min(
    availableW / BASE_W,
    availableH / BASE_H
  );

  // Applique la taille CSS du canvas sans changer la résolution
  cnv.elt.style.width = Math.round(BASE_W * scalePreview) + "px";
  cnv.elt.style.height = Math.round(BASE_H * scalePreview) + "px";

  // Centre le canvas dans la fenêtre
  cnv.elt.style.position = "fixed";
  cnv.elt.style.top = "50%";
  cnv.elt.style.left = "50%";
  cnv.elt.style.transform = "translate(-50%, -50%)";
}

function windowResized() {
  updatePreviewScale();
}
