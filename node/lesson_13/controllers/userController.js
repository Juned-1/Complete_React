const multer = require('multer');
const sharp = require('sharp'); //image processing library easy to use.
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
//nulter storage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users'); //first argument in callback function is error is there is, otherwise it is null. @nd argument is destination
//   },
//   filename: (req, file, cb) => {
//     //user-userid-currentTimestamp.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage(); //creating memory storage to do resizing of of image in memory before saving
//destination takes a callback function which have req, file and another callback function which is similar to express next()

//multer filter
const multerFilter = (req, file, cb) => {
  //we are filtering if file is image then we upload otherwise not, you can create your filter for your file type like CSV and other
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
//upload single will upload single image and name of the field of uplaod will be photo
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async(req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; //we are doing this because when we use memory storage, file does not get set, but we need file name in our other middleware function of updateMe
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`); //image is stored in memory buffer
  //jpeg for compression -- quality is given here 90%
  //Finally we write it to file using toFile
  next();
});
const filterObject = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
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
  if (req.file) filteredBody.photo = req.file.filename;
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
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    //204 -- deleted
    status: 'success',
    data: null,
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
