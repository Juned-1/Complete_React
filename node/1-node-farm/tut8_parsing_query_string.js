const fs = require("fs");
const http = require('http');
const url = require('url'); //required for routing

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`,"utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`,"utf-8");
const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html`,"utf-8");

const replaceTemplate = (temp,product)=> {
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName); /*we are using regular expression instead of quotation mark, since there can be multiple instances of PRODUCTNAME and we want all of them to be replaced by g global flag.*/
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);
    if(!product.organic){output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');}
    return output;
}

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

//quer is searched using page?id=anything