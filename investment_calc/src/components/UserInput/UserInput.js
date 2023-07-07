import {useState} from 'react';
import classes from './UserInput.module.css';
const initialUserInput = {
  'current-savings' : 10000,
  'yearly-contribution': 2000,
  'expected-return' : 7,
  'duration' : 10
};
const UserInput = (props) => {
    const [userInput,setUserInput] = useState(initialUserInput);
    const submitHandler = (event) => {
      event.preventDefault(); /*preventing browser default behavior -- 
      browser by drault load page again after form submission but we do not want this. -- 
      Instead we want javascript to load and execute*/
      props.onCalculate(userInput);
      
    };
    const resetHandler = (event) => {
        setUserInput(initialUserInput);
    };
    const inputChangeHandler = (input, value) => {
      /*input here we rae taking from user as id (identifer) */
      setUserInput((prevInput) => {
        return{
            ...prevInput,
            [input] : +value, /* + convert string into numbers */
        };
      });
    };
    return(
      <form onSubmit = {submitHandler} className={classes.form}>
        <div className={classes['input-group']}>
          <p>
            <label htmlFor="current-savings">Current Savings ($)</label>
            <input onChange = {(event)=> inputChangeHandler('current-savings',event.target.value)} type="number" id="current-savings" value = {userInput['current-savings']}/>
          </p>
          <p>
            <label htmlFor="yearly-contribution">Yearly Savings ($)</label>
            <input onChange = {(event)=> inputChangeHandler('yearly-contribution',event.target.value)} type="number" id="yearly-contribution" value = {userInput['yearly-contribution']}/>
          </p>
        </div>
        <div className={classes['input-group']}>
          <p>
            <label htmlFor="expected-return">
              Expected Interest (%, per year)
            </label>
            <input onChange = {(event)=> inputChangeHandler('expected-return',event.target.value)} type="number" id="expected-return" value={userInput['expected-return']}/>
          </p>
          <p>
            <label htmlFor="duration">Investment Duration (years)</label>
            <input onChange = {(event)=> inputChangeHandler('duration',event.target.value)} type="number" id="duration" value={userInput['duration']}/>
          </p>
        </div>
        <p className={classes.actions}>
          <button onClick = {resetHandler} type="reset" className={classes.buttonAlt}>
            Reset
          </button>
          <button type="submit" className={classes.button}>
            Calculate
          </button>
        </p>
      </form>
    );
};
export default UserInput;