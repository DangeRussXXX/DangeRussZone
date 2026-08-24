/* ============================================================
   🦖 DINO'S LETTER LUNCH
   ============================================================ */

const gameArea =
  document.getElementById("gameArea");

const dinosaur =
  document.getElementById("dinosaur");

const dinoTarget =
  document.getElementById("dinoTarget");

const targetLetter =
  document.getElementById("targetLetter");

const foodArea =
  document.getElementById("foodArea");

const effect =
  document.getElementById("effect");

const messageEffect =
  document.getElementById("messageEffect");

const scoreDisplay =
  document.getElementById("score");

const fedDisplay =
  document.getElementById("fed");

const restartButton =
  document.getElementById("restartButton");

const dinoSpeech =
  document.getElementById("dinoSpeech");


/* ============================================================
   GAME VARIABLES
   ============================================================ */

let currentLetter = "A";

let score = 0;

let fed = 0;

let busy = false;


/* ============================================================
   LETTERS
   ============================================================ */

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");


/* ============================================================
   RANDOM LETTER
   ============================================================ */

function randomLetter() {

  return alphabet[
    Math.floor(
      Math.random() * alphabet.length
    )
  ];

}


/* ============================================================
   FIND TARGET
   ============================================================ */

function newTarget() {

  currentLetter = randomLetter();

  targetLetter.textContent =
    currentLetter;

  createFood();

}


/* ============================================================
   CREATE HAMBURGERS
   ============================================================ */

function createFood() {

  foodArea.innerHTML = "";

  const correctPosition =
    Math.floor(Math.random() * 5);

  for (let i = 0; i < 5; i++) {

    let letter;

    if (i === correctPosition) {

      letter = currentLetter;

    } else {

      letter = randomLetter();

      while (
        letter === currentLetter
      ) {

        letter = randomLetter();

      }

    }

    createBurger(
      letter,
      i
    );

  }

}


/* ============================================================
   CREATE ONE BURGER
   ============================================================ */

function createBurger(
  letter,
  index
) {

  const burger =
    document.createElement("button");

  burger.className =
    "letter-food";

  burger.dataset.letter =
    letter;

  burger.innerHTML = `
    <span class="burger">🍔</span>
    <span class="food-letter">
      ${letter}
    </span>
  `;


  /* Random position */

  const positions = [

    [12, 35],

    [32, 25],

    [55, 40],

    [75, 28],

    [85, 55]

  ];


  const position =
    positions[index];


  burger.style.left =
    position[0] + "%";

  burger.style.top =
    position[1] + "%";


  burger.addEventListener(
    "click",
    function () {

      chooseLetter(
        letter,
        burger
      );

    }
  );


  foodArea.appendChild(
    burger
  );

}


/* ============================================================
   SELECT LETTER
   ============================================================ */

function chooseLetter(
  letter,
  burger
) {

  if (busy) return;

  busy = true;


  /* Move Dino toward burger */

  const burgerRect =
    burger.getBoundingClientRect();

  const areaRect =
    gameArea.getBoundingClientRect();


  const burgerX =
    burgerRect.left +
    burgerRect.width / 2;


  const percent =
    (
      (burgerX - areaRect.left)
      /
      areaRect.width
    ) * 100;


  dinosaur.style.left =
    percent + "%";


  /* Move target letter too */

  dinoTarget.style.left =
    percent + "%";


  dinoSpeech.textContent =
    "👀";


  setTimeout(
    function () {

      if (
        letter === currentLetter
      ) {

        correctAnswer(
          burger
        );

      } else {

        wrongAnswer(
          burger
        );

      }

    },
    1000
  );

}


/* ============================================================
   CORRECT
   ============================================================ */

function correctAnswer(
  burger
) {

  score++;

  fed++;

  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;


  /* Dino eats burger */

  burger.style.transform =
    "scale(0)";


  burger.style.opacity =
    "0";


  dinoSpeech.textContent =
    "😋";


  /* Roar */

  playRoar();


  /* Message */

  showMessage(
    "🦖 GOOD JOB! ⭐"
  );


  setTimeout(
    function () {

      dinoSpeech.textContent =
        "🦖";

      busy = false;

      newTarget();

    },
    1300
  );

}


/* ============================================================
   WRONG
   ============================================================ */

