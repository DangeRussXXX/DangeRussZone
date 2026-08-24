/* ============================================================
   🦖 DINO'S LETTER LUNCH
   FULL WORKING GAME SCRIPT
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

    scoreDisplay.textContent =
      score;

  }


  if (fedDisplay) {

    fedDisplay.textContent =
      fed;

  }


  dinosaur.classList.remove(
    "walking",
    "eating"
  );


  dinosaur.style.left =
    "50%";

  dinosaur.style.top =
    "62%";


  dinosaurSpeech("🍔?");


  createKeyboard();


  showNextLetter();

}


/* ============================================================
   SHOW WORD + HIGHLIGHT CURRENT LETTER
   ============================================================ */

function showNextLetter() {

  busy = false;

  clearBurgers();


  /* ==========================================================
     WORD COMPLETE
     ========================================================== */

  if (
    currentIndex >=
    currentWord.length
  ) {

    targetLetter.innerHTML =
      currentWord
        .split("")
        .map(function(letter) {

          return (
            '<span class="word-letter completed">' +
            letter +
            '</span>'
          );

        })
        .join("");


    dinosaurSpeech(
      "🎉 GREAT JOB!"
    );


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
     BUILD THE WHOLE WORD
     ========================================================== */

  targetLetter.innerHTML =
    currentWord
      .split("")
      .map(function(letter, index) {


        /*
           ALREADY FOUND
        */

        if (
          index <
          currentIndex
        ) {

          return (
            '<span class="word-letter completed">' +
            letter +
            '</span>'
          );

        }


        /*
           CURRENT LETTER
        */

        if (
          index ===
          currentIndex
        ) {

          return (
            '<span class="word-letter current">' +
            letter +
            '</span>'
          );

        }


        /*
           LETTERS STILL TO FIND
        */

        return (
          '<span class="word-letter">' +
          letter +
          '</span>'
        );

      })
      .join("");


  /*
     Remove old FIND message.
  */

  message.textContent = "";


  /*
     Create burgers.
  */

  createBurgers(
    currentWord[currentIndex]
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
     Shuffle.
  */

  choices.sort(
    () =>
      Math.random() - 0.5
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
         Burgers go directly
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

  } else {

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
     Walk to correct burger.
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


      /*
         Roar sound.
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
   💥 WRONG ANSWER
   DINO WALKS TO WRONG BURGER THEN BOOM
   ============================================================ */

function wrongAnswer(
  burger
) {

  dinosaurSpeech(
    "🤔 HMMM..."
  );


  /*
     Walk to the wrong burger.
  */

  moveDinosaurTo(
    burger,
    function() {


      /*
         Dino arrived.
      */

      dinosaur.classList.remove(
        "walking"
      );


      dinosaurSpeech(
        "💥 OH NO!"
      );


      /*
         BOOM.
      */

      showBoomAt(
        burger
      );


      burger.classList.add(
        "explode"
      );


      playSound(
        "sounds/boom.mp3"
      );


      /*
         Allow another answer.
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


  /*
     Get fresh positions.
     This is important on mobile.
  */

  const gameRect =
    gameArea.getBoundingClientRect();


  const burgerRect =
    burger.getBoundingClientRect();


  /*
     Burger center relative
     to game area.
  */

  const x =
    burgerRect.left +
    burgerRect.width / 2 -
    gameRect.left;


  const y =
    burgerRect.top +
    burgerRect.height / 2 -
    gameRect.top;


  /*
     Start walking.
  */

  dinosaur.classList.remove(
    "eating"
  );


  dinosaur.classList.add(
    "walking"
  );


  /*
     Force the browser to recognize
     the current position before
     applying the new one.
  */

  void dinosaur.offsetWidth;


  /*
     Move Dino.
  */

  dinosaur.style.left =
    x + "px";


  dinosaur.style.top =
    y + "px";


  /*
     Give CSS transition time
     to finish.
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
   💥 BOOM OVER BURGER
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


  /*
     Restart animation.
  */

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
     Letter is one of
     the visible burgers.
  */

  if (burger) {

    selectBurger(
      burger
    );

    return;

  }


  /*
     Letter isn't one of
     the choices.

     Keep the existing behavior.
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
   🔄 RESTART BUTTON
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
   🚀 START
   ============================================================ */

startGame();