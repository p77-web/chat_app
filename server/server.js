const path = require('path');
const express = require('express');

let app = express();

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

let port = process.env.PORT || 3060;

app.get('/', (req, res) => {
  res.send('It works!');
});

app.listen(port, () => {
  console.log(`Chat app is running on port ${port}`);
});
