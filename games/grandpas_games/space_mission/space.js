document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     GET ELEMENTS
     ============================================================ */

  const player = document.getElementById("player");
  const gameArea = document.getElementById("gameArea");
  const letterArea = document.getElementById("letterArea");
  const explosion = document.getElementById("explosion");

  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const missionDisplay = document.getElementById("missionNumber");

  const message = document.getElementById("message");
  const instruction = document.getElementById("instruction");

  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");

  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");


  /* ============================================================
     CHECK THAT EVERYTHING LOADED
     ============================================================ */

  if (
    !player ||
    !gameArea ||
    !letterArea ||
    !explosion ||
    !scoreDisplay ||
    !livesDisplay ||
    !missionDisplay ||
    !message ||
    !instruction ||
    !startButton ||
    !restartButton ||
    !leftButton ||
    !rightButton
  ) {
    console.error(
      "Space Mission: One or more HTML elements are missing."
    );

    return;
  }


  /* ============================================================
     GAME VARIABLES
     ============================================================ */

  let score = 0;
  let lives = 3;
  let mission = 1;

  let playing = false;
  let answering = false;

  let rocketX = 50;
  let rocketY = 85;

  let correctLetter = "";

  let lettersToLearn = [
    "A",
    "B"
  ];

  const alphabet = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
  ];


  /* ============================================================
     SPEAK
     ============================================================ */

  function speak(text) {

    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const voice =
      new SpeechSynthesisUtterance(text);

    voice.rate = 0.75;
    voice.pitch = 1.2;
    voice.volume = 1;

    window.speechSynthesis.speak(voice);
  }


  /* ============================================================
     START GAME
     ============================================================ */

  function startGame() {

    console.log("Alphabet mission started!");

    playing = true;
    answering = false;

    score = 0;
    lives = 3;
    mission = 1;

    rocketX = 50;
    rocketY = 85;

    lettersToLearn = [
      "A",
      "B"
    ];

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    missionDisplay.textContent = mission;

    player.style.left = "50%";
    player.style.top = "85%";

    letterArea.innerHTML = "";

    explosion.classList.remove("show");

    startButton.style.display = "none";

    restartButton.style.display = "none";

    message.textContent =
      "🚀 Welcome, Russell!";

    instruction.textContent =
      "🔤 Get ready!";

    speak(
      "Welcome Russell! Let's learn our letters!"
    );

    setTimeout(function () {
      newQuestion();
    }, 800);
  }


  /* ============================================================
     NEW QUESTION
     ============================================================ */

  function newQuestion() {

    if (!playing) {
      return;
    }

    answering = true;

    letterArea.innerHTML = "";

    correctLetter =
      lettersToLearn[
        Math.floor(
          Math.random() *
          lettersToLearn.length
        )
      ];

    instruction.innerHTML =
      "🔤 Find the letter <strong>" +
      correctLetter +
      "</strong>!";

    message.textContent =
      "🚀 Help Russell find it!";

    speak(
      "Find the letter " +
      correctLetter
    );


    /* Create correct letter */

    createLetter(
      correctLetter,
      true
    );


    /* Create wrong letter */

    let wrongLetter =
      alphabet[
        Math.floor(
          Math.random() *
          alphabet.length
        )
      ];

    while (
      wrongLetter === correctLetter
    ) {
      wrongLetter =
        alphabet[
          Math.floor(
            Math.random() *
            alphabet.length
          )
        ];
    }


    createLetter(
      wrongLetter,
      false
    );
  }


  /* ============================================================
     CREATE LETTER
     ============================================================ */

  function createLetter(
    letter,
    correct
  ) {

    const button =
      document.createElement("button");

    button.className = "letter";

    button.type = "button";

    button.textContent = letter;

    button.setAttribute(
      "aria-label",
      "Letter " + letter
    );


    /* Random location */

    const x =
      Math.floor(
        Math.random() * 70
      ) + 10;

    const y =
      Math.floor(
        Math.random() * 45
      ) + 10;

    button.style.left =
      x + "%";

    button.style.top =
      y + "%";


    /* Click / tap */

    button.addEventListener(
      "click",
      function () {

        chooseLetter(
          letter,
          correct,
          button
        );

      }
    );


    letterArea.appendChild(button);
  }


  /* ============================================================
     CHOOSE LETTER
     ============================================================ */

  function chooseLetter(
    letter,
    correct,
    button
  ) {

    if (
      !playing ||
      !answering
    ) {
      return;
    }


    if (correct) {

      answering = false;

      correctAnswer(button);

    } else {

      wrongAnswer(button);

    }
  }


  /* ============================================================
     CORRECT ANSWER
     ============================================================ */

  function correctAnswer(button) {

    score++;

    scoreDisplay.textContent = score;

    message.innerHTML =
      "🎉 GREAT JOB! " +
      correctLetter +
      " is correct! ⭐";

    speak(
      "Great job! " +
      correctLetter
    );


    /* Make letter bigger */

    button.style.transform =
      "scale(1.3)";

    button.style.background =
      "#16823b";


    /* Fly rocket to letter */

    const gameRect =
      gameArea.getBoundingClientRect();

    const letterRect =
      button.getBoundingClientRect();


    const targetX =
      (
        letterRect.left +
        letterRect.width / 2 -
        gameRect.left
      )
      /
      gameRect.width
      *
      100;


    const targetY =
      (
        letterRect.top +
        letterRect.height / 2 -
        gameRect.top
      )
      /
      gameRect.height
      *
      100;


    player.style.left =
      targetX + "%";

    player.style.top =
      targetY + "%";


    /* Add new letters as Russell learns */

    if (
      score === 3 &&
      lettersToLearn.length === 2
    ) {
      lettersToLearn.push("C");
    }

    if (
      score === 6 &&
      lettersToLearn.length === 3
    ) {
      lettersToLearn.push("D");
    }

    if (
      score === 9 &&
      lettersToLearn.length === 4
    ) {
      lettersToLearn.push("E");
    }


    /* Next question */

    setTimeout(function () {

      mission++;

      missionDisplay.textContent =
        mission;

      if (mission > 10) {

        finishGame();

      } else {

        resetRocket();

        newQuestion();

      }

    }, 1600);
  }


  /* ============================================================
     WRONG ANSWER
     ============================================================ */

  function wrongAnswer(button) {

    lives--;

    livesDisplay.textContent =
      lives;

    answering = false;


    message.innerHTML =
      "💥 BOOM! Try again!";


    speak(
      "Boom! Try again!"
    );


    /* Explosion */

    explosion.classList.remove("show");

    void explosion.offsetWidth;

    explosion.classList.add("show");


    /* Wrong letter fades */

    button.style.opacity = "0.3";

    button.disabled = true;


    /* Move rocket back */

    setTimeout(function () {

      resetRocket();

    }, 400);


    /* Give another chance */

    setTimeout(function () {

      if (lives <= 0) {

        lives = 3;

        livesDisplay.textContent =
          lives;

        message.textContent =
          "❤️ Let's try again! You can do it!";

        speak(
          "Let's try again! You can do it!"
        );
      }

      answering = true;

      instruction.innerHTML =
        "🔤 Find the letter <strong>" +
        correctLetter +
        "</strong>!";

    }, 900);
  }


  /* ============================================================
     RESET ROCKET
     ============================================================ */

  function resetRocket() {

    rocketX = 50;
    rocketY = 85;

    player.style.left = "50%";
    player.style.top = "85%";
  }


  /* ============================================================
     FINISH
     ============================================================ */

  function finishGame() {

    playing = false;
    answering = false;

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
     ROCKET MOVEMENT
     ============================================================ */

  function moveLeft() {

    if (!playing) {
      return;
    }

    rocketX -= 8;

    if (rocketX < 5) {
      rocketX = 5;
    }

    player.style.left =
      rocketX + "%";
  }


  function moveRight() {

    if (!playing) {
      return;
    }

    rocketX += 8;

    if (rocketX > 95) {
      rocketX = 95;
    }

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
    function (event) {

      if (!playing) {
        return;
      }

      if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
      ) {

        event.preventDefault();

        moveLeft();
      }


      if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
      ) {

        event.preventDefault();

        moveRight();
      }

    }
  );


  /* ============================================================
     READY
     ============================================================ */

  console.log(
    "Lil' Russell's Alphabet Mission is ready!"
  );

});