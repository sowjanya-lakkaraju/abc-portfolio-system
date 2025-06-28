const express = require('express');
const dotenv = require('dotenv');
const app = express();

const PORT = process.env.PORT || 3500;


app.use(express.json());

app.listen(3500, () => {
  console.log('Server is running on port 3500');
})