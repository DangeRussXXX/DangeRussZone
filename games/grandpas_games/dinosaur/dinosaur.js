/* ============================================================
   🦖 DINO'S LETTER LUNCH
   FULL WORKING VERSION
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


/* ============================================================
   🎮 GAME VARIABLES
   ============================================================ */

let score = 0;
let fed = 0;

let currentWord = "";
let currentIndex = 0;

let burgers = [];
let busy = false;


/* ============================================================
   📝 WORDS
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
   🎮 START GAME
   ============================================================ */

function startGame() {

  score = 0;
  fed = 0;

  scoreDisplay.textContent = score;

  if (fedDisplay) {
    fedDisplay.textContent = fed;
  }

  currentWord =
    words[Math.floor(Math.random() * words.length)];

  currentIndex = 0;

  busy = false;


  /* Reset Dino */

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
   🔤 SHOW NEXT LETTER
   ============================================================ */

function showNextLetter() {

  busy = false;

  clearBurgers();


  /*
     Finished word
  */

  if (currentIndex >= currentWord.length) {

    message.textContent =
      "🎉 You spelled " + currentWord + "!";

    targetLetter.textContent = "✓";

    dinosaurSpeech("🎉 GREAT JOB!");


    setTimeout(function() {

      currentWord =
        words[Math.floor(Math.random() * words.length)];

      currentIndex = 0;

      showNextLetter();

    }, 1800);

    return;
  }


  const wanted =
    currentWord[currentIndex];


  targetLetter.textContent =
    wanted;

  message.textContent =
    "FIND: " + wanted;


  createBurgers(wanted);
}


/* ============================================================
   🍔 CREATE 3 BURGERS
   ============================================================ */

function createBurgers(correctLetter) {

  clearBurgers();


  /*
     Correct letter
     + two wrong letters
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
     Burger positions
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
       Letter bubble
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
       Put burger directly
       inside gameArea.
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
   👆 SELECT BURGER
   ============================================================ */

function selectBurger(burger) {

  if (busy) {
    return;
  }


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
   ✅ CORRECT ANSWER
   ============================================================ */

function correctAnswer(burger) {

  score++;
  fed++;


  scoreDisplay.textContent =
    score;


  if (fedDisplay) {

    fedDisplay.textContent =
      fed;

  }


  message.textContent =
    "🦖 Good job!";


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
         Burger gets eaten.
      */

      burger.classList.add(
        "eaten"
      );


      /*
         Dino sound.
      */

      playSound(
        "sounds/dino-roar.mp3"
      );


      /*
         Next letter.
      */

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
   DINO WALKS TO WRONG BURGER
   THEN BOOM
   ============================================================ */

function wrongAnswer(burger) {

  message.textContent =
    "🦖 Uh oh...";


  dinosaurSpeech(
    "🤔 HMMM..."
  );


  /*
     IMPORTANT:
     Dino walks to the wrong burger
     BEFORE the explosion happens.
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
         Explosion happens
         exactly where burger is.
      */

      showBoomAt(
        burger
      );


      burger.classList.add(
        "explode"
      );


      /*
         Boom sound.
      */

      playSound(
        "sounds/boom.mp3"
      );


      /*
         Let player try again.
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
   🦖 MOVE DINO TO BURGER
   MOBILE + DESKTOP SAFE
   ============================================================ */

function moveDinosaurTo(burger, finished) {

  if (
    !burger ||
    !gameArea ||
    !dinosaur
  ) {
    return;
  }


  /*
     Get the actual game area position.
  */

  const gameRect =
    gameArea.getBoundingClientRect();


  /*
     Get the burger's actual position
     on the screen.

     This is important on mobile because
     the burger may be positioned with %.
  */

  const burgerRect =
    burger.getBoundingClientRect();


  /*
     Find burger center relative
     to gameArea.
  */

  const x =
    (burgerRect.left - gameRect.left) +
    (burgerRect.width / 2);


  const y =
    (burgerRect.top - gameRect.top) +
    (burgerRect.height / 2);


  /*
     Dino starts walking.
  */

  dinosaur.classList.remove(
    "eating"
  );

  dinosaur.classList.add(
    "walking"
  );


  /*
     Force browser to recognize
     walking state before movement.
  */

  void dinosaur.offsetWidth;


  /*
     Move Dino to burger center.
  */

  dinosaur.style.left =
    x + "px";

  dinosaur.style.top =
    y + "px";


  /*
     Desktop = 1 second
     Mobile = 1.1 seconds
  */

  const walkTime =
    window.innerWidth <= 650
      ? 1100
      : 1000;


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
    walkTime
  );

}


/* ============================================================
   💥 SHOW BOOM
   ============================================================ */

function showBoomAt(burger) {

  if (!burger || !effect) {
    return;
  }


  const gameRect =
    gameArea.getBoundingClientRect();


  const burgerRect =
    burger.getBoundingClientRect();


  /*
     Find burger center.
  */

  const x =
    (burgerRect.left - gameRect.left) +
    (burgerRect.width / 2);


  const y =
    (burgerRect.top - gameRect.top) +
    (burgerRect.height / 2);


  /*
     Put explosion directly
     over burger.
  */

  effect.style.left =
    x + "px";

  effect.style.top =
    y + "px";


  effect.textContent =
    "💥";


  /*
     Restart animation.
  */

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
   ⌨️ CREATE KEYBOARD
   ============================================================ */

function createKeyboard() {

  if (!keyboardLetters) {
    return;
  }


  keyboardLetters.innerHTML =
    "";


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
   ⌨️ KEYBOARD SELECTION
   ============================================================ */

function keyboardSelect(letter) {

  if (busy) {
    return;
  }


  /*
     See if that letter is
     one of the burgers.
  */

  const burger =
    burgers.find(
      function(item) {

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

    return;

  }


  /*
     Letter isn't one of the burgers.
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
   🚀 START
   ============================================================ */

startGame();