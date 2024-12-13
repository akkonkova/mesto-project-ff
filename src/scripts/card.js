import { deleteCardFromServer } from './api.js'

export function deleteCard(cardElement, cardId) {
  deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove()
    })
    .catch((error) => console.error(`Ошибка при удалении карточки ${error.status}`))
}

export const likeCard = (evt) => evt.target.classList.toggle('card__like-button_is-active')

export function createCard(
  cardData,
  userId,
  deleteCallback,
  likeCallback,
  openImageCallback,
  addLikeCallback,
  removeLikeCallback
) {
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

  // лайк карточки
  const likeButtonFn = (evt) => {
    likeCallback(evt)
  }
  cardLikeButton.addEventListener('click', likeButtonFn)

  // const hasLike = cardLikeButton.classList.contains('card__like-button_is-active');
  // cardLikeButton.classList.toggle(
  //   'card__like-button_is-active',
  //   likes.some((user) => user._id === userId)
  // )

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
