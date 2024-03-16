const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../model/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
//multiple file upload, one imageCover and three images

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
//[{fieldname: ..., maximum}]
//if only one field then, upload.array('images',3);
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //1)Process Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`); //2 : 3 ratio image -- 2000px : 1333px
  //2) All other images in loop
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    }),
  ); //more than one async function return an array fo promises which intern we can await. Since inside for each is async it will awai entire req.files.images code and may go to next which we do not want before setting image
  next();
});
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTour = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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

//router.route('/tours-within/:distance/center/34.119007, -118.418663/unit/mi',tourController.getTourWithin);

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  //distance is either in mile or kilometer
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng,',
        400,
      ),
    );
  }
  console.log(distance, lat, lng, unit);
  //Geospatial query
  //To work with geo spatial data we need to index the field where the geospatial data is stored what we are searching for
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  }); //we want to find places within a sphere of given distance
  //center sphere takes an array of coordinate and radius
  //mongodb expect a special unit called radian to take radius not in other unit
  //In order to get radian we need to divide distance by radius of the earth
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

//router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);
//router.route('/distance/34.119007, -118.418663/unit/mi').get(tourController.getDistances);

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng,',
        400,
      ),
    );
  }
  //our tour already have 2dgeosphere index so aggregation will happen on this index
  const distances = await Tour.aggregate([
    {
      //since we have a aggregation middleware in model which run before every other pieline, but geoNear need to be first stage in aggregation pipeline
      //So we do not need this middleware right now, we get rid of it
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        //near is the point from which the distances will be calculated these point is like geoJSON
        distanceField: 'distance', //all the caluculated distances will be stored in distance field
        distanceMultiplier: multiplier, //converting distance into km or mile from m using distanceMultiplier property
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
