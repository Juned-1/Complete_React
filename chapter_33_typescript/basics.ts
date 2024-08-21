//primitive: number, string, boolean, null, undefined
//More complex types: arrays, objects
//Function types, parameters

//primitive
//Number is Number object, number is primitive
let age : number;
age = 24;

let userName : string = 'Myra';

let isLearner : boolean;

isLearner = true;

//let hobbies : null;

//hobbies = 12

//More complex type

//array;
let hobbies : string[];
hobbies = ['Sports', 'Cooking'];

//if no type is assigned, then typescript allow any value assigned to it, and by default consider first value type as variable's type
let person; //this is any type --it is fallback type
person = {
    name : 'Myra',
    age : 32
}

//explicit object type
let p : {
    name : string,
    age : number
};

p = {
    name : 'Myra',
    age : 45
};

// p = {
//     name : 'abc'
// }

//array of object

let people : {
    name : string,
    dob : Date,
}[];

//type inference -- type of value is infered and added to varaible
let course = "Typescript"; //string type is added to course

//course = 23; //wrong

//union type -- allows more than one type
let value : string | number = 'hello';
value = 25;

type Person = {
    name : string,
    dob : Date
};

let p1 : Person;

let groupOfPerope : Person[];

//Function & type

function add(a : number, b : number){
    //inferred return type of function is number
    return a+b;
}

function Add(a : number, b : number) : number | string{
    return a+b
}

function printOutput(value : any){
    //special return type void since it is not returning
    console.log(value);
}

//diving into generics -- if  we want return value of same type as input to function we use generic
//generic give both type safety and flexibility
function insertAtBeginning<T>(arr : T[], value : T){
    const updatedArray = [value, ...arr];
    return updatedArray;
}

const demoArray = [1,2,3];
const updatedArray = insertAtBeginning(demoArray,-1);

const stringArray = insertAtBeginning(['1','2','3'],'-1');

//updatedArray[0].split();
