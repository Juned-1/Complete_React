import './NewExpense.css';
import ExpenseForm from './ExpenseForm';
import {useState} from 'react';
const NewExpense = (props) => {
    const saveExpenseData = enteredExpenseData =>{
        const expenseData = {
            ...enteredExpenseData,
            id : Math.random().toString()
        }
        props.onAddExpense(expenseData);
    };
    const [editing,setEditing] = useState(false);

    const startEditing = () => {
        setEditing(true);
    }
    const stopEditing = () =>{
        setEditing(false);
    }
    return <div className = 'new-expense'>
        {!editing && <button type='button' onClick = {startEditing}>Add New Expense</button>}
        {editing && <ExpenseForm onSaveExpenseData = {saveExpenseData} onCancel = {stopEditing}/>}
    </div>
}
export default NewExpense;
//for upwrad communication -children to parent create method inside children and call it in childre by passing
//data which we want to set
//onSaveExpense is our props, not  system genereated props unlike onChnage,onClick etc.