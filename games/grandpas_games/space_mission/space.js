/* ============================================================
   LIL' RUSSELL'S ALPHABET SPACE MISSION
   ============================================================ */


/* ============================================================
   GET ELEMENTS
   ============================================================ */

const player =
  document.getElementById("player");

const gameArea =
  document.getElementById("gameArea");

const letterArea =
  document.getElementById("letterArea");

const explosion =
  document.getElementById("explosion");

const scoreDisplay =
  document.getElementById("score");

const livesDisplay =
  document.getElementById("lives");

const missionNumberDisplay =
  document.getElementById("missionNumber");

const message =
  document.getElementById("message");

const instruction =
  document.getElementById("instruction");

const startButton =
  document.getElementById("startButton");

const restartButton =
  document.getElementById("restartButton");

const leftButton =
  document.getElementById("leftButton");

const rightButton =
  document.getElementById("rightButton");


/* ============================================================
   GAME VARIABLES
   ============================================================ */

let score = 0;

let lives = 3;

let missionNumber = 1;

let playing = false;

let rocketX = 50;

let rocketY = 85;

let correctLetter = "";

let acceptingAnswer = true;


/*
   Start with only A and B.

   After the player gets several questions correct,
   C is introduced, then D, then E, etc.
*/

let lettersAvailable = [
  "A",
  "B"
];


const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

  score = 0;

  lives = 3;

  missionNumber = 1;

  playing = true;

  acceptingAnswer = true;

  rocketX = 50;

  rocketY = 85;


  lettersAvailable = [
    "A",
    "B"
  ];


  scoreDisplay.textContent =
    score;

  livesDisplay.textContent =
    lives;

  missionNumberDisplay.textContent =
    missionNumber;


  player.style.left =
    rocketX + "%";

  player.style.top =
    rocketY + "%";


  startButton.style.display =
    "none";

  restartButton.style.display =
    "none";


  message.textContent =
    "🚀 Welcome, Russell!";


  instruction.textContent =
    "🔤 Find the letter!";


  speak(
    "Welcome Russell. Let's learn our letters!"
  );


  createLetterMission();
}


/* ============================================================
   CREATE LETTER MISSION
   ============================================================ */

function createLetterMission() {

  if (!playing) {
    return;
  }


  acceptingAnswer = true;


  letterArea.innerHTML = "";


  /*
     Pick the correct letter
  */

  correctLetter =
    randomItem(
      lettersAvailable
    );


  instruction.innerHTML =
    "🔤 Find the letter <strong>" +
    correctLetter +
    "</strong>!";


  speak(
    "Find the letter " +
    correctLetter
  );


  /*
     Create correct letter
  */

  createLetter(
    correctLetter,
    true
  );


  /*
     Create one wrong letter
  */

  let wrongLetter =
    randomItem(
      alphabet
    );


  while (
    wrongLetter ===
    correctLetter
  ) {

    wrongLetter =
      randomItem(
        alphabet
      );

  }


  createLetter(
    wrongLetter,
    false
  );
}


/* ============================================================
   CREATE A FLOATING LETTER
   ============================================================ */

function createLetter(
  letter,
  isCorrect
) {

  const button =
    document.createElement(
      "button"
    );


  button.className =
    "letter";


  button.textContent =
    letter;


  button.type =
    "button";


  button.setAttribute(
    "aria-label",
    "Letter " + letter
  );


  /*
     Random position.

     Keep the letters away from the very
     bottom where the rocket starts.
  */

  const x =
    randomNumber(
      15,
      85
    );


  const y =
    randomNumber(
      15,
      60
    );


  button.style.left =
    x + "%";


  button.style.top =
    y + "%";


  /*
     Mouse click AND touch
     are handled by click.
  */

  button.addEventListener(
    "click",
    function() {

      selectLetter(
        letter,
        button,
        isCorrect
      );

    }
  );


  letterArea.appendChild(
    button
  );
}


/* ============================================================
   SELECT LETTER
   ============================================================ */

function selectLetter(
  letter,
  button,
  isCorrect
) {

  if (
    !playing ||
    !acceptingAnswer
  ) {

    return;

  }


  acceptingAnswer =
    false;


  /*
     CORRECT
  */

  if (isCorrect) {

    correctAnswer(
      button
    );

    return;
  }


  /*
     WRONG
  */

  wrongAnswer(
    button
  );
}


/* ============================================================
   CORRECT ANSWER
   ============================================================ */

function correctAnswer(
  button
) {

  score++;

  scoreDisplay.textContent =
    score;


  message.innerHTML =
    "🎉 GREAT JOB! You found " +
    correctLetter +
    "! ⭐";


  speak(
    "Great job! " +
    correctLetter +
    "!"
  );


  /*
     Make the selected letter
     look extra special.
  */

  button.style.background =
    "#16823b";


  button.style.transform =
    "scale(1.25)";


  /*
     Fly rocket to the letter.
  */

  flyRocketTo(
    button
  );


  /*
     Add another letter after
     enough successful answers.
  */

  if (
    score === 3 &&
    lettersAvailable.length < 3
  ) {

    lettersAvailable.push(
      "C"
    );

  }


  if (
    score === 6 &&
    lettersAvailable.length < 4
  ) {

    lettersAvailable.push(
      "D"
    );

  }


  if (
    score === 9 &&
    lettersAvailable.length < 5
  ) {

    lettersAvailable.push(
      "E"
    );

  }


  /*
     Wait for rocket animation.
  */

  setTimeout(
    function() {

      celebrate();

    },
    900
  );


  setTimeout(
    function() {

      missionNumber++;

      missionNumberDisplay.textContent =
        missionNumber;


      if (
        missionNumber > 10
      ) {

        finishMission();

      } else {

        createLetterMission();

      }

    },
    1800
  );
}


