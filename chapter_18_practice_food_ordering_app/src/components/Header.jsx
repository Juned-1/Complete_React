import { useContext } from "react";
import logoImg from "../assets/logo.jpg";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems += item.quantity;
  }, 0); //reduce array to a single number
  //reduce take a function as a first argument and starting value as a second argument (we will set it as 0)
  //This funtion inside reduce receive two argument, first newValue to be derived second argument every item of the array
  //starting value in reducer is first time value for first argument of the function inside reducer
  //simply setting textOnly actually set textOnly={true}

  function handleShowCart() {
    userProgressCtx.showCart();
  }
  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="A logo of restaurant!" />
        <h1>Foodie</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
      </nav>
    </header>
  );
}
