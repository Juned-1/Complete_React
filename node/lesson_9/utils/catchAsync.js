module.exports = (fn) => {
  //this receive entire function of us as parameter
  //It should not be directly called rather it should return a pointer to which will be called by express when request comes
  return (req, res, next) => {
    //fn(req,res,next).catch(err => next(err)); //catching error from promise
    fn(req, res, next).catch(next); //equivalent to fn(req,res,next).catch(err => next(err));
    //this next function pass error to global error handling middleware
  }; //this returned anonymous function is assigned to createTour
};
