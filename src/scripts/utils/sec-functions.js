import  cardData  from "../database/cardData.js";

import state from "./state.js";

export async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);

  return cardData[randomIndex].id;
}

export async function showCardDetails(boolean) {
  if (boolean) {
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.style.display = "block";
  } else {
    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";
  }
}

export async function hideCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "Select";
  state.cardSprites.type.innerText = "a card";
}

export async function drawCardsInfield(cardId, computerCardId) {
  state.fieldCards.computer.src = cardData[computerCardId].img;
  state.fieldCards.player.src = cardData[cardId].img;
}

export async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  await audio.play();
}

export async function drawButton(duelResults) {
  state.actions.button.innerText = duelResults;
  state.actions.button.style.display = "block";
}

export async function updateScore() {
  state.score.scoreBox.innerText = `Victories: ${state.score.playerScore} 
  | Losses: ${state.score.computerScore} | Draws: ${state.score.drawScore} `;
}