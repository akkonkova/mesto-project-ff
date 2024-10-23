const cardsContainer = document.querySelector(".places__list");

function createCard(cardData, deleteCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.querySelector(".card__image").src = cardData.cardLink;
  cardElement.querySelector(".card__title").textContent = cardData.cardName;
  cardElement.querySelector(".card__image").alt = cardData.altText;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  const deleteFunction = () => deleteCallback(cardElement);
  deleteButton.addEventListener("click", deleteFunction);

  return cardElement;
}

const deleteCard = (element) => element.remove();

initialCards.forEach((item) => {
  cardsContainer.append(createCard(item, deleteCard));
});
