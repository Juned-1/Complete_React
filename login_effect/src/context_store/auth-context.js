import React, {useState} from 'react';
const AuthContext = React.createContext(
    {
        isLoggedIn : false,
        onLogout : () => {},
        onLogin : (email,password) => {}
    }
);

export const AuthContextProvider = (props) => {
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const logoutHandler = () => {
        setIsLoggedIn(false);
    }
    const loginHandler = () => {
        setIsLoggedIn(true);
    }
    return <AuthContext.Provider value = {
        {isLoggedIn : isLoggedIn,
        onLogout : logoutHandler,
        onLogin : loginHandler}
    }
    >{props.children}</AuthContext.Provider>
} //named export
export default AuthContext; //default export

/*Context return back a component */