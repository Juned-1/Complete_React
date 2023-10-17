/*synchronous code is also called blocking code. Because it generally block execution
of rest of the code until it finish synchronous operation(reading or writing code)
Asynchronous -- non blocking

Node JS is single threaded system : all application executing is through one thread to
machine which can be problematic for synchronous system

Asynchronous function does heavy operation at background until finish operation
and we register a callback function to be called once the data is available
and in the mean time all other user can perform task in single thread,
once data is being read callback function is called in thread.

In contrast to node js php create one new thread for each user. But single thread
is best way to make highly performable application

If we continue to call back on call back it create call back hell. To avoid call
back we use ES6 promises */

//non blocking asynchronous way
const fs = require("fs");
fs.readFile("./text.txt","utf-8",(err,data1)=>{
    //callback function
    if(err) throw err;
    fs.readFile(data1,"utf-8",(err,data2)=>{
        //callback function
        if(err) throw err;
        console.log(data2);
        fs.readFile("./append.txt","utf-8",(err,data3)=>{
            //callback function
            if(err) throw err;
            console.log(data3);
            //async write
            fs.writeFile("./final.txt",`${data1}\n${data2}\n${data3}`,"utf-8",err => {
                if(err) throw err;
                console.log("File have been written");
            })
        });
    });
});
console.log("Will read file!");
