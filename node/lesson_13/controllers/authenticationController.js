const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);
  user.password = undefined; //Remove password from the output
  res.status(statusCode).json({
    //201 --created
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  //const newUser = await User.create(req.body); with this line anyone can specify role is admin and access everything
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role ? req.body.role : 'user',
  });
  //http://127.0.0.1:3000/me
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser,url).sendWelcome(); //awaiting send welcome function
  //expies time could Eg: 90d 10h 5m 3s or just number which will be treated as milliseconds
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400)); //bad request -- 400
  }
  //2)Check if the user exist && password is correct
  const user = await User.findOne({ email }).select('+password'); //since password selection is by default false in schema, here for verification we will explicitly select it using selcet

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); //401 means unauthorised
  }

  //3)If everything ok, send token to the client
  createSendToken(user, 200, res);
});
//We will send an empty cookie with same name for short duration of time. That is more like deleting ookie and logging out
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), //10 s logout cookie time
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
//Route protection using JWT
exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in first.', 401),
    ); //401 - unauthorised, data sent is correct butuser is not authorised
  }
  //2. Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3. Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }
  //4. If User changed password after JWT is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401),
    );
  }
  //grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser; //only for getting account template in pug
  next();
});

//It just check login status to render element. No error elements is there.
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      //1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      //2) Check if user still exist
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //3) If User changed password after JWT is issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //There is a logged in user
      //In resposne we can pass any value which our template can access (here pug template)
      res.locals.user = currentUser;
      return next();
    }
    return next();
  } catch (err) {
    //In case ther is no cookie Still it will get to next rendering object
    return next();
  }
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array eg: ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      ); //403 - forbidden
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) GET USER BASED ON POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address!', 404));
  }
  //2) Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetpassword/${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);

    return next(
      new AppError(
        'There was an error in sending email. Please try again!',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400)); //bad request
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //deleting password reset token and password token expires
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); //In this case validtor runs to verify password and password confirm are same

  //3) Update changedPasswordAt property

  //4) Log the user in, send JWT to the client
  const token = signToken(user._id);
  //createSendToken(user,200,res);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(
      new AppError(
        'There is no user with given email. Please provide a valid email',
        404,
      ),
    );
  }
  //2) Check if the posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  //3) If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //findAndUpdate can not be used because because schema validator will not work because, this.password is not available when we update, internally mongoose does not keep current object in memory
  //Other three hook on schema written for save observable will not work by findANdUpdate which we want to work for validation

  //4) Log user In, Send JWT
  createSendToken(user, 200, res);
});
