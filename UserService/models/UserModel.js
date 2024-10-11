const mongoose = require('mongoose');
const argon2 = require('argon2');
const { hashPassword } = require('../utilities/passwordHasher');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  userEmail: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: [true, 'An account with this email already exists'],
  },
  password: {
    type: String,
    required: [true, 'Password not specified'],
    minLength: 8,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
});

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  return resetToken; // Return the plain reset token for email purposes
};

// Document middleware to hash password before saving
userSchema.pre('save', async function (next) {
  // console.log('Inside userschema middleware');
  // console.log(this.isModified('password'));
  // console.log(this.password);
  if (!this.isModified('password')) return next();

  this.password = await argon2.hash(this.password);
  console.log(this.password);

  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
