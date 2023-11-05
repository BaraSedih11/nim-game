const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

const startGameRouter = require('./routes/startGameRouter');

app.use('/game', startGameRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
