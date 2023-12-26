const fs = require("fs");
const server = require("http").createServer();

server.on("request",(req,res) => {
    //solution 1 -- node have to load entire file in memory and after it get ready it sends file to http response stream
    //problematic when file is big and a ton of request are coming to server. System will very quickly run out of resources and application will stop
    // fs.readFile("test.txt", (err,data) => {
    //     if(err) console.log(err);
    //     res.end(data);
    // }); //in production ready app we do not do it.

    //solution 2 : stream
    //we do not create variable to store data, we create a stream, each time stream receive a chunk of data it can send it to response.
    /*const readable = fs.createReadStream("testt.txt");
    //each time a readble stream receive data, it emits data event. We can listen to this event or subscribe and then on callback we can send it to http response
    readable.on("data",chunk => {
        res.write(chunk); //write is writable stream of http module -- response is writable stream
    });
    //after finishing readable stream content -- entire we have close response stream of http
    readable.on("end",() => {
        res.end(); // no more data will be written to this writable stream
    });
    readable.on("error", (err) => {
        console.log(err);
        res.statusCode = 500;
        res.end("File not found");
    });*/
    //drawback : readable stream is much much faster than than http response stream which actually transfer data through network stream.
    //This problem is called back pressure.

    //Solution 3
    //using pipe operator -- pipe the output of a readable stream to input of writable stream
    //It handle speed of data coming to data going out, in short handle back pressure.
    const readable = fs.createReadStream("test.txt");
    readable.pipe(res); //response is writable stream
    //readableSource.pipe(writableDestination) -- writableDestination can also be duplex or transform stream.
    

});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening on 8000 port");
});