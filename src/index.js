import './pages/index.css'
import './scripts/cards.js'
import { initialCards } from './scripts/cards.js'
import { createCard, deleteCard, likeCard } from './scripts/card.js'
import { openModal, closeModal, closePopupOnOverlayClick } from './scripts/modal.js'

const allPopupsOnPage = document.querySelectorAll('.popup')
const cardsContainer = document.querySelector('.places__list')
const profileEditButton = document.querySelector('.profile__edit-button')
const profilePopup = document.querySelector('.popup')
const profilePopupForm = document.forms['edit-profile']
const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const popupCloseButton = document.querySelectorAll('.popup__close')
const popupCaption = imagePopupElement.querySelector('.popup__caption')
const cardCreateButton = document.querySelector('.profile__add-button')
const cardCreatePopup = document.querySelector('.popup_type_new-card')
const cardCreateForm = document.forms['new-place']
const formElement = document.querySelector('.popup__form')
const nameInput = document.querySelector('.popup__input_type_name')
const jobInput = document.querySelector('.popup__input_type_description')
const imagePopup = imagePopupElement.querySelector('.popup__image')
const imagePopupElement = document.querySelector('.popup_type_image')

//инициализируем все карточки из массива
initialCards.forEach((card) => {
  cardsContainer.append(createCard(card, deleteCard, likeCard, openImagePopup))
})

//добавляем всем поп-апам анимацию для плавного появления
allPopupsOnPage.forEach((popup) => {
  popup.classList.add('popup_is-animated')
})

// закрытие по крестику для всех попапов
popupCloseButton.forEach((item) => {
  item.addEventListener('click', closeModal)
})

//функция для заполнения формы профиля и открытия попапа
function fillProfileUserinfo(formName, popupName) {
  formName.elements.name.value = profileTitle.textContent
  formName.elements.description.value = profileDescription.textContent
  openModal(popupName)
}

// попап для редактирования профиля
profileEditButton.addEventListener('click', () =>
  fillProfileUserinfo(profilePopupForm, profilePopup)
)

profilePopup.addEventListener('click', closePopupOnOverlayClick)

// попап добавления новой карточки
cardCreateButton.addEventListener('click', () => openModal(cardCreatePopup))
cardCreatePopup.addEventListener('click', closePopupOnOverlayClick)

// обработчик «отправки» данных из формы
function handleFormSubmit(evt) {
  evt.preventDefault()
  profileTitle.textContent = nameInput.value
  profileDescription.textContent = jobInput.value
  closeModal(profilePopup)
}

formElement.addEventListener('submit', handleFormSubmit)

// создание новой карточки по клику на плюс
function handlecardCreateFormSubmit(evt) {
  evt.preventDefault()
  const cardData = {
    cardName: cardCreateForm.elements['place-name'].value,
    cardLink: cardCreateForm.elements.link.value,
    altText: cardCreateForm.elements['place-name'].value,
  }
  cardsContainer.prepend(createCard(cardData, deleteCard, likeCard, openImagePopup))
  closeModal(cardCreatePopup)
  cardCreateForm.reset()
}

cardCreateForm.addEventListener('submit', handlecardCreateFormSubmit)

// функция открытия модального окна с изображением карточки и обработчик для закрытия по клику на оверлей
function openImagePopup(imageLink, imageAlt, imageTitle) {
  imagePopup.src = imageLink
  imagePopup.alt = imageAlt
  popupCaption.textContent = imageTitle
  openModal(imagePopupElement)
}

imagePopupElement.addEventListener('click', closePopupOnOverlayClick)
