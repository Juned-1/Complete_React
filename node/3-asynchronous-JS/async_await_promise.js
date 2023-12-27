//ES 8 async await is more convenient than promise chain
//consuming async await promise
//async function return promise
const fs = require("fs");
const superagent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find the file 👎");
      resolve(data);
    });
  });
};
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write the file 👎");
      resolve("succes");
    });
  });
};
//async code keep running in background to perform operation while rest of the code keep running in the event loop
//inside we can have one or more await function or promise, we can save returned result into a variable
//async function returns a promise
const getDogPic = async () => {
    //we can handle the error using try catch -- the earlier promise catch method error can be handled using js try-catch
    //If there is an error happen in the try block it immediately exit try block and throw error to catch block
    try{
        const data = await readFilePromise(`${__dirname}/dog.txt`); //await stops the code from running until the promise is resolved
        //It makes our code look like sync code while behind the sceene it looks like async
        console.log(`Breed : ${data}`);
        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);
        await writeFilePromise(`${__dirname}/dog-image.txt`, res.body.message);
        console.log("Random dog image is saved to file!");
    }catch(err){
        console.log(err);
        //throw error marks entire promise to be rejected
        throw(err); //throwing error to handle error, rather than resolve it successfully
    }
    //returning from async function
    return '2 : READY';
}
/*console.log("1 : Getting dog pics"); //run in the main process
//const x = getDogPic(); //Js offload async function in the background
//console.log(x); //async function automatically returns a promise
//To actually access returned value from async method (or promise), we can either await it or use then to resolve it
getDogPic().then(data => { //even after happening error, it still resovle then method, return value
    //To resolve this we have to throw error from the catch block of async function
    //This throw error marks entire function as rejected
    console.log(data);
}).catch(err => {
    console.log("ERROR 👎");
})
console.log("3 : Got dog pics"); //run in main process
*/
//another way to handle returned value from async function other tahn then and catch
//using IIFE with error handling
(async () => { //creating function without name
    try{
        console.log("1 : Getting dog pics");
        const value = await getDogPic();
        console.log(value);
        console.log("3 : Got dog pics");
    }catch(err){
        console.log("ERROR 👎");
    }
})()//calling anynomous function