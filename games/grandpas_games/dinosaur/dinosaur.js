/* ============================================================
   🦖 DINO'S LETTER LUNCH
   ============================================================ */

const gameArea = document.getElementById("gameArea");
const dinosaur = document.getElementById("dinosaur");
const foodArea = document.getElementById("foodArea");
const targetLetter = document.getElementById("targetLetter");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const fedDisplay = document.getElementById("fed");
const effect = document.getElementById("effect");
const keyboardLetters = document.getElementById("keyboardLetters");
const restartButton = document.getElementById("restartButton");

let score = 0;
let fed = 0;
let currentWord = "";
let currentIndex = 0;
let burgers = [];
let busy = false;


/* ============================================================
   WORDS
   ============================================================ */

const words = [
  "DINO",
  "ROAR",
  "TREE",
  "MAMA",
  "DAD",
  "DOG",
  "CAT",
  "SUN"
];


/* ============================================================
   START
   ============================================================ */

function startGame() {

  score = 0;
  fed = 0;

  scoreDisplay.textContent = score;
  fedDisplay.textContent = fed;

  currentWord =
    words[Math.floor(Math.random() * words.length)];

  currentIndex = 0;

  busy = false;

  message.textContent = "Help Dino spell the word!";

  createKeyboard();

  showNextLetter();
}


/* ============================================================
   NEXT LETTER
   ============================================================ */

function showNextLetter() {

  busy = false;

  clearBurgers();

  if (currentIndex >= currentWord.length) {

    message.textContent =
      "🎉 Great job! You spelled " + currentWord + "!";

    dinosaurSpeech("🎉 YAY!");

    setTimeout(() => {

      currentWord =
        words[Math.floor(Math.random() * words.length)];

      currentIndex = 0;

      showNextLetter();

    }, 1800);

    return;
  }


  const wanted =
    currentWord[currentIndex];

  targetLetter.textContent = wanted;

  message.textContent =
    "FIND: " + wanted;

  createBurgers(wanted);
}


/* ============================================================
   CREATE BURGERS
   ============================================================ */

function createBurgers(correctLetter) {

  foodArea.innerHTML = "";

  burgers = [];


  /* Three choices */

  const choices = [
    correctLetter
  ];


  while (choices.length < 3) {

    const letter =
      String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );

    if (!choices.includes(letter)) {
      choices.push(letter);
    }
  }


  /* Shuffle */

  choices.sort(
    () => Math.random() - 0.5
  );


  /*
     Safe locations.

     These are intentionally away
     from Dino.
  */

  const positions = [

    {
      left: "18%",
      top: "23%"
    },

    {
      left: "82%",
      top: "23%"
    },

    {
      left: "50%",
      top: "78%"
    }

  ];


  choices.forEach(
    (letter, index) => {

      /* Create burger */

      const burger =
        document.createElement("div");

      burger.className = "burger";

      burger.dataset.letter =
        letter;

      burger.style.left =
        positions[index].left;

      burger.style.top =
        positions[index].top;


      /* Create glowing letter */

      const letterBubble =
        document.createElement("div");

      letterBubble.className =
        "burger-letter";

      letterBubble.textContent =
        letter;


      /* Put letter ON burger */

      burger.appendChild(
        letterBubble
      );


      /* Put burger in game */

      foodArea.appendChild(
        burger
      );


      burgers.push(
        burger
      );


      /* Mouse */

      burger.addEventListener(
        "click",
        function () {
          selectBurger(burger);
        }
      );

    }
  );
}


/* ============================================================
   SELECT BURGER
   ============================================================ */

function selectBurger(burger) {

  if (busy) return;

  busy = true;

  const selected =
    burger.dataset.letter;

  const wanted =
    currentWord[currentIndex];


  if (selected === wanted) {

    correctAnswer(burger);

  } else {

    wrongAnswer(burger);

  }
}


/* ============================================================
   CORRECT
   ============================================================ */

