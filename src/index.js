import './pages/index.css'
import { initialCards } from './scripts/cards.js'
import { createCard, likeCard } from './scripts/card.js'
import { openModal, closeModal, closePopupOnOverlayClick } from './scripts/modal.js'
import { enableValidation, clearValidation } from './scripts/validation.js'
import {
  deleteCard,
  handleError,
  getUserDataForProfile,
  updateProfileAvatar,
  updateProfileData,
  createNewCard,
  getDataForInitialCards,
} from './scripts/api.js'

const allPopupsOnPage = document.querySelectorAll('.popup')
const cardsContainer = document.querySelector('.places__list')
const profileEditButton = document.querySelector('.profile__edit-button')
const profilePopup = document.querySelector('.popup_type_edit')
const profilePopupForm = document.forms['edit-profile']
const profilePopupFormButton = profilePopupForm.querySelector('.popup__button')
const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const profileAvatar = document.querySelector('.profile__image')
const popupNameInput = document.querySelector('.popup__input_type_name')
const popupJobInput = document.querySelector('.popup__input_type_description')
const popupCloseButton = document.querySelectorAll('.popup__close')
const cardCreateButton = document.querySelector('.profile__add-button')
const cardCreatePopup = document.querySelector('.popup_type_new-card')
const cardCreateForm = document.forms['new-place']
const cardCreateFormNameInput = cardCreateForm.querySelector('.popup__input_type_card-name')
const cardCreateFormLinkInput = cardCreateForm.querySelector('.popup__input_type_url')
const imagePopupElement = document.querySelector('.popup_type_image')
const imagePopup = imagePopupElement.querySelector('.popup__image')
const popupCaption = imagePopupElement.querySelector('.popup__caption')
const avatarPopup = document.querySelector('.popup_type_edit-avatar')
const avatarPopupForm = document.forms['edit-avatar']
const avatarPopupFormButton = avatarPopupForm.querySelector('.popup__button')
const avatarPopupInput = avatarPopupForm.querySelector('.popup__input_type_avatar')
const avatarContainer = document.querySelector('.profile__image-container')

let userId

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
}

// инициализируем получение данных с сервера для заполнения профиля, а также получение данных для карточек
Promise.all([getUserDataForProfile(), getDataForInitialCards()])
  .then((data) => {
    const userProfileInfo = data[0]
    userId = userProfileInfo._id
    const initialCardsFromServer = data[1]
    fillProfileUserinfo(userProfileInfo)
    initialCardsFromServer.forEach((item) => {
      cardsContainer.append(createCard(item, userId, deleteCard, likeCard, openImagePopup))
    })
  })
  .catch(handleError)

//добавляем всем поп-апам анимацию для плавного появления
allPopupsOnPage.forEach((item) => {
  item.classList.add('popup_is-animated')
})

// закрытие по крестику для всех попапов
popupCloseButton.forEach((item) => {
  item.addEventListener('click', closeModal)
})

//изменение текста кнопки во время клика на кнопку сохранения
function renderLoading(isLoading, button) {
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить'
}

//открытие формы для редактирования аватара профиля
avatarContainer.addEventListener('click', () => openModal(avatarPopup))

//функция для заполнения формы профиля и открытия попапа
function fillProfileUserinfo(userProfileInfo) {
  profileTitle.textContent = userProfileInfo.name
  profileDescription.textContent = userProfileInfo.about
  profileAvatar.style.backgroundImage = `url(${userProfileInfo.avatar})`
}

//открытие попапа для редактирования профиля
profileEditButton.addEventListener('click', () => {
  profilePopupForm.elements.name.value = profileTitle.textContent
  profilePopupForm.elements.description.value = profileDescription.textContent
  openModal(profilePopup)
  clearValidation(profilePopupForm, validationConfig)
})

profilePopup.addEventListener('click', closePopupOnOverlayClick)

// попап добавления новой карточки
cardCreateButton.addEventListener('click', () => openModal(cardCreatePopup))
cardCreatePopup.addEventListener('click', closePopupOnOverlayClick)

// обработчик «отправки» данных из формы редактирования профиля юзера
function handleProfilePopupFormSubmit(evt) {
  evt.preventDefault()
  renderLoading(true, profilePopupFormButton)
  updateProfileData(popupNameInput.value, popupJobInput.value)
    .then((data) => {
      profileTitle.textContent = data.name
      profileDescription.textContent = data.about
      clearValidation(profilePopupForm, validationConfig)
      closeModal(profilePopup)
    })
    .finally(() => {
      renderLoading(false, profilePopupFormButton)
    })
}

// обработчик «отправки» данных из формы аватара пользователя
function handleAvatarPopupFormSubmit(evt) {
  evt.preventDefault()
  renderLoading(true, avatarPopupFormButton)
  updateProfileAvatar(avatarPopupInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar
      clearValidation(avatarPopupForm, validationConfig)
      closeModal(avatarPopup)
    })
    .finally(() => {
      renderLoading(false, avatarPopupFormButton)
    })
}

// создание новой карточки по клику на плюс, отправка данных из попапов для сохранения на сервере
function handleCardCreateFormSubmit(evt) {
  evt.preventDefault()
  renderLoading(true, cardCreateButton)
  createNewCard(cardCreateFormNameInput.value, cardCreateFormLinkInput.value)
    .then((cardData) => {
      const newCard = createCard(cardData, userId, deleteCard, likeCard, openImagePopup)
      cardsContainer.prepend(newCard)
      cardCreateForm.reset()
      clearValidation(cardCreateForm, validationConfig)
      closeModal(cardCreatePopup)
    })
    .catch(handleError)
    .finally(() => {
      renderLoading(false, cardCreateButton)
    })
}

// инициализация отправки данных на сервер при клике на кнопку "сохранить"
profilePopupForm.addEventListener('submit', handleProfilePopupFormSubmit)
avatarPopupForm.addEventListener('submit', handleAvatarPopupFormSubmit)
cardCreateForm.addEventListener('submit', handleCardCreateFormSubmit)

// функция открытия модального окна с изображением карточки и обработчик для закрытия по клику на оверлей
function openImagePopup(imageLink, imageAlt, imageTitle) {
  imagePopup.src = imageLink
  imagePopup.alt = imageAlt
  popupCaption.textContent = imageTitle
  openModal(imagePopupElement)
}

imagePopupElement.addEventListener('click', closePopupOnOverlayClick)

//включение валидации всех форм
enableValidation(validationConfig)
