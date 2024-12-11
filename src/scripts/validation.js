function toggleButtonState(inputList, buttonElement, selectorsConfig) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(selectorsConfig.inactiveButtonClass)
    buttonElement.disabled = true
  } else {
    buttonElement.classList.remove(selectorsConfig.inactiveButtonClass)
    buttonElement.disabled = false
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

const showInputError = (formElement, inputElement, errorMessage, selectorsConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}.popup__input-error`)
  inputElement.classList.add(selectorsConfig.inputErrorClass)
  errorElement.classList.add(selectorsConfig.errorClass)
  errorElement.textContent = errorMessage
}

const hideInputError = (formElement, inputElement, selectorsConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}.popup__input-error`)
  inputElement.classList.remove(selectorsConfig.inputErrorClass)
  errorElement.classList.remove(selectorsConfig.errorClass)
  errorElement.textContent = ''
}

const checkInputValidity = (formElement, inputElement, selectorsConfig) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage)
  } else {
    inputElement.setCustomValidity('')
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, selectorsConfig)
  } else {
    hideInputError(formElement, inputElement, selectorsConfig)
  }
}

const setEventListeners = (formElement, selectorsConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(selectorsConfig.inputSelector))
  const buttonElement = formElement.querySelector(selectorsConfig.submitButtonSelector)
  //сначала проверяем состояние кнопки, чтобы задизейблить при необходимости
  toggleButtonState(inputList, buttonElement, selectorsConfig)

  // Обработчик события reset для формы, при сбросе формы обновляем состояние кнопки
  // formElement.addEventListener('reset', () => {
  //   setTimeout(() => {
  //     toggleButtonState(inputList, buttonElement, selectorsConfig)
  //   }, 0)
  // })

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, selectorsConfig)
      toggleButtonState(inputList, buttonElement, selectorsConfig)
    })
  })
}

export function enableValidation(selectorsConfig) {
  const formsListForValidation = Array.from(document.querySelectorAll(selectorsConfig.formSelector))
  formsListForValidation.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault()
    })
    setEventListeners(formElement, selectorsConfig)
  })
}

export function clearValidation(formElement, selectorsConfig) {
  const inputList = Array.from(formElement.querySelectorAll(selectorsConfig.inputSelector))
  const buttonElement = formElement.querySelector(selectorsConfig.submitButtonSelector)
  buttonElement.classList.add(selectorsConfig.inactiveButtonClass);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, selectorsConfig)
    toggleButtonState(inputList, buttonElement, selectorsConfig)
  })
}