function correctAnswer(burger) {

  score++;
  fed++;

  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;

  message.textContent =
    "🦖 Good job!";


  moveDinosaurTo(
    burger,
    function () {

      dinosaur.classList.remove(
        "walking"
      );

      dinosaur.classList.add(
        "eating"
      );

      dinosaurSpeech(
        "😋 YUM!"
      );

      burger.classList.add(
        "eaten"
      );

      playSound(
        "sounds/dino-roar.mp3"
      );


      setTimeout(
        function () {

          dinosaur.classList.remove(
            "eating"
          );

          currentIndex++;

          showNextLetter();

        },
        900
      );

    }
  );
}


/* ============================================================
   WRONG
   ============================================================ */

function wrongAnswer(burger) {

  message.textContent =
    "💥 BOOM! Try again!";

  dinosaurSpeech(
    "💥 OH NO!"
  );


  /* Explosion goes over burger */

  showBoomAt(burger);


  burger.classList.add(
    "explode"
  );


  playSound(
    "sounds/boom.mp3"
  );


  setTimeout(
    function () {

      dinosaurSpeech(
        "Try again!"
      );

      busy = false;

    },
    700
  );
}


/* ============================================================
   MOVE DINOSAUR
   ============================================================ */

function moveDinosaurTo(
  burger,
  finished
) {

  const gameRect =
    gameArea.getBoundingClientRect();

  const burgerRect =
    burger.getBoundingClientRect();


  const x =
    burgerRect.left +
    burgerRect.width / 2 -
    gameRect.left;


  const y =
    burgerRect.top +
    burgerRect.height / 2 -
    gameRect.top;


  dinosaur.classList.add(
    "walking"
  );


  dinosaur.style.left =
    x + "px";

  dinosaur.style.top =
    y + "px";


  setTimeout(
    finished,
    1000
  );
}


/* ============================================================
   BOOM OVER BURGER
   ============================================================ */

function showBoomAt(burger) {

  const gameRect =
    gameArea.getBoundingClientRect();

  const burgerRect =
    burger.getBoundingClientRect();


  const x =
    burgerRect.left +
    burgerRect.width / 2 -
    gameRect.left;


  const y =
    burgerRect.top +
    burgerRect.height / 2 -
    gameRect.top;


  effect.style.left =
    x + "px";

  effect.style.top =
    y + "px";

  effect.textContent =
    "💥";


  effect.classList.remove(
    "show-boom"
  );


  void effect.offsetWidth;


  effect.classList.add(
    "show-boom"
  );
}


/* ============================================================
   DINO SPEECH
   ============================================================ */

function dinosaurSpeech(text) {

  const speech =
    document.getElementById(
      "dinoSpeech"
    );

  if (speech) {

    speech.textContent =
      text;

  }
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
        document.createElement(
          "button"
        );

      button.className =
        "key";

      button.type =
        "button";

      button.textContent =
        letter;


      button.addEventListener(
        "click",
        function () {

          keyboardSelect(
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
   KEYBOARD SELECTION
   ============================================================ */

function keyboardSelect(letter) {

  if (busy) return;


  const burger =
    burgers.find(
      function (item) {

        return (
          item.dataset.letter ===
          letter
        );

      }
    );


  if (burger) {

    selectBurger(
      burger
    );

  } else {

    message.textContent =
      "💥 BOOM! Try again!";

    dinosaurSpeech(
      "Try again!"
    );

    playSound(
      "sounds/boom.mp3"
    );

    busy = false;

  }
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
      letter >= "A" &&
      letter <= "Z"
    ) {

      keyboardSelect(
        letter
      );

    }

  }
);


/* ============================================================
   CLEAR BURGERS
   ============================================================ */

function clearBurgers() {

  foodArea.innerHTML = "";

  burgers = [];
}


/* ============================================================
   RESTART
   ============================================================ */

if (restartButton) {

  restartButton.addEventListener(
    "click",
    startGame
  );

}


/* ============================================================
   SOUND
   ============================================================ */

function playSound(file) {

  const audio =
    new Audio(file);

  audio.volume = 0.8;

  audio.play().catch(
    function () {

      console.log(
        "Sound could not play:",
        file
      );

    }
  );
}


/* ============================================================
   GO!
   ============================================================ */

startGame();