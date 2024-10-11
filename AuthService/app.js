const express = require('express');
const app = express();
const authController = require('./Controller/authController');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

let corsOptions;

if (process.env.ENVIRONMENT === 'development') {
  corsOptions = {
    origin: 'http://localhost:5173', // Local development origin
    credentials: true, // Allow cookies to be sent
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type',
  };
} else {
  corsOptions = {
    origin: 'https://frontend.development-project-tours.xyz', // Production origin
    credentials: true, // Allow cookies to be sent
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type',
  };
}

// Use helmet to set secure HTTP headers
app.use(helmet());

// Use CORS with the specified options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Define routes
app.post('/verify', authController.validate);
app.post('/forgotPassword', authController.forgotPassword);
app.patch('/resetPassword', authController.resetPassword);
app.get('/resetPassword/:token', authController.sendResetPasswordPage);
app.post('/login', authController.verifyCredentials, authController.loginUser);

module.exports = app;
