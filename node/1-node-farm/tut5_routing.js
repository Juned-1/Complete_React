const http = require('http');
const url = require('url'); //required for routing
const server = http.createServer((req, res) => {
    //console.log(req.url);
    const pathName = req.url;
    if(pathName === '/overview'){
        res.end("This is the overiview");
    }else if(pathName === '/product'){
        res.end("This is product");
    }else if(pathName === '/'){
        res.end("Hello from the server!");
    }else{
        res.writeHead(404,{
            'content-type' : 'text/html',
            'my-own-header' : "Hello world",
        }); //passing 404 and header as an object -- inspect 404 in development tool
        //status code and header always need to be set up before response message
        res.end("<h1>Page is not found</h1>"); //handing if none of routing path match
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
});