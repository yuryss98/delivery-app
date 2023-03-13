const CustomError = require('../error/CustomError');

const isAdmin = (role) => {
  console.log('role', role);
  if (role !== 'administrator') {
    throw new CustomError('UNAUTHORIZED', 'Unauthorized user');
  }
};

module.exports = isAdmin;