/* ============================================================
   🦖 DINO'S LETTER LUNCH
   ============================================================ */

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

const dinoSpeech =
  document.getElementById("dinoSpeech");

const restartButton =
  document.getElementById("restartButton");


/* ============================================================
   GAME
   ============================================================ */

const letters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let currentLetter = "A";

let score = 0;

let fed = 0;

let busy = false;


/* ============================================================
   TARGET
   ============================================================ */

function newRound() {

  currentLetter =
    letters[
      Math.floor(
        Math.random() *
        letters.length
      )
    ];

  targetLetter.textContent =
    currentLetter;

  /* Put Dino back in middle */

  dinosaur.style.left =
    "50%";

  dinoTarget.style.left =
    "50%";

  dinoSpeech.textContent =
    "🍔?";

  createBurgers();

}


/* ============================================================
   BURGERS
   ============================================================ */

function createBurgers() {

  foodArea.innerHTML = "";

  const positions = [

    {
      left: "10%",
      top: "35%"
    },

    {
      left: "30%",
      top: "25%"
    },

    {
      left: "52%",
      top: "38%"
    },

    {
      left: "73%",
      top: "27%"
    },

    {
      left: "82%",
      top: "50%"
    }

  ];


  const correctSpot =
    Math.floor(
      Math.random() * positions.length
    );


  positions.forEach(
    function(position, index) {

      let letter;


      if (
        index === correctSpot
      ) {

        letter =
          currentLetter;

      } else {

        letter =
          randomWrongLetter();

      }


      const burger =
        document.createElement(
          "button"
        );


      burger.className =
        "letter-food";


      burger.dataset.letter =
        letter;


      burger.style.left =
        position.left;


      burger.style.top =
        position.top;


      burger.innerHTML = `
        <span class="burger">🍔</span>
        <span class="food-letter">${letter}</span>
      `;


      burger.addEventListener(
        "click",
        function() {

          selectBurger(
            burger,
            letter
          );

        }
      );


      foodArea.appendChild(
        burger
      );

    }
  );

}


/* ============================================================
   WRONG LETTER
   ============================================================ */

function randomWrongLetter() {

  let letter;

  do {

    letter =
      letters[
        Math.floor(
          Math.random() *
          letters.length
        )
      ];

  }
  while (
    letter === currentLetter
  );

  return letter;

}


/* ============================================================
   CLICK BURGER
   ============================================================ */

function selectBurger(
  burger,
  letter
) {

  if (busy) return;

  busy = true;


  /*
    Find where burger actually is.
  */

  const burgerRect =
    burger.getBoundingClientRect();

  const gameRect =
    document
      .getElementById("gameArea")
      .getBoundingClientRect();


  const burgerCenter =
    burgerRect.left +
    burgerRect.width / 2;


  const percentage =
    (
      (burgerCenter -
        gameRect.left)
      /
      gameRect.width
    ) * 100;


  /*
    Keep Dino on screen.
  */

  const safePercentage =
    Math.max(
      10,
      Math.min(
        90,
        percentage
      )
    );


  /*
    WALK DINO
  */

  dinosaur.style.left =
    safePercentage + "%";


  /*
    Move glowing letter
    with Dino.
  */

  dinoTarget.style.left =
    safePercentage + "%";


  dinoSpeech.textContent =
    "👀";


  /*
    Wait for Dino to arrive.
  */

  setTimeout(
    function() {

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
    900
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


  /*
    Burger disappears.
  */

  burger.style.transform =
    "scale(0)";

  burger.style.opacity =
    "0";


  dinoSpeech.textContent =
    "😋";


  playRoar();


  showMessage(
    "🦖 GOOD JOB! ⭐"
  );


  setTimeout(
    function() {

      busy = false;

      newRound();

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

  burger.style.opacity =
    "0";


  showExplosion();

  playBoom();


  showMessage(
    "💥 BOOM! TRY AGAIN!"
  );


  dinoSpeech.textContent =
    "😮";


  setTimeout(
    function() {

      busy = false;

      createBurgers();

      dinoSpeech.textContent =
        "🍔?";

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
   💥 EXPLOSION
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

let audioContext = null;


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
   🦖 ROAR
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
    140,
    audio.currentTime
  );


  oscillator.frequency.exponentialRampToValueAtTime(
    55,
    audio.currentTime + 0.5
  );


  gain.gain.setValueAtTime(
    0.01,
    audio.currentTime
  );


  gain.gain.exponentialRampToValueAtTime(
    0.4,
    audio.currentTime + 0.05
  );


  gain.gain.exponentialRampToValueAtTime(
    0.01,
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
   💥 BOOM
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
    100,
    audio.currentTime
  );


  oscillator.frequency.exponentialRampToValueAtTime(
    25,
    audio.currentTime + 0.35
  );


  gain.gain.setValueAtTime(
    0.01,
    audio.currentTime
  );


  gain.gain.exponentialRampToValueAtTime(
    0.45,
    audio.currentTime + 0.03
  );


  gain.gain.exponentialRampToValueAtTime(
    0.01,
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

const keyboard =
  document.getElementById(
    "keyboardLetters"
  );


letters.forEach(
  function(letter) {

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
      function() {

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

          selectBurger(
            burger,
            letter
          );

        }

      }
    );


    keyboard.appendChild(
      button
    );

  }
);


/* ============================================================
   PHYSICAL KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  function(event) {

    const letter =
      event.key.toUpperCase();


    if (
      !letters.includes(letter)
    ) {

      return;

    }


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

      selectBurger(
        burger,
        letter
      );

    }

  }
);


/* ============================================================
   🔄 RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  function() {

    score = 0;

    fed = 0;

    scoreDisplay.textContent =
      "0";

    fedDisplay.textContent =
      "0";

    busy = false;

    newRound();

  }
);


/* ============================================================
   START GAME
   ============================================================ */

newRound();