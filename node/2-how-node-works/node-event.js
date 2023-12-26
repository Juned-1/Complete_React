const EventEmitter = require("events");
const http = require("http");

//////////Example 1
//const myEmmiter = new EventEmitter();

//event emitter emits named event and we can subscribe to those events, listen to them and then react accordingly
class Sales extends EventEmitter{
    constructor(){
        super();
    }
    
}
//inetrnally http , file system all  of them inherit from event emitter class ineternally
const myEmmiter = new Sales();

myEmmiter.on("newSale", () => { //on is observer of the emitted event
    console.log("There was a new sale");
});
//for a event emitter we can set multiple event listener
myEmmiter.on("newSale", () => {
    console.log("Customer name is Junaid");
});
myEmmiter.on("newSale",stock => {
    console.log(`There are now ${stock} item left in the stock`);
})
//If there are more than one event listenere or observer they executed in order as they are written in program
myEmmiter.emit("newSale",9); //passing argument to event emitter


/////////Example 2
const server = http.createServer();

server.on("request",(req,res) => {
    console.log("Request received!");
    console.log(req.url);
    res.end("Response received!");
}) //using on event we are listening to request event

server.on("request",(req,res) => {
    console.log("Another request!");
});

server.on("close", () => {
    console.log("closed server");
});

server.listen(8000, "127.0.0.1", () => {
    console.log("waiting for request.......");
})