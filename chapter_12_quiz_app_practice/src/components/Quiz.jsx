import { useState, useCallback } from "react";
import QUESTIONS from "../question.js";
import Question from "./Question.jsx";
import Summary from "./Summary.jsx";
export default function Quiz() {
  const [userAnswer, setUserAnswer] = useState([]);
  const activeQuestionIndex = userAnswer.length;
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;
  const handleSelectAnswer = useCallback(
    function handleSelectAnswer(selectedAnswer) {
      setUserAnswer((prevUserAnswer) => [...prevUserAnswer, selectedAnswer]);
    },
    []
  );
  const handleSkipAnswer = useCallback(() => {
    handleSelectAnswer(null);
  }, [handleSelectAnswer]);
  if (quizIsComplete) {
    return (
        <Summary userAnswer = {userAnswer} />
    );
  }

  //when question changes react unmount and remount JSX of quiz but it do not remount QuestionTimer, since it does not chnages
  //To make it change we add key props which changes everytime question changes and force QustionTimer to unmount and remount
  //same key can not be used to render to differnent sibling components
  return (
    <div id="quiz">
      <Question
        key={activeQuestionIndex}
        questionIndex={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  );
}
