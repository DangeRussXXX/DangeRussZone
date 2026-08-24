/* ============================================================
   🦖 DINO'S LETTER LUNCH
   ============================================================ */

const gameArea = document.getElementById("gameArea");
const dinosaur = document.getElementById("dinosaur");
const targetLetter = document.getElementById("targetLetter");
const message = document.getElementById("message") || {
  set textContent(value) {}
};

const scoreDisplay = document.getElementById("score") || {
  set textContent(value) {}
};
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
  busy = false;

  dinosaur.classList.remove(
    "walking",
    "eating"
  );

  dinosaur.style.left = "50%";
  dinosaur.style.top = "62%";

  dinosaurSpeech("🍔?");

  createKeyboard();

  showNextLetter();
}


/* ============================================================
   SHOW NEXT LETTER
   ============================================================ */

function showNextLetter() {

  busy = false;

  clearBurgers();

  if (currentIndex >= currentWord.length) {

    message.textContent =
      "🎉 You spelled " + currentWord + "!";

    targetLetter.textContent = "✓";

    dinosaurSpeech("🎉 GREAT JOB!");

    setTimeout(function () {

      currentWord =
        words[Math.floor(Math.random() * words.length)];

      currentIndex = 0;

      showNextLetter();

    }, 1800);

    return;
  }


  const wanted =
    currentWord[currentIndex];


  /* BIG FIND LETTER */

  targetLetter.textContent =
    wanted;


  message.textContent =
    "FIND: " + wanted;


  createBurgers(wanted);
}


/* ============================================================
   CREATE EXACTLY 3 BURGERS
   ============================================================ */

function createBurgers(correctLetter) {

  clearBurgers();


  /*
     Correct letter + 2 wrong letters
  */

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


  /*
     Shuffle
  */

  choices.sort(
    () => Math.random() - 0.5
  );


  /*
     SAFE POSITIONS

     The burgers are deliberately placed
     around the outside of the game area.

     None are underneath Dino.
  */

  const positions = [

    {
      left: "18%",
      top: "22%"
    },

    {
      left: "82%",
      top: "22%"
    },

    {
      left: "18%",
      top: "72%"
    }

  ];


  choices.forEach(function(letter, index) {

    const burger =
      document.createElement("button");


    burger.className =
      "burger";


    burger.type =
      "button";


    burger.dataset.letter =
      letter;


    burger.style.left =
      positions[index].left;


    burger.style.top =
      positions[index].top;


    /*
       Burger emoji
       is created by CSS.
    */

    const letterBubble =
      document.createElement("span");


    letterBubble.className =
      "burger-letter";


    letterBubble.textContent =
      letter;


    burger.appendChild(
      letterBubble
    );


    /*
       IMPORTANT:
       Burgers go directly into gameArea.
    */

    gameArea.appendChild(
      burger
    );


    burgers.push(
      burger
    );


    burger.addEventListener(
      "click",
      function() {

        selectBurger(burger);

      }
    );

  });

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
   CORRECT ANSWER
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


  dinosaurSpeech(
    "😋 YUM!"
  );


  /*
     Dino walks to burger.
  */

  moveDinosaurTo(
    burger,
    function() {

      dinosaur.classList.remove(
        "walking"
      );


      dinosaur.classList.add(
        "eating"
      );


      dinosaurSpeech(
        "😋 YUM!"
      );


      /*
         Burger disappears.
      */

      burger.classList.add(
        "eaten"
      );


      /*
         Dino roar.
      */

      playSound(
        "sounds/dino-roar.mp3"
      );


      setTimeout(
        function() {

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
   💥 WRONG ANSWER — DINO WALKS OVER THEN BOOM
   ============================================================ */

function wrongAnswer(burger) {

  message.textContent =
    "🦖 Uh oh...";


  dinosaurSpeech(
    "🤔 HMMM..."
  );


  /*
     Dino walks over to the wrong burger first.
  */

  moveDinosaurTo(
    burger,
    function() {

      /*
         Dino has arrived.
      */

      dinosaur.classList.remove(
        "walking"
      );


      dinosaurSpeech(
        "💥 OH NO!"
      );


      message.textContent =
        "💥 BOOM! Try again!";


      /*
         NOW the burger explodes.
      */

      showBoomAt(
        burger
      );


      burger.classList.add(
        "explode"
      );


      /*
         Play explosion sound.
      */

      playSound(
        "sounds/boom.mp3"
      );


      /*
         Give the animation time to finish,
         then let the player try again.
      */

      setTimeout(
        function() {

          dinosaurSpeech(
            "Try again!"
          );


          busy = false;

        },
        700
      );

    }
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


  /*
     Burger center inside game area
  */

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
   BOOM OVER WRONG BURGER
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


  /*
     Restart animation
  */

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
   KEYBOARD BUTTONS
   ============================================================ */

function createKeyboard() {

  keyboardLetters.innerHTML = "";


  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


  alphabet.split("").forEach(
    function(letter) {

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
        function() {

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
      function(item) {

        return (
          item.dataset.letter ===
          letter
        );

      }
    );


  /*
     If that letter is one of the
     three burgers, select it.
  */

  if (burger) {

    selectBurger(
      burger
    );

    return;

  }


  /*
     Keyboard letter isn't one
     of the three choices.
  */

  message.textContent =
    "💥 BOOM! Try again!";


  dinosaurSpeech(
    "💥 OH NO!"
  );


  playSound(
    "sounds/boom.mp3"
  );


  busy = false;

}


/* ============================================================
   PHYSICAL KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  function(event) {

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

  /*
     IMPORTANT:
     Burgers are inside gameArea,
     NOT foodArea.
  */

  burgers.forEach(
    function(burger) {

      if (burger.parentNode) {

        burger.parentNode.removeChild(
          burger
        );

      }

    }
  );


  burgers = [];

}


/* ============================================================
   RESTART BUTTON
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


  audio.volume =
    0.8;


  audio.play().catch(
    function() {

      console.log(
        "Sound could not play:",
        file
      );

    }
  );

}


/* ============================================================
   START
   ============================================================ */

startGame();