const redux = require("redux");

//reducer function
const counterReducer = (state = { counter: 0 }, action) => {
  //for first time when reducer is created it does not have value so we provie a default value
  if (action.type === "increment") {
    return {
      counter: state.counter + 1,
    };
  }
  if (action.type === "decrement") {
    return {
      counter: state.counter - 1,
    };
  }
  return state;
};
const store = redux.createStore(counterReducer); //take reducer as argument
//console.log(store.getState());
//subsciber
const counterSubscriber = () => {
  const latestState = store.getState();
  console.log(latestState);
};

//subscribing on store
store.subscribe(counterSubscriber);

//action of redux
store.dispatch({ type: "increment" });
store.dispatch({ type : 'decrement' });