/* ============================================================
   🦖 DINO'S LETTER LUNCH
   ============================================================ */


/* ============================================================
   GET ELEMENTS
   ============================================================ */

const dinosaur = document.getElementById("dinosaur");
const dinoSpeech = document.getElementById("dinoSpeech");

const gameArea = document.getElementById("gameArea");
const foodArea = document.getElementById("foodArea");

const targetLetter = document.getElementById("targetLetter");

const fedDisplay = document.getElementById("fed");
const wordProgressDisplay =
  document.getElementById("wordProgress");

const keyboardLetters =
  document.getElementById("keyboardLetters");

const effect = document.getElementById("effect");

const restartButton =
  document.getElementById("restartButton");


/* ============================================================
   WORDS
   ============================================================ */

const words = [
  "CAT",
  "DOG",
  "SUN",
  "MOM",
  "DAD",
  "PIG",
  "COW",
  "HAT"
];


/* ============================================================
   GAME VARIABLES
   ============================================================ */

let currentWordIndex = 0;

let currentLetterIndex = 0;

let fed = 0;

let busy = false;


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

  currentWordIndex = 0;

  currentLetterIndex = 0;

  fed = 0;

  busy = false;

  fedDisplay.textContent = fed;

  createKeyboard();

  showCurrentLetter();

}


/* ============================================================
   CURRENT WORD
   ============================================================ */

function getCurrentWord() {

  return words[currentWordIndex];

}


/* ============================================================
   SHOW LETTER
   ============================================================ */

function showCurrentLetter() {

  const word = getCurrentWord();

  const letter = word[currentLetterIndex];

  targetLetter.textContent = letter;

  updateWordProgress();

  createBurgers(letter);

  dinoSpeech.textContent = "🍔?";

}


/* ============================================================
   WORD PROGRESS
   ============================================================ */

function updateWordProgress() {

  const word = getCurrentWord();

  let display = "";

  for (
    let i = 0;
    i < word.length;
    i++
  ) {

    if (i < currentLetterIndex) {

      display += word[i];

    } else {

      display += "_";

    }

    if (i < word.length - 1) {

      display += " ";

    }
  }

  wordProgressDisplay.textContent = display;
}


/* ============================================================
   CREATE 3 BURGERS
   ============================================================ */

function createBurgers(correctLetter) {

  foodArea.innerHTML = "";

  const letters = createChoices(correctLetter);

  const positions = getBurgerPositions();

  letters.forEach((letter, index) => {

    const burger =
      document.createElement("div");

    burger.className = "burger";

    burger.dataset.letter = letter;

    burger.style.left =
      positions[index].x + "%";

    burger.style.top =
      positions[index].y + "%";


    const letterBubble =
      document.createElement("div");

    letterBubble.className =
      "burger-letter";

    letterBubble.textContent =
      letter;


    burger.appendChild(letterBubble);

    burger.addEventListener(
      "click",
      function () {

        chooseBurger(
          burger,
          letter
        );

      }
    );


    foodArea.appendChild(burger);

  });

}


/* ============================================================
   CREATE LETTER CHOICES
   ============================================================ */

function createChoices(correctLetter) {

  const choices = [correctLetter];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


  while (choices.length < 3) {

    const randomLetter =
      alphabet[
        Math.floor(
          Math.random() * alphabet.length
        )
      ];


    if (
      !choices.includes(randomLetter)
    ) {

      choices.push(randomLetter);

    }

  }


  /*
     Shuffle the three choices
  */

  for (
    let i = choices.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      choices[i],
      choices[j]
    ] =
    [
      choices[j],
      choices[i]
    ];

  }


  return choices;

}


/* ============================================================
   BURGER POSITIONS
   ============================================================ */

function getBurgerPositions() {

  return [

    {
      x: 12,
      y: 18
    },

    {
      x: 70,
      y: 22
    },

    {
      x: 42,
      y: 62
    }

  ];

}


/* ============================================================
   SELECT BURGER
   ============================================================ */

function chooseBurger(
  burger,
  selectedLetter
) {

  if (busy) {

    return;

  }

  busy = true;


  /*
     Move dinosaur to burger
  */

  walkToBurger(burger);


  setTimeout(
    function () {

      const correctLetter =
        getCurrentWord()[
          currentLetterIndex
        ];


      if (
        selectedLetter ===
        correctLetter
      ) {

        correctAnswer(burger);

      } else {

        wrongAnswer(burger);

      }

    },
    1000
  );

}


/* ============================================================
   DINO WALKS TO BURGER
   ============================================================ */

function walkToBurger(burger) {

  const burgerRect =
    burger.getBoundingClientRect();

  const areaRect =
    gameArea.getBoundingClientRect();


  const x =
    (
      burgerRect.left +
      burgerRect.width / 2 -
      areaRect.left
    )
    /
    areaRect.width
    *
    100;


  const y =
    (
      burgerRect.top +
      burgerRect.height / 2 -
      areaRect.top
    )
    /
    areaRect.height
    *
    100;


  dinosaur.classList.add(
    "walking"
  );


  dinosaur.style.left =
    x + "%";

  dinosaur.style.top =
    y + "%";

}


/* ============================================================
   CORRECT ANSWER
   ============================================================ */

