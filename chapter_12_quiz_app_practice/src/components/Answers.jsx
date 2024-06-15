import { useRef } from "react";
function Answers({ answers, selectedAnswer, answerState, onSelect }) {
  const shuffledAnswer = useRef();

  if (!shuffledAnswer.current) {
    //to avoid shuffling answer due to component re-execution after asnswer is selected and css is added and component remount
    shuffledAnswer.current = [...answers];
    shuffledAnswer.current.sort(() => Math.random() - 0.5); //if sort(a,b) return -1 elements will be swaped, if it return 1 then it will not be swaped
    //we don't care about input since we want to shuffle Math.random gives [0-1] and deduction 0.5 will give either -ve or +ve value
  }
  return (
    <ul id="answers">
      {shuffledAnswer.current.map((answer) => {
        const isSelected = selectedAnswer === answer;
        let cssClass = "";
        if (answerState === "answered" && isSelected) {
          cssClass = "selected";
        }
        if (
          (answerState === "correct" || answerState === "wrong") &&
          isSelected
        ) {
          cssClass = answerState;
        }
        return (
          <li key={answer} className="answer">
            <button
              onClick={() => onSelect(answer)}
              className={cssClass}
              disabled={ answerState !== ''}
            >
              {answer}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default Answers;
