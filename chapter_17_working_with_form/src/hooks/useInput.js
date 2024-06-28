import { useState } from "react";
export function useInput(defaultValue, validationFn) {
  const [enteredvalue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);
  const valuesIsValid = validationFn(enteredvalue);
  function handleInputBlur() {
    setDidEdit(true);
  }
  function handleInputChange(event) {
    setEnteredValue(event.target.value);
    setDidEdit(false);
  }
  return {
    value : enteredvalue,
    handleInputChange,
    handleInputBlur,
    hasError : didEdit && !valuesIsValid
  }
}
