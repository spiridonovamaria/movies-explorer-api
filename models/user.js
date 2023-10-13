const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/autherror');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Неправильный формат почты',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },

  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                return Promise.reject(
                  new Unauthorized('Неправильные почта или пароль'),
                );
              });
            }

            return Promise.reject(
              new Unauthorized('Неправильные почта или пароль'),
            );
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
