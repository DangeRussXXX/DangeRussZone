/* ============================================================
   LIL' RUSSELL'S SPACE MISSION
   ============================================================ */

// Get game elements
const rocket = document.getElementById("player");
const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const fuelDisplay = document.getElementById("fuel");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const message = document.getElementById("message");


// ============================================================
// GAME VARIABLES
// ============================================================

let score = 0;
let lives = 3;
let fuel = 100;

let rocketX = 50;
let rocketY = 80;

let gameRunning = false;

let star;


// ============================================================
// CREATE STAR
// ============================================================

function createStar() {

  star = document.createElement("div");

  star.id = "star";
  star.textContent = "⭐";

  gameArea.appendChild(star);

  moveStar();
}


// ============================================================
// MOVE STAR TO RANDOM LOCATION
// ============================================================

function moveStar() {

  if (!star) return;

  const maxX = 85;
  const maxY = 70;

  const randomX = Math.random() * (maxX - 10) + 10;
  const randomY = Math.random() * (maxY - 10) + 10;

  star.style.left = randomX + "%";
  star.style.top = randomY + "%";
}


// ============================================================
// MOVE ROCKET
// ============================================================

function moveRocket(direction) {

  if (!gameRunning) return;

  if (direction === "left") {
    rocketX -= 5;
    fuel -= 1;
  }

  if (direction === "right") {
    rocketX += 5;
    fuel -= 1;
  }

  if (direction === "up") {
    rocketY -= 5;
    fuel -= 1;
  }

  if (direction === "down") {
    rocketY += 5;
    fuel -= 1;
  }


  // Keep rocket inside game area

  rocketX = Math.max(5, Math.min(95, rocketX));
  rocketY = Math.max(5, Math.min(90, rocketY));


  // Update rocket position

  rocket.style.left = rocketX + "%";
  rocket.style.top = rocketY + "%";
  rocket.style.bottom = "auto";


  // Update fuel

  fuel = Math.max(0, fuel);

  fuelDisplay.textContent = fuel;


  // Check if fuel is empty

  if (fuel <= 0) {

    endGame("⛽ Oh no! Russell ran out of fuel!");

    return;
  }


  checkStarCollision();
}


// ============================================================
// CHECK STAR COLLISION
// ============================================================

function checkStarCollision() {

  if (!star) return;

  const rocketRect = rocket.getBoundingClientRect();
  const starRect = star.getBoundingClientRect();


  const rocketCenterX =
    rocketRect.left + rocketRect.width / 2;

  const rocketCenterY =
    rocketRect.top + rocketRect.height / 2;


  const starCenterX =
    starRect.left + starRect.width / 2;

  const starCenterY =
    starRect.top + starRect.height / 2;


  const distance = Math.hypot(
    rocketCenterX - starCenterX,
    rocketCenterY - starCenterY
  );


  if (distance < 60) {

    score++;

    scoreDisplay.textContent = score;

    message.textContent =
      "⭐ Great job, Russell! You collected a star!";


    moveStar();
  }
}


// ============================================================
// START MISSION
// ============================================================

function startMission() {

  if (gameRunning) return;

  gameRunning = true;

  score = 0;
  lives = 3;
  fuel = 100;

  rocketX = 50;
  rocketY = 80;


  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  fuelDisplay.textContent = fuel;


  rocket.style.left = rocketX + "%";
  rocket.style.top = rocketY + "%";
  rocket.style.bottom = "auto";


  message.textContent =
    "🚀 Mission started! Collect the stars, Russell!";


  startButton.style.display = "none";
  restartButton.style.display = "none";


  createStar();
}


// ============================================================
// END GAME
// ============================================================

function endGame(text) {

  gameRunning = false;

  message.textContent = text;

  restartButton.style.display = "inline-block";
}


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

document.addEventListener("keydown", function(event) {

  if (!gameRunning) return;


  const key = event.key.toLowerCase();


  if (key === "arrowleft" || key === "a") {

    event.preventDefault();

    moveRocket("left");
  }


  if (key === "arrowright" || key === "d") {

    event.preventDefault();

    moveRocket("right");
  }


  if (key === "arrowup" || key === "w") {

    event.preventDefault();

    moveRocket("up");
  }


  if (key === "arrowdown" || key === "s") {

    event.preventDefault();

    moveRocket("down");
  }

});


// ============================================================
// BUTTON CONTROLS
// ============================================================

leftButton.addEventListener("click", function() {

  moveRocket("left");

});


rightButton.addEventListener("click", function() {

  moveRocket("right");

});


startButton.addEventListener("click", function() {

  startMission();

});


restartButton.addEventListener("click", function() {

  startButton.style.display = "inline-block";

  startMission();

});