import { useRef, useContext } from "react";
import classes from "./NewTodo.module.css";
import { TodosContext } from "../store/todo-context";
const NewTodo : React.FC = (props) => {
  const inputTextRef = useRef<HTMLInputElement>(null);
  const todosCtx = useContext(TodosContext);
  const submitFormHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredText = inputTextRef.current!.value; //inputTextRef.current!.value
    if(enteredText.trim().length === 0){
        return;
    }
    todosCtx.addTodo(enteredText);
  };
  return (
    <form onSubmit={submitFormHandler} className={classes.form}>
      <label htmlFor="text">Todo Text</label>
      <input type="text" id="text" ref={inputTextRef} />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
