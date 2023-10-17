import React from 'react';
import { useContext } from 'react';
import classes from './Navigation.module.css';
import AuthContext from '../../context_store/auth-context';

const Navigation = () => {
  //listening to a context by passing Context Pointer and get context value
  const ctx = useContext(AuthContext);
  return (
    <nav className={classes.nav}>
      <ul>
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Users</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <a href="/">Admin</a>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <button onClick={ctx.onLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
  );
};

export default Navigation;

/*Using hook to to get context and this is efficeint way. */