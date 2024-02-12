const dotenv = require(`dotenv`);
const mongoose = require('mongoose');
const fs = require("fs");
const Tour = require("../../model/tourModel");
const User = require("../../model/userModel");
const Review = require("../../model/reviewModel");
dotenv.config({ path: `../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
//opetions are passed to overcome deprecation warning
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false
  })
  .then((con) => {
    //console.log(con.connection);
    console.log('Connection successful!');
  });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

//import data into database
const importData = async () => {
    try{
        await User.create(users, {validateBeforeSave: false});
        await Tour.create(tours);
        await Review.create(reviews);
        console.log("Data is inserted successfully");
        process.exit();
    }catch(err){
        console.log(err);
    }
}

//DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
    try{
        await Tour.deleteMany(); //deleting all document
        await User.deleteMany(); //deleting all document
        await Review.deleteMany(); //deleting all document

        console.log("Deletion successful");
        process.exit();
    }catch(err){
        console.log(err);
    }
}
if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}else{
    console.log("Invalid argument. pass either --delete or --import")
}
//console.log(process.argv);
//we can provide argument in js usign arg after name of file
//node import-dev-data.js --hello, the third command line argument will be --hello 