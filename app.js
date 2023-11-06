const express = require('express');
const sessionConfig = require('./middlewares/sessionConfig'); // Import the session configuration module

const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON data
app.use(sessionConfig); // Apply the session configuration

const startGameRouter = require('./routes/startGameRouter');

app.use('/game', startGameRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
