// функция открытия модального окна
export function openModal(popup) {
  popup.classList.add('popup_is-opened')
  document.addEventListener('keydown', closePopupOnEsc)
}

// функция закрытия модального окна
export function closeModal() {
  const popup = document.querySelector('.popup_is-opened')
  popup.classList.remove('popup_is-opened')
  document.removeEventListener('keydown', closePopupOnEsc)
}

// функция-обработчик события нажатия Esc или Оверлея
export function closePopupOnEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened')
    closeModal(openedPopup)
  }
}

// функция-обработчик события клика по Оверлею
export function closePopupOnOverlayClick(evt) {
  if (evt.currentTarget === evt.target) {
    closeModal(evt.currentTarget)
  }
}
