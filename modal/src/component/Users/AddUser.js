import React from 'react';
import Card from '../UI/Card';
import classes from './AddUser.module.css';
import Button from '../UI/Button';
import { useState, useRef } from 'react';
import ErrorModal from '../UI/ErrorModal';
const AddUser = (props) => {
    const nameInputRef = useRef();
    const ageInputRef = useRef();

    const [error,setError] = useState();
    const addUserHandler = (event) => {
        event.preventDefault();
        const enName = nameInputRef.current.value;
        const enAge = ageInputRef.current.value;
        if(enName.trim().length === 0 || enAge.trim().length === 0){
            setError({
                title : 'Inavlid Input',
                message : 'Please Enter a valid Name and age (non empty values)',
            });
            return;
        }
        if(+enAge < 1){
            setError({
                title : 'Inavlid Input',
                message : 'Please Enter a valid Age (> 0)',
            });
            return;
        }
        props.onAddUser(enName,enAge);
        nameInputRef.current.value = '';/*generally we should not use such syntax, because a part of dom to be manipulated using state, not entire dom. but
        for resetting only the values, it quite works as trick*/
        ageInputRef.current.value = '';
    }
    const errorHandler = () => {
        setError(null);
    }
    return(
        <React.Fragment>
            {error && <ErrorModal title = {error.title} message = {error.message} onConfirm = {errorHandler}/>}
            <Card className = {classes.input}>
                <form onSubmit = {addUserHandler}>
                    <label htmlFor="username">User Name</label>
                    <input type="text" id = "username" ref = {nameInputRef}/>
                    <label htmlFor="age">Age (Year)</label>
                    <input type="number" id = "age" ref = {ageInputRef}/>
                    <Button type = "submit"  onClick = {addUserHandler}>Add User</Button>
                </form>
            </Card>
        </React.Fragment>
    );
};
export default AddUser;
/* + before variable convert string value into number */
/*refs allows us to work with other dom element. Example updating value of input using
state hook on every key stroke is redundant. We need updation only before submitting 
form. Here refs can helps us. Use another hook useRef it returnms a vlue and set a
default value. We can connect html with ref using ref props to set value.
Ref store entire dom node which we can manipulate now. Rarely use Ref to manipulate dom, not recommended alwyas, it may bring  tremendous change and brak dom. Use ref
where only want to read a value, not write back. if both read and write require then use state based solution. ref based compnent are called uncontrolled component, since their values are not controlled by react(rather react dom control), and do not feed back the data.
Using state based solution and feeding back input is controlled components, because
their internal state is controlled by react*/