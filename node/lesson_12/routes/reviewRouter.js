const { Router } = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authenticationController');
const router = Router({ mergeParams: true }); //merging parameters in routes
//Each router by default have access to their route parameter, to get access to parameter of other router we need to merge paramter.

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setBodyId,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );
module.exports = router;
