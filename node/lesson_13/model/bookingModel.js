const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  createdAt : {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean, //by default it will be true, but if admin want to book on cash manually then they can manipulate that field manually.
    default: true,
  },
});
bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
    //it will not be a performance problem, since it will be very useful api when guides/admin want to see all bookings 
    next();
})
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;