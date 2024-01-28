const express = require('express');
const authController = require('../controllers/authenticationController');
const tourController = require('../controllers/tourController');

const router = express.Router();

//router.param("id", tourController.checkID);
router.route('/top-5-tours').get(tourController.aliasTopTour,tourController.getAllTour);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect,tourController.getAllTour) //authenticating
  .post(tourController.createTour); //chaining multiple middleware
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour); //authenticating and then authorizing users role
module.exports = router;
