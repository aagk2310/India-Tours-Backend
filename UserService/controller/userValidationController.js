const User = require('../models/UserModel');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const argon2 = require('argon2');
exports.getPasswordResetToken = catchAsync(async function (req, res, next) {
  const { email } = req.body;
  console.log(`Email ${email}`);
  const user = await User.findOne({ userEmail: email });

  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }

  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  const currentUser = await user.save({ validateBeforeSave: false }); // Save the token and expiry to the database
  res.status(200).json({
    status: 'success',
    passwordResetToken: currentUser.passwordResetToken,
    userName: currentUser.userName,
    userEmail: currentUser.userEmail,
  });
});

async function verifyPassword(password, hashedPassword) {
  try {
    console.log(`Argon ${hashedPassword} ${password}`);
    if (await argon2.verify(hashedPassword, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new AppError('Something went wrong', 400);
  }
}

exports.validateUserCredentials = catchAsync(async function (req, res, next) {
  console.log(`INSIDE USER CREDENTIALS`);
  const { email, password } = req.body;
  const user = await User.findOne({ userEmail: email });
  if (!user) {
    return next(new AppError('No user found with that email', 404));
  }
  const hashedPassword = user.password;
  const isValidPassword = await verifyPassword(password, hashedPassword);
  console.log(`isValidPasswrod:${isValidPassword}`);
  if (!isValidPassword)
    res.status(401).json({
      status: 'fail',
    });
  else {
    console.log(`User id ${user._id}`);
    res.status(200).json({
      status: 'ok',
      valid: true,
      name: user.userName,
      id: user._id,
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  // Find user by token and ensure token has not expired
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  // Set the new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Save the user (the pre-save hook will handle password hashing)
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
});
