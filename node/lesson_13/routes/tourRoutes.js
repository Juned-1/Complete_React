const express = require('express');
const authController = require('../controllers/authenticationController');
const tourController = require('../controllers/tourController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('../routes/reviewRouter');
const router = express.Router();

//nested route with tourid and reviews
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews', reviewRouter); //mergin params

//router.param("id", tourController.checkID);
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTour, tourController.getAllTour);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route(
    authController.protect,
    authController.restrictTo('admin', 'lead-giide', 'guide'),
    '/monthly-plan/:year',
  )
  .get(tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/')
  .get(authController.protect, tourController.getAllTour) //authenticating
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-giide'),
    tourController.createTour,
  ); //chaining multiple middleware
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  ); //authenticating and then authorizing users role

module.exports = router;
