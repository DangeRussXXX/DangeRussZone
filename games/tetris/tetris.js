"use strict";

// ============================================================
// DangeRussZone Tetris
// Complete Tetris Game
// ============================================================

// ------------------------------------------------------------
// CANVAS
// ------------------------------------------------------------

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const nextCanvas = document.getElementById("nextCanvas");
const nextCtx = nextCanvas.getContext("2d");

const holdCanvas = document.getElementById("holdCanvas");
const holdCtx = holdCanvas.getContext("2d");

// ------------------------------------------------------------
// BOARD SETTINGS
// ------------------------------------------------------------

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

// ------------------------------------------------------------
// TETRIMINOS
// ------------------------------------------------------------

const PIECES = {
  I: {
    color: "#00f0f0",
    shape: [
      [1, 1, 1, 1]
    ]
  },

  O: {
    color: "#f0f000",
    shape: [
      [1, 1],
      [1, 1]
    ]
  },

  T: {
    color: "#a000f0",
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },

  S: {
    color: "#00f000",
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },

  Z: {
    color: "#f00000",
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },

  J: {
    color: "#0000f0",
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },

  L: {
    color: "#f0a000",
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  }
};

const PIECE_TYPES = Object.keys(PIECES);

// ------------------------------------------------------------
// GAME STATE
// ------------------------------------------------------------

let board = createBoard();

let current = null;
let next = null;
let hold = null;

let canHold = true;

let score = 0;
let lines = 0;
let level = 1;

let highScore = Number(
  localStorage.getItem("dangeRussTetrisHighScore") || 0
);

let gameRunning = false;
let paused = false;
let gameOver = false;

let dropInterval = 800;
let dropCounter = 0;
let lastTime = 0;

let bag = [];

// ------------------------------------------------------------
// DOM ELEMENTS
// ------------------------------------------------------------

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const levelDisplay = document.getElementById("level");
const linesDisplay = document.getElementById("lines");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const pauseButton = document.getElementById("pauseButton");

const finalScore = document.getElementById("finalScore");

// ------------------------------------------------------------
// BOARD
// ------------------------------------------------------------

function createBoard() {
  return Array.from(
    { length: ROWS },
    () => Array(COLS).fill(null)
  );
}

// ------------------------------------------------------------
// RANDOMIZER
// ------------------------------------------------------------

function refillBag() {
  bag = [...PIECE_TYPES];

  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

function randomPieceType() {
  if (bag.length === 0) {
    refillBag();
  }

  return bag.pop();
}

// ------------------------------------------------------------
// PIECE CREATION
// ------------------------------------------------------------

function createPiece(type) {
  return {
    type: type,

    matrix: PIECES[type].shape.map(row => [...row]),

    color: PIECES[type].color,

    x: 0,
    y: 0
  };
}

// ------------------------------------------------------------
// SPAWN PIECE
// ------------------------------------------------------------

function spawnPiece(type = randomPieceType()) {
  current = createPiece(type);

  current.x = Math.floor(
    (COLS - current.matrix[0].length) / 2
  );

  current.y = 0;

  // Check immediately for game over.
  if (collides(current)) {
    endGame();
  }
}

// ------------------------------------------------------------
// COLLISION DETECTION
// ------------------------------------------------------------

function collides(piece) {
  if (!piece || !board) {
    return false;
  }

  for (let y = 0; y < piece.matrix.length; y++) {
    for (let x = 0; x < piece.matrix[y].length; x++) {

      if (!piece.matrix[y][x]) {
        continue;
      }

      const boardX = piece.x + x;
      const boardY = piece.y + y;

      // Left/right walls
      if (boardX < 0 || boardX >= COLS) {
        return true;
      }

      // Bottom
      if (boardY >= ROWS) {
        return true;
      }

      // Existing block
      if (
        boardY >= 0 &&
        board[boardY][boardX]
      ) {
        return true;
      }
    }
  }

  return false;
}

// ------------------------------------------------------------
// MOVE LEFT / RIGHT
// ------------------------------------------------------------

function move(dx) {
  if (
    !gameRunning ||
    paused ||
    gameOver ||
    !current
  ) {
    return;
  }

  current.x += dx;

  if (collides(current)) {
    current.x -= dx;
  }

  drawBoard();
}

// ------------------------------------------------------------
// SOFT DROP
// ------------------------------------------------------------

function softDrop() {
  if (
    !gameRunning ||
    paused ||
    gameOver ||
    !current
  ) {
    return;
  }

  current.y++;

  if (collides(current)) {
    current.y--;

    lockPiece();
  } else {
    score += 1;

    updateDisplays();
  }

  dropCounter = 0;

  drawBoard();
}

// ------------------------------------------------------------
// HARD DROP
// ------------------------------------------------------------

function hardDrop() {
  if (
    !gameRunning ||
    paused ||
    gameOver ||
    !current
  ) {
    return;
  }

  let distance = 0;

  while (!collides(current)) {
    current.y++;
    distance++;
  }

  current.y--;
  distance--;

  if (distance > 0) {
    score += distance * 2;
  }

  updateDisplays();

  lockPiece();

  drawBoard();
}

// ------------------------------------------------------------
// ROTATION
// ------------------------------------------------------------

function rotateMatrix(matrix) {
  return matrix[0].map((_, index) =>
    matrix
      .map(row => row[index])
      .reverse()
  );
}

function rotate() {
  if (
    !gameRunning ||
    paused ||
    gameOver ||
    !current
  ) {
    return;
  }

  const oldMatrix = current.matrix;
  const oldX = current.x;

  current.matrix = rotateMatrix(current.matrix);

  // Normal rotation works.
  if (!collides(current)) {
    drawBoard();
    return;
  }

  // Try moving right.
  current.x = oldX + 1;

  if (!collides(current)) {
    drawBoard();
    return;
  }

  // Try moving left.
  current.x = oldX - 1;

  if (!collides(current)) {
    drawBoard();
    return;
  }

  // Rotation failed.
  current.x = oldX;
  current.matrix = oldMatrix;

  drawBoard();
}

// ------------------------------------------------------------
// HOLD
// ------------------------------------------------------------

function holdPiece() {
  if (
    !gameRunning ||
    paused ||
    gameOver ||
    !current ||
    !canHold
  ) {
    return;
  }

  canHold = false;

  // First hold.
  if (hold === null) {
    hold = current.type;

    // Bring next piece into play.
    spawnPiece(next.type);

    // Generate another next piece.
    next = createPiece(randomPieceType());

  } else {

    // Swap current and held piece.
    const swap = hold;

    hold = current.type;

    spawnPiece(swap);
  }

  drawPreviews();
  drawBoard();
}

// ------------------------------------------------------------
// LOCK CURRENT PIECE
// ------------------------------------------------------------

function lockPiece() {
  if (!current) {
    return;
  }

  for (
    let y = 0;
    y < current.matrix.length;
    y++
  ) {
    for (
      let x = 0;
      x < current.matrix[y].length;
      x++
    ) {

      if (!current.matrix[y][x]) {
        continue;
      }

      const boardX = current.x + x;
      const boardY = current.y + y;

      if (
        boardY >= 0 &&
        boardY < ROWS &&
        boardX >= 0 &&
        boardX < COLS
      ) {
        board[boardY][boardX] =
          current.color;
      }
    }
  }

  // Clear completed rows.
  clearLines();

  // Move NEXT into CURRENT.
  current = next;

  current.x = Math.floor(
    (COLS - current.matrix[0].length) / 2
  );

  current.y = 0;

  // Generate new NEXT piece.
  next = createPiece(randomPieceType());

  // Allow holding again.
  canHold = true;

  // Check game over.
  if (collides(current)) {
    endGame();
    return;
  }

  drawPreviews();
  drawBoard();
}

// ------------------------------------------------------------
// CLEAR LINES
// ------------------------------------------------------------

function clearLines() {
  let cleared = 0;

  for (
    let y = ROWS - 1;
    y >= 0;
    y--
  ) {

    if (
      board[y].every(
        cell => cell !== null
      )
    ) {

      board.splice(y, 1);

      board.unshift(
        Array(COLS).fill(null)
      );

      cleared++;

      y++;
    }
  }

  if (cleared === 0) {
    return;
  }

  lines += cleared;

  const lineScores = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
  };

  score +=
    (lineScores[cleared] || 0) *
    level;

  level =
    Math.floor(lines / 10) + 1;

  dropInterval =
    Math.max(
      80,
      800 - (level - 1) * 65
    );

  updateDisplays();
}

// ------------------------------------------------------------
// GHOST PIECE
// ------------------------------------------------------------

function getGhostY() {
  if (!current || !board) {
    return 0;
  }

  const testPiece = {
    ...current,
    y: current.y
  };

  while (true) {
    testPiece.y++;

    if (collides(testPiece)) {
      return testPiece.y - 1;
    }
  }
}

// ------------------------------------------------------------
// DRAW BLOCK
// ------------------------------------------------------------

function drawBlock(
  context,
  x,
  y,
  size,
  color,
  alpha = 1
) {
  context.save();

  context.globalAlpha = alpha;

  // Main block
  context.fillStyle = color;

  context.fillRect(
    x,
    y,
    size,
    size
  );

  // Border
  context.strokeStyle =
    "rgba(0,0,0,0.65)";

  context.lineWidth = 2;

  context.strokeRect(
    x,
    y,
    size,
    size
  );

  // Highlight
  context.strokeStyle =
    "rgba(255,255,255,0.25)";

  context.lineWidth = 1;

  context.strokeRect(
    x + 2,
    y + 2,
    size - 4,
    size - 4
  );

  context.restore();
}

// ------------------------------------------------------------
// DRAW MATRIX
// ------------------------------------------------------------

function drawMatrix(
  context,
  matrix,
  offsetX,
  offsetY,
  size,
  color,
  alpha = 1
) {
  matrix.forEach((row, y) => {

    row.forEach((value, x) => {

      if (!value) {
        return;
      }

      drawBlock(
        context,
        (offsetX + x) * size,
        (offsetY + y) * size,
        size,
        color,
        alpha
      );
    });
  });
}

// ------------------------------------------------------------
// DRAW GAME BOARD
// ------------------------------------------------------------

function drawBoard() {

  // Clear canvas
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Background
  ctx.fillStyle = "#050505";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // ----------------------------------------------------------
  // GRID
  // ----------------------------------------------------------

  ctx.strokeStyle =
    "rgba(255,255,255,0.08)";

  ctx.lineWidth = 1;

  // Vertical lines
  for (
    let x = 0;
    x <= COLS;
    x++
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x * BLOCK,
      0
    );

    ctx.lineTo(
      x * BLOCK,
      ROWS * BLOCK
    );

    ctx.stroke();
  }

  // Horizontal lines
  for (
    let y = 0;
    y <= ROWS;
    y++
  ) {

    ctx.beginPath();

    ctx.moveTo(
      0,
      y * BLOCK
    );

    ctx.lineTo(
      COLS * BLOCK,
      y * BLOCK
    );

    ctx.stroke();
  }

  // ----------------------------------------------------------
  // LOCKED BLOCKS
  // ----------------------------------------------------------

  if (board) {

    for (
      let y = 0;
      y < ROWS;
      y++
    ) {

      for (
        let x = 0;
        x < COLS;
        x++
      ) {

        if (board[y][x]) {

          drawBlock(
            ctx,
            x * BLOCK,
            y * BLOCK,
            BLOCK,
            board[y][x]
          );
        }
      }
    }
  }

  // ----------------------------------------------------------
  // CURRENT PIECE
  // ----------------------------------------------------------

  if (
    current &&
    gameRunning &&
    !gameOver
  ) {

    // Ghost piece
    const ghostY = getGhostY();

    drawMatrix(
      ctx,
      current.matrix,
      current.x,
      ghostY,
      BLOCK,
      current.color,
      0.18
    );

    // Actual falling piece
    drawMatrix(
      ctx,
      current.matrix,
      current.x,
      current.y,
      BLOCK,
      current.color,
      1
    );
  }
}

// ------------------------------------------------------------
// DRAW PREVIEW
// ------------------------------------------------------------

function drawPreview(
  context,
  piece
) {

  context.clearRect(
    0,
    0,
    context.canvas.width,
    context.canvas.height
  );

  if (!piece) {
    return;
  }

  const size = 24;

  const width =
    piece.matrix[0].length * size;

  const height =
    piece.matrix.length * size;

  const offsetX =
    (context.canvas.width - width) / 2;

  const offsetY =
    (context.canvas.height - height) / 2;

  piece.matrix.forEach(
    (row, y) => {

      row.forEach(
        (value, x) => {

          if (!value) {
            return;
          }

          drawBlock(
            context,
            offsetX + x * size,
            offsetY + y * size,
            size,
            piece.color
          );
        }
      );
    }
  );
}

// ------------------------------------------------------------
// DRAW HOLD + NEXT
// ------------------------------------------------------------

function drawPreviews() {

  drawPreview(
    nextCtx,
    next
  );

  drawPreview(
    holdCtx,
    hold
      ? createPiece(hold)
      : null
  );
}

// ------------------------------------------------------------
// UPDATE SCORE DISPLAY
// ------------------------------------------------------------

function updateDisplays() {

  scoreDisplay.textContent =
    score;

  highScoreDisplay.textContent =
    highScore;

  levelDisplay.textContent =
    level;

  linesDisplay.textContent =
    lines;
}

// ------------------------------------------------------------
// START GAME
// ------------------------------------------------------------

function startGame() {

  // New board
  board = createBoard();

  // Reset score
  score = 0;

  lines = 0;

  level = 1;

  // Reset speed
  dropInterval = 800;

  dropCounter = 0;

  // Reset timer
  lastTime =
    performance.now();

  // Reset hold
  hold = null;

  canHold = true;

  // Reset state
  gameOver = false;

  paused = false;

  gameRunning = true;

  // Reset randomizer
  bag = [];

  // Create first NEXT piece
  next =
    createPiece(
      randomPieceType()
    );

  // Create first CURRENT piece
  spawnPiece();

  // Hide overlays
  startScreen.classList.add(
    "hidden"
  );

  gameOverScreen.classList.add(
    "hidden"
  );

  // Reset pause button
  pauseButton.textContent =
    "PAUSE";

  // Update UI
  updateDisplays();

  // Draw previews
  drawPreviews();

  // Draw board
  drawBoard();
}

// ------------------------------------------------------------
// GAME OVER
// ------------------------------------------------------------

function endGame() {

  gameOver = true;

  gameRunning = false;

  // High score
  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      "dangeRussTetrisHighScore",
      highScore
    );
  }

  // Final score
  finalScore.textContent =
    score;

  // Show game-over screen
  gameOverScreen.classList.remove(
    "hidden"
  );

  updateDisplays();

  drawBoard();
}

// ------------------------------------------------------------
// PAUSE
// ------------------------------------------------------------

function togglePause() {

  if (
    !gameRunning ||
    gameOver
  ) {
    return;
  }

  paused = !paused;

  pauseButton.textContent =
    paused
      ? "RESUME"
      : "PAUSE";

  drawBoard();
}

// ------------------------------------------------------------
// GAME LOOP
// ------------------------------------------------------------

function update(time = 0) {

  // Time since previous frame
  const delta =
    time - lastTime;

  lastTime = time;

  // ----------------------------------------------------------
  // GAME UPDATE
  // ----------------------------------------------------------

  if (
    gameRunning &&
    !paused &&
    !gameOver &&
    current
  ) {

    dropCounter += delta;

    // Piece should fall
    if (
      dropCounter >=
      dropInterval
    ) {

      current.y++;

      // Collision?
      if (
        collides(current)
      ) {

        // Move back up
        current.y--;

        // Lock piece
        lockPiece();
      }

      // Reset timer
      dropCounter = 0;
    }
  }

  // ----------------------------------------------------------
  // DRAW
  // ----------------------------------------------------------

  drawBoard();

  // ----------------------------------------------------------
  // NEXT FRAME
  // ----------------------------------------------------------

  requestAnimationFrame(
    update
  );
}

// ------------------------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------------------------

document.addEventListener(
  "keydown",
  event => {

    const gameKeys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
      " ",
      "c",
      "C",
      "p",
      "P"
    ];

    if (
      gameKeys.includes(
        event.key
      )
    ) {
      event.preventDefault();
    }

    switch (event.key) {

      case "ArrowLeft":
        move(-1);
        break;

      case "ArrowRight":
        move(1);
        break;

      case "ArrowDown":
        softDrop();
        break;

      case "ArrowUp":
        rotate();
        break;

      case " ":
        hardDrop();
        break;

      case "c":
      case "C":
        holdPiece();
        break;

      case "p":
      case "P":
        togglePause();
        break;
    }
  }
);

// ------------------------------------------------------------
// START BUTTON
// ------------------------------------------------------------

startButton.addEventListener(
  "click",
  startGame
);

// ------------------------------------------------------------
// RESTART BUTTON
// ------------------------------------------------------------

restartButton.addEventListener(
  "click",
  startGame
);

// ------------------------------------------------------------
// PAUSE BUTTON
// ------------------------------------------------------------

pauseButton.addEventListener(
  "click",
  togglePause
);

// ------------------------------------------------------------
// MOBILE CONTROLS
// ------------------------------------------------------------

document
  .querySelectorAll(
    "#mobileControls button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const action =
          button.dataset.action;

        switch (action) {

          case "left":
            move(-1);
            break;

          case "right":
            move(1);
            break;

          case "rotate":
            rotate();
            break;

          case "down":
            softDrop();
            break;

          case "drop":
            hardDrop();
            break;

          case "hold":
            holdPiece();
            break;
        }
      }
    );
  });

// ------------------------------------------------------------
// INITIAL DISPLAY
// ------------------------------------------------------------

updateDisplays();

drawPreviews();

drawBoard();

// ------------------------------------------------------------
// START THE ANIMATION LOOP
// ------------------------------------------------------------

requestAnimationFrame(
  update
);