const express = require('express');
const viewController = require('../controllers/viewControllers');
const authController = require('../controllers/authenticationController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.get('/me', authController.protect, viewController.getAccount); //avoiding isLoggedIn protect will check it
router.get('/my-tours', authController.protect, viewController.getMyTour); //avoiding isLoggedIn protect will check it
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);
router.use(authController.isLoggedIn);

router.get(
  '/',
  bookingController.createBookingCheckout,
  viewController.getOverview,
);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.login);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData,
);
module.exports = router;
