//importing external module or requiring module

//opening file module
fs = require("fs");
const textInput = fs.readFileSync('./lorem.txt','utf-8'); //file path and encoding scheme
console.log(textInput)
txetOutput = `This is what we know about avocado : ${textInput}.\nCrated on ${Date.now()}`;
fs.writeFileSync('./output.txt',txetOutput);
console.log("File has been written");

const hello = "Hello World";
console.log(hello);