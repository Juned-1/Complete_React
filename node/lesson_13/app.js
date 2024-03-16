const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanirize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require("path");
const cookieParser = require('cookie-parser');
const tourRouters = require('./routes/tourRoutes');
const userRouters = require('./routes/userRoutes');
const reviewRouters = require('./routes/reviewRouter');
const bookingRouters = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRouters');
const app = express();
//GLOBAL middleware

//HTTP security implementation
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
//stripe set up

//serving static file
app.use(express.static(path.join(__dirname,'public')));
app.use(helmet({
  contentSecurityPolicy: false,
}));
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
app.use(express.urlencoded({extended: true, limit: '10kb'}));
//cookie parser
app.use(cookieParser());

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
app.use('/',viewRouter);
app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/reviews',reviewRouters);
app.use('/api/v1/bookings', bookingRouters);
//Handling all unhandled routes
// app.get('/bundle.js.map', (req, res, next) => {
//   res.sendFile(path.join(__dirname, 'public', 'js', 'bundle.js.map'));
// });
//app.all indicate respose for all method get, post, patch, put, delete etc.
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find url ${req.originalUrl} on this server!`, 404)); //If next function receive any parametere then by default express consider parameter as error
});
//Error handling middleware
app.use(globalErrorHandler);
module.exports = app;