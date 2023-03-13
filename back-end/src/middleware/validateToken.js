const CustomError = require('../services/error/CustomError');
const { verifyToken } = require('../auth/token');

module.exports = async (req, _res, next) => {
  try {
    const token = req.header('Authorization');

    // console.log('token', token)

    if (!token) {
      throw new CustomError('UNAUTHORIZED', 'Token not found');
    }

    const { data } = await verifyToken(token);

    // console.log('data', data)

    req.user = data;

    return next();
  } catch (error) {
    next(error);
  }
};