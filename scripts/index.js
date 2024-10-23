const cardsContainer = document.querySelector(".places__list");

function createCard(initialCards, deleteCallback) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.querySelector(".card__image").src = initialCards.cardLink;
  cardElement.querySelector(".card__title").textContent = initialCards.cardName;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  const deleteFunction = () => deleteCallback(cardElement);
  deleteButton.addEventListener("click", deleteFunction);

  return cardElement;
}

const deleteCard = (element) => element.remove();

initialCards.forEach((item) => {
  cardsContainer.append(createCard(item, deleteCard));
});
