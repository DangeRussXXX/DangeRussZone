/* ============================================================
   🦖 DINO'S LETTER LUNCH
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const gameArea =
  document.getElementById("gameArea");

const dinosaur =
  document.getElementById("dinosaur");

const foodArea =
  document.getElementById("foodArea");

const targetLetter =
  document.getElementById("targetLetter");

const message =
  document.getElementById("message");

const scoreDisplay =
  document.getElementById("score");

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

const letters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let currentLetter = "A";

let score = 0;

let fed = 0;

let busy = false;


/* ============================================================
   CREATE KEYBOARD
   ============================================================ */

letters.forEach(letter => {

  const button =
    document.createElement("button");

  button.className = "key";

  button.textContent = letter;

  button.type = "button";

  button.addEventListener(
    "click",
    () => chooseLetter(letter)
  );

  keyboardLetters.appendChild(button);

});


/* ============================================================
   RANDOM LETTER
   ============================================================ */

function newRound() {

  busy = false;

  currentLetter =
    letters[
      Math.floor(
        Math.random() * letters.length
      )
    ];

  targetLetter.textContent =
    currentLetter;

  message.textContent =
    "Find the letter " +
    currentLetter +
    "!";

  dinosaur.style.left = "50%";

  dinosaur.style.bottom = "10px";

  createFoods();

}


/* ============================================================
   CREATE HAMBURGERS
   ============================================================ */

function createFoods() {

  foodArea.innerHTML = "";

  const positions = [

    { x: 15, y: 25 },

    { x: 42, y: 18 },

    { x: 70, y: 28 },

    { x: 25, y: 52 },

    { x: 60, y: 55 }

  ];


  /* Make sure the correct letter appears once */

  const correctSpot =
    Math.floor(
      Math.random() * positions.length
    );


  positions.forEach(
    (position, index) => {

      let letter;


      if (index === correctSpot) {

        letter =
          currentLetter;

      } else {

        letter =
          getWrongLetter();

      }


      createFood(
        letter,
        position.x,
        position.y
      );

    }
  );

}


/* ============================================================
   WRONG LETTER
   ============================================================ */

function getWrongLetter() {

  let letter;

  do {

    letter =
      letters[
        Math.floor(
          Math.random() * letters.length
        )
      ];

  } while (
    letter === currentLetter
  );

  return letter;
}


/* ============================================================
   CREATE FOOD
   ============================================================ */

function createFood(
  letter,
  x,
  y
) {

  const food =
    document.createElement("button");

  food.className = "food";

  food.type = "button";

  food.dataset.letter =
    letter;

  food.style.left =
    x + "%";

  food.style.top =
    y + "%";


  food.innerHTML = `

    <span class="burger">
      🍔
      <span class="food-letter">
        ${letter}
      </span>
    </span>

  `;


  food.addEventListener(
    "click",
    () => {

      chooseFood(
        food,
        letter
      );

    }
  );


  foodArea.appendChild(food);

}


/* ============================================================
   LETTER SELECTION
   ============================================================ */

function chooseLetter(letter) {

  if (busy) {
    return;
  }


  const foods =
    document.querySelectorAll(
      ".food"
    );


  let selectedFood = null;


  foods.forEach(food => {

    if (
      food.dataset.letter ===
      letter
    ) {

      selectedFood = food;

    }

  });


  if (selectedFood) {

    chooseFood(
      selectedFood,
      letter
    );

  } else {

    wrongAnswer();

  }

}


/* ============================================================
   FOOD SELECTION
   ============================================================ */

function chooseFood(
  food,
  letter
) {

  if (busy) {
    return;
  }


  if (
    letter ===
    currentLetter
  ) {

    correctAnswer(food);

  } else {

    wrongAnswer(food);

  }

}


/* ============================================================
   CORRECT ANSWER
   ============================================================ */

function correctAnswer(food) {

  busy = true;


  score++;

  fed++;


  scoreDisplay.textContent =
    score;

  fedDisplay.textContent =
    fed;


  message.textContent =
    "YUM! Dino found " +
    currentLetter +
    "! 🦖🍔";


  /* Move dinosaur toward hamburger */

  const foodRect =
    food.getBoundingClientRect();

  const areaRect =
    gameArea.getBoundingClientRect();


  const foodX =
    (
      (foodRect.left -
      areaRect.left) /
      areaRect.width
    ) * 100;


  dinosaur.style.left =
    foodX + "%";


  /* Chomp */

  food.classList.add(
    "correct"
  );


  showEffect("😋");


  setTimeout(() => {

    showEffect("💥");

  }, 300);


  setTimeout(() => {

    newRound();

  }, 1100);

}


/* ============================================================
   WRONG ANSWER
   ============================================================ */

function wrongAnswer(food) {

  if (busy) {
    return;
  }


  message.textContent =
    "Oops! Try another letter! 🦖";


  if (food) {

    food.classList.add(
      "wrong"
    );

  }


  showEffect("💥");


  /* Dino reacts */

  dinosaur.style.transform =
    "translateX(-50%) rotate(-8deg)";


  setTimeout(() => {

    dinosaur.style.transform =
      "translateX(-50%)";

  }, 350);

}


/* ============================================================
   EFFECT
   ============================================================ */

function showEffect(symbol) {

  effect.textContent =
    symbol;

  effect.classList.remove(
    "effect-pop"
  );


  void effect.offsetWidth;


  effect.classList.add(
    "effect-pop"
  );

}


/* ============================================================
   KEYBOARD CONTROLS
   ============================================================ */

document.addEventListener(
  "keydown",
  event => {

    const key =
      event.key.toUpperCase();


    if (
      letters.includes(key)
    ) {

      chooseLetter(key);

    }

  }
);


/* ============================================================
   RESTART
   ============================================================ */

restartButton.addEventListener(
  "click",
  () => {

    score = 0;

    fed = 0;

    scoreDisplay.textContent =
      "0";

    fedDisplay.textContent =
      "0";

    newRound();

  }
);


/* ============================================================
   START GAME
   ============================================================ */

newRound();