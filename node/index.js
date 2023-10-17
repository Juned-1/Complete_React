//In node Js every single file is treated as module

const fs = require("fs");
const http = require('http');
const url = require('url'); //required for routing
const replaceTemplate = require('./module/replaceTemplate'); //importing our module
const slugify = requir("slugify"); //importing third party module -- automatically serach inside node_modules folder

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`,"utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`,"utf-8");
const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html`,"utf-8");



const server = http.createServer((req, res) => {
    
    const {query, pathname} = url.parse(req.url,true);
    if(pathname === '/overview'){
        res.writeHead(200,{'Content-type' : 'text/html'});
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join(''); //map return an array of element, but we want a complete html string so we element by empty string
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);
        res.end(output);
    }else if(pathname === '/product'){
        
        const product = dataObj[query.id];
        res.writeHead(200,{'Content-type' : 'text/html'});
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    }else if(pathname === '/api'){
        res.writeHead(200,{'Content-type' : 'application/json'}); //200 success code application/json is type of content
        res.end(data);
    }else if(pathname === '/'){
        res.end("Hello from the server!");
    }else{
        res.writeHead(404,{
            'content-type' : 'text/html',
            'my-own-header' : "Hello world",
        });
        res.end("<h1>Page is not found</h1>");
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
});
