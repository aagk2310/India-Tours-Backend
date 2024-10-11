const express = require('express');
const cors = require('cors');
const app = express();
const controller = require('./controller/userController');
const userValidationController = require('./controller/userValidationController');
const validationRouter = require('./routes/userDetailRoutes');

app.use(cors());
app.use(express.json());

app.route('/users').post(controller.addUser);

app.route('/users/:id').get(controller.getUserById);

app.post('/validate', userValidationController.validateUserCredentials);

app
  .route('/passwordreset')
  .post(userValidationController.getPasswordResetToken)
  .patch(userValidationController.resetPassword);

// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
