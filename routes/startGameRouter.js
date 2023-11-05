const express = require('express');
const startGameController = require('../controllers/startGameController');

const routes = express.Router();

routes.get('/login', startGameController.loginPage);
  
routes.post('/startGame', startGameController.startGame);

module.exports = routes;