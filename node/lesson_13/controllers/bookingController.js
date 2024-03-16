const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //passing secret key will give us a stripe object to work with
const Tour = require('../model/tourModel');
const Booking = require("../model/bookingModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  //2) Create checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`, //This is not secure anyone knows url structure can give these variable in url and create bookings without paying, after deploying we will use secure booikngs using stripe webhooks
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    //line of product what we are selling
    line_items: [
      {
        //name: `${tour.name} Tour`, //these fields comes from stripe we can not define ourselves, otherwise we will get error
        //description: tour.summary,
        //images: [`https://www.natours.dev/img/tours/tour-1-cover.jpg`],//images should be live images hosted in internet because stripe will automatically upload those images in their server
        //price: tour.price * 100,
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1, //one tour bying here
      },
    ],
  });
  //3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    //This is only temporary, unsecure, everyone can make bookings without paying
    const {tour, user, price } = req.query;
    if(!tour && !user && !price) return next();
    await Booking.create({tour, user, price});
    res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBookings = factory.createOne(Booking);
exports.getBookings = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBookings = factory.updateOne(Booking);
exports.deleteBookings = factory.deleteOne(Booking);
