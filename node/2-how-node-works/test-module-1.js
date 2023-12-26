// class Calculator{
//     add(a, b){return a+b;}
//     multiply(a,b){return a*b;}
//     divide(a,b){return a/b;}
// }
// module.exports = Calculator;
//we use module.exports when we use one single value to be exported.
module.exports = class {
    add(a, b){return a+b;}
    multiply(a,b){return a*b;}
    divide(a,b){return a/b;}
}