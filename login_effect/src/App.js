import React, { useState, useEffect } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import AuthContext from './context_store/auth-context';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const storedLogedInInfo = localStorage.getItem('isLoggedIn');
    if(storedLogedInInfo === '1'){
      setIsLoggedIn(true);
    }
  },[]);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem('isLoggedIn','1'); //1 to signal user is loged in 0 for not logged in
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <AuthContext.Provider value = {    {
        isLoggedIn : isLoggedIn,
        onLogout : logoutHandler
    }}>
      <MainHeader />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
      </AuthContext.Provider>
    </React.Fragment>
  );
}

export default App;

/*After vrestarting we lose data, since we managed it in state in react. After
restarting all variables value get lost. we after log restart whether the data
is persisted or not. Local storage is browser mechanism built int totally independent
of react which stores values.
Go to developers tool - go to application tab - storage section - Local storage
After expanding we can find host also find the key - value pair. But teh huge 
drawback using locaStorage is we can create infinite loop, it keep sets and run again
and again. That is why we will use useEffect. Since useEffect runs after every
component reevaluation and if the dependencies is changed. So it does not create
infinite loop. If tehre is no depenedencies then this useEffect will run once when
app starts. Data fetching is not related to ui, but is still important use of 
useEffect. We don't need to check performance intensive code to run again and again,
only once for evry component re render cycle*/

/*Provider is property of AuthContext component Now all children of app will have 
access to authcomponent*/