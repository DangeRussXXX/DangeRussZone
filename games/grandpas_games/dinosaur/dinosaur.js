/* ============================================================
   🦖 DINO'S LETTER LUNCH
   WORD-BUILDING VERSION
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
  "JUNGLE",
  "MAMA",
  "DAD",
  "BABY",
  "CAT",
  "DOG",
  "SUN"
];


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

  score = 0;
  fed = 0;

  scoreDisplay.textContent = score;
  fedDisplay.textContent = fed;

  currentWord =
    words[Math.floor(Math.random() * words.length)];

  currentIndex = 0;

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

    wordComplete();

    return;
  }

  const letter =
    currentWord[currentIndex];

  targetLetter.textContent = letter;

  message.textContent =
    "FIND: " + letter;

  createBurgers(letter);
}


/* ============================================================
   CREATE THREE BURGERS
   ============================================================ */

function createBurgers(correctLetter) {

  foodArea.innerHTML = "";

  burgers = [];

  const letters = [];

  letters.push(correctLetter);

  while (letters.length < 3) {

    const randomLetter =
      String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );

    if (!letters.includes(randomLetter)) {

      letters.push(randomLetter);

    }
  }


  // Shuffle choices

  letters.sort(() => Math.random() - 0.5);


  /*
     Three safe positions.

     These deliberately stay away from
     the dinosaur's starting area.
  */

  const positions = [

    {
      left: "12%",
      top: "18%"
    },

    {
      left: "75%",
      top: "20%"
    },

    {
      left: "45%",
      top: "72%"
    }

  ];


  letters.forEach((letter, index) => {

    const burger =
      document.createElement("div");

    burger.className = "burger";

    burger.dataset.letter = letter;

    burger.style.left =
      positions[index].left;

    burger.style.top =
      positions[index].top;


    const letterElement =
      document.createElement("div");

    letterElement.className =
      "burger-letter";

    letterElement.textContent =
      letter;


    burger.appendChild(letterElement);

    foodArea.appendChild(burger);

    burgers.push(burger);


    burger.addEventListener(
      "click",
      () => selectLetter(burger)
    );

  });

}


/* ============================================================
   SELECT LETTER
   ============================================================ */

function selectLetter(burger) {

  if (busy) return;

  busy = true;

  const selectedLetter =
    burger.dataset.letter;

  const correctLetter =
    currentWord[currentIndex];


  if (selectedLetter === correctLetter) {

    correctAnswer(burger);

  } else {

    wrongAnswer(burger);

  }

}


/* ============================================================
   CORRECT
   ============================================================ */

function correctAnswer(burger) {

  message.textContent =
    "🦖 ROAR! Great job!";

  score++;
  fed++;

  scoreDisplay.textContent = score;
  fedDisplay.textContent = fed;


  /*
     Move dinosaur directly
     to the selected burger.
  */

  moveDinosaurTo(burger, () => {

    dinosaur.classList.remove("walking");

    dinosaur.classList.add("eating");

    dinosaurSpeech("😋 YUM!");

    burger.classList.add("eaten");


    playRoar();


    setTimeout(() => {

      dinosaur.classList.remove("eating");

      currentIndex++;

      showNextLetter();

    }, 900);

  });

}


/* ============================================================
   WRONG ANSWER
   ============================================================ */

function wrongAnswer(burger) {

  message.textContent =
    "💥 BOOM! Try again!";

  dinosaurSpeech("😮 OH NO!");


  /*
     Move the BOOM to the
     incorrect burger.
  */

  showBoomAt(burger);


  burger.classList.add("explode");

  playBoom();


  setTimeout(() => {

    dinosaurSpeech("Try again!");

    busy = false;

  }, 800);

}


/* ============================================================
   MOVE DINO TO BURGER
   ============================================================ */

function moveDinosaurTo(burger, callback) {

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


  dinosaur.classList.add("walking");


  dinosaur.style.left =
    x + "px";

  dinosaur.style.top =
    y + "px";


  setTimeout(callback, 1000);

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


  effect.textContent = "💥";

  effect.classList.remove("show-boom");


  // Force animation restart

  void effect.offsetWidth;

  effect.classList.add("show-boom");


  setTimeout(() => {

    effect.classList.remove("show-boom");

  }, 850);

}


/* ============================================================
   DINO SPEECH
   ============================================================ */

function dinosaurSpeech(text) {

  const speech =
    document.getElementById("dinoSpeech");

  if (!speech) return;

  speech.textContent = text;

}


/* ============================================================
   WORD COMPLETE
   ============================================================ */

function wordComplete() {

  busy = true;

  dinosaurSpeech("🎉 YAY!");

  message.textContent =
    "🎉 You spelled " + currentWord + "!";

  playSuccess();


  setTimeout(() => {

    currentWord =
      words[Math.floor(Math.random() * words.length)];

    currentIndex = 0;

    showNextLetter();

  }, 1800);

}


/* ============================================================
   KEYBOARD
   ============================================================ */

function createKeyboard() {

  keyboardLetters.innerHTML = "";

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  alphabet.split("").forEach(letter => {

    const button =
      document.createElement("button");

    button.className = "key";

    button.textContent = letter;

    button.type = "button";

    button.addEventListener(
      "click",
      () => keyboardSelect(letter)
    );

    keyboardLetters.appendChild(button);

  });

}


/* ============================================================
   KEYBOARD LETTER
   ============================================================ */

function keyboardSelect(letter) {

  if (busy) return;

  const burger =
    burgers.find(
      b => b.dataset.letter === letter
    );


  if (burger) {

    selectLetter(burger);

  } else {

    /*
       If the keyboard letter isn't one
       of the three burgers, treat it
       as an incorrect choice.
    */

    message.textContent =
      "💥 BOOM! Try again!";

    dinosaurSpeech("Try again!");

    playBoom();

  }

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
      letter >= "A" &&
      letter <= "Z"
    ) {

      keyboardSelect(letter);

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

restartButton.addEventListener(
  "click",
  startGame
);


/* ============================================================
   SOUND
   ============================================================ */

function playRoar() {

  try {

    const audio =
      new Audio(
        "sounds/dino-roar.mp3"
      );

    audio.volume = 0.8;

    audio.play();

  } catch (error) {

    console.log("Roar sound unavailable.");

  }

}


function playBoom() {

  try {

    const audio =
      new Audio(
        "sounds/boom.mp3"
      );

    audio.volume = 0.8;

    audio.play();

  } catch (error) {

    console.log("Boom sound unavailable.");

  }

}


function playSuccess() {

  try {

    const audio =
      new Audio(
        "sounds/success.mp3"
      );

    audio.volume = 0.8;

    audio.play();

  } catch (error) {

    console.log("Success sound unavailable.");

  }

}


/* ============================================================
   START
   ============================================================ */

startGame();