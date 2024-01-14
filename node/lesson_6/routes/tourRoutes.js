//organizing routes into different file structure or module
const express = require("express");
const tourController = require("../controllers/tourController");
//2. ROUTE HANDLER
const router = express.Router();
//param middleware
router.param("id", tourController.checkID);
router
  .route("/")
  .get(tourController.getAllTour)
  .post(tourController.checkBody,tourController.createTour);//chaining multiple middleware
router
  .route("/:id/:x?/:y?")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = router;
