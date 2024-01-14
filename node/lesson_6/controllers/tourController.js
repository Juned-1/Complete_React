const fs = require("fs");
//top level in the above
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
); //convert JSON into JS object
exports.checkID = (req, res, next, val) => { //middleware
  console.log(`Tour id : ${val}`);
  //if(id > tours.length)
  if (val * 1 >= tours.length) {
    return res.status(404).json({//return is important, if there is no return after sending error response express will continue through other middleware whcih we do not want, we want express to return from this middleware with response error after encountering erros
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};
exports.checkBody = (req,res,next) => { //middleware
  if(!req.body.name || !req.body.price){
    return res.status(400).json({//400 is bad request
      status : "fail",
      message : "Name or price is missing"
    });
  }
  next();
}
exports.getAllTour = (req, res) => {
  console.log(req.requestTime);
  //this cod will run inside event loop, so blocking code could not be here, it should be written above
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
  //status can be success fail or error
  //data is enveloped to provide abstraction and mismanagement
  //To mentain hoe much data we are sending we sent length
};
exports.getTour = (req, res) => {
  //reading url variable using :variable_name
  console.log(req.params); //req.params stores all varaible and parameters that we define
  //uisng :var? we create optional parameters, which user may or may not pass
  const id = req.params.id * 1; //converting dtring id into number
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  //console.log(req.body); //body will come as json since we set middleware as json
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); //merge two object and create new object
  //req.body.id = id will mutate body object we don't want it. That is why we create new object by merging them.
  tours.push(newTour);
  //non blocking async file write
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //201 -- created new DB object
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<updated tour>",
    },
  });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({
    //204 indicates that content is no more, delete code
    status: "success",
    data: null,
  });
};
