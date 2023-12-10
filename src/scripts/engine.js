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

const srcImage = "./src/assets/icons/";
const cardData = [
  {
    id: 0,
    name: "Blue-Eyes White Dragon",
    type: "Paper",
    img: `${srcImage}dragon.png`,
    beats: [1],
    losesTo: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${srcImage}magician.png`,
    beats: [2],
    losesTo: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${srcImage}exodia.png`,
    beats: [0],
    losesTo: [1],
  },
];

const cardBackData = {
  name: "Unknown",
  type: "Attribute: Unknown",
  img: `${srcImage}card-back.png`,
};

async function drawCards(numberOfCards, fieldSide) {
  for (let i = 0; i < numberOfCards; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);

  return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${srcImage}card-back.png`);
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  cardImage.addEventListener("mouseover", () => {
    drawSelectedCard(idCard, fieldSide);
  });
  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCards();

  let computerCardId = await getRandomCardId();

  await showCardDetails(true);

  await hideCardDetails();

  await drawCardsInfield(cardId, computerCardId)

  let cardDuelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(cardDuelResults);
}

async function removeAllCards() {
  let { cardsBOX } = state.playerSides;

  for (let i = 0; i < cardsBOX.length; i++) {
    let imgElements = cardsBOX[i].querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
  }
}

async function showCardDetails(boolean) {
  if (boolean) {
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.style.display = "block";
  } else {
    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";
  }
}

async function hideCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "Select";
  state.cardSprites.type.innerText = "a card";
}

async function drawCardsInfield(cardId, computerCardId) {
  state.fieldCards.computer.src = cardData[computerCardId].img;
  state.fieldCards.player.src = cardData[cardId].img;
}

async function checkDuelResults(cardId, computerCardId) {
  let duelResults = "DRAW";
  state.score.drawScore++;

  let playerCard = cardData[cardId];
  let status = "lose";

  if (playerCard.beats.includes(computerCardId)) {
    duelResults = "VICTORY";
    state.score.playerScore++;
    state.score.drawScore--;
    status = "win";
  } else if (playerCard.losesTo.includes(computerCardId)) {
    duelResults = "DEAFEAT";
    state.score.computerScore++;
    state.score.drawScore--;
  }

  playAudio(status);

  return duelResults;
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  audio.play();
}

async function drawButton(duelResults) {
  state.actions.button.innerText = duelResults;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Victories: ${state.score.playerScore} 
  | Losses: ${state.score.computerScore} | Draws: ${state.score.drawScore} `;
}

async function drawSelectedCard(index, fieldSide) {
  if (fieldSide === state.playerSides.player) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
  } else {
    state.cardSprites.avatar.src = cardBackData.img;
    state.cardSprites.name.innerText = cardBackData.name;
    state.cardSprites.type.innerText = cardBackData.type;
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

function init() {
  showCardDetails(false);
  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);

  const bgm = document.getElementById("bgm")
   bgm.play() 
}

init();
