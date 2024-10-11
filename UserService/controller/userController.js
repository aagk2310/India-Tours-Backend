const User = require('../models/UserModel');
const catchAsync = require('../../utils/catchAsync');

//Function to add user
exports.addUser = catchAsync(async function (req, res, next) {
  console.log(req.body);
  const { userName, userEmail, userPassword, confirmPassword } = req.body;
  if (userPassword != confirmPassword) {
    throw new Error('Passwords dont match');
  }
  const newUserDocument = new User({
    userName,
    userEmail,
    password: userPassword,
  });
  const userData = await newUserDocument.save();
  const userDataWithoutPassword = await User.findById(userData._id).select(
    '-password -__v'
  );

  res.send(userDataWithoutPassword);
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findById(id);
  const isSuccess = user ? true : false;
  const statusCode = isSuccess ? 200 : 404;
  res.status(statusCode).json({
    isSuccess,
    id,
  });

  next();
});
