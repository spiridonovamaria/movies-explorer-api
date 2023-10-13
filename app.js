// подключаем dotenv, чтобы секретный
// ключ из файла .env работал на сервере
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const CentralErrorHandling = require('./middlewares/CentralErrorHandling');
const cors = require('./middlewares/cors');

const { DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose.connect(DB_URL).then(() => {
  console.log('Database connected');
})
  .catch(() => {
    console.log('Database not connected');
  });

const app = express();
app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(CentralErrorHandling);
app.listen(PORT);
