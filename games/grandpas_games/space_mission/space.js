const rocket = document.getElementById("rocket");
const star = document.getElementById("star");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");

let score = 0;
let rocketPosition = 50;

function moveRocket(direction) {
  if (direction === "left") {
    rocketPosition -= 5;
  }

  if (direction === "right") {
    rocketPosition += 5;
  }

  // Keep rocket inside the game area
  rocketPosition = Math.max(5, Math.min(95, rocketPosition));

  rocket.style.left = rocketPosition + "%";
}

function launchRocket() {
  const rocketRect = rocket.getBoundingClientRect();
  const starRect = star.getBoundingClientRect();

  const distance = Math.hypot(
    rocketRect.left - starRect.left,
    rocketRect.top - starRect.top
  );

  if (distance < 100) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    alert("🚀 You got the star! ⭐");
  } else {
    alert("🚀 Keep moving! Try to reach the star! ⭐");
  }
}