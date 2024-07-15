import { useSelector } from "react-redux";
import Counter from "./components/Counter";
import Header from "./components/Header";
import Auth from "./components/Auth";
import UserProfile from "./components/UserProfile";
function App() {
  const authenticationStatus = useSelector( state => state.auth.isAuthenticated);
  return (
    <>
      <Header />
      {authenticationStatus ? <UserProfile /> : <Auth />}
      <Counter />
    </>
  );
}

export default App;
