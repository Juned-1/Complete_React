//unlike vanila JS we don't have to define variable in constructor, we can directly do it
class Todo {
    id : string;
    text : string;
    constructor(todoText : string){
        this.text = todoText;
        this.id = new Date().toISOString();
    }
}

export default Todo;