const mongoose = require('mongoose');
const Tour = require('./tourModel');
//review /rating / createdAt / ref to the tour / ref to User
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must have above 1.0 rating'],
      max: [5, 'A tour must have below 5.0 rating'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true }, //every time JSON is formed virtual property should be true
    toObject: { virtuals: true },
  },
);

//We want to prevent duplicate review writing, if make tour and user id as unique foreign key then each user can write one review and each tour can get one review which is not correct
//We want both user both of user and together to be unique, so that each user can write one review not more than that, both together to be unique
reviewSchema.index({tour: 1, user: 1}, {unique: true}); //passing option object to set unique both key together

//populate middleware during review finding -- for multiple population call populate again
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  //console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  }else{
        await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', function () {
  //post middleware does not get next
  this.constructor.calcAverageRatings(this.tour); //but review is not defined at the this stage and if we move it after Review variable it will not be part of schema, since middleware execute in a order they are defined so we can call it from constructor
});

//updating rating when a review is updated and deleted
//findByIdAndUpdate
//findByIdAndDelete
//For this we do not have document middleware but actucally a query middleware
//We don't have direct access to dicument to do something similar to this
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Retrieve the query conditions
  const conditions = this.getQuery();

  this.r = await this.model.findOne(conditions); //In query middleware we only have access to query not to document, but we need access to document so we are using findOne and storing result in r -- it is technically a trick
  //Now if we use this static method to update statistics, it will update by non updated data -- because we can not change pre hook to post because after that we no longer have access to query because at that point query has already executed
  //without query we can not save the review document
  //The calculation of statistics we will do using post middleware, but here we will use trick to pass id of tour from pre middleware to post middleware
  //That is where we will store a state varibale r(any name).
  //console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  if (!this.r) {
    return; // Exit if no document is found
  }
  //This is where we will calculate statistics during update
  //await this.model.findOne(conditions);  -- does not work here, query hs already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

//If we embed review to user and tours and large number of review comes then it will be terrible situation to change review. So we embed tour and user to review as parent referncing to avoid situation
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
