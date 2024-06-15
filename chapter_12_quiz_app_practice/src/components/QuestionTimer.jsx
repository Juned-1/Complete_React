import { useEffect, useState } from "react";
function QuestionTimer({ timeout, onTimeout, mode }) {
  const [remainingTime, setRemainingTime] = useState(timeout);
  //setTimeout(onTimeout, timeout); //onTimout function will be called by browser once timout
  //It is side effect but it is not impacting any state yet, no component re-execution, so no danger of infinite loop, hence useEffect is not used.

  useEffect(() => {
    console.log("SETTING TIMEOUT");
    const timer = setTimeout(onTimeout, timeout);
    //clean up function
    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeout]);

  useEffect(() => {
    console.log("SETTING INTERVAL");
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100);
    }, 100);

    //clean up function -- run by react when componet is re-executed or component is unmounted from the dom
    return () => {
      clearInterval(interval);
    };
  }, []); //now due to time interval state upadte and component re-executed and hence setTime get re-created, so now we have to put it in useEffect

  return (
    <progress
      id="question-time"
      max={timeout}
      value={remainingTime}
      className={mode}
    />
  );
}

export default QuestionTimer;
