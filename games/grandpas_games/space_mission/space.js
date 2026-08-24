const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const fuelDisplay = document.getElementById("fuel");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const message = document.getElementById("message");

let x = 50;
let y = 80;

let score = 0;
let lives = 3;
let fuel = 100;

let playing = false;

let star = null;


// ================================
// START GAME
// ================================

function startGame() {

  playing = true;

  score = 0;
  lives = 3;
  fuel = 100;

  x = 50;
  y = 80;

  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  fuelDisplay.textContent = fuel;

  player.style.left = x + "%";
  player.style.top = y + "%";
  player.style.bottom = "auto";

  startButton.style.display = "none";
  restartButton.style.display = "none";

  message.textContent =
    "🚀 Mission started! Collect the stars!";

  createStar();
}


// ================================
// CREATE STAR
// ================================

function createStar() {

  if (star) {
    star.remove();
  }

  star = document.createElement("div");

  star.id = "star";
  star.textContent = "⭐";

  star.style.position = "absolute";
  star.style.fontSize = "50px";
  star.style.left = (Math.random() * 70 + 15) + "%";
  star.style.top = (Math.random() * 60 + 10) + "%";

  gameArea.appendChild(star);
}


// ================================
// MOVE PLAYER
// ================================

function movePlayer(direction) {

  if (!playing) return;

  if (direction === "left") {
    x -= 5;
  }

  if (direction === "right") {
    x += 5;
  }

  if (direction === "up") {
    y -= 5;
  }

  if (direction === "down") {
    y += 5;
  }

  // Keep rocket inside game area

  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(90, y));

  player.style.left = x + "%";
  player.style.top = y + "%";

  fuel--;

  if (fuel < 0) {
    fuel = 0;
  }

  fuelDisplay.textContent = fuel;

  checkStar();

  if (fuel === 0) {
    gameOver("⛽ Russell ran out of fuel!");
  }
}


// ================================
// CHECK STAR
// ================================

function checkStar() {

  if (!star) return;

  const playerRect = player.getBoundingClientRect();
  const starRect = star.getBoundingClientRect();

  const playerX =
    playerRect.left + playerRect.width / 2;

  const playerY =
    playerRect.top + playerRect.height / 2;

  const starX =
    starRect.left + starRect.width / 2;

  const starY =
    starRect.top + starRect.height / 2;

  const distance = Math.hypot(
    playerX - starX,
    playerY - starY
  );

  if (distance < 60) {

    score++;

    scoreDisplay.textContent = score;

    message.textContent =
      "⭐ Awesome! You found a star!";

    createStar();
  }
}


// ================================
// GAME OVER
// ================================

function gameOver(text) {

  playing = false;

  message.textContent = text;

  startButton.style.display = "none";
  restartButton.style.display = "inline-block";
}


// ================================
// BUTTONS
// ================================

leftButton.addEventListener("click", function () {
  movePlayer("left");
});

rightButton.addEventListener("click", function () {
  movePlayer("right");
});

startButton.addEventListener("click", function () {
  startGame();
});

restartButton.addEventListener("click", function () {
  startGame();
});


// ================================
// KEYBOARD
// ================================

document.addEventListener("keydown", function (event) {

  if (!playing) return;

  if (
    event.key === "ArrowLeft" ||
    event.key.toLowerCase() === "a"
  ) {
    event.preventDefault();
    movePlayer("left");
  }

  if (
    event.key === "ArrowRight" ||
    event.key.toLowerCase() === "d"
  ) {
    event.preventDefault();
    movePlayer("right");
  }

  if (
    event.key === "ArrowUp" ||
    event.key.toLowerCase() === "w"
  ) {
    event.preventDefault();
    movePlayer("up");
  }

  if (
    event.key === "ArrowDown" ||
    event.key.toLowerCase() === "s"
  ) {
    event.preventDefault();
    movePlayer("down");
  }

});