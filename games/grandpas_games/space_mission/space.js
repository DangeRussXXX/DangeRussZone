/* ============================================================
   LIL' RUSSELL'S SPACE READING MISSION
   ============================================================ */


/* GET HTML ELEMENTS */

const player =
  document.getElementById("player");

const gameArea =
  document.getElementById("gameArea");

const scoreDisplay =
  document.getElementById("score");

const livesDisplay =
  document.getElementById("lives");

const fuelDisplay =
  document.getElementById("fuel");

const message =
  document.getElementById("message");

const leftButton =
  document.getElementById("leftButton");

const rightButton =
  document.getElementById("rightButton");

const startButton =
  document.getElementById("startButton");

const restartButton =
  document.getElementById("restartButton");

const answerArea =
  document.getElementById("answerArea");


/* GAME VARIABLES */

let x = 50;
let y = 80;

let score = 0;
let lives = 3;
let fuel = 100;

let playing = false;

let currentLetter = "";

let questionNumber = 0;

const totalQuestions = 10;


/* LETTERS */

const letters = [
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

  playing = true;

  score = 0;

  lives = 3;

  fuel = 100;

  questionNumber = 0;

  x = 50;

  y = 80;


  scoreDisplay.textContent = score;

  livesDisplay.textContent = lives;

  fuelDisplay.textContent = fuel;


  player.style.left =
    x + "%";

  player.style.top =
    y + "%";


  startButton.style.display =
    "none";

  restartButton.style.display =
    "none";


  message.textContent =
    "🚀 Welcome, Russell! Let's find some letters!";


  createQuestion();
}


/* ============================================================
   CREATE QUESTION
   ============================================================ */

function createQuestion() {

  answerArea.innerHTML = "";


  questionNumber++;


  if (
    questionNumber >
    totalQuestions
  ) {

    finishGame();

    return;
  }


  /* Pick a random letter */

  currentLetter =
    letters[
      Math.floor(
        Math.random() *
        letters.length
      )
    ];


  message.innerHTML =
    "🔤 Find the letter <strong>" +
    currentLetter +
    "</strong>!";


  createAnswers();
}


/* ============================================================
   CREATE ANSWER BUTTONS
   ============================================================ */

function createAnswers() {

  let choices = [
    currentLetter
  ];


  /* Add two wrong letters */

  while (
    choices.length < 3
  ) {

    const randomLetter =
      letters[
        Math.floor(
          Math.random() *
          letters.length
        )
      ];


    if (
      !choices.includes(
        randomLetter
      )
    ) {

      choices.push(
        randomLetter
      );

    }
  }


  /* Shuffle choices */

  choices.sort(
    () => Math.random() - 0.5
  );


  /* Create buttons */

  choices.forEach(
    function(letter) {

      const button =
        document.createElement(
          "button"
        );


      button.type = "button";

      button.textContent =
        letter;

      button.setAttribute(
        "aria-label",
        "Letter " + letter
      );


      /*
        CLICK / MOUSE / TOUCH

        A normal click works with:
        - mouse
        - touchscreen
        - tablet
        - phone
      */

      button.addEventListener(
        "click",
        function() {

          checkAnswer(
            letter,
            button
          );

        }
      );


      answerArea.appendChild(
        button
      );

    }
  );
}


/* ============================================================
   CHECK ANSWER
   ============================================================ */

function checkAnswer(
  answer,
  clickedButton
) {

  if (!playing) {
    return;
  }


  /* CORRECT */

  if (
    answer ===
    currentLetter
  ) {

    score++;

    scoreDisplay.textContent =
      score;


    clickedButton.style.background =
      "#16823b";


    message.innerHTML =
      "🎉 GREAT JOB! " +
      currentLetter +
      " is correct! ⭐";


    disableAnswers();


    setTimeout(
      function() {

        createQuestion();

      },
      1000
    );


    return;
  }


  /* WRONG */

  lives--;

  livesDisplay.textContent =
    lives;


  clickedButton.style.background =
    "#8b1e1e";


  message.innerHTML =
    "💡 Good try! Look for the letter <strong>" +
    currentLetter +
    "</strong>.";


  if (lives <= 0) {

    message.innerHTML =
      "❤️ Let's try again! You can do it, Russell!";


    lives = 3;

    livesDisplay.textContent =
      lives;

  }

}


/* ============================================================
   DISABLE ANSWERS
   ============================================================ */

function disableAnswers() {

  const buttons =
    answerArea.querySelectorAll(
      "button"
    );


  buttons.forEach(
    function(button) {

      button.disabled =
        true;

    }
  );
}


/* ============================================================
   FINISH GAME
   ============================================================ */

function finishGame() {

  playing = false;


  answerArea.innerHTML = "";


  message.innerHTML =
    "🏆 AMAZING JOB, RUSSELL! 🏆<br>" +
    "You finished your first reading mission! 🚀";


  restartButton.style.display =
    "inline-block";
}


/* ============================================================
   MOVE ROCKET
   ============================================================ */

function movePlayer(direction) {

  if (!playing) {
    return;
  }


  if (
    direction === "left"
  ) {

    x -= 5;

  }


  if (
    direction === "right"
  ) {

    x += 5;

  }


  if (
    direction === "up"
  ) {

    y -= 5;

  }


  if (
    direction === "down"
  ) {

    y += 5;

  }


  /* Keep rocket inside game */

  x =
    Math.max(
      5,
      Math.min(
        95,
        x
      )
    );


  y =
    Math.max(
      5,
      Math.min(
        90,
        y
      )
    );


  player.style.left =
    x + "%";

  player.style.top =
    y + "%";


  /* Fuel */

  fuel--;

  if (fuel < 0) {
    fuel = 0;
  }


  fuelDisplay.textContent =
    fuel;


  if (fuel === 0) {

    fuel = 100;

    fuelDisplay.textContent =
      fuel;

    message.textContent =
      "⛽ Fuel refilled! Keep going!";
  }
}


/* ============================================================
   MOUSE / TOUCH BUTTONS
   ============================================================ */

leftButton.addEventListener(
  "click",
  function() {

    movePlayer("left");

  }
);


rightButton.addEventListener(
  "click",
  function() {

    movePlayer("right");

  }
);


startButton.addEventListener(
  "click",
  function() {

    startGame();

  }
);


restartButton.addEventListener(
  "click",
  function() {

    startGame();

  }
);


/* ============================================================
   OPTIONAL KEYBOARD CONTROLS
   ============================================================ */

document.addEventListener(
  "keydown",
  function(event) {

    if (!playing) {
      return;
    }


    const key =
      event.key.toLowerCase();


    if (
      key === "arrowleft" ||
      key === "a"
    ) {

      event.preventDefault();

      movePlayer("left");

    }


    if (
      key === "arrowright" ||
      key === "d"
    ) {

      event.preventDefault();

      movePlayer("right");

    }


    if (
      key === "arrowup" ||
      key === "w"
    ) {

      event.preventDefault();

      movePlayer("up");

    }


    if (
      key === "arrowdown" ||
      key === "s"
    ) {

      event.preventDefault();

      movePlayer("down");

    }

  }
);