const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
exports.aliasTopTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //findById() is equivalent to findOne({_id: req.params.id}) -- it is shorthand given by mongodb
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    //const newTour = new Tour({}); -- create a new document instance
    //newTour.save().then() --return promise by save method
    const newTour = await Tour.create(req.body); //directly call create on model. -- return promise by create method
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  //everything comes from our body which is not defined in schema are not written in database
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //new is set true so that it can updated document as response
    //run validators is set true every time updation it validate req.body with mongoose schema
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      //204 indicates that content is no more, delete code
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      ststus: 'fail',
      message: err,
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    //console.log(err);
    res.status(404).json({
      ststus: 'fail',
      message: err,
    });
  }
};
//find 6 busiest tour month  of the year with tour details - business problem
exports.getMonthlyPlan = async (req, res) => {
  try {
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
            $lte: new Date(`${year}-12-31`) //end at december 31st
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'}, //grouping by month
          numToursStarts: { $sum: 1}, //number of tours each month
          tours: {$push: '$name'}, //create array of name of tours in this month
        }
      },
      {
        $addFields: {
          month: '$_id'
        }
      },
      {
        $project: {
          _id: 0 //0 do not project, 1 project
        }
      },
      {
        $sort: {
          numToursStarts: -1 //1 -- ascending sort -1 -- descending sort
        }
      },
      {
        $limit: 6
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    //console.log(err);
    res.status(404).json({
      ststus: 'fail',
      message: err,
    });
  }
};
