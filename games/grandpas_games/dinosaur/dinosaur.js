/* ============================================================
   🦖 LIL' RUSSELL'S DINOSAUR JUNGLE
   ============================================================ */

const gameArea = document.getElementById("gameArea");
const dino = document.getElementById("dino");
const targetLetter = document.getElementById("targetLetter");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const letterButtons = document.querySelectorAll(".letterButton");

let score = 0;
let lives = 3;
let gameStarted = false;
let currentLetter = "";
let dinosaurs = [];
let animationTimer = null;


/* ============================================================
   SOUND EFFECTS
   No audio files required!
   ============================================================ */

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  return audioContext;
}


function playSound(type) {

  try {

    const ctx = getAudioContext();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "correct") {

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(500, now);
      oscillator.frequency.setValueAtTime(700, now + 0.1);
      oscillator.frequency.setValueAtTime(900, now + 0.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.45
      );

      oscillator.start(now);
      oscillator.stop(now + 0.45);

    }

    else if (type === "wrong") {

      oscillator.type = "sawtooth";

      oscillator.frequency.setValueAtTime(250, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        70,
        now + 0.35
      );

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.4
      );

      oscillator.start(now);
      oscillator.stop(now + 0.4);

    }

    else if (type === "feed") {

      oscillator.type = "triangle";

      oscillator.frequency.setValueAtTime(350, now);
      oscillator.frequency.setValueAtTime(500, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.25
      );

      oscillator.start(now);
      oscillator.stop(now + 0.25);

    }

    else if (type === "start") {

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.setValueAtTime(500, now + 0.1);
      oscillator.frequency.setValueAtTime(700, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.5
      );

      oscillator.start(now);
      oscillator.stop(now + 0.5);

    }

    else if (type === "gameover") {

      oscillator.type = "triangle";

      oscillator.frequency.setValueAtTime(500, now);
      oscillator.frequency.setValueAtTime(350, now + 0.15);
      oscillator.frequency.setValueAtTime(200, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 0.6
      );

      oscillator.start(now);
      oscillator.stop(now + 0.6);

    }

  } catch (error) {

    console.log("Sound unavailable.");

  }
}


/* ============================================================
   LETTERS
   ============================================================ */

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function getRandomLetter() {

  return alphabet[
    Math.floor(Math.random() * alphabet.length)
  ];

}


/* ============================================================
   UPDATE SCORE
   ============================================================ */

function updateScore() {

  if (scoreDisplay) {
    scoreDisplay.textContent = score;
  }

  if (livesDisplay) {
    livesDisplay.textContent = lives;
  }

}


/* ============================================================
   CREATE TARGET LETTER
   ============================================================ */

function newLetter() {

  currentLetter = getRandomLetter();

  if (targetLetter) {

    targetLetter.textContent = currentLetter;

    targetLetter.classList.remove("letterCorrect");
    targetLetter.classList.remove("letterWrong");

  }

  highlightCorrectButton();

}


/* ============================================================
   HIGHLIGHT TARGET BUTTON
   ============================================================ */

function highlightCorrectButton() {

  letterButtons.forEach(button => {

    button.classList.remove("targetLetter");

    if (
      button.textContent.trim().toUpperCase() ===
      currentLetter
    ) {

      button.classList.add("targetLetter");

    }

  });

}


/* ============================================================
   MOVE DINOSAUR
   ============================================================ */

function moveDinosaur() {

  if (!gameStarted || !dino || !gameArea) {
    return;
  }

  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;

  const dinoWidth = dino.offsetWidth || 80;
  const dinoHeight = dino.offsetHeight || 80;

  const maxX = Math.max(
    0,
    areaWidth - dinoWidth
  );

  const maxY = Math.max(
    0,
    areaHeight - dinoHeight
  );

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  dino.style.left = x + "px";
  dino.style.top = y + "px";

}


/* ============================================================
   SLOW DINO WANDERING
   ============================================================ */

function startDinosaurMovement() {

  if (animationTimer) {
    clearInterval(animationTimer);
  }

  animationTimer = setInterval(() => {

    if (gameStarted) {
      moveDinosaur();
    }

  }, 3000);

}


/* ============================================================
   DINO RUNS TOWARD LETTER
   ============================================================ */

