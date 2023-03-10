const userService = require('../services/user.service');
const isAdmin = require('../services/validations/isAdmin');

const createUser = async (req, res, next) => {
  try {
    const { token: _, ...userWithoutToken } = await userService.register(req.body);
    return res.status(201).json(userWithoutToken);
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (_req, res, next) => {
  try {
    console.log('dentro do admin controller')
    const output = await userService.getAllUsers();
    return res.status(200).json(output);
  } catch (error) {
    console.log('error admin controller', error)
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    isAdmin(req.user.role);
    await userService.deleteUser(id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
};