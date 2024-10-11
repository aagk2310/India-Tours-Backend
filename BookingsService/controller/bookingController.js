const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const axios = require('axios');
const Booking = require('../models/bookingSchema');
const { json } = require('express');

exports.validateUser = catchAsync(async function (req, res, next) {
  console.log(`Inside validate user`);
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new AppError('Please login', 401);
  }
  console.log(`Access token: ${accessToken}`);

  // Send accessToken as a cookie
  const response = await axios.post(
    `${process.env.AUTH_SERVICE}/verify`,
    {},
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    }
  );
  console.log(response.data);
  const { id: userId } = response.data;
  if (!userId) throw new AppError('Something went wrong', 500);
  else {
    req.body.userId = userId;
    next();
  }
});

async function validateTours(tourIds) {
  console.log('INSIDE BOOKING PRE SAVE HOOK');
  console.log('Tour IDs:', tourIds);

  const response = await axios.post(
    `${process.env.TOUR_SERVICE}/tours/validate`,
    { tourIds }
  );
  console.log(response.data);
  if (!response?.data?.isSuccess) {
    throw new Error('Invalid Tour');
  } else {
    return response.data;
  }
}

// Tour booking middleware
exports.bookTour = catchAsync(async function (req, res, next) {
  console.log(`Inside Booking tour`);
  const { tourIds, userId, tickets } = req.body;

  // Create a new instance of the Booking model
  console.log(`Booking,${tourIds}`);

  const newBooking = new Booking({ tourIds, userId, tickets });

  // Save the new booking instance to the database
  const bookedTour = await newBooking.save();

  res.status(200).json({
    status: 'success',
    data: {
      bookedTour,
    },
  });
});

exports.getUserBookings = catchAsync(async function (req, res, next) {
  console.log(`Inside user bookings`);
  console.log(req.body);
  const { userId } = req.body;
  const bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });
  if (bookings.length === 0) {
    throw new Error(`Something went wrong`);
  }
  let tourIds = bookings.map((booking) => booking.tourIds);
  const tours = await validateTours(tourIds);
  res.status(200).json({
    tours,
    bookings,
  });
});
