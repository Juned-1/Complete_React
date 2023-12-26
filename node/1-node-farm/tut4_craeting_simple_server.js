const http = require('http');
/*create method accept a call back function whcih receive a request variable and a
 response variable
 Each time a server is called, this callback function will be called.*/
const server = http.createServer((req, res) => {
    //console.log(req);
    res.end("Hello from the server!");
});

/*listen(port,localhost) -- if we do not specify by default it is local host
and as a optional argument we can pass call back function which will be called when
server listen to any call from client*/
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
}) 
