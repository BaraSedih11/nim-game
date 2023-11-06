const express = require('express');
const path = require('path');
const { authenticateUser } = require('../middlewares/authentication');
const startGameController = require('../controllers/startGameController');

const routes = express.Router();

routes.use(express.static(path.join(__dirname, 'public')));

routes.get('/', startGameController.loginPage);
routes.post('/startGame', startGameController.startGame);

routes.get('/version1', authenticateUser, startGameController.version1Page);
routes.get('/version2', authenticateUser, startGameController.version2Page);

routes.get('/logout', startGameController.logout);

module.exports = routes;