const mongoose = require('mongoose');
const { Schema } = mongoose;
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

const bookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  tourIds: [{ type: Schema.Types.ObjectId, required: true }],
  tickets: [{ type: Number, min: 1 }],
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  totalPrice: { type: Number },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ userId: 1, bookingDate: -1 });
// bookingSchema.pre('save', async function (next) {});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
