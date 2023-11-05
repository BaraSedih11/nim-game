const express = require('express');
const path = require('path');
//const startGameController = require('../controllers/startGameController');

const routes = express.Router();

routes.use(express.static(path.join(__dirname, 'public')));

// Serve the login page when the user accesses the root URL
routes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'loginPage', 'index.html')); 
});

routes.post('/checkGameType', (req, res) => {
    // You can perform any server-side logic here if needed
    // No need to check 'gameType' and return it in the response
    res.json({ message: 'Game type checked successfully' });
});

module.exports = routes;