function dinoRunsToLetter() {

  if (!dino || !targetLetter) {
    return;
  }

  const dinoRect = dino.getBoundingClientRect();
  const letterRect = targetLetter.getBoundingClientRect();

  const dx =
    letterRect.left -
    dinoRect.left;

  const dy =
    letterRect.top -
    dinoRect.top;

  dino.style.transform =
    `translate(${dx}px, ${dy}px) scale(1.15)`;

}


/* ============================================================
   CORRECT LETTER
   ============================================================ */

function correctAnswer() {

  if (!gameStarted) {
    return;
  }

  score++;

  updateScore();

  playSound("correct");

  if (targetLetter) {

    targetLetter.classList.add("letterCorrect");

  }

  if (dino) {

    dino.classList.add("dinoHappy");

  }

  dinoRunsToLetter();

  setTimeout(() => {

    playSound("feed");

  }, 250);


  setTimeout(() => {

    if (dino) {
      dino.classList.remove("dinoHappy");
      dino.style.transform = "";
    }

    newLetter();

    moveDinosaur();

  }, 900);

}


/* ============================================================
   WRONG LETTER
   ============================================================ */

function wrongAnswer() {

  if (!gameStarted) {
    return;
  }

  lives--;

  updateScore();

  playSound("wrong");

  if (targetLetter) {

    targetLetter.classList.add("letterWrong");

  }

  if (dino) {

    dino.classList.add("dinoOops");

  }

  if (lives <= 0) {

    setTimeout(() => {
      gameOver();
    }, 700);

    return;
  }


  setTimeout(() => {

    if (dino) {
      dino.classList.remove("dinoOops");
    }

    if (targetLetter) {
      targetLetter.classList.remove("letterWrong");
    }

  }, 600);

}


/* ============================================================
   CHECK LETTER
   ============================================================ */

function chooseLetter(letter) {

  if (!gameStarted) {
    return;
  }

  letter = letter.toUpperCase();

  if (letter === currentLetter) {

    correctAnswer();

  } else {

    wrongAnswer();

  }

}


/* ============================================================
   MOUSE / TOUCH LETTER BUTTONS
   ============================================================ */

letterButtons.forEach(button => {

  button.addEventListener("click", () => {

    const letter =
      button.textContent.trim().toUpperCase();

    chooseLetter(letter);

  });

});


/* ============================================================
   KEYBOARD
   ============================================================ */

document.addEventListener("keydown", event => {

  if (!gameStarted) {
    return;
  }

  const key = event.key.toUpperCase();

  if (
    key.length === 1 &&
    alphabet.includes(key)
  ) {

    chooseLetter(key);

  }

});


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

  score = 0;
  lives = 3;

  gameStarted = true;

  updateScore();

  playSound("start");

  newLetter();

  moveDinosaur();

  startDinosaurMovement();

  if (startButton) {

    startButton.style.display = "none";

  }

  if (restartButton) {

    restartButton.style.display = "none";

  }

}


/* ============================================================
   GAME OVER
   ============================================================ */

function gameOver() {

  gameStarted = false;

  playSound("gameover");

  if (animationTimer) {

    clearInterval(animationTimer);

    animationTimer = null;

  }

  if (targetLetter) {

    targetLetter.textContent = "💥";

  }

  if (dino) {

    dino.classList.add("dinoOops");

  }

  if (startButton) {

    startButton.style.display = "none";

  }

  if (restartButton) {

    restartButton.style.display = "inline-block";

  }

}


/* ============================================================
   RESTART GAME
   ============================================================ */

function restartGame() {

  if (dino) {

    dino.classList.remove("dinoOops");
    dino.classList.remove("dinoHappy");

    dino.style.transform = "";

  }

  startGame();

}


/* ============================================================
   BUTTONS
   ============================================================ */

if (startButton) {

  startButton.addEventListener(
    "click",
    startGame
  );

}


if (restartButton) {

  restartButton.addEventListener(
    "click",
    restartGame
  );

}


/* ============================================================
   INITIAL POSITION
   ============================================================ */

if (dino) {

  dino.style.left = "50%";
  dino.style.top = "65%";

}

if (targetLetter) {

  targetLetter.textContent = "A";

}

updateScore();


/* ============================================================
   RESIZE HANDLING
   ============================================================ */

window.addEventListener("resize", () => {

  if (gameStarted) {
    moveDinosaur();
  }

});


console.log(
  "🦖 Lil' Russell's Dinosaur Jungle loaded!"
);