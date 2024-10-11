const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const {
  validateUser,
  bookTour,
  getUserBookings,
} = require('./controller/bookingController');

// CORS configuration
let corsOptions;
if (process.env.ENVIRONMENT === 'development') {
  corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include OPTIONS for preflight
    allowedHeaders: 'Content-Type, Authorization', // Include Authorization
  };
} else {
  corsOptions = {
    origin: 'https://frontend.development-project-tours.xyz', // Your frontend domain
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include OPTIONS for preflight
    allowedHeaders: 'Content-Type, Authorization', // Include Authorization
  };
}

// Use helmet to set secure HTTP headers
app.use(helmet());

// Use CORS with the specified options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).send('GET REQUEST SUCCESSFUL');
});

app.post('/book', validateUser, bookTour);
app.post('/bookings', validateUser, getUserBookings);

//Global error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ err });
});

module.exports = app;
