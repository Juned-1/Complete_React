import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import Notification from "./components/UI/Notification";
import { fetchCartData, sendCartData } from "./store/cart-action";
let isInitial = true; //we set it outside component function so that does not re-execute whenever component function re-execute, this will be initalaized when the file is parsed first time
function App() {
  const cartIsVisible = useSelector((state) => state.ui.cartVisible);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]); //this useEffect only run when app is refresh to only fetch data, no dependency no re-execution
  useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }
    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]); //react redux ensure that dispatch is never created again due to component re-execution, so we could add it as depenedency of useEffect without usecallback
  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}
export default App;
