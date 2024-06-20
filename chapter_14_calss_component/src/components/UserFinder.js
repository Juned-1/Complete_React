import { Fragment, Component } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Users from "./Users";
import classes from "./UserFinder.module.css";
import UsersContext from "../store/users-context";
class UserFinder extends Component {
  static contextType = UsersContext;
  //static value can be set only once and if there are two context need to be consumed this will not work, instead we have to work with <UserContext.Consumer></UserContext.Consumer> wrapped around our component which is to be consume it
  constructor() {
    super();
    this.state = {
      filteredUsers: [],
      searchTerm: "",
    };
  }
  componentDidMount() {
    //get called when the app execute and render for first time
    //send http request
    this.setState({ filteredUsers: this.context.users });
  }
  componentDidUpdate(prevProps, prevState) {
    //get called whenever this component is re-evaluated, because it is stage change for example
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.setState({
        filteredUsers: this.context.users.filter((user) =>
          user.name.includes(this.state.searchTerm)
        ),
      });
    }

    //but this can create infinite loop since everytime component execute it update filterUsers and every time filterUsers state updated, component is executed again.
    //To prevent this --use last props and last state snapshot before the current component change
  }
  searchChangeHandler(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    return (
      <Fragment>
        <div className={classes.finder}>
          <input type="search" onChange={this.searchChangeHandler.bind(this)} />
        </div>
        <ErrorBoundary>
          <Users users={this.state.filteredUsers} />
        </ErrorBoundary>
      </Fragment>
    );
  }
}
// const UserFinder = () => {
//   const [filteredUsers, setFilteredUsers] = useState(DUMMY_USERS);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     setFilteredUsers(
//       DUMMY_USERS.filter((user) => user.name.includes(searchTerm))
//     );
//   }, [searchTerm]);

//   const searchChangeHandler = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <Fragment>
//       <div className={classes.finder}>
//         <input type="search" onChange={searchChangeHandler} />
//       </div>
//       <Users users={filteredUsers} />
//     </Fragment>
//   );
// };

export default UserFinder;
