import React from 'react';
import Card from '../UI/Card';
import classes from './AddUser.module.css';
import Button from '../UI/Button';
import { useState } from 'react';
import ErrorModal from '../UI/ErrorModal';
const AddUser = (props) => {
    const [enteredUserName,setUserName] = useState('');
    const [enteredAge,setAge] = useState('');
    const [error,setError] = useState();
    const addUserHandler = (event) => {
        event.preventDefault();
        if(enteredUserName.trim().length === 0 || enteredAge.trim().length === 0){
            setError({
                title : 'Inavlid Input',
                message : 'Please Enter a valid Name and age (non empty values)',
            });
            return;
        }
        if(+enteredAge < 1){
            setError({
                title : 'Inavlid Input',
                message : 'Please Enter a valid Age (> 0)',
            });
            return;
        }
        props.onAddUser(enteredUserName,enteredAge);
        setUserName('');
        setAge('');
    }
    const userNameChangeHandler = (event) =>{
        setUserName(event.target.value);
    }
    const ageChangeHandler = (event) =>{
        setAge(event.target.value);
    }
    const errorHandler = () => {
        setError(null);
    }
    return(
        <div>
            {error && <ErrorModal title = {error.title} message = {error.message} onConfirm = {errorHandler}/>}
            <Card className = {classes.input}>
                <form onSubmit = {addUserHandler}>
                    <label htmlFor="username">User Name</label>
                    <input type="text" id = "username" onChange={userNameChangeHandler} value={enteredUserName}/>
                    <label htmlFor="age">Age (Year)</label>
                    <input type="number" id = "age" onChange={ageChangeHandler} value={enteredAge}/>
                    <Button type = "submit"  onClick = {addUserHandler}>Add User</Button>
                </form>
            </Card>
        </div>
    );
};
export default AddUser;
/* + before variable convert string value into number */