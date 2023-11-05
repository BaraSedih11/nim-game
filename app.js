const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const startGameRouter = require('./routes/startGameRouter');

app.use('/game', startGameRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
