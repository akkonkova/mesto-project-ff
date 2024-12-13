import { addLikeOnCard, removeLikeFromCard } from './api'

export const likeCard = (evt) => evt.target.classList.toggle('card__like-button_is-active')

export function createCard(cardData, userId, deleteCallback, likeCallback, openImageCallback) {
  const cardTemplate = document.querySelector('#card-template').content
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
  const cardImage = cardElement.querySelector('.card__image')
  const cardTitle = cardElement.querySelector('.card__title')
  const cardDeleteButton = cardElement.querySelector('.card__delete-button')
  const cardLikeButton = cardElement.querySelector('.card__like-button')
  const cardLikeCounter = cardElement.querySelector('.card__like-count')
  const cardOwnerId = cardData.owner._id
  const cardId = cardData._id

  cardImage.src = cardData.link
  cardTitle.textContent = cardData.name
  cardImage.alt = cardData.name
  cardLikeCounter.textContent = typeof cardData.likes === 'number' ? cardData.likes.length : 0

  //открытие поп-апа с полным изображением из карточки
  const openFullImageFn = () => {
    openImageCallback(cardData.link, cardData.name, cardData.name)
  }
  cardImage.addEventListener('click', openFullImageFn)

  // лайк карточки
  const likeButtonFn = (evt) => {
    likeCallback(evt)
  }
  cardLikeButton.addEventListener('click', likeButtonFn)

  //удаление карточек
  if (userId === cardOwnerId) {
    cardDeleteButton.style.visibility = 'visible'
    const deleteFunction = () => deleteCallback(cardId)
    cardDeleteButton.addEventListener('click', () => {
      deleteFunction(cardId)
      .then(() => {
        cardElement.remove();
      })
    })
  } else {
    cardDeleteButton.remove()
  }

  return cardElement
}
