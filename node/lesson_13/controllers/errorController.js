const AppError = require('../utils/appError');
const handleCastErrorDB = (err) => {
  //path is inuput field for which given value is wrong
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400); //400 for bad request
};
const handleDuplicateFieldErrorDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value "${value}". Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); //Object.values create array of all error object

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Inavlid token. Please login again!', 401);
const handleJWTExpiresError = () =>
  new AppError('Your token is expired. Please login again!', 401);

const sendDevError = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) RENDERED WEBSITE
  console.log('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};
const sendProdError = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //operational, trusted errors: send message to the client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //programming or other unknown error: don't leak error details
    //1. Log the error
    console.log('ERROR', err);
    //2. Send a generic message
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
  //B)RENDERED WEBSITE
  if (err.isOperational) {
    //operational, trusted errors: send message to the client
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //programming or other unknown error: don't leak error details
  //1. Log the error
  console.log('ERROR', err);
  //2. Send a generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later!',
  });
};
module.exports = (err, req, res, next) => {
  //console.log(err.stack); //stackstrace
  //console.log(err.statusCode);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    //development error -- more information exposing
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    //production error -- less information exposing
    //marking operational errors
    let error = err;
    //console.log(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error); //mongoose error
    if (error.code === 11000) error = handleDuplicateFieldErrorDB(error); //mongodb driver error, not mongoose error. Therefore no name, handling by error code
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error); //mongoose error
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiresError();
    sendProdError(error, req, res);
  }
};