function correctAnswer(burger) {

  dinosaur.classList.remove(
    "walking"
  );

  dinosaur.classList.add(
    "eating"
  );


  dinoSpeech.textContent =
    "😋 YUM!";


  burger.classList.add(
    "eaten"
  );


  playSound("correct");


  setTimeout(
    function () {

      dinosaur.classList.remove(
        "eating"
      );

      dinoSpeech.textContent =
        "🦖 ROAR! GOOD JOB!";


      fed++;

      fedDisplay.textContent =
        fed;


      currentLetterIndex++;


      if (
        currentLetterIndex >=
        getCurrentWord().length
      ) {

        finishWord();

      } else {

        updateWordProgress();

        setTimeout(
          function () {

            showCurrentLetter();

            busy = false;

          },
          900
        );

      }

    },
    600
  );

}


/* ============================================================
   WRONG ANSWER
   ============================================================ */

function wrongAnswer(burger) {

  dinosaur.classList.remove(
    "walking"
  );


  burger.classList.add(
    "explode"
  );


  dinoSpeech.textContent =
    "💥 BOOM! TRY AGAIN!";


  showBoom();


  playSound("wrong");


  setTimeout(
    function () {

      dinosaur.style.left = "50%";
      dinosaur.style.top = "62%";


      setTimeout(
        function () {

          dinoSpeech.textContent =
            "🍔 TRY AGAIN!";

          busy = false;

        },
        700
      );

    },
    500
  );

}


/* ============================================================
   BOOM EFFECT
   ============================================================ */

function showBoom(burger) {

  const burgerRect =
    burger.getBoundingClientRect();

  const areaRect =
    gameArea.getBoundingClientRect();


  /*
     Put the explosion directly
     over the incorrect burger.
  */

  const x =
    burgerRect.left +
    burgerRect.width / 2 -
    areaRect.left;


  const y =
    burgerRect.top +
    burgerRect.height / 2 -
    areaRect.top;


  effect.style.left =
    x + "px";

  effect.style.top =
    y + "px";


  effect.textContent = "💥";


  effect.classList.remove("show");


  /*
     Force the animation to restart.
  */

  void effect.offsetWidth;


  effect.classList.add("show");
}


/* ============================================================
   FINISH WORD
   ============================================================ */

function finishWord() {

  const finishedWord =
    getCurrentWord();


  wordProgressDisplay.textContent =
    finishedWord;


  targetLetter.textContent =
    "🎉";


  dinoSpeech.textContent =
    "🦖 GREAT JOB!";


  playSound("word");


  setTimeout(
    function () {

      currentWordIndex++;

      currentLetterIndex = 0;


      if (
        currentWordIndex >=
        words.length
      ) {

        currentWordIndex = 0;

      }


      showCurrentLetter();

      busy = false;

    },
    1800
  );

}


/* ============================================================
   KEYBOARD
   ============================================================ */

function createKeyboard() {

  keyboardLetters.innerHTML = "";


  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


  alphabet.split("").forEach(
    function (letter) {

      const button =
        document.createElement("button");


      button.className = "key";

      button.type = "button";

      button.textContent = letter;


      button.addEventListener(
        "click",
        function () {

          chooseKeyboardLetter(
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


/* ============================================================
   KEYBOARD LETTER SELECTION
   ============================================================ */

function chooseKeyboardLetter(letter) {

  if (busy) {

    return;

  }


  const burgers =
    document.querySelectorAll(
      ".burger"
    );


  for (
    const burger of burgers
  ) {

    if (
      burger.dataset.letter ===
      letter
    ) {

      chooseBurger(
        burger,
        letter
      );

      return;

    }

  }


  /*
     If the pressed letter isn't
     one of the three burgers,
     do nothing.
  */

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
      /^[A-Z]$/.test(letter)
    ) {

      chooseKeyboardLetter(
        letter
      );

    }

  }
);


/* ============================================================
   RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  function () {

    startGame();

  }
);


/* ============================================================
   SIMPLE SOUND EFFECTS
   ============================================================ */

let audioContext = null;


function getAudioContext() {

  if (!audioContext) {

    audioContext =
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

  }

  return audioContext;

}


function playSound(type) {

  try {

    const audio =
      getAudioContext();


    if (
      audio.state ===
      "suspended"
    ) {

      audio.resume();

    }


    const oscillator =
      audio.createOscillator();

    const gain =
      audio.createGain();


    oscillator.connect(gain);

    gain.connect(
      audio.destination
    );


    if (
      type === "correct"
    ) {

      oscillator.frequency.value =
        650;

      gain.gain.value =
        0.12;

      oscillator.start();

      oscillator.frequency.exponentialRampToValueAtTime(
        900,
        audio.currentTime + 0.15
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.3
      );

      oscillator.stop(
        audio.currentTime + 0.3
      );

    }


    else if (
      type === "wrong"
    ) {

      oscillator.frequency.value =
        120;

      gain.gain.value =
        0.18;

      oscillator.start();

      oscillator.frequency.exponentialRampToValueAtTime(
        50,
        audio.currentTime + 0.35
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.4
      );

      oscillator.stop(
        audio.currentTime + 0.4
      );

    }


    else if (
      type === "word"
    ) {

      oscillator.frequency.value =
        500;

      gain.gain.value =
        0.15;

      oscillator.start();

      oscillator.frequency.exponentialRampToValueAtTime(
        1000,
        audio.currentTime + 0.4
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.6
      );

      oscillator.stop(
        audio.currentTime + 0.6
      );

    }

  }

  catch (error) {

    console.log(
      "Sound unavailable:",
      error
    );

  }

}


/* ============================================================
   START
   ============================================================ */

startGame();