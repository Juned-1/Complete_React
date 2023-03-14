import {useState} from 'react';
import './ExpenseForm.css'
const ExpenseForm = (props) => {
    const [enteredTitle,setEnteredTitle] = useState('');
    const [enteredAmount,setEnteredAmount] = useState('');
    const [enteredDate,setEnteredDate] = useState('');
    /*const [userInput,setUserInput] = useState({//passing object
        enteredTitle : '',
        enteredAmount : '',
        enteredDate : ''
    });*/
    const titleChangeHandler = (event) =>{
        setEnteredTitle(event.target.value);
        //setUserInput({ //Alternative to individual state
        //    ...userInput, //using spread operator to preserve all value
        //    enteredTitle : event.target.value //overriding the required value
        //});//this apprach depends on sbapshot of previous state, so it is not secure always
        //better version is using arrow function to perform changes
        //setUserInput((prevState) => {return {...prevState,enteredTitle: event.target.value}})
    };
    const amountChangeHandler = event =>{
        setEnteredAmount(event.target.value);
        /*setUserInput({
            ...userInput,
            enteredAmount : event.target.value
        });*/
    };
    const dateChangeHandler = event =>{
        setEnteredDate(event.target.value);
        /*setUserInput({
            ...userInput,
            enteredDate : event.target.value
        });*/
    };
    const submitHandler = (event) =>{
        event.preventDefault();

        const expenseData = {
            title : enteredTitle,
            amount : +enteredAmount,
            date : new Date(enteredDate)
        }
        props.onSaveExpenseData(expenseData);
        setEnteredTitle('');
        setEnteredAmount('');
        setEnteredDate('');
        props.onCancel();
    };
    return <form onSubmit = {submitHandler}>
        <div className = "new-expense__controls">
            <div className = "new-expense__control">
                <label>Title</label>
                <input type = "text" onChange={titleChangeHandler} value = {enteredTitle}/>
            </div>

            <div className = "new-expense__control">
                <label>Amount</label>
                <input type = "number" min="0.01" step="0.01" onChange = {amountChangeHandler} value={enteredAmount}/>

            </div>

            <div className = "new-expense__control">
                <label>Date</label>
                <input type = "date" min="2020-01-01" max="2023-12-31" onChange = {dateChangeHandler} value={enteredDate}/>
            </div>
        </div>

        <div className="new-expense__actions">
            <button type='button' onClick={props.onCancel}>Cancel</button>
            <button type='submit'>Add Expense</button>
        </div>
    </form>
}
export default ExpenseForm;

//value props set back the value inside input element from state, it takes the state and set back
//It seems like an infinite loop but it is not, it just set the values
//We can set value along side th listening. value, onChange are props.