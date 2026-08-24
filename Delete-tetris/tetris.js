// Select the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the size of the blocks
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = ['#FF6347', '#32CD32', '#1E90FF', '#FFD700', '#9932CC', '#FF1493', '#FFA500'];

// Tetrimino shapes
const TETRIMINOS = [
  [[1, 1, 1], [0, 1, 0]],    // T-shape
  [[1, 1], [1, 1]],          // O-shape
  [[1, 1, 0], [0, 1, 1]],    // S-shape
  [[0, 1, 1], [1, 1, 0]],    // Z-shape
  [[1, 1, 1, 1]],            // I-shape
  [[1, 0, 0], [1, 1, 1]],    // L-shape
  [[0, 0, 1], [1, 1, 1]]     // J-shape
];

// Initialize game state
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentTetrimino = randomTetrimino();
let currentPos = { x: 4, y: 0 }; // Starting position
let gameOver = false;
let score = 0;
let fallSpeed = 500;
let lastFallTime = 0;

// Start the game
function startGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentTetrimino = randomTetrimino();
  currentPos = { x: 4, y: 0 };
  gameOver = false;
  score = 0;
  fallSpeed = 500;
  lastFallTime = 0;
  document.querySelector('.game-over').style.display = 'none';
  requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop(timestamp) {
  if (gameOver) return;

  // Check if enough time has passed to make the piece fall
  if (timestamp - lastFallTime > fallSpeed) {
    // Move the piece down
    if (canMove(0, 1)) {
      currentPos.y += 1;
    } else {
      placeTetrimino();
      clearRows();
      currentTetrimino = randomTetrimino();
      currentPos = { x: 4, y: 0 };
      if (!canMove(0, 0)) {
        gameOver = true;
        document.querySelector('.game-over').style.display = 'block';
      }
    }

    // Update the last fall time
    lastFallTime = timestamp;
  }

  // Clear the canvas and redraw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawTetrimino();
  drawScore();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Check if tetrimino can move
function canMove(dx, dy, rotated = currentTetrimino) {
  for (let y = 0; y < rotated.length; y++) {
    for (let x = 0; x < rotated[y].length; x++) {
      if (rotated[y][x]) {
        let newX = currentPos.x + x + dx;
        let newY = currentPos.y + y + dy;
        if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY] && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}

// Place tetrimino on the board
function placeTetrimino() {
  for (let y = 0; y < currentTetrimino.length; y++) {
    for (let x = 0; x < currentTetrimino[y].length; x++) {
      if (currentTetrimino[y][x]) {
        board[currentPos.y + y][currentPos.x + x] = COLORS[TETRIMINOS.indexOf(currentTetrimino)];
      }
    }
  }
}

// Clear full rows
function clearRows() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== null)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(null));
      score += 10;
    }
  }
}

// Draw the game board
function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        ctx.fillStyle = board[row][col];
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Draw current tetrimino
function drawTetrimino() {
  ctx.fillStyle = COLORS[TETRIMINOS.indexOf(currentTetrimino)];
  for (let y = 0; y < currentTetrimino.length; y++) {
    for (let x = 0; x < currentTetrimino[y].length; x++) {
      if (currentTetrimino[y][x]) {
        ctx.fillRect((currentPos.x + x) * BLOCK_SIZE, (currentPos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect((currentPos.x + x) * BLOCK_SIZE, (currentPos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Draw the score
function drawScore() {
  const scoreDisplay = document.querySelector('.score');
  scoreDisplay.textContent = "Score: " + score;
}

// Random tetrimino selector
function randomTetrimino() {
  return TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)];
}

// Handle key events
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
  if (e.key === 'ArrowDown') {
    if (canMove(0, 1)) currentPos.y += 1;
  }
  if (e.key === 'ArrowUp') rotate();
});

// Move tetrimino left
function moveLeft() {
  if (canMove(-1, 0)) currentPos.x -= 1;
}

// Move tetrimino right
function moveRight() {
  if (canMove(1, 0)) currentPos.x += 1;
}

// Rotate tetrimino
function rotate() {
  let rotated = currentTetrimino[0].map((_, i) => currentTetrimino.map(row => row[i])).reverse();
  let originalPos = { ...currentPos };

  // Try to rotate the piece
  if (canMove(0, 0, rotated)) {
    currentTetrimino = rotated;
  } else {
    // If rotation isn't possible, move left or right (if possible) and try again
    if (canMove(-1, 0)) currentPos.x -= 1;  // Try left
    else if (canMove(1, 0)) currentPos.x += 1;  // Try right
  }

  // If it still doesn't fit, revert back to original position
  if (!canMove(0, 0, currentTetrimino)) {
    currentPos = originalPos;
  }
}
