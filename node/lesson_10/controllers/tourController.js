const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTour = catchAsync(async (req, res, next) => {
  console.log(req.query);

  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .paginate(); //chaining method
  const tours = await features.query;
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if(!tour){
    return next(new AppError(`No tour is found with that ID`,404));
  }
  //console.log(x);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  //new is set true so that it can updated document as response
  //run validators is set true every time updation it validate req.body with mongoose schema
  if(!tour){
    return next(new AppError(`No tour is found with that ID`,404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError(`No tour is found with that ID`,404));
  }
  res.status(204).json({
    //204 indicates that content is no more, delete code
    status: 'success',
    data: null,
  });
});
exports.getTourStats = catchAsync(async (req, res) => {
  //aggregation pipeline
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        //_id: null, //group by nothing if null
        //_id: '$difficulty', //group by difficulty
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 }, //for each doccument it will go through pipeline and add 1
        numAverage: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, //In sort we will use the properties we defined in group. 1 for ascending sort
    },
    // {
    //   //we can also repeat stages -- here id is id of previous stage result -- which is difficulty
    //   $match: {_id : {$ne: 'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
//find 6 busiest tour month  of the year with tour details - business problem
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      //unwind deconstruct array fileds from the input document and then ouput one document for each elements of the array.
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), //starts from january 1st
          $lte: new Date(`${year}-12-31`), //end at december 31st
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, //grouping by month
        numToursStarts: { $sum: 1 }, //number of tours each month
        tours: { $push: '$name' }, //create array of name of tours in this month
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0, //0 do not project, 1 project
      },
    },
    {
      $sort: {
        numToursStarts: -1, //1 -- ascending sort -1 -- descending sort
      },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
