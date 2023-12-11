const state = {
    score: {
      playerScore: 0,
      computerScore: 0,
      drawScore: 0,
      scoreBox: document.getElementById("score_points"),
    },
  
    cardSprites: {
      avatar: document.getElementById("card_image"),
      name: document.getElementById("card_name"),
      type: document.getElementById("card_type"),
    },
  
    fieldCards: {
      computer: document.getElementById("computer-field-card"),
      player: document.getElementById("player-field-card"),
    },
  
    actions: {
      button: document.getElementById("next-duel"),
    },
  
    playerSides: {
      player: "player-cards",
      computer: "computer-cards",
      cardsBOX: document.getElementsByClassName("card-box"),
    },
  };

export default state