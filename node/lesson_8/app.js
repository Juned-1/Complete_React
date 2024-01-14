const express = require("express");

const morgan = require("morgan");
const app = express();
const tourRouters = require("./routes/tourRoutes");
const userRouters = require("./routes/userRoutes");
//1. MIDDLEWARE
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev")); //morgan is third party middleware
}
//express.json() is middleware
app.use(express.json()); //this middlle ware is required to get data from body of request object in json format
//creating our own middleware
//serving static file using express middleware
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log("This is our middleware");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// app.get("/", (req,res) => {
//     //res.status(200).send("Hello from the server side!");
//     res.status(200).json({message : "Hello from the server side!", app : "Natours"});

// });



//3. ROUTE

//app.get("/api/v1/tours", getAllTour);
//get specific tours -- accessing url parameter
//app.get("/api/v1/tours/:id/:x?/:y?", getTour);

//adding new data using post
//app.post("/api/v1/tours", createTour);
//app.patch("/api/v1/tours/:id", updateTour);
//app.delete("/api/v1/tours/:id", deleteTour);


/*app.use((req,res,next) => {//if we request above api, then this middleware is not called because by that time request-response cycle is over
    //Below route hit this middleware, because it comes in between request response cycle
    //Therefore order of middleware is important
    //That is why we define global middleware whcih execute for all api end point
    console.log("This is our middleware");
    next();
});*/


//4. MOUNTING Routers -- comes after route definition
//using tour Routers as middleware
app.use("/api/v1/tours",tourRouters); //mounting a new router on a route - mounting router
app.use("/api/v1/users",userRouters);
module.exports = app;