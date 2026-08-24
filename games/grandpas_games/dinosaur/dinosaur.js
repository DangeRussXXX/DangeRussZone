const gameArea =
  document.getElementById("gameArea");

const foodArea =
  document.getElementById("foodArea");

const dinosaur =
  document.getElementById("dinosaur");

const dinoBody =
  document.getElementById("dinoBody");

const dinoSpeech =
  document.getElementById("dinoSpeech");

const targetLetter =
  document.getElementById("targetLetter");

const message =
  document.getElementById("message");

const scoreDisplay =
  document.getElementById("score");

const fedDisplay =
  document.getElementById("fed");

const streakDisplay =
  document.getElementById("streak");

const keyboardLetters =
  document.getElementById("keyboardLetters");

const effect =
  document.getElementById("effect");

const restartButton =
  document.getElementById("restartButton");


/* ============================================================
   GAME VARIABLES
   ============================================================ */

let target = "A";

let score = 0;

let fed = 0;

let streak = 0;

let foods = [];

let busy = false;


/*
   Start with a small group.

   This is much easier for a toddler than
   throwing all 26 letters at them.
*/

let learningLetters = [
  "A",
  "B",
  "C"
];


/* ============================================================
   SOUND
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

  return audioContext;
}


function playTone(
  frequency,
  duration,
  type = "sine"
) {

  try {

    const audio =
      getAudio();

    const oscillator =
      audio.createOscillator();

    const gain =
      audio.createGain();

    oscillator.type =
      type;

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.12,
      audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audio.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(audio.destination);

    oscillator.start();

    oscillator.stop(
      audio.currentTime + duration
    );

  } catch (error) {

    console.log(
      "Sound unavailable."
    );
  }
}


/* ============================================================
   SAY LETTER
   ============================================================ */

function sayLetter(letter) {

  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(
      letter
    );

  speech.rate = 0.75;

  speech.pitch = 1.3;

  speech.volume = 1;

  window.speechSynthesis.speak(
    speech
  );
}


/* ============================================================
   CORRECT SOUND
   ============================================================ */

function correctSound() {

  playTone(
    523,
    0.12
  );

  setTimeout(
    () => playTone(659, 0.12),
    100
  );

  setTimeout(
    () => playTone(784, 0.18),
    200
  );
}


/* ============================================================
   WRONG SOUND
   ============================================================ */

function wrongSound() {

  playTone(
    180,
    0.18,
    "sawtooth"
  );

  setTimeout(
    () =>
      playTone(
        100,
        0.25,
        "sawtooth"
      ),
    120
  );
}


/* ============================================================
   START
   ============================================================ */

function startGame() {

  score = 0;

  fed = 0;

  streak = 0;

  busy = false;

  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;

  streakDisplay.textContent =
    streak;

  createKeyboard();

  newRound();
}


/* ============================================================
   NEW ROUND
   ============================================================ */

function newRound() {

  busy = false;

  target =
    learningLetters[
      Math.floor(
        Math.random() *
        learningLetters.length
      )
    ];

  targetLetter.textContent =
    target;

  message.textContent =
    "Find " +
    target +
    "!";

  dinoSpeech.textContent =
    "🍔 " + target + "?";

  sayLetter(target);

  createFoods();

  moveDinosaur();
}


/* ============================================================
   CREATE BURGERS
   ============================================================ */

function createFoods() {

  foodArea.innerHTML = "";

  foods = [];

  let letters = [target];

  while (
    letters.length < 5
  ) {

    const letter =
      learningLetters[
        Math.floor(
          Math.random() *
          learningLetters.length
        )
      ];

    if (
      !letters.includes(letter)
    ) {

      letters.push(letter);
    }
  }


  /*
     Shuffle the burgers.
  */

  letters.sort(
    () => Math.random() - 0.5
  );


  const positions = [

    {
      left: 10,
      top: 22
    },

    {
      left: 35,
      top: 17
    },

    {
      left: 65,
      top: 22
    },

    {
      left: 20,
      top: 47
    },

    {
      left: 55,
      top: 48
    }

  ];


  letters.forEach(
    (letter, index) => {

      const food =
        document.createElement(
          "button"
        );

      food.className =
        "food";

      food.type =
        "button";

      food.dataset.letter =
        letter;

      food.innerHTML = `
        <span class="burger">🍔</span>
        <span class="food-letter">
          ${letter}
        </span>
      `;


      food.style.left =
        positions[index].left +
        "%";

      food.style.top =
        positions[index].top +
        "%";


      /*
         Slightly different animation
         timing makes the burgers feel alive.
      */

      food.style.animationDelay =
        (index * 0.15) +
        "s";


      food.addEventListener(
        "click",
        () => {

          chooseLetter(
            letter,
            food
          );

        }
      );


      foodArea.appendChild(
        food
      );

      foods.push(food);

    }
  );
}


