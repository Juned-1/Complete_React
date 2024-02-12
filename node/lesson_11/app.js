const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanirize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const tourRouters = require('./routes/tourRoutes');
const userRouters = require('./routes/userRoutes');
const reviewRouters = require('./routes/reviewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
//GLOBAL middleware
//HTTP security implementation
app.use(helmet());
//environment
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit HTTP request in API for time interavl
const limiter = rateLimit({
  max: 100, //maximum request
  windowMs: 60 * 60 * 1000, //window in milliseconds
  message: 'Too many request from this IP. Please try again in an hour!', //error message
}); //100 request in an hour per IP.
app.use('/api', limiter); //applying limiter only for /api routes. -- All routes start with /api

//body parser
app.use(express.json({ limit: '10kb' }));

//NoSQL injection query santizer to prevent injection attack
app.use(mongoSanirize());
//XSS attack prevention
app.use(xssClean());
//Preventing HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//serving static file
app.use(express.static(`${__dirname}/public`));

//sometime for looking date our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use((req, res, next) => {
  //console.log(req.headers);
  next();
});

//routes middleware
app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/reviews',reviewRouters);
//Handling all unhandled routes
//app.all indicate respose for all method get, post, patch, put, delete etc.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find url ${req.originalUrl} on this server!`, 404)); //If next function receive any parametere then by default express consider parameter as error
});
//Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
