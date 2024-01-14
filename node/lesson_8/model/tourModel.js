const mongoose = require('mongoose');
const slugify = require('slugify');
const validtor = require('validator');
//We need mongoose schema for each of our CRUD operation
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //property value, error string, validator
      unique: true, //validator
      trim: true,
      maxlength: [40, 'A tour must have name equal to or less than 40 character'],
      minlength: [10, 'A tour must have name equal to or greater than 10 character'],
      //validate: [validtor.isAlpha, "A tour name should only contain alphabet"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must have above 1.0 rating'],
      max: [5, 'A tour must have below 5.0 rating'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'], //validator
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val){
          //this only points current document on NEW document creation
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true, //removes beginning and ending space on string
      required: [true, 'A tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //ignoring to project it -- it is required when we want to avoid exposing important details
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
  },
  {
    toJSON: { virtuals: true }, //every time JSON is formed virtual property should be true
    toObject: { virtuals: true },
  },
);
//1st object in mongoose schema is schema defintion, 2nd object is option
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//pre hook of mongoose middleware whic runs before save event
//DOCUMENT MIDDLEWARE -- runs before .save or .create() command -- in between other function it will not run like insertMany etc.
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});
// tourSchema.pre('save',function(next){
//   console.log("Will save document...");
//   next();
// })
// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();
// });

//Query Middleware
// tourSchema.pre('find',function(next){
//   this.find({secretTour : {$ne: true}});
//   next();
// });
//prevents even individual exposing of secret document by findById which is internally run findOne
// tourSchema.pre('findOne',function(next){
//   this.find({secretTour : {$ne: true}});
//   next();
// });
tourSchema.pre(/^find/,function(next){
  this.find({secretTour : {$ne: true}});
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/,function(doc,next){
  console.log(`Query tooks ${Date.now() - this.start} milliseconds!`);
  //console.log(doc);
  next();
});
tourSchema.pre('aggregate',function(next){
  //unshift methods add an element at the beginning of array
  //adding one more stage
  this.pipeline().unshift({ $match: {secretTour: {$ne: true}}}); 
  //console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
//mongose craete the collection by pluralizing name of model + small caps if it do not exist
module.exports = Tour;
