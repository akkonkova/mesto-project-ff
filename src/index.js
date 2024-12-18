import './pages/index.css'
import { createCard, deleteCard, toggleLike } from './scripts/card.js'
import { openModal, closeModal, closePopupOnOverlayClick } from './scripts/modal.js'
import { enableValidation, clearValidation } from './scripts/validation.js'
import {
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
const cardDeleteConfirmationPopup = document.querySelector('.popup_type_confirm_remove')
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
  .then(([userProfileInfo, initialCardsFromServer]) => {
    userId = userProfileInfo._id
    fillProfileUserinfo(userProfileInfo)
    initialCardsFromServer.forEach((item) => {
      cardsContainer.append(
        createCard(item, userId, openDeleteConfirmationPopup, toggleLike, openImagePopup)
      )
    })
  })
  .catch(handleError)

// добавляем всем поп-апам анимацию для плавного появления,
// и закрытие поп-апа по клику на оверлей и крестик
allPopupsOnPage.forEach((item) => {
  item.classList.add('popup_is-animated')
  item.addEventListener('click', closePopupOnOverlayClick)
  item.querySelector('.popup__close').addEventListener('click', closeModal)
})

// изменение текста кнопки во время клика на кнопку сохранения
function renderLoading(isLoading, button) {
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить'
}

// слушатели для открытия форм / попапов по клику на соответствующие кнопки
avatarContainer.addEventListener('click', () => {
  clearValidation(avatarPopup, validationConfig)
  avatarPopupForm.reset()
  openModal(avatarPopup)
})
cardCreateButton.addEventListener('click', () => {
  clearValidation(cardCreatePopup, validationConfig)
  cardCreateForm.reset()
  openModal(cardCreatePopup)
})
profileEditButton.addEventListener('click', () => {
  clearValidation(profilePopupForm, validationConfig)
  profilePopupForm.elements.name.value = profileTitle.textContent
  profilePopupForm.elements.description.value = profileDescription.textContent
  openModal(profilePopup)
})

// функция для заполнения формы профиля
function fillProfileUserinfo(userProfileInfo) {
  profileTitle.textContent = userProfileInfo.name
  profileDescription.textContent = userProfileInfo.about
  profileAvatar.style.backgroundImage = `url(${userProfileInfo.avatar})`
}

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
    .catch(handleError)
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
    .catch(handleError)
    .finally(() => {
      renderLoading(false, avatarPopupFormButton)
    })
}

//открытие окна подверждения удаления карточки + обработчик клика после подтверждения
function openDeleteConfirmationPopup(cardElement, cardId) {
  const cardDeleteConfirmButton = cardDeleteConfirmationPopup.querySelector(
    validationConfig.submitButtonSelector
  )

  openModal(cardDeleteConfirmationPopup)

  cardDeleteConfirmButton.addEventListener('click', () => {
    deleteCard(cardElement, cardId)
    closeModal(cardDeleteConfirmationPopup)
  })
}

// создание новой карточки по клику на плюс, отправка данных из попапов для сохранения на сервере
function handleCardCreateFormSubmit(evt) {
  evt.preventDefault()
  renderLoading(true, cardCreateButton)
  createNewCard(cardCreateFormNameInput.value, cardCreateFormLinkInput.value)
    .then((cardData) => {
      const newCard = createCard(
        cardData,
        cardData.owner._id,
        openDeleteConfirmationPopup,
        toggleLike,
        openImagePopup
      )
      cardsContainer.prepend(newCard)
      closeModal(cardCreatePopup)
      cardCreateForm.reset()
      clearValidation(cardCreateForm, validationConfig)
    })
    .catch(handleError)
    .finally(() => {
      renderLoading(false, cardCreateButton)
    })
}

// функция открытия модального окна с изображением карточки
function openImagePopup(imageLink, imageAlt, imageTitle) {
  imagePopup.src = imageLink
  imagePopup.alt = imageAlt
  popupCaption.textContent = imageTitle
  openModal(imagePopupElement)
}

// инициализация отправки данных на сервер при клике на кнопку "сохранить"
profilePopupForm.addEventListener('submit', handleProfilePopupFormSubmit)
avatarPopupForm.addEventListener('submit', handleAvatarPopupFormSubmit)
cardCreateForm.addEventListener('submit', handleCardCreateFormSubmit)

// включение валидации всех форм
enableValidation(validationConfig)
