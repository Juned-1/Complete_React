import { useState } from "react";

import Counter from "./components/Counter/Counter.jsx";
import Header from "./components/Header.jsx";
import { log } from "./log.js";
import CounterConfigure from "./components/Counter/CounterConfigure.jsx";

function App() {
  log("<App /> rendered");

  const [chosenCount, setChosenCount] = useState(0);

  function handleSetClick(enteredNumber) {
    //batching state update
    setChosenCount(enteredNumber);
    //console.log(chosenCount); -- give output previous state -- won't work
    //if 10 is entered and set as chosenCount from user side
    //setChosenCount(chosenCount + 1); -- add 1 to previous unupdated value 1 + 0 = 1
    setChosenCount((prevChosenCount) => prevChosenCount + 1); //alawys works on new updated state 1 + 10 = 11, since states are scheduled and executed in order they are executed
  }

  return (
    <>
      <Header />
      <main>
        <CounterConfigure onSet={handleSetClick} />
        <Counter key={chosenCount} initialCount={chosenCount} />
        <Counter initialCount={0} />
      </main>
    </>
  );
}

export default App;
