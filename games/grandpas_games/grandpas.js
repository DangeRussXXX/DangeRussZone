"use strict";


const message =
  document.getElementById("message");


const adventureCards =
  document.querySelectorAll(".adventure-card");


adventureCards.forEach(card => {

  card.addEventListener("click", () => {

    const game =
      card.dataset.game;


    switch (game) {

      case "space":

        message.textContent =
          "🚀 Space Mission is coming soon!";

        break;


      case "treasure":

        message.textContent =
          "🪙 Treasure Hunt is coming soon!";

        break;


      case "dragon":

        message.textContent =
          "🐉 Dragon Quest is coming soon!";

        break;


      case "racing":

        message.textContent =
          "🏎️ Grandpa's Grand Prix is coming soon!";

        break;

    }

  });

});