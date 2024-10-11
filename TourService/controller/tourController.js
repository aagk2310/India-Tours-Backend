const Tour = require('../model/tourModel');
const { ObjectId } = require('mongodb');
const catchAsync = require('../../utils/catchAsync');

exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).json(tours);
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = req.body;
  const createdTour = await Tour.create(tour);
  res.json(createdTour);
});

exports.findTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return next('Invalid tour ID');
  // }
  const tour = await Tour.findById(id);
  if (!tour) {
    return next('No tour found');
  }
  console.log(tour);
  res.status(200).json(tour);
});

exports.sendTours = async function (req, res, next) {
  const { tours } = req.body;

  res.status(200).json({
    isSuccess: true,
    status: 'ok',
    tours,
  });
};

exports.validateTourIDsAndPopulateTours = async (req, res, next) => {
  console.log(`Inside validate tour`);
  const { tourIds } = req.body;
  console.log(req.body);
  console.log(tourIds);
  if (!tourIds) next(new Error('No tour id'));
  let tours = [];
  for (tourId of tourIds) {
    console.log(`TOOOOOR ID ${tourId}`);
    const tour = await Tour.find({ _id: { $in: tourId } }).select({
      _id: 1,
      category: 1,
      imageCover: 1,
    });
    console.log(`TOOOOUR ${tour}`);
    if (!tour) {
      return next('No tour found');
    }
    tours.push(tour);
  }
  console.log(tours);
  req.body.tours = tours;
  next();
  // sendTours(req, res, tours);
};
