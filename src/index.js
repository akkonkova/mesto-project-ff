// в файле index.js описана инициализация приложения и основная логика страницы:
// поиск DOM-элементов на странице и навешивание на них обработчиков событий;
// обработчики отправки форм, функция-обработчик события открытия модального окна для редактирования профиля;
// функция открытия модального окна изображения карточки.

import './pages/index.css'
import './scripts/cards.js'
import { initialCards } from './scripts/cards.js'
import { createCard, deleteCard, likeCard } from './scripts/card.js'
import { openModal, closeModal, closePopupOnOverlayClick } from './scripts/modal.js'

const allPopupsOnPage = document.querySelectorAll('.popup')
const cardsContainer = document.querySelector('.places__list')
const editProfileButton = document.querySelector('.profile__edit-button')
const editProfilePopup = document.querySelector('.popup')
const editProfileForm = document.forms['edit-profile']
const closePopupButton = document.querySelectorAll('.popup__close')
const createCardButton = document.querySelector('.profile__add-button')
const createCardPopup = document.querySelector('.popup_type_new-card')
const createCardForm = document.forms['new-place']
const formElement = document.querySelector('.popup__form')
const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')
const popupImageElement = document.querySelector('.popup_type_image')
const popupImage = popupImageElement.querySelector('.popup__image')
const popupCaption = popupImageElement.querySelector('.popup__caption')
const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')

//добавляем всем поп-апам анимацию для плавного появления
allPopupsOnPage.forEach((popup) => {
  popup.classList.add('popup_is-animated')
})

initialCards.forEach((card) => {
  cardsContainer.append(createCard(card, deleteCard, likeCard, openImagePopup))
})

//функция для заполнения формы профиля + вызов в ней внутри функции openmodal
function fillProfileUserinfo(formName, popupName) {
  formName.elements.name.value = profileTitle.textContent
  formName.elements.description.value = profileDescription.textContent
  openModal(popupName)
}

// попап для редактирования профиля
editProfileButton.addEventListener('click', () =>
  fillProfileUserinfo(editProfileForm, editProfilePopup)
)

closePopupButton.forEach((item) => {
  item.addEventListener('click', closeModal)
})

editProfilePopup.addEventListener('click', closePopupOnOverlayClick)

// попап добавления новой карточки
createCardButton.addEventListener('click', () => openModal(createCardPopup))
createCardPopup.addEventListener('click', closePopupOnOverlayClick)

// Обработчик «отправки» формы, хотя пока она никуда отправляться не будет
function handleFormSubmit(evt) {
  evt.preventDefault()
  profileTitle.textContent = nameInput.value
  profileDescription.textContent = jobInput.value
  closeModal(editProfilePopup)
}

formElement.addEventListener('submit', handleFormSubmit)

// создание новой карточки по клику на плюс
function handleCreateCardFormSubmit(evt) {
  evt.preventDefault()
  const cardData = {
    cardName: createCardForm.elements['place-name'].value,
    cardLink: createCardForm.elements.link.value,
    altText: createCardForm.elements['place-name'].value,
  }
  cardsContainer.prepend(createCard(cardData, deleteCard, likeCard, openImagePopup))
  closeModal(createCardPopup)
  createCardForm.reset()
}

createCardForm.addEventListener('submit', handleCreateCardFormSubmit)


// функция открытия модального окна с изображением карточки и обработчик для закрытия по клику на оверлей
function openImagePopup(imageLink, imageAlt, imageTitle) {
  popupImage.src = imageLink
  popupImage.alt = imageAlt
  popupCaption.textContent = imageTitle
  openModal(popupImageElement)
}

popupImageElement.addEventListener('click', closePopupOnOverlayClick)
