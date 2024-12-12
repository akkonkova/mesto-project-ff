export function createCard(cardData, deleteCallback, likeCallback, openImageCallback) {
  const cardTemplate = document.querySelector('#card-template').content
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const cardDeleteButton = cardElement.querySelector('.card__delete-button')
  const cardLikeButton = cardElement.querySelector('.card__like-button')

  cardImage.src = cardData.link
  cardTitle.textContent = cardData.name
  cardImage.alt = cardData.name

  const openFullImageFn = () => {
    openImageCallback(cardData.link, cardData.name, cardData.name)
  }
  cardImage.addEventListener('click', openFullImageFn)

  const likeButtonFn = (evt) => {
    likeCallback(evt)
  }
  cardLikeButton.addEventListener('click', likeButtonFn)

  const deleteFunction = () => deleteCallback(cardElement)
  cardDeleteButton.addEventListener('click', deleteFunction)

  return cardElement
}

export const deleteCard = (element) => element.remove()

export const likeCard = (evt) => evt.target.classList.toggle('card__like-button_is-active')
