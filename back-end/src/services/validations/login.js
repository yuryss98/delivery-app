const CustomError = require('../error/CustomError');

const login = (email, password) => {
  if (!email || !password) {
    throw new CustomError('BAD_REQUEST', 'All fields must be filled');
  }

  const isValidEmail = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)(\.br)?$/i);

  if (!isValidEmail) {
    throw new CustomError('UNAUTHORIZED', 'Email is in invalid format');
  }

  if (password.length < 6) {
    throw new CustomError('UNAUTHORIZED', 'Password must contain at least 6 characters');
  }
};

module.exports = login;