function wrongAnswer(
  burger
) {

  dinoSpeech.textContent =
    "😮";


  /* Explosion */

  burger.style.transform =
    "scale(0)";


  showExplosion();


  playBoom();


  showMessage(
    "💥 BOOM! TRY AGAIN!"
  );


  setTimeout(
    function () {

      dinoSpeech.textContent =
        "🍔?";

      busy = false;

      /* Same target */

      createFood();

    },
    1300
  );

}


/* ============================================================
   MESSAGE
   ============================================================ */

function showMessage(
  text
) {

  messageEffect.textContent =
    text;

  messageEffect.classList.remove(
    "message-show"
  );


  void messageEffect.offsetWidth;


  messageEffect.classList.add(
    "message-show"
  );

}


/* ============================================================
   EXPLOSION
   ============================================================ */

function showExplosion() {

  effect.textContent =
    "💥";


  effect.classList.remove(
    "effect-show"
  );


  void effect.offsetWidth;


  effect.classList.add(
    "effect-show"
  );

}


/* ============================================================
   🔊 SOUND
   ============================================================ */

let audioContext;


function getAudio() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

  if (
    audioContext.state ===
    "suspended"
  ) {

    audioContext.resume();

  }

  return audioContext;

}


/* ============================================================
   ROAR SOUND
   ============================================================ */

function playRoar() {

  const audio =
    getAudio();

  const oscillator =
    audio.createOscillator();

  const gain =
    audio.createGain();


  oscillator.type =
    "sawtooth";


  oscillator.frequency.setValueAtTime(
    130,
    audio.currentTime
  );


  oscillator.frequency.exponentialRampToValueAtTime(
    55,
    audio.currentTime + 0.5
  );


  gain.gain.setValueAtTime(
    0.001,
    audio.currentTime
  );


  gain.gain.exponentialRampToValueAtTime(
    0.4,
    audio.currentTime + 0.05
  );


  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audio.currentTime + 0.6
  );


  oscillator.connect(gain);

  gain.connect(
    audio.destination
  );


  oscillator.start();

  oscillator.stop(
    audio.currentTime + 0.6
  );

}


/* ============================================================
   💥 BOOM SOUND
   ============================================================ */

function playBoom() {

  const audio =
    getAudio();


  const oscillator =
    audio.createOscillator();

  const gain =
    audio.createGain();


  oscillator.type =
    "square";


  oscillator.frequency.setValueAtTime(
    90,
    audio.currentTime
  );


  oscillator.frequency.exponentialRampToValueAtTime(
    25,
    audio.currentTime + 0.35
  );


  gain.gain.setValueAtTime(
    0.001,
    audio.currentTime
  );


  gain.gain.exponentialRampToValueAtTime(
    0.5,
    audio.currentTime + 0.02
  );


  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audio.currentTime + 0.4
  );


  oscillator.connect(gain);

  gain.connect(
    audio.destination
  );


  oscillator.start();

  oscillator.stop(
    audio.currentTime + 0.4
  );

}


/* ============================================================
   ⌨️ KEYBOARD
   ============================================================ */

function setupKeyboard() {

  const keyboard =
    document.getElementById(
      "keyboardLetters"
    );


  keyboard.innerHTML = "";


  alphabet.forEach(
    function (letter) {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "keyboard-letter";


      button.textContent =
        letter;


      button.addEventListener(
        "click",
        function () {

          const burger =
            [...document.querySelectorAll(
              ".letter-food"
            )]
            .find(
              item =>
                item.dataset.letter ===
                letter
            );


          if (burger) {

            chooseLetter(
              letter,
              burger
            );

          }

        }
      );


      keyboard.appendChild(
        button
      );

    }
  );

}


/* ============================================================
   PHYSICAL KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  function (event) {

    const letter =
      event.key.toUpperCase();


    if (
      alphabet.includes(letter)
    ) {

      const burger =
        [...document.querySelectorAll(
          ".letter-food"
        )]
        .find(
          item =>
            item.dataset.letter ===
            letter
        );


      if (burger) {

        chooseLetter(
          letter,
          burger
        );

      }

    }

  }
);


/* ============================================================
   RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  function () {

    score = 0;

    fed = 0;

    scoreDisplay.textContent =
      "0";

    fedDisplay.textContent =
      "0";

    dinosaur.style.left =
      "50%";

    dinoTarget.style.left =
      "50%";

    dinoSpeech.textContent =
      "🍔?";

    busy = false;

    newTarget();

  }
);


/* ============================================================
   START
   ============================================================ */

setupKeyboard();

newTarget();