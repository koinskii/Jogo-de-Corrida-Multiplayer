var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player,game;
var playerCount,gameState;
var track;
var car1img, car2img
var car1, car2, cars = []
function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  track = loadImage("./assets/track.jpg")
  car1img = loadImage("./assets/car1.png")
  car2img = loadImage("./assets/car2.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.start();

  game.getState()
}

function draw() {
  background(backgroundImage);

  if (playerCount == 2) {
    game.updateState(1)
  }

  if (gameState == 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
