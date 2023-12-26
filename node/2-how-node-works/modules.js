//console.log(arguments); //arguments is an array of all values we pass to javascript
//5 function of arguments
//1st export
//2nd -- require,
//3rd -- Module
//4th -- fileName
//5th -- dirName
//console.log(require("module").wrapper);

//module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(4,5));

//exports
//const calc2 = require('./test-module-2'); //contain an object of all the named exports
//console.log(calc2.add(4,5));
//since it is object of exports, we can use ES6 destructuring
const {add, multiply} = require("./test-module-2");
console.log(add(4,5));

//caching
require("./test-module-3")();//load and execute
require("./test-module-3")();//cache
require("./test-module-3")();//cache
//print hello from module once because this module executed only once, when first time required, later 2 times module code is called from node processor's cache
