const fs = require("fs");
const http = require('http');
const url = require('url'); //required for routing

/*even though it is synchronous file read still it will only get called once here, 
and create server function get called agian and again when page request is there*/
//__dirname gives where file is located, ./ gives directory where script is running
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
    //console.log(req.url);
    const pathName = req.url;
    if(pathName === '/overview'){
        res.end("This is the overiview");
    }else if(pathName === '/product'){
        res.end("This is product");
    }else if(pathName === '/api'){
        res.writeHead(200,{'Content-type' : 'application/json'}); //200 success code application/json is type of content
        res.end(data);
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