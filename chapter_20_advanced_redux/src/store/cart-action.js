//Thung
import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";
const url = "firebase-realtime-db-url/cart.json"; //db-url/node-name
export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        url
      );
      if (!response.ok) {
        throw new Error("Could not fetch cart data!");
      }
      const data = await response.json();

      return data;
    };
    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart({
        items : cartData.items || [],
        totalQuantity : cartData.totalQuantity
      }));
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching cart data failed!",
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  //we can create an action creator that returns another function
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    ); //but before dispatch we can call any side effect where we have not reached yet in dispatch
    const sendeRequest = async () => {
      const response = await fetch(
        url,
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      ); //PUT method override existing data and post method generally add incoming data, not override
      if (!response.ok) {
        throw new Error("Sending cart data failed!");
      }
    };
    try {
      await sendeRequest();
      dispatch(
        uiActions.showNotification({
          status: "succcess",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    }
  };
};
