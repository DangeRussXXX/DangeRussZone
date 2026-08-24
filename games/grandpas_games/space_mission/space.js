/* ============================================================
   LIL' RUSSELL'S SPACE READING MISSION
   LEVEL 1 - LETTER IDENTIFICATION
   ============================================================ */

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

let currentLetter = "";
let questionNumber = 0;

const totalQuestions = 10;

let answerButtons = [];

let star = null;


/* ============================================================
   LETTER BANK
   ============================================================ */

const letters = [
  "A", "B", "C", "D", "E",
  "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z"
];


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

  playing = true;

  score = 0;
  lives = 3;
  fuel = 100;
  questionNumber = 0;

  x = 50;
  y = 80;

  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  fuelDisplay.textContent = fuel;

  player.style.left = x + "%";
  player.style.top = y + "%";

  startButton.style.display = "none";
  restartButton.style.display = "none";

  message.textContent =
    "🚀 Welcome, Russell! Let's find some letters!";

  removeOldAnswers();

  createStar();

  createLetterQuestion();
}


/* ============================================================
   CREATE STAR
   ============================================================ */

function createStar() {

  if (star) {
    star.remove();
  }

  star = document.createElement("div");

  star.id = "star";
  star.textContent = "⭐";

  star.style.position = "absolute";
  star.style.fontSize = "50px";
  star.style.left = "80%";
  star.style.top = "15%";

  gameArea.appendChild(star);
}


/* ============================================================
   CREATE LETTER QUESTION
   ============================================================ */

function createLetterQuestion() {

  questionNumber++;

  if (questionNumber > totalQuestions) {
    finishMission();
    return;
  }

  removeOldAnswers();

  currentLetter =
    letters[Math.floor(Math.random() * letters.length)];


  message.innerHTML =
    "🔤 Find the letter <strong>" +
    currentLetter +
    "</strong>!";


  createAnswerButtons();
}


/* ============================================================
   CREATE ANSWER BUTTONS
   ============================================================ */

function createAnswerButtons() {

  const answerArea = document.createElement("div");

  answerArea.id = "answerArea";

  answerArea.style.display = "flex";
  answerArea.style.justifyContent = "center";
  answerArea.style.gap = "12px";
  answerArea.style.flexWrap = "wrap";
  answerArea.style.marginTop = "15px";


  let choices = [currentLetter];


  while (choices.length < 3) {

    const randomLetter =
      letters[Math.floor(Math.random() * letters.length)];

    if (!choices.includes(randomLetter)) {
      choices.push(randomLetter);
    }
  }


  // Shuffle choices

  choices.sort(() => Math.random() - 0.5);


  choices.forEach(function(letter) {

    const button = document.createElement("button");

    button.textContent = letter;

    button.style.fontSize = "28px";
    button.style.fontWeight = "bold";
    button.style.padding = "12px 24px";
    button.style.borderRadius = "12px";
    button.style.border = "2px solid #00ffff";
    button.style.background = "#10104a";
    button.style.color = "white";
    button.style.cursor = "pointer";


    button.addEventListener("click", function() {

      checkLetter(letter);

    });


    answerArea.appendChild(button);

    answerButtons.push(button);

  });


  gameArea.parentNode.insertBefore(
    answerArea,
    gameArea.nextSibling
  );
}


/* ============================================================
   CHECK LETTER
   ============================================================ */

function checkLetter(answer) {

  if (!playing) return;


  if (answer === currentLetter) {

    score++;

    scoreDisplay.textContent = score;

    message.innerHTML =
      "🎉 Great job, Russell! " +
      currentLetter +
      " is correct! ⭐";


    disableAnswers();


    setTimeout(function() {

      createLetterQuestion();

    }, 900);


  } else {

    message.innerHTML =
      "💡 Good try! Look again. " +
      "Find the letter <strong>" +
      currentLetter +
      "</strong>.";

  }
}


/* ============================================================
   DISABLE ANSWERS
   ============================================================ */

function disableAnswers() {

  answerButtons.forEach(function(button) {

    button.disabled = true;

  });

}


/* ============================================================
   REMOVE OLD ANSWERS
   ============================================================ */

function removeOldAnswers() {

  const oldArea =
    document.getElementById("answerArea");

  if (oldArea) {
    oldArea.remove();
  }

  answerButtons = [];
}


/* ============================================================
   FINISH MISSION
   ============================================================ */

function finishMission() {

  playing = false;

  removeOldAnswers();

  message.innerHTML =
    "🏆 AMAZING JOB, RUSSELL! 🏆<br>" +
    "You completed your first reading mission! 🚀";


  startButton.style.display = "none";

  restartButton.style.display = "inline-block";
}


/* ============================================================
   MOVE ROCKET
   ============================================================ */

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


  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(90, y));


  player.style.left = x + "%";
  player.style.top = y + "%";


  fuel--;

  if (fuel < 0) {
    fuel = 0;
  }

  fuelDisplay.textContent = fuel;


  if (fuel === 0) {

    fuel = 100;

    fuelDisplay.textContent = fuel;

    message.textContent =
      "⛽ Fuel refilled! Keep learning, Russell!";

  }
}


/* ============================================================
   BUTTON CONTROLS
   ============================================================ */

leftButton.addEventListener("click", function() {

  movePlayer("left");

});


rightButton.addEventListener("click", function() {

  movePlayer("right");

});


startButton.addEventListener("click", function() {

  startGame();

});


restartButton.addEventListener("click", function() {

  startGame();

});


/* ============================================================
   KEYBOARD CONTROLS
   ============================================================ */

document.addEventListener("keydown", function(event) {

  if (!playing) return;


  const key = event.key.toLowerCase();


  if (key === "arrowleft" || key === "a") {

    event.preventDefault();

    movePlayer("left");

  }


  if (key === "arrowright" || key === "d") {

    event.preventDefault();

    movePlayer("right");

  }


  if (key === "arrowup" || key === "w") {

    event.preventDefault();

    movePlayer("up");

  }


  if (key === "arrowdown" || key === "s") {

    event.preventDefault();

    movePlayer("down");

  }

});