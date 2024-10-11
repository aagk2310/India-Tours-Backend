const express = require('express');
const { getUser } = require('../controller/userValidationController');
const router = express.Router();

router.post('/user', (req, res, next) => {
  next();
});

module.exports = router;
