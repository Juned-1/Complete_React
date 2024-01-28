const express = require('express');

const morgan = require('morgan');
const app = express();
const tourRouters = require('./routes/tourRoutes');
const userRouters = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouters); //tourRouters is middleware
app.use('/api/v1/users', userRouters);

//HAndling all unhandled routes
//app.all indicate respose for all method get, post, patch, put, delete etc.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find url ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find url ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find url ${req.originalUrl} on this server!`, 404)); //If next function receive any parametere then by default express consider parameter as error
});
//Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
