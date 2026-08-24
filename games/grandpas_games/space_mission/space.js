/* ============================================================
   LIL' RUSSELL'S SPACE MISSION
   ============================================================ */

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  font-family: Arial, sans-serif;
  background:
    radial-gradient(circle at 20% 20%, #24245c 0%, transparent 25%),
    radial-gradient(circle at 80% 30%, #35145c 0%, transparent 25%),
    linear-gradient(#02020d, #080020);

  color: white;
  text-align: center;
}


/* ============================================================
   MAIN GAME
   ============================================================ */

.game {
  width: min(95%, 900px);
  margin: 0 auto;
  padding: 20px;
}


/* ============================================================
   TITLE
   ============================================================ */

h1 {
  margin: 10px 0 20px;

  font-size: clamp(28px, 6vw, 52px);

  text-shadow:
    0 0 8px #00ffff,
    0 0 18px #00ffff,
    0 0 30px #7b00ff;
}


/* ============================================================
   MISSION INTRO
   ============================================================ */

.mission {
  background: rgba(0, 0, 40, 0.75);

  border: 2px solid #00ffff;
  border-radius: 15px;

  padding: 15px;
  margin-bottom: 20px;

  box-shadow:
    0 0 15px rgba(0, 255, 255, 0.4);
}

.mission h2 {
  margin-top: 0;

  color: #ffe600;

  text-shadow:
    0 0 8px #ff9900;
}

.mission p {
  font-size: 18px;
  line-height: 1.5;
}


/* ============================================================
   GAME AREA
   ============================================================ */

#gameArea {
  position: relative;

  width: 100%;
  height: min(65vh, 600px);

  min-height: 400px;

  overflow: hidden;

  border: 4px solid #00ffff;
  border-radius: 20px;

  background-color: #02020d;

  background-image:
    radial-gradient(circle, white 1px, transparent 1px),
    radial-gradient(circle, white 1px, transparent 1px);

  background-size: 70px 70px, 110px 110px;

  background-position: 10px 20px, 50px 80px;

  box-shadow:
    inset 0 0 40px #000,
    0 0 25px rgba(0, 255, 255, 0.5);
}


/* ============================================================
   ROCKET
   ============================================================ */

#rocket {
  position: absolute;

  left: 50%;
  bottom: 30px;

  transform: translateX(-50%);

  font-size: 60px;

  user-select: none;

  transition: left 0.12s ease;

  filter:
    drop-shadow(0 0 8px #00ffff)
    drop-shadow(0 0 15px #ffffff);
}


/* ============================================================
   STAR
   ============================================================ */

#star {
  position: absolute;

  top: 80px;
  left: 70%;

  font-size: 50px;

  user-select: none;

  filter:
    drop-shadow(0 0 8px #fff)
    drop-shadow(0 0 18px #ffe600);

  animation: starGlow 1.2s infinite alternate;
}


@keyframes starGlow {

  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.25);
  }

}


/* ============================================================
   CONTROLS
   ============================================================ */

.controls {
  display: flex;

  justify-content: center;
  align-items: center;

  gap: 15px;

  margin-top: 20px;

  flex-wrap: wrap;
}


.controls button {
  border: 2px solid #00ffff;

  border-radius: 12px;

  background: #10104a;

  color: white;

  font-size: 22px;

  font-weight: bold;

  padding: 12px 22px;

  cursor: pointer;

  box-shadow:
    0 0 10px rgba(0, 255, 255, 0.4);

  transition:
    transform 0.1s,
    background 0.1s;
}


.controls button:hover {
  background: #202080;
}


.controls button:active {
  transform: scale(0.92);
}


/* LAUNCH BUTTON */

#launchButton {
  background: #7b00ff;

  border-color: #ff00ff;

  padding-left: 30px;
  padding-right: 30px;
}


#launchButton:hover {
  background: #9b35ff;
}


/* ============================================================
   SCORE
   ============================================================ */

#score {
  font-size: 22px;

  font-weight: bold;

  color: #ffe600;

  text-shadow:
    0 0 8px #ff9900;

  margin: 20px 0;
}


/* ============================================================
   BACK BUTTON
   ============================================================ */

.backButton {
  display: inline-block;

  margin-top: 10px;

  padding: 12px 20px;

  border: 2px solid #ff69b4;

  border-radius: 12px;

  background: #35002d;

  color: white;

  text-decoration: none;

  font-weight: bold;

  box-shadow:
    0 0 10px rgba(255, 105, 180, 0.4);

  transition:
    transform 0.1s,
    background 0.1s;
}


.backButton:hover {
  background: #650055;
}


.backButton:active {
  transform: scale(0.95);
}


/* ============================================================
   MOBILE
   ============================================================ */

@media (max-width: 600px) {

  .game {
    padding: 10px;
  }

  .mission p {
    font-size: 16px;
  }

  #gameArea {
    min-height: 350px;
  }

  #rocket {
    font-size: 48px;
  }

  #star {
    font-size: 40px;
  }

  .controls {
    gap: 8px;
  }

  .controls button {
    padding: 12px 16px;
    font-size: 20px;
  }

}