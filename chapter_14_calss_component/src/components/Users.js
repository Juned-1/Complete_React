import { Component } from "react";
import User from "./User";

import classes from "./Users.module.css";

class Users extends Component {
  //to define state we initialize it inside constructor -- constructor extecuted when instance of class is executed
  constructor() {
    super();
    //with calss based component state always is state
    this.state = {
      showUsers: true,
      moreState: "Test",
      //nested : {},
      //data : []
    };
  }
  componentDidUpdate(){
    if(this.props.users.length === 0){
      throw new Error('No users provided');
    }
  }
  toggleUsersHandler() {
    //this.state.showUsers = false; //not
    this.setState((curState) => {
      return { showUsers: !curState.showUsers };
    }); //moreState will be kept and showUser will be merged, not override entire state
  }
  render() {
    const usersList = (
      <ul>
        {this.props.users.map((user) => (
          <User key={user.id} name={user.name} />
        ))}
      </ul>
    );
    //we have to make sure that this keyword is this of the surrounding class and that is why we have to bind it in the method
    return (
      <div className={classes.users}>
        <button onClick={this.toggleUsersHandler.bind(this)}>
          {this.state.showUsers ? "Hide" : "Show"} Users
        </button>
        {this.state.showUsers && usersList}
      </div>
    );
  }
}
// const Users = () => {
//   const [showUsers, setShowUsers] = useState(true);

//   const toggleUsersHandler = () => {
//     setShowUsers((curState) => !curState);
//   };

//   const usersList = (
//     <ul>
//       {DUMMY_USERS.map((user) => (
//         <User key={user.id} name={user.name} />
//       ))}
//     </ul>
//   );

//   return (
//     <div className={classes.users}>
//       <button onClick={toggleUsersHandler}>
//         {showUsers ? 'Hide' : 'Show'} Users
//       </button>
//       {showUsers && usersList}
//     </div>
//   );
// };

export default Users;
