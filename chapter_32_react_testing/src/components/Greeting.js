import { useState } from "react";
import Output from "./Output";
export default function Greeting() {
  const [changedText, setChangeText] = useState(false);
  const changeTextHandler = () => {
    setChangeText(true);
  };
  return (
    <div>
      <h2>Hello World!</h2>
      {!changedText && <Output>Is's good to see you!</Output>}
      {changedText && <Output>Changed!</Output>}
      <button onClick={changeTextHandler}>Change Text</button>
    </div>
  );
}
