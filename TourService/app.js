const express = require('express');
const app = express();
const cors = require('cors');
const tourRouter = require('./routes/tourRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('GET REQUEST SUCCESSSFUL');
});

app.use('/tours', tourRouter);

//Global error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send(err);
});

module.exports = app;
