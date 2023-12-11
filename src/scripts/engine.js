import {
  getRandomCardId,
  showCardDetails,
  hideCardDetails,
  drawCardsInfield,
  playAudio,
  drawButton,
  updateScore
} from "./utils/sec-functions.js";
import cardBackData from "./database/cardBackData.js";
import state from "./utils/state.js";
import cardData from "./database/cardData.js";

async function drawCards(numberOfCards, fieldSide) {
  for (let i = 0; i < numberOfCards; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", cardBackData.img);
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

  await drawCardsInfield(cardId, computerCardId);

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

async function init() {
  showCardDetails(false);
  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);

  state.actions.button.addEventListener("click", resetDuel)
  
  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
