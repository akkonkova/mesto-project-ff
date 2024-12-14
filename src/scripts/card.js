import { deleteCardFromServer, addLikeOnCard, removeLikeFromCard } from './api.js'

export function deleteCard(cardElement, cardId) {
  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove()
    })
    .catch((error) => console.error(`Ошибка при удалении карточки ${error.status}`))
}

function cardHasLike(cardData, userId) {
  const likes = cardData.likes
  return likes.some((like) => like._id === userId)
}

export function toggleLike(cardData, button, cardId, userId, likeCounter) {
  const hasLike = cardHasLike(cardData, userId)
  const updateLikeInfo = hasLike ? removeLikeFromCard : addLikeOnCard
  updateLikeInfo(cardId).then((data) => {
    const likes = data.likes
    cardData.likes = likes

    const hasLike = cardHasLike(cardData, userId)
    button.classList.toggle('card__like-button_is-active', hasLike)
    likeCounter.textContent = likes.length
  })
}

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
  cardLikeCounter.textContent = cardData.likes.length || 0

  // отображаем лайки, который поставил текущий пользователь
  const hasLike = cardHasLike(cardData, userId)
  cardLikeButton.classList.toggle('card__like-button_is-active', hasLike)

  // функция для работы с лайками карточки
  const likeButtonFn = () => {
    likeCallback(cardData, cardLikeButton, cardId, userId, cardLikeCounter)
  }
  cardLikeButton.addEventListener('click', likeButtonFn)

  //удаление карточки, если её добавил текущий пользователь
  if (userId === cardOwnerId) {
    cardDeleteButton.style.visibility = 'visible'
    const deleteFunction = () => deleteCallback(cardElement, cardId)
    cardDeleteButton.addEventListener('click', deleteFunction)
  } else {
    cardDeleteButton.remove()
  }

  //открытие поп-апа с полным изображением из карточки
  const openFullImageFn = () => {
    openImageCallback(cardData.link, cardData.name, cardData.name)
  }
  cardImage.addEventListener('click', openFullImageFn)

  return cardElement
}
