const dotenv = require(`dotenv`);
const mongoose = require('mongoose');
const fs = require("fs");
const Tour = require("../../model/tourModel");

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
//import data into database
const importData = async () => {
    try{
        await Tour.create(tours);
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