/* ============================================================
   ROCKET FLIES TO LETTER
   ============================================================ */

function flyRocketTo(
  button
) {

  const gameRect =
    gameArea.getBoundingClientRect();


  const letterRect =
    button.getBoundingClientRect();


  const targetX =
    (
      (
        letterRect.left +
        letterRect.width / 2 -
        gameRect.left
      )
      /
      gameRect.width
    )
    * 100;


  const targetY =
    (
      (
        letterRect.top +
        letterRect.height / 2 -
        gameRect.top
      )
      /
      gameRect.height
    )
    * 100;


  rocketX =
    targetX;


  rocketY =
    targetY;


  player.style.left =
    rocketX + "%";


  player.style.top =
    rocketY + "%";
}


/* ============================================================
   CELEBRATION
   ============================================================ */

function celebrate() {

  player.classList.add(
    "celebrate"
  );


  setTimeout(
    function() {

      player.classList.remove(
        "celebrate"
      );

    },
    700
  );
}


/* ============================================================
   WRONG ANSWER
   ============================================================ */

function wrongAnswer(
  button
) {

  lives--;

  livesDisplay.textContent =
    lives;


  message.innerHTML =
    "💥 BOOM! Try again!";


  speak(
    "Boom! Try again!"
  );


  /*
     Hide the wrong letter.
  */

  button.style.opacity =
    "0.3";


  button.style.pointerEvents =
    "none";


  /*
     Show explosion.
  */

  explosion.classList.remove(
    "show"
  );


  /*
     Force animation restart.
  */

  void explosion.offsetWidth;


  explosion.classList.add(
    "show"
  );


  /*
     Reset rocket position.
  */

  rocketX = 50;

  rocketY = 85;


  player.style.left =
    rocketX + "%";


  player.style.top =
    rocketY + "%";


  /*
     If lives reach zero,
     give him encouragement
     instead of ending the game.
  */

  if (lives <= 0) {

    lives = 3;

    livesDisplay.textContent =
      lives;


    message.innerHTML =
      "❤️ You can do it, Russell! Let's try again!";


    speak(
      "You can do it Russell. Let's try again!"
    );

  }


  /*
     Let him try again.
  */

  setTimeout(
    function() {

      acceptingAnswer = true;

      message.innerHTML =
        "💡 Find the letter " +
        correctLetter +
        "!";


      speak(
        "Find " +
        correctLetter
      );

    },
    900
  );
}


/* ============================================================
   FINISH MISSION
   ============================================================ */

function finishMission() {

  playing = false;

  acceptingAnswer = false;


  letterArea.innerHTML = "";


  instruction.innerHTML =
    "🏆 ALPHABET MISSION COMPLETE! 🏆";


  message.innerHTML =
    "🎉 AMAZING JOB, RUSSELL! 🎉<br>" +
    "You found " +
    score +
    " letters!";


  speak(
    "Amazing job Russell! " +
    "You finished your alphabet mission!"
  );


  restartButton.style.display =
    "inline-block";
}


/* ============================================================
   RANDOM ITEM
   ============================================================ */

function randomItem(
  array
) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];
}


/* ============================================================
   RANDOM NUMBER
   ============================================================ */

function randomNumber(
  min,
  max
) {

  return Math.floor(
    Math.random() *
    (max - min + 1)
  ) + min;
}


/* ============================================================
   SPEAK LETTER / MESSAGE
   ============================================================ */

function speak(
  text
) {

  /*
     Some browsers don't support speech.
     If they don't, the game still works.
  */

  if (
    !("speechSynthesis" in window)
  ) {

    return;

  }


  window.speechSynthesis.cancel();


  const voice =
    new SpeechSynthesisUtterance(
      text
    );


  voice.rate =
    0.75;


  voice.pitch =
    1.2;


  voice.volume =
    1;


  window.speechSynthesis.speak(
    voice
  );
}


/* ============================================================
   MOVE ROCKET LEFT
   ============================================================ */

function moveLeft() {

  if (!playing) {
    return;
  }


  rocketX -= 8;


  rocketX =
    Math.max(
      5,
      rocketX
    );


  player.style.left =
    rocketX + "%";
}


/* ============================================================
   MOVE ROCKET RIGHT
   ============================================================ */

function moveRight() {

  if (!playing) {
    return;
  }


  rocketX += 8;


  rocketX =
    Math.min(
      95,
      rocketX
    );


  player.style.left =
    rocketX + "%";
}


/* ============================================================
   BUTTONS
   ============================================================ */

startButton.addEventListener(
  "click",
  startGame
);


restartButton.addEventListener(
  "click",
  startGame
);


leftButton.addEventListener(
  "click",
  moveLeft
);


rightButton.addEventListener(
  "click",
  moveRight
);


/* ============================================================
   KEYBOARD
   ============================================================ */

document.addEventListener(
  "keydown",
  function(event) {

    if (!playing) {
      return;
    }


    if (
      event.key ===
      "ArrowLeft"
    ) {

      event.preventDefault();

      moveLeft();

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      event.preventDefault();

      moveRight();

    }

  }
);