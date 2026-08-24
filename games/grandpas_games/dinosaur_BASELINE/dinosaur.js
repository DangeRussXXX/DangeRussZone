/* ============================================================
   🦖 DINO'S LETTER LUNCH
   FULL WORKING GAME SCRIPT
   WORD ALWAYS VISIBLE
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const gameArea =
  document.getElementById("gameArea");

const dinosaur =
  document.getElementById("dinosaur");

const targetLetter =
  document.getElementById("targetLetter");

const message =
  document.getElementById("message") || {
    set textContent(value) {}
  };

const scoreDisplay =
  document.getElementById("score") || {
    set textContent(value) {}
  };

const fedDisplay =
  document.getElementById("fed");

const effect =
  document.getElementById("effect");

const keyboardLetters =
  document.getElementById("keyboardLetters");

const restartButton =
  document.getElementById("restartButton");


/* ============================================================
   GAME VARIABLES
   ============================================================ */

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

  currentWord =
    words[
      Math.floor(
        Math.random() * words.length
      )
    ];

  currentIndex = 0;

  busy = false;


  if (scoreDisplay) {
    scoreDisplay.textContent = score;
  }


  if (fedDisplay) {
    fedDisplay.textContent = fed;
  }


  if (dinosaur) {

    dinosaur.classList.remove(
      "walking",
      "eating"
    );

    dinosaur.style.left = "50%";
    dinosaur.style.top = "62%";
  }


  dinosaurSpeech("🍔?");


  createKeyboard();


  showNextLetter();

}


/* ============================================================
   SHOW THE ENTIRE WORD
   ============================================================ */

function showNextLetter() {

  busy = false;

  clearBurgers();


  /* ==========================================================
     WORD COMPLETE
     ========================================================== */

  if (
    currentIndex >= currentWord.length
  ) {

    showWordComplete();


    setTimeout(function() {

      currentWord =
        words[
          Math.floor(
            Math.random() * words.length
          )
        ];

      currentIndex = 0;

      showNextLetter();

    }, 1800);

    return;
  }


  /* ==========================================================
     BUILD ENTIRE WORD
     
     Example:
     
     D I N O
     
     The current letter is highlighted.
     ========================================================== */

  targetLetter.innerHTML = "";


  currentWord
    .split("")
    .forEach(function(letter, index) {

      const span =
        document.createElement("span");


      span.className =
        "word-letter";


      span.textContent =
        letter;


      /*
         LETTERS ALREADY COMPLETED
      */

      if (
        index < currentIndex
      ) {

        span.classList.add(
          "completed"
        );

      }


      /*
         CURRENT LETTER
      */

      else if (
        index === currentIndex
      ) {

        span.classList.add(
          "current"
        );

      }


      /*
         FUTURE LETTERS
      */

      else {

        span.classList.add(
          "future"
        );

      }


      /*
         FORCE the word letters
         to actually display.
      */

      span.style.display =
        "inline-block";

      span.style.visibility =
        "visible";


      targetLetter.appendChild(
        span
      );

    });


  /*
     IMPORTANT:
     There is NO "FIND: A" text anymore.
  */

  message.textContent = "";


  /*
     Create the three burger choices.
  */

  createBurgers(
    currentWord[currentIndex]
  );

}


/* ============================================================
   WORD COMPLETE DISPLAY
   ============================================================ */

function showWordComplete() {

  targetLetter.innerHTML = "";


  currentWord
    .split("")
    .forEach(function(letter) {

      const span =
        document.createElement("span");


      span.className =
        "word-letter completed";


      span.textContent =
        letter;


      span.style.display =
        "inline-block";

      span.style.visibility =
        "visible";


      targetLetter.appendChild(
        span
      );

    });


  message.textContent =
    "🎉 GREAT JOB!";


  dinosaurSpeech(
    "🎉 GREAT JOB!"
  );

}


/* ============================================================
   CREATE EXACTLY 3 BURGERS
   ============================================================ */

function createBurgers(
  correctLetter
) {

  clearBurgers();


  const choices = [
    correctLetter
  ];


  /*
     Add two wrong letters.
  */

  while (
    choices.length < 3
  ) {

    const letter =
      String.fromCharCode(
        65 +
        Math.floor(
          Math.random() * 26
        )
      );


    if (
      !choices.includes(letter)
    ) {

      choices.push(letter);

    }

  }


  /*
     Shuffle choices.
  */

  choices.sort(
    function() {

      return Math.random() - 0.5;

    }
  );


  /*
     Burger positions.
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


  choices.forEach(
    function(letter, index) {

      const burger =
        document.createElement(
          "button"
        );


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
         Letter bubble.
      */

      const letterBubble =
        document.createElement(
          "span"
        );


      letterBubble.className =
        "burger-letter";


      letterBubble.textContent =
        letter;


      burger.appendChild(
        letterBubble
      );


      /*
         Put burger directly
         into gameArea.
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

          selectBurger(
            burger
          );

        }
      );

    }
  );

}


/* ============================================================
   SELECT BURGER
   ============================================================ */

function selectBurger(
  burger
) {

  if (busy) return;


  busy = true;


  const selected =
    burger.dataset.letter;


  const wanted =
    currentWord[currentIndex];


  if (
    selected === wanted
  ) {

    correctAnswer(
      burger
    );

  }

  else {

    wrongAnswer(
      burger
    );

  }

}


/* ============================================================
   ✅ CORRECT ANSWER
   ============================================================ */

function correctAnswer(
  burger
) {

  score++;
  fed++;


  if (scoreDisplay) {

    scoreDisplay.textContent =
      score;

  }


  if (fedDisplay) {

    fedDisplay.textContent =
      fed;

  }


  dinosaurSpeech(
    "😋 YUM!"
  );


  /*
     Dino walks to correct burger.
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
         Eat burger.
      */

      burger.classList.add(
        "eaten"
      );


      playSound(
        "sounds/dino-roar.mp3"
      );


      setTimeout(
        function() {

          dinosaur.classList.remove(
            "eating"
          );


          /*
             Move to next letter.
          */

          currentIndex++;


          /*
             Show the SAME word again,
             but now the next letter
             is highlighted.
          */

          showNextLetter();

        },
        900
      );

    }
  );

}


/* ============================================================
   💥 WRONG ANSWER
   ============================================================ */

function wrongAnswer(
  burger
) {

  dinosaurSpeech(
    "🤔 HMMM..."
  );


  /*
     Dino walks to wrong burger.
  */

  moveDinosaurTo(
    burger,
    function() {

      dinosaur.classList.remove(
        "walking"
      );


      dinosaurSpeech(
        "💥 OH NO!"
      );


      message.textContent =
        "💥 BOOM! Try again!";


      showBoomAt(
        burger
      );


      burger.classList.add(
        "explode"
      );


      playSound(
        "sounds/boom.mp3"
      );


      setTimeout(
        function() {

          dinosaurSpeech(
            "Try again!"
          );


          /*
             Same word and same
             highlighted letter remain.
          */

          busy = false;

        },
        700
      );

    }
  );

}


/* ============================================================
   🦖 MOVE DINOSAUR
   MOBILE + DESKTOP SAFE
   ============================================================ */

function moveDinosaurTo(
  burger,
  finished
) {

  if (
    !burger ||
    !gameArea ||
    !dinosaur
  ) {

    if (
      typeof finished ===
      "function"
    ) {

      finished();

    }

    return;

  }


  const gameRect =
    gameArea.getBoundingClientRect();


  const burgerRect =
    burger.getBoundingClientRect();


  /*
     Find burger center
     relative to game area.
  */

  const x =
    burgerRect.left +
    burgerRect.width / 2 -
    gameRect.left;


  const y =
    burgerRect.top +
    burgerRect.height / 2 -
    gameRect.top;


  dinosaur.classList.remove(
    "eating"
  );


  dinosaur.classList.add(
    "walking"
  );


  /*
     Force browser to recognize
     current position.
  */

  void dinosaur.offsetWidth;


  dinosaur.style.left =
    x + "px";


  dinosaur.style.top =
    y + "px";


  /*
     Wait for movement.
  */

  setTimeout(
    function() {

      dinosaur.classList.remove(
        "walking"
      );


      if (
        typeof finished ===
        "function"
      ) {

        finished();

      }

    },
    1050
  );

}


/* ============================================================
   💥 BOOM
   ============================================================ */

function showBoomAt(
  burger
) {

  if (
    !burger ||
    !effect
  ) return;


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
   💬 DINO SPEECH
   ============================================================ */

function dinosaurSpeech(
  text
) {

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
   ⌨️ CREATE KEYBOARD
   ============================================================ */

function createKeyboard() {

  if (!keyboardLetters)
    return;


  keyboardLetters.innerHTML =
    "";


  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


  alphabet
    .split("")
    .forEach(
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
   ⌨️ KEYBOARD SELECTION
   ============================================================ */

function keyboardSelect(
  letter
) {

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
     If letter is one of
     the three burgers,
     select it.
  */

  if (burger) {

    selectBurger(
      burger
    );

    return;

  }


  /*
     Letter isn't one of
     the visible choices.
  */

  dinosaurSpeech(
    "💥 OH NO!"
  );


  playSound(
    "sounds/boom.mp3"
  );


  busy = false;

}


/* ============================================================
   ⌨️ PHYSICAL KEYBOARD
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
   🧹 CLEAR BURGERS
   ============================================================ */

function clearBurgers() {

  burgers.forEach(
    function(burger) {

      if (
        burger.parentNode
      ) {

        burger.parentNode.removeChild(
          burger
        );

      }

    }
  );


  burgers = [];

}


/* ============================================================
   🔄 RESTART
   ============================================================ */

if (restartButton) {

  restartButton.addEventListener(
    "click",
    startGame
  );

}


/* ============================================================
   🔊 SOUND
   ============================================================ */

function playSound(
  file
) {

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
   🚀 START GAME
   ============================================================ */

startGame();