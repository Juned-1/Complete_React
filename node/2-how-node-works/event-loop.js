const fs = require("fs"); //require module second - 2nd
const crypto = require("crypto");
const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 3; // manually setting thread pool size
setTimeout(() => console.log("Timer 1 finished"), 0); //-- do not go into event loop
setImmediate(() => console.log("Immediate 1 finished")); //-- do not go into event loop
fs.readFile("test.txt", () => {
    console.log("I/O finished");
    console.log("-------------------");
    //putting settime and set immediate inside a callback then it follow event loop order
    //If it is outside callback then it does not go inside event loop
    setTimeout(() => console.log("Timer 2 finished"), 0); //3rd
    setTimeout(() => console.log("Timer 3 finished"), 3000); //4th
    setImmediate(() => console.log("Immediate 2 finished")); //6th

    process.nextTick(() => console.log("Process.nextTick")); //nextTick happen before next phase, not before next entire Tick(loop)

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {//this code are async -- if we make it sync it will block event loop
        console.log(Date.now() - start,"Password encrypted");
    }); //this will be offloaded to thread pool by event loop
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start,"Password encrypted");
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start,"Password encrypted");
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start,"Password encrypted");
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start,"Password encrypted");
    });
}); //5th

console.log("Hello from the top level code"); //execute first - 1st
/*If queue of I/O callback is empty then we have no I/O callback, all we have 
is timer . Then event loop will wait until the timer expires. And if we setImmediate,
immediate callback after polling phase and even before expire timer. */

/*SetImmediate runs once per tick, but next tick before next phase of current tick(loop),
not before next tick(loop) */