/* ============================================================
   CHOOSE LETTER
   ============================================================ */

function chooseLetter(
  letter,
  food
) {

  if (busy) {
    return;
  }

  /*
     Make sure the browser allows sound
     after a click.
  */

  getAudio();

  sayLetter(letter);

  if (
    letter === target
  ) {

    correctAnswer(food);

  } else {

    wrongAnswer(food);

  }
}


/* ============================================================
   CORRECT ANSWER
   ============================================================ */

function correctAnswer(food) {

  busy = true;

  score++;

  fed++;

  streak++;


  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;

  streakDisplay.textContent =
    streak;


  message.textContent =
    "YUMMY! Dino found " +
    target +
    "!";


  correctSound();


  /*
     Move dinosaur toward burger.
  */

  moveDinoToFood(food);


  /*
     Chomp after Dino reaches it.
  */

  setTimeout(
    () => {

      dinoSpeech.textContent =
        "😋 CHOMP!";

      food.classList.add(
        "correct"
      );

      showEffect(
        "😋🍔"
      );

    },
    550
  );


  /*
     Big celebration.
  */

  if (
    streak >= 5
  ) {

    setTimeout(
      () => {

        showEffect(
          "🎉🦖🎉"
        );

        message.textContent =
          "WOW! 5 letters! Great job!";

        playCelebration();

        streak = 0;

        streakDisplay.textContent =
          streak;

      },
      800
    );
  }


  setTimeout(
    () => {

      newRound();

    },
    1300
  );
}


/* ============================================================
   WRONG ANSWER
   ============================================================ */

function wrongAnswer(food) {

  streak = 0;

  streakDisplay.textContent =
    streak;

  message.textContent =
    "Oops! Try again!";

  wrongSound();

  food.classList.add(
    "wrong"
  );

  showEffect(
    "💥"
  );

  dinoSpeech.textContent =
    "😮 OOPS!";


  setTimeout(
    () => {

      dinoSpeech.textContent =
        "🍔 " + target + "?";

    },
    800
  );
}


/* ============================================================
   MOVE DINOSAUR
   ============================================================ */

function moveDinosaur() {

  const positions = [
    25,
    50,
    75
  ];

  const position =
    positions[
      Math.floor(
        Math.random() *
        positions.length
      )
    ];

  dinosaur.style.left =
    position + "%";
}


/* ============================================================
   MOVE DINO TO BURGER
   ============================================================ */

function moveDinoToFood(food) {

  const foodLeft =
    parseFloat(
      food.style.left
    );

  dinosaur.style.left =
    foodLeft + "%";
}


/* ============================================================
   EFFECT
   ============================================================ */

function showEffect(symbol) {

  effect.textContent =
    symbol;

  effect.classList.remove(
    "effect-pop"
  );

  void effect.offsetWidth;

  effect.classList.add(
    "effect-pop"
  );
}


/* ============================================================
   CELEBRATION SOUND
   ============================================================ */

function playCelebration() {

  playTone(
    523,
      0.12
  );

  setTimeout(
    () =>
      playTone(
        659,
        0.12
      ),
    120
  );

  setTimeout(
    () =>
      playTone(
        784,
        0.12
      ),
    240
  );

  setTimeout(
    () =>
      playTone(
        1046,
        0.3
      ),
    360
  );
}


/* ============================================================
   KEYBOARD
   ============================================================ */

function createKeyboard() {

  keyboardLetters.innerHTML =
    "";

  learningLetters.forEach(
    letter => {

      const key =
        document.createElement(
          "button"
        );

      key.className =
        "key";

      key.type =
        "button";

      key.textContent =
        letter;


      key.addEventListener(
        "click",
        () => {

          const food =
            foods.find(
              item =>
                item.dataset.letter ===
                letter
            );

          if (food) {

            chooseLetter(
              letter,
              food
            );

          }

        }
      );


      keyboardLetters.appendChild(
        key
      );

    }
  );
}


/* ============================================================
   PHYSICAL KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  event => {

    const letter =
      event.key.toUpperCase();

    if (
      !learningLetters.includes(
        letter
      )
    ) {
      return;
    }

    const food =
      foods.find(
        item =>
          item.dataset.letter ===
          letter
      );

    if (food) {

      chooseLetter(
        letter,
        food
      );

    }

  }
);


/* ============================================================
   RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  () => {

    getAudio();

    startGame();

  }
);


/* ============================================================
   START GAME
   ============================================================ */

startGame();