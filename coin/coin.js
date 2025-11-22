const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let basket = { x: 160, y: 540, width: 80, height: 40, speed: 100 };
let score = 0;
let gameOver = false;
let running = false;   // <-- Controls Start/Stop

// Load coin images
const coinImages = [new Image(), new Image(), new Image()];
coinImages[0].src = "coin.png";
coinImages[1].src = "coin.png";
coinImages[2].src = "coin.png";

// Create 3 coins
let coins = [
  { x: Math.random() * 360 + 20, y: -20, size: 20, speed: 2 + Math.random() * 2, img: coinImages[0] },
  { x: Math.random() * 360 + 20, y: -50, size: 22, speed: 3 + Math.random() * 2, img: coinImages[1] },
  { x: Math.random() * 360 + 20, y: -80, size: 18, speed: 4 + Math.random() * 2, img: coinImages[2] }
];

// Move basket (keyboard)
document.addEventListener("keydown", (e) => {
  if (!running) return;
  if (e.key === "ArrowLeft") basket.x -= basket.speed;
  if (e.key === "ArrowRight") basket.x += basket.speed;

  basket.x = Math.max(0, Math.min(canvas.width - basket.width, basket.x));
});

// Move basket (touch / drag)
canvas.addEventListener("touchmove", (e) => {
  if (!running) return;

  const rect = canvas.getBoundingClientRect();
  const touchX = e.touches[0].clientX - rect.left;
  basket.x = touchX - basket.width / 2;
  basket.x = Math.max(0, Math.min(canvas.width - basket.width, basket.x));
});

// Reset any individual coin
function resetCoin(c) {
  c.x = Math.random() * (canvas.width - 40) + 20;
  c.y = -20;
  c.speed = 2 + Math.random() * 3;
}

function update() {
  if (!running || gameOver) return;

  coins.forEach((c) => {
    c.y += c.speed;

    // Missed coin → game over
    if (c.y > canvas.height) {
      gameOver = true;
    }

    // Collision (catch)
    if (
      c.x > basket.x &&
      c.x < basket.x + basket.width &&
      c.y + c.size > basket.y
    ) {
      score++;
      resetCoin(c);
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Basket
  ctx.fillStyle = "#00ff99";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // Draw coins
  coins.forEach((c) => {
    ctx.drawImage(c.img, c.x - c.size, c.y - c.size, c.size * 2, c.size * 2);
  });

  // Score
  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 90, 300);
    ctx.font = "20px Arial";
    ctx.fillText("Press Start to play again", 100, 340);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

/* --------------------------
   START / STOP BUTTONS
--------------------------- */

document.getElementById("startBtn").addEventListener("click", () => {
  // Reset everything
  score = 0;
  gameOver = false;

  coins.forEach(c => resetCoin(c));
  running = true;
});

document.getElementById("stopBtn").addEventListener("click", () => {
  running = false; // Pause game
});
