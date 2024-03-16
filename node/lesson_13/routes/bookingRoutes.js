const express = require('express');
const authController = require('../controllers/authenticationController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.use(authController.protect);
router.get('/checkout-session/:tourId', bookingController.getCheckOutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBookings);

router
  .route('/:id')
  .get(bookingController.getBookings)
  .patch(bookingController.updateBookings)
  .delete(bookingController.deleteBookings);
module.exports = router;
