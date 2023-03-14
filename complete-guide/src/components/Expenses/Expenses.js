import { useState } from "react";
import Card from "../UI/Card";
import "./Expenses.css";
import ExpensesFilter from "./ExpensesFilter";
import ExpensesList from './ExpensesList';
import ExpenseChart from './ExpenseChart';
function Expenses(props) {
  const [option, setOption] = useState("2021"); //statefull components
  const selectFilterHandler = (value) => {
    setOption(value);
  };

  const filteredExpense = props.expenses.filter(expense => expense.date.getFullYear().toString() === option);
  
  return (
    <Card className="expenses">
      <div>
        <ExpensesFilter
          onSelectFilter={selectFilterHandler}
          filteredYear={option}
        />
      </div>
      <ExpenseChart expenses={filteredExpense}/>
      <ExpensesList item = {filteredExpense} />
      {/*
        //transforming expenses object array as array of JSX so that react can render it using custom JS logic
        //React generally create element at end and then move up element to match array value, this is inefficient
        //and many times lead to bug, this scenario is known as key error. To remove such warning we nedd
        //to add unique keys during rendering oject to JSX*/
      }
    </Card>
  );
}

export default Expenses;
