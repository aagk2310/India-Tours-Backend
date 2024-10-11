const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.verifyToken = async function (token, next) {
  // Added next as a parameter
  if (!token) {
    throw new AppError(
      'You are not logged in! Please log in to get access.',
      401
    );
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded ${decoded}`);
    return decoded;
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
};
