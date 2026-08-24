/* ============================================================
   🦖 DINO'S LETTER LUNCH
   Educational Dinosaur Letter Game
   ============================================================ */

const gameArea = document.getElementById("gameArea");
const dinosaur = document.getElementById("dinosaur");
const dinoBody = document.getElementById("dinoBody");
const foodArea = document.getElementById("foodArea");
const targetLetter = document.getElementById("targetLetter");
const message = document.getElementById("message");

const scoreDisplay = document.getElementById("score");
const fedDisplay = document.getElementById("fed");
const keyboardLetters = document.getElementById("keyboardLetters");
const restartButton = document.getElementById("restartButton");
const effect = document.getElementById("effect");

let score = 0;
let fed = 0;
let currentLetter = "A";

let foods = [];

let audioContext = null;


/* ============================================================
   🔊 SOUND SYSTEM
   ============================================================ */

function startAudio() {

  if (!audioContext) {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioContext) {
      audioContext = new AudioContext();
    }
  }

  if (
    audioContext &&
    audioContext.state === "suspended"
  ) {
    audioContext.resume();
  }
}


/* Play a simple generated sound */

function sound(
  frequency,
  duration,
  type = "sine",
  volume = 0.08
) {

  startAudio();

  if (!audioContext) return;

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = type;

  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(
    volume,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);

  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + duration
  );
}


/* Happy sound */

function correctSound() {

  startAudio();

  sound(523, 0.12);
  
  setTimeout(() => {
    sound(659, 0.12);
  }, 100);

  setTimeout(() => {
    sound(784, 0.18);
  }, 200);
}


/* Wrong sound */

function wrongSound() {

  startAudio();

  sound(180, 0.18, "sawtooth", 0.1);

  setTimeout(() => {
    sound(100, 0.25, "square", 0.08);
  }, 100);
}


/* Munch sound */

function munchSound() {

  startAudio();

  sound(140, 0.08, "square", 0.06);

  setTimeout(() => {
    sound(100, 0.08, "square", 0.06);
  }, 90);

  setTimeout(() => {
    sound(160, 0.1, "square", 0.05);
  }, 180);
}


/* Button click */

function clickSound() {

  sound(350, 0.05, "square", 0.04);
}


/* Celebration */

function celebrationSound() {

  startAudio();

  const notes = [
    523,
    659,
    784,
    1046
  ];

  notes.forEach((note, index) => {

    setTimeout(() => {
      sound(note, 0.15);
    }, index * 100);

  });
}


/* ============================================================
   🔤 LETTERS
   ============================================================ */

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function randomLetter() {

  return letters[
    Math.floor(
      Math.random() * letters.length
    )
  ];
}


function newTarget() {

  currentLetter = randomLetter();

  targetLetter.textContent =
    currentLetter;

  message.textContent =
    "Find the letter " +
    currentLetter +
    "! 🦖🍔";

  createFoods();
}


/* ============================================================
   🍔 CREATE HAMBURGERS
   ============================================================ */

function createFoods() {

  foodArea.innerHTML = "";

  foods = [];

  const correctIndex =
    Math.floor(Math.random() * 4);

  for (
    let i = 0;
    i < 4;
    i++
  ) {

    const food =
      document.createElement("button");

    food.className = "letter-food";

    food.type = "button";

    const letter =
      i === correctIndex
        ? currentLetter
        : randomWrongLetter();

    food.dataset.letter = letter;

    food.innerHTML =
      `
        <span class="burger">🍔</span>
        <span class="food-letter">${letter}</span>
      `;

    /* Random position */

    food.style.left =
      (10 + Math.random() * 75) + "%";

    food.style.top =
      (20 + Math.random() * 60) + "%";


    food.addEventListener(
      "click",
      () => {

        startAudio();

        selectLetter(
          letter,
          food
        );

      }
    );


    foodArea.appendChild(food);

    foods.push(food);

  }

}


function randomWrongLetter() {

  let letter;

  do {

    letter =
      randomLetter();

  } while (
    letter === currentLetter
  );

  return letter;
}


/* ============================================================
   🦖 SELECT LETTER
   ============================================================ */

function selectLetter(
  letter,
  food
) {

  if (
    letter === currentLetter
  ) {

    correctAnswer(food);

  } else {

    wrongAnswer(food);

  }

}


/* ============================================================
   🥳 CORRECT
   ============================================================ */

function correctAnswer(food) {

  score++;
  fed++;

  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;


  correctSound();

  message.textContent =
    "YES! Dino found " +
    currentLetter +
    "! 🦖🎉";


  /* Dino moves toward food */

  moveDinoToFood(food);


  /* Make hamburger fly toward Dino */

  food.classList.add(
    "food-eaten"
  );


  setTimeout(() => {

    munchSound();

    dinoBody.textContent =
      "😋🦖";

  }, 350);


  setTimeout(() => {

    celebrationSound();

    showEffect("🎉");

  }, 500);


  setTimeout(() => {

    dinoBody.textContent =
      "🦖";

    newTarget();

  }, 1300);

}


/* ============================================================
   💥 WRONG
   ============================================================ */

function wrongAnswer(food) {

  wrongSound();

  message.textContent =
    "Oops! Dino needs " +
    currentLetter +
    "! Try again! 🦖";

  food.classList.add(
    "food-wrong"
  );

  showEffect("💥");


  setTimeout(() => {

    food.classList.remove(
      "food-wrong"
    );

  }, 500);

}


/* ============================================================
   🦖 MOVE DINOSAUR
   ============================================================ */

function moveDinoToFood(food) {

  const foodRect =
    food.getBoundingClientRect();

  const areaRect =
    gameArea.getBoundingClientRect();

  const x =
    foodRect.left -
    areaRect.left +
    foodRect.width / 2;

  dinosaur.style.left =
    Math.max(
      20,
      Math.min(
        areaRect.width - 100,
        x
      )
    ) + "px";

}


/* ============================================================
   💥 EFFECT
   ============================================================ */

function showEffect(text) {

  effect.textContent =
    text;

  effect.classList.remove(
    "effect-show"
  );

  void effect.offsetWidth;

  effect.classList.add(
    "effect-show"
  );

}


/* ============================================================
   ⌨️ KEYBOARD LETTERS
   ============================================================ */

function createKeyboard() {

  keyboardLetters.innerHTML = "";

  letters.split("").forEach(
    letter => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.textContent =
        letter;

      button.className =
        "keyboard-letter";

      button.addEventListener(
        "click",
        () => {

          startAudio();

          clickSound();

          selectKeyboardLetter(
            letter
          );

        }
      );

      keyboardLetters.appendChild(
        button
      );

    }
  );

}


function selectKeyboardLetter(letter) {

  if (
    letter === currentLetter
  ) {

    const correctFood =
      foods.find(
        food =>
          food.dataset.letter ===
          currentLetter
      );

    correctAnswer(
      correctFood
    );

  } else {

    wrongAnswer(
      document.createElement("div")
    );

  }

}


/* ============================================================
   ⌨️ COMPUTER KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toUpperCase();

    if (
      letters.includes(key)
    ) {

      startAudio();

      selectKeyboardLetter(
        key
      );

    }

  }
);


/* ============================================================
   🔄 RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  () => {

    startAudio();

    clickSound();

    score = 0;

    fed = 0;

    scoreDisplay.textContent =
      "0";

    fedDisplay.textContent =
      "0";

    dinosaur.style.left =
      "50%";

    dinoBody.textContent =
      "🦖";

    message.textContent =
      "Let's feed Dino! 🦖🍔";

    newTarget();

  }
);


/* ============================================================
   🚀 START AUDIO ON FIRST TOUCH
   ============================================================ */

document.addEventListener(
  "pointerdown",
  () => {

    startAudio();

  },
  { once: true }
);


/* ============================================================
   🌴 LITTLE DINO MOVEMENT
   ============================================================ */

let dinoDirection = 1;

setInterval(() => {

  if (!gameArea) return;

  const currentLeft =
    parseFloat(
      dinosaur.style.left
    ) || 50;

  const areaWidth =
    gameArea.clientWidth;

  let next =
    currentLeft +
    dinoDirection * 2;

  if (
    next > areaWidth - 120
  ) {

    dinoDirection = -1;

  }

  if (
    next < 30
  ) {

    dinoDirection = 1;

  }

  dinosaur.style.left =
    next + "px";

}, 120);


/* ============================================================
   🎮 START GAME
   ============================================================ */

createKeyboard();

newTarget();