//Reading file within file using non blocking code
const fs = require("fs");
fs.readFile("./text.txt","utf-8",(err,data)=>{
    //callback function
    if(err) throw err;
    console.log(data);
});
console.log("Will read file!");
