const catchAsync = require('../../utils/catchAsync');
const axios = require('axios');
const AppError = require('../../utils/AppError');
const dotenv = require('dotenv');
const { generateAccessToken, verifyToken } = require('../utils/jwt');
const { sendMail } = require('../utils/nodemailer');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

let jwtCookieConfig;
// if (process.env.ENVIRONMENT === 'development') {
//   jwtCookieConfig = {
//     domain: 'localhost', // Use localhost for local development
//     path: '/',
//     sameSite: 'Lax', // Allows cookies to be sent with same-site requests
//     secure: false, // Use secure: false if not using HTTPS locally
//     httpOnly: false, // Allow JavaScript access to the cookie
//     maxAge: 24 * 7 * 60 * 60 * 1000, // 1 week
//   };
// } else {
jwtCookieConfig = {
  domain: '.development-project-tours.xyz', // Ensure this domain matches your API server
  path: '/',
  sameSite: 'None', // Required for cross-site requests
  secure: true, // Required when SameSite=None and using HTTPS
  httpOnly: false, // Allow JavaScript access to the cookie
  maxAge: 24 * 7 * 60 * 60 * 1000, // 1 week
};
// }
// Middleware to login
exports.loginUser = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  const { id, name } = req.body.data;
  if (!email || !password)
    throw new AppError('Please enter valid email and password', 400);
  console.log(id);
  const accessToken = generateAccessToken({ id, name });
  res.cookie('accessToken', accessToken, jwtCookieConfig);
  res.status(200).json({
    status: 'success',
  });
});

// Middleware to validate jwt and check if a request is from a valid user
exports.validate = catchAsync(async function (req, res, next) {
  console.log(`Inside validate`);
  const token = req.cookies.accessToken;
  if (!token) throw new AppError('Please login again', 401);
  const decoded = await verifyToken(token);
  if (!decoded) {
    console.log(`Decoded is null`);
    throw new AppError('No user exists', 401);
  }

  res.status(200).json(decoded);
});

exports.forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;
  if (!email) throw new AppError('Please enter email', 401);

  const user = await axios.post(`${process.env.USER_SERVICE}/passwordreset`, {
    email,
  });
  if (!user.data) throw new AppError('No such user exists', 401);

  await sendMail(user.data);
  next();
});

exports.sendResetPasswordPage = catchAsync(async function (req, res, next) {
  res.render('resetPassword.ejs', { userService: process.env.USER_SERVICE });
});

exports.verifyCredentials = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const response = await axios.post(`${process.env.USER_SERVICE}/validate`, {
    email,
    password,
  });

  if (response.data.status === 'ok') {
    req.body.data = response.data; // Ensure you access the correct property
    next();
  } else throw new AppError('Incorrect password', 400);
});

exports.resetPassword = catchAsync(async function (req, res, next) {
  const { token, password } = req.body;
  await axios.patch(`${process.env.USER_SERVICE}/resetpassword`, {
    token,
    password,
  }); // Ensure the correct endpoint is used
  res.status(200).json({ status: 'success' });
});
