import './App.css';
import AddUser from './component/Users/AddUser';
import UsersList from './component/Users/UsersList';
import { useState } from 'react';
function App() {
  const [userList,setUserList] = useState([]);
  const addUserHandler = (uName, uAge) => {
    setUserList((prevList) => {
      return [...prevList,{name : uName, age : uAge, id : Math.random().toString()}];
    });
  }
  return (
    <>
      <AddUser onAddUser = {addUserHandler} />
      <UsersList users = {userList}/>
    </>
  );
}

export default App;
/*Fregments <> are interanally given erapper where externally mentained div element 
rendering can be reduced using fregments, those div which have no semantic meaning
just existing as to return one lement to render. we can design our own wrapper
const Wrapper = props => {
  return props.children;
} 
export default Wraper

We can write built in fragment like <></> or <React.Fragment></React.Fragment>
or import {Fragment} from 'react';
<Fragment></Fragment> */