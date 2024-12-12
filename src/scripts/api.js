const authToken = '00fd9f92-5b54-4d51-b39a-ce0e5928685c'
const cohortID = 'wff-cohort-28'
const requestCongig = {
  url: `https://nomoreparties.co/v1/${cohortID}`,
  headers: {
    authorization: authToken,
    'Content-Type': 'application/json',
  },
}
// функция для обработки ошибки при запросе к серверу, подсвечивает ошибку красным в консоль
function handleError(error) {
  if (error.status === undefined) {
    console.error('Неизвестная ошибка', error)
  } else {
    console.error(`Ошибка ${error.status}`)
  }
}

//универсальная функция для получения данных методом GET из разных разделов/путей
function getDataFromAPI(urlPath, method, body = null) {
  const parameters = {
    method: method,
    headers: requestCongig.headers,
  }
  if (body) {
    parameters.body = JSON.stringify(body)
  }
  return fetch(`${requestCongig.url}/${urlPath}`, parameters)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        return Promise.reject(res)
      }
    })
    .catch(handleError)
}
//основные функции для наполнения и взаимодействия с контентом сайта
function getUserDataForProfile() {
  return getDataFromAPI('users/me', 'GET')
}

function getDataForInitialCards() {
  return getDataFromAPI('cards', 'GET')
}

function updateProfileData(name, about) {
  return getDataFromAPI('users/me', 'PATCH', { name: name, about: about })
}

function createNewCard(name, link) {
  return getDataFromAPI('cards', 'POST', { name: name, link: link })
}

function deleteCard(id) {
  return getDataFromAPI(`cards/${id}`, 'DELETE')
}

function addLikeOnCard(id) {
  return getDataFromAPI(`cards/likes/${id}`, 'PUT')
}

function removeLikeFromCard(id) {
  return getDataFromAPI(`cards/likes/${id}`, 'DELETE')
}

function updateProfileAvatar(link) {
  return getDataFromAPI('users/me/avatar', 'PATCH', { avatar: link })
}

export {
  getDataFromAPI,
  handleError,
  getUserDataForProfile,
  updateProfileAvatar,
  updateProfileData,
  createNewCard,
  getDataForInitialCards,
  deleteCard,
  addLikeOnCard,
  removeLikeFromCard,
}
