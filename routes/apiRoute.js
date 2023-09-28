const express = require('express');
const authController = require('../controllers/authController.js');

const apiRouter = express.Router();

apiRouter.route('/register').post(authController.register);
apiRouter.route('/login').post(authController.login);

module.exports = {apiRouter};
