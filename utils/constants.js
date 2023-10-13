// Статус создания нового ресурса
const CREATED_CODE = 201;

const regLink = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

// Ошибка сервера
const SERVER_ERROR = 500;

// Ключ для режима разработки
const JWT_SECRET_DEV = 'dev-secret';

module.exports = {
  JWT_SECRET_DEV,
  regLink,
  SERVER_ERROR,
  CREATED_CODE,
};
