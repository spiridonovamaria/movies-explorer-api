const { config } = require('dotenv');

const { NODE_ENV } = process.env;

const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

if (NODE_ENV === 'production') {
  config();
}

const { JWT_SECRET = 'dev-secret' } = process.env;

module.exports = {
  JWT_SECRET,
  urlPattern,
  NODE_ENV,
};
