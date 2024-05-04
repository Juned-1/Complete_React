import { useRef, useState } from "react";
import ResultModal from "./ResultModal.jsx";
//let timer -- that can not be used because this timer variable will be shared as global variable between all instance or TimerChallenge component
export default function TimerChallenge({ title, targetTime }) {
  const [ remainingTime, setRemainingTime ] = useState(targetTime * 1000);
  const timerActive = remainingTime > 0 && remainingTime < targetTime * 1000;
  //the variable timer will be created when timer started and stopped with re evaluation of component, since we update timerStarted state in handleStart
  //let timer;
  const timer = useRef(); //timer has no direct impact on UI, hence aprropriate Ref
  const dialog = useRef();
  if(remainingTime <= 0){
    clearInterval(timer.current);
    dialog.current.open();
  }
  function handleResetTime(){
    setRemainingTime(targetTime * 1000); //if set state without condition, it will create infinite loop. And component will keep reloading.
  }
  function handleStart() {
    timer.current = setInterval(() => {
      setRemainingTime(prevTimeRemaining => prevTimeRemaining - 10);
    }, 10); //each 10 ms this function will run
  }
  function handleStop() {
    clearInterval(timer.current);
    dialog.current.open();
  }
  return (
    <>
      <ResultModal ref={dialog} targetTime={targetTime} remainingTime={remainingTime} onReset={handleResetTime} />
      <section className="challenge">
        <h2>{title}</h2>
        <p className="challenge-time">
          {targetTime} second{targetTime > 1 ? "s" : ""}
        </p>
        <p>
          <button onClick={timerActive ? handleStop : handleStart}>
            {timerActive ? "Stop" : "Start"} Challenge
          </button>
        </p>
        <p className={timerActive ? "active" : undefined}>
          {timerActive ? "Time is running..." : "Timer inacative"}
        </p>
      </section>
    </>
  );
}
