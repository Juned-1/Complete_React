import React, { createContext, useState } from "react";
import Todo from "../models/todos";
type todosContextObj = {
  items: Todo[];
  addTodo: (text : string) => void;
  removeTodo: (id: string) => void;
};
export const TodosContext = createContext<todosContextObj>({
  items: [],
  addTodo: (text : string) => {},
  removeTodo: (id: string) => {},
});

const TodosContextProvider: React.FC<{children : React.ReactNode}> = (props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodoHandler = (todoText: string) => {
    const newTodo = new Todo(todoText);
    setTodos((prevTodos) => {
      return prevTodos.concat(newTodo);
    });
  };
  const removeTodoHandler = (todoId: string) => {
    setTodos((prevTodo) => {
      return prevTodo.filter((todo) => todo.id !== todoId);
    });
  };
  const contextValue: todosContextObj= {
    items: todos,
    addTodo: addTodoHandler,
    removeTodo: removeTodoHandler,
  };
  return (
    <TodosContext.Provider value={contextValue}>
      {props.children}
    </TodosContext.Provider>
  );
};
export default TodosContextProvider;