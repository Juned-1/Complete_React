import { useState, useEffect } from "react";
let globalState = {}; //this global variable does not get created when every component consume useStore custom hook, it created once, and updated again again using useState and other hook
let listeners = []; //This is what allows us to share data between all files in our project
let actions = {}; //Earlier we shared logic using custom hook, now we will share logic and data

export const useStore = (shouldListen = true) => {
  //should listen is used for customization of state, for dispatch we don't need to set listener
  //only for when listener is needed, rebuild when listener is registered
  const setState = useState(globalState)[1];
  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };
    for (let listener of listeners) {
      listener(globalState);
    }
  };
  useEffect(() => {
    //whenever user use our hook, get updated then only useEffect pdated listener
    //with empty array as dependency, it will run only when component mounts
    if (shouldListen) {
      listeners.push(setState);
    }
    //we provide cleaner function, so that it clear when component is unmound
    return () => {
      if (shouldListen) {
        listeners = listeners.filter((li) => li !== setState);
      }
    };
  }, [setState,shouldListen]); //react gurantees its state only run once, so it will only run once, rendered once, that is why adding internal state as depenedency to useEffect as same as not adding
  //we can ommit this if we use array destructuring syntax from useState, react can automatically find this dpenedency, since we have not use array destructuring , we will keep this explicitly tell react
  //Although it(will never re-run) have no Effect even, it is still mount and unmount once in a component
  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
