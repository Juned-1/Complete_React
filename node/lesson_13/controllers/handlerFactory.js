const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
//Factory function
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //inner function catchAsync gets access to variable of outer function even when after outer function returns and Model and replace it with acual value -- JAvascript closure.
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`No document is found with that ID`, 404));
    }
    res.status(204).json({
      //204 indicates that content is no more, delete code
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //new is set true so that it can updated document as response
    //run validators is set true every time updation it validate req.body with mongoose schema
    if (!doc) {
      return next(new AppError(`No document is found with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    //we want to poulate review for specific tour which is open, not all tours so we will poulate here rather than schema middleware
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    // const tour = await Tour.findById(req.params.id).populate('reviews');
    if (!doc) {
      return next(new AppError(`No tour is found with that ID`, 404));
    }
    //console.log(x);
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //for review
    let filter = {}
    if(req.params.tourId) filter = { tour: req.params.tourId }
    //EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .paginate(); //chaining method
    //const doc = await features.query.explain();
    const doc = await features.query;
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
