const mongoose = require('mongoose');
const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: Number,
  longitude: Number,
  images: [String],
});
const tourPackages = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please specify the category'],
    unique: [true, 'A tour with this category already exits'],
  },
  imageCover: {
    type: String,
    //required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  startDates: [Date],
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description'],
  },
  places: [placeSchema],
});

const Tour = mongoose.model('Tour', tourPackages);
module.exports = Tour;
