import {useState} from 'react';
import './App.css';
import Expenses from './components/Expenses/Expenses';
import NewExpense from './components/NewExpense/NewExpense';
//import React from 'react'; this converts syntax into JSX

//JSX stands for javascript XML
const DUMMY_EXPENSES = [
  {
    id: 'e1',
    title: 'Toilet Paper',
    amount: 94.12,
    date: new Date(2023, 3, 10),
  },
  { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2022, 2, 12) },
  {
    id: 'e3',
    title: 'Car Insurance',
    amount: 294.67,
    date: new Date(2023, 3, 28),
  },
  {
    id: 'e4',
    title: 'New Desk (Wooden)',
    amount: 450,
    date: new Date(2021, 5, 12),
  },
];
function App() {
  /*return React.createElement('div',
    {},
    React.createElement('h2',{},'Let\'s get started'),
    React.createElement(Expenses, {items : expenses})
  );*/

  const[expenses,setExpenses] = useState(DUMMY_EXPENSES);

  const addExpenseHandler = expense =>{
    setExpenses((prevState) => {
      //using lamda function rather directly expanding array to new array is good practice
      //since  directly spreading might not work in some cases where updating onject or array is based previous snashot
      return [expense, ...prevState];
    });
  };
  return (
    <div className="App">
      <NewExpense onAddExpense = {addExpenseHandler}/>
      <Expenses expenses={expenses} />
    </div>
  );
}

export default App;

//if we just use variable nothing update in react, since it is not re-evaluated after parsing
//But if we use state, the particular component to which a state is attached is re evaluated