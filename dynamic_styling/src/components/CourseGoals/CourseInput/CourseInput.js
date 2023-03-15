import React, { useState } from 'react';
//import styled from 'styled-components';
import Button from '../../UI/Button/Button';
import styles from './CourseInput.module.css';

/*const FormControl = styled.div`
  margin: 0.5rem 0;

& label {
  font-weight: bold;
  display: block;
  color: ${props => (props.invalid ? 'red' : 'black')};
  margin-bottom: 0.5rem;
}

& input {
  display: block;
  width: 100%;
  border: 1px solid ${props => (props.invalid ? 'red' : '#ccc')};
  background: ${props => (props.invalid ? '#e19999' : 'transparent')};
  font: inherit;
  line-height: 1.5rem;
  padding: 0 0.25rem;
}

& input:focus {
  outline: none;
  background: #fad0ec;
  border-color: #8b005d;
}

`;*/

const CourseInput = props => {
  const [enteredValue, setEnteredValue] = useState('');
  const [isValid,setIsValid] = useState(true);
  const goalInputChangeHandler = event => {
    if(event.target.value.trim().length > 0){
      setIsValid(true);
    }
    setEnteredValue(event.target.value);
  };

  const formSubmitHandler = event => {
    event.preventDefault();
    if(enteredValue.trim().length === 0){
      setIsValid(false);
      return;
    }
    props.onAddGoal(enteredValue);
  };

  return (
    <form onSubmit={formSubmitHandler}>
      {/*<FormControl invalid={!isValid}>*/}
      <div className={`${styles['form-control']} ${!isValid && styles.invalid}`}>
        <label >Course Goal</label>
        <input type="text" onChange={goalInputChangeHandler} />
      </div>
      {/*</FormControl>*/}
      <Button type="submit">Add Goal</Button>
    </form>
  );
};

export default CourseInput;

//adding invalid class dynamically to add styling conditinally without inline styling
//Add content between the string
//Calling the css class dynamically using {} in className
/*In large application one css class can be used manytime (like form control) where many developer
working togther and it can affect other component, since css is not bounded to this scope only
There are two approach to avoid them
1. using styled component package --official web [styled-component.com]
styled component only apply style to that component where it is styled, not other
npm i styled-components --install style component in node module
Now we will design our <div> with it. <FormControl className={ !isValid && 'invalid'}> is one type of passing
condtional class anothetr is passing props to FormControl (invalid props)
2.We can use CSS Module : To keep css module separate and clean -- officail doc [https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/]
Now we will design our button with it
*/