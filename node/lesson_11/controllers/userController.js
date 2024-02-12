const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const filterObject = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
exports.getMe = (req,res,next) => {
  req.params.id = req.user.id;
  next();
}
exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for pasword update. Please use /updateMyPassword',
        400,
      ),
    );
  }
  //2) Filtered out unwanted fileds that are not allowed to be updated
  const filteredBody = filterObject(req.body, 'name', 'email');
  //3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  //new option makes db to return new object
  //user.name = 'Junaid';
  //await user.save() -- can not use it because it requires password to confirm -- password is required fields, instead we will dot findAndUpdate to update some fields of DB.
  //findByIdAndUpdate can be used to update non sensitive data
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteMe = catchAsync(async(req,res,next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});
  res.status(204).json({//204 -- deleted
    status: "success",
    data: null
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'These route is never defined. Please use sign up instead',
  });
};
exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Should not be updated directly
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);