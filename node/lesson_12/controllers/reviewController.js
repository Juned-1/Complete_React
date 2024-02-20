const Review = require("../model/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require('../controllers/handlerFactory');
exports.setBodyId = (req,res,next) => {
    //Allow nested route
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(req.user) req.body.user = req.user._id.toString();
    else if(!req.user) req.body.user = req.params.id;
    next();
}
exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);