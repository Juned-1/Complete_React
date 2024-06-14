import { useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";
const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  //Delete confirm is always rendered iniside html and inside Modal so it is just not visible
  //So it can always call onConfirm after every 3 seconds and it will keep deleting set places
  //we can resolve it using conditional render of delete components
  //but it still after calling delete on open is true, timer will still run for 3 seconds
  //and after 3 seconds it will try to delete the deleted places if we confirm deletion before 3 seconds is expired
  //and even if we click no on delete it still will delete after 3 seconds
  //timer will continue even after deletion component is disappered
  //so this code is also a side effect since it is not directly related to JSX of delete components
  useEffect(() => {
    console.log("TIMER IS SET");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);
    return () => {
      console.log("Cleaning up timer");
      clearTimeout(timer); //this will stop timer whenever this component is removed from dom
    };
  }, [onConfirm]);
  // setTimeout(() => {
  //   onConfirm();
  // },3000);
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
