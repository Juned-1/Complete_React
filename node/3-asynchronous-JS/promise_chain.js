//promise consuming or resolving using then
//The resulting promise may not always be succcessful. It can have error.
//That is why a promise is rseolved using then and if error happen promise is rejected
//then only handle fulfilled promises. and if error happen it is handled by catch method

const fs = require("fs");
const superagent = require("superagent");

const readFilePromise = (file) => {
  //promisifying or creating promise
  //promise constructor takes an executor function --this function takes two argument resolve and reject
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find the file 👎"); //whateve error we pass here will be available in the catch method later
      resolve(data); //whatever variable we pass in resolve method that will be available later in then method to handle resolve method
      //value returned by promise to us
    });
  });
};
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    //resolve and reject are standard name, we can call them whatever we want
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write the file 👎");
      resolve("succes");
    });
  });
};

readFilePromise(`${__dirname}/dog.txt`)
  .then((result) => {
    console.log(`Breed : ${result}`);
    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
  })
  .then((res) => {
    //resolving promise
    console.log(res.body.message);
    return writeFilePromise(`${__dirname}/dog-image.txt`, res.body.message); //by returning promise after promise we can chain the promise using then
  })
  .then(() => {
    console.log("Random dog image is saved to file!");
  })
  .catch((err) => {
    console.log(err);
  });
//With one single catch handle we can manage all errors, just then need to be chained to perform different operation from different returned promise
//These returned promises is chained using then. This create flatten structure of chain
//And avoid triangular call back hell
//This is more easy to manage
//drawback : still so much chain
//It can be simplified using async await promises.