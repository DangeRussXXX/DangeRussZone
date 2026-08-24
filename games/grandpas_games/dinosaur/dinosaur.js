/* ============================================================
   🦖 DINO'S LETTER LUNCH
   EDUCATIONAL LETTER GAME
   ============================================================ */

const gameArea = document.getElementById("gameArea");
const dinosaur = document.getElementById("dinosaur");
const dinoEmoji = document.getElementById("dinoEmoji");
const dinoSpeech = document.getElementById("dinoSpeech");

const foodArea = document.getElementById("foodArea");

const targetLetter = document.getElementById("targetLetter");
const gameMessage = document.getElementById("gameMessage");
const effect = document.getElementById("effect");

const scoreDisplay = document.getElementById("score");
const fedDisplay = document.getElementById("fed");

const keyboardLetters =
  document.getElementById("keyboardLetters");

const restartButton =
  document.getElementById("restartButton");


/* ============================================================
   GAME SETTINGS
   ============================================================ */

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let target = "A";

let score = 0;
let fed = 0;

let busy = false;

let burgers = [];


/* ============================================================
   SOUND SYSTEM
   Browser-generated sounds
   ============================================================ */

let audioContext = null;


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


/* Simple sound */

function playTone(
  frequency,
  duration,
  type = "sine",
  volume = 0.08
) {

  startAudio();

  if (!audioContext) {
    return;
  }

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = type;

  oscillator.frequency.value =
    frequency;

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


/* Correct answer sound */

function playCorrectSound() {

  playTone(523, 0.12, "sine", 0.12);

  setTimeout(() => {
    playTone(659, 0.12, "sine", 0.12);
  }, 100);

  setTimeout(() => {
    playTone(784, 0.22, "sine", 0.12);
  }, 200);
}


/* Wrong answer / boom sound */

function playBoomSound() {

  startAudio();

  if (!audioContext) {
    return;
  }

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "sawtooth";

  oscillator.frequency.setValueAtTime(
    120,
    audioContext.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    40,
    audioContext.currentTime + 0.5
  );

  gain.gain.setValueAtTime(
    0.18,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.5
  );

  oscillator.connect(gain);

  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.5
  );
}


/* Dino roar */

function playRoar() {

  startAudio();

  if (!audioContext) {
    return;
  }

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "sawtooth";

  oscillator.frequency.setValueAtTime(
    150,
    audioContext.currentTime
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    70,
    audioContext.currentTime + 0.65
  );

  gain.gain.setValueAtTime(
    0.15,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.65
  );

  oscillator.connect(gain);

  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + 0.65
  );
}


/* ============================================================
   TARGET LETTER
   ============================================================ */

function chooseTarget() {

  target =
    alphabet[
      Math.floor(
        Math.random() * alphabet.length
      )
    ];

  targetLetter.textContent = target;
}


/* ============================================================
   CREATE BURGER
   ============================================================ */

function createBurger(letter, x, y) {

  const burger =
    document.createElement("div");

  burger.className = "burger";

  burger.dataset.letter = letter;

  burger.style.left = x + "%";

  burger.style.top = y + "%";


  const letterElement =
    document.createElement("span");

  letterElement.className =
    "burger-letter";

  letterElement.textContent =
    letter;


  burger.appendChild(letterElement);

  foodArea.appendChild(burger);


  burger.addEventListener(
    "click",
    function () {

      startAudio();

      selectBurger(burger);

    }
  );


  burgers.push(burger);
}


/* ============================================================
   CREATE THE FOOD
   ============================================================ */

function createFood() {

  foodArea.innerHTML = "";

  burgers = [];


  /*
    We deliberately spread the burgers
    around the game area.
  */

  const positions = [

    [10, 25],
    [30, 35],
    [55, 27],
    [78, 38],
    [18, 55],
    [42, 60],
    [68, 58],
    [85, 65]

  ];


  /*
    Put the correct letter somewhere
    in the group.
  */

  const correctIndex =
    Math.floor(
      Math.random() * positions.length
    );


  positions.forEach(
    (position, index) => {

      let letter;

      if (index === correctIndex) {

        letter = target;

      } else {

        letter =
          alphabet[
            Math.floor(
              Math.random() *
              alphabet.length
            )
          ];

        /*
          Make sure wrong burgers aren't
          accidentally the correct letter.
        */

        while (letter === target) {

          letter =
            alphabet[
              Math.floor(
                Math.random() *
                alphabet.length
              )
            ];

        }

      }


      createBurger(
        letter,
        position[0],
        position[1]
      );

    }
  );
}


/* ============================================================
   FIND BURGER
   ============================================================ */

function findBurger(letter) {

  return burgers.find(
    burger =>
      burger &&
      burger.dataset.letter === letter &&
      !burger.classList.contains("eaten") &&
      !burger.classList.contains("explode")
  );
}


/* ============================================================
   SELECT A BURGER
   ============================================================ */

function selectBurger(burger) {

  if (busy) {
    return;
  }

  if (!burger) {
    return;
  }

  busy = true;


  const selectedLetter =
    burger.dataset.letter;


  /*
    Dino walks toward the selected burger.
  */

  walkToBurger(
    burger,
    selectedLetter
  );
}


/* ============================================================
   DINO WALK
   ============================================================ */

function walkToBurger(
  burger,
  selectedLetter
) {

  const gameRect =
    gameArea.getBoundingClientRect();

  const burgerRect =
    burger.getBoundingClientRect();


  /*
    Convert burger position into
    percentages inside the game.
  */

  let x =
    (
      burgerRect.left -
      gameRect.left +
      burgerRect.width / 2
    )
    /
    gameRect.width
    *
    100;


  let y =
    (
      burgerRect.top -
      gameRect.top +
      burgerRect.height / 2
    )
    /
    gameRect.height
    *
    100;


  /*
    Keep Dino safely inside the jungle.
  */

  x = Math.max(10, Math.min(90, x));

  y = Math.max(35, Math.min(78, y));


  dinosaur.classList.add("walking");

  dinoSpeech.textContent = "🍔!";


  dinosaur.style.left =
    x + "%";

  dinosaur.style.top =
    y + "%";


  /*
    Wait for Dino to arrive.
  */

  setTimeout(
    () => {

      dinosaur.classList.remove(
        "walking"
      );

      checkAnswer(
        burger,
        selectedLetter
      );

    },
    850
  );
}


/* ============================================================
   CHECK ANSWER
   ============================================================ */

function checkAnswer(
  burger,
  selectedLetter
) {

  if (
    selectedLetter === target
  ) {

    correctAnswer(burger);

  } else {

    wrongAnswer(burger);

  }
}


/* ============================================================
   CORRECT ANSWER
   ============================================================ */

function correctAnswer(burger) {

  score++;

  fed++;


  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;


  dinoSpeech.textContent =
    "😋 YUM!";


  gameMessage.textContent =
    "🎉 GOOD JOB! Dino found the letter " +
    target +
    "!";


  dinosaur.classList.add(
    "eating"
  );


  burger.classList.add(
    "eaten"
  );


  playCorrectSound();


  setTimeout(
    () => {

      playRoar();

      dinoSpeech.textContent =
        "🦖 ROOOAAAR!";

    },
    250
  );


  setTimeout(
    () => {

      dinosaur.classList.remove(
        "eating"
      );

      chooseTarget();

      createFood();

      gameMessage.textContent =
        "Find the new letter!";

      dinoSpeech.textContent =
        "🍔?";

      busy = false;

    },
    1200
  );
}


/* ============================================================
   WRONG ANSWER
   ============================================================ */

function wrongAnswer(burger) {

  dinoSpeech.textContent =
    "😳";


  gameMessage.textContent =
    "💥 BOOM! Try again!";


  burger.classList.add(
    "explode"
  );


  playBoomSound();


  effect.textContent =
    "💥 BOOM!";


  effect.classList.remove(
    "show-boom"
  );


  /*
    Force browser to restart animation.
  */

  void effect.offsetWidth;


  effect.classList.add(
    "show-boom"
  );


  setTimeout(
    () => {

      dinoSpeech.textContent =
        "🍔?";

      gameMessage.textContent =
        "Try again! Find the letter " +
        target;

      busy = false;

    },
    900
  );
}


/* ============================================================
   KEYBOARD
   ============================================================ */

function createKeyboard() {

  keyboardLetters.innerHTML = "";


  alphabet.split("").forEach(
    letter => {

      const button =
        document.createElement("button");

      button.className = "key";

      button.textContent =
        letter;

      button.type = "button";


      button.addEventListener(
        "click",
        () => {

          startAudio();

          const burger =
            findBurger(letter);

          if (burger) {

            selectBurger(burger);

          } else {

            wrongKeyboardLetter(letter);

          }

        }
      );


      keyboardLetters.appendChild(
        button
      );

    }
  );
}


/* ============================================================
   KEYBOARD WRONG LETTER
   ============================================================ */

function wrongKeyboardLetter(letter) {

  if (busy) {
    return;
  }


  /*
    Find the burger with that letter.
    Dino walks to it if it exists.
  */

  const burger =
    findBurger(letter);


  if (burger) {

    selectBurger(burger);

    return;

  }


  /*
    If that letter isn't currently
    on a burger, give a gentle hint.
  */

  gameMessage.textContent =
    "Look for the letter " +
    target +
    " 🍔";


  dinoSpeech.textContent =
    "👀";


  playTone(
    220,
    0.15,
    "triangle",
    0.06
  );


  setTimeout(
    () => {

      dinoSpeech.textContent =
        "🍔?";

    },
    500
  );
}


/* ============================================================
   COMPUTER KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  event => {

    const letter =
      event.key.toUpperCase();


    if (
      !alphabet.includes(letter)
    ) {
      return;
    }


    startAudio();


    const burger =
      findBurger(letter);


    if (burger) {

      selectBurger(burger);

    } else {

      wrongKeyboardLetter(letter);

    }

  }
);


/* ============================================================
   RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  () => {

    startAudio();

    score = 0;

    fed = 0;

    scoreDisplay.textContent =
      "0";

    fedDisplay.textContent =
      "0";

    busy = false;


    dinosaur.style.left =
      "50%";

    dinosaur.style.top =
      "58%";


    dinoSpeech.textContent =
      "🍔?";


    gameMessage.textContent =
      "Find the letter Dino wants!";


    chooseTarget();

    createFood();

  }
);


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

  chooseTarget();

  createFood();

  createKeyboard();

  gameMessage.textContent =
    "Find the letter Dino wants! 🍔";

}


/* ============================================================
   START
   ============================================================ */

startGame();