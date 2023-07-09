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
    <div className="App">
      <AddUser onAddUser = {addUserHandler} />
      <UsersList users = {userList}/>
    </div>
  );
}

export default App;
