import React, { useEffect, useRef, useState } from "react";

function Timer({ onNextQuestion, totalQuestions, handleSubmit, timer, currentQuestionIndex }) {
  // Convert timer string to number
  const seconds = parseInt(timer);

  // State to store countdown value
  const [countdown, setCountdown] = useState(seconds);

  // Ref to hold interval ID
  const intervalId = useRef();

  // Ref to track if it's the last question
  const isLastQuestion = useRef(false);

  // Effect to start the countdown timer
  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, []);

  // Effect to handle countdown completion or change in current question
  useEffect(() => {
    // Countdown completed for current question
    if (countdown <= 0) {
      clearInterval(intervalId.current);
      onNextQuestion();

      // Check if it's not the last question
      if (currentQuestionIndex < totalQuestions - 1 && !isLastQuestion.current) {
        // Check if it's the second last question
        if (currentQuestionIndex === totalQuestions - 2) {
          isLastQuestion.current = true;
        }
        
        // Reset countdown and start for the next question
        setCountdown(() => seconds);
        intervalId.current = setInterval(() => {
          setCountdown((countdown) => countdown - 1);
        }, 1000);
      } else {
        // Last question reached, handle submit
        clearInterval(intervalId.current);
        handleSubmit();
      }
    }
  }, [countdown, currentQuestionIndex]);

  // Effect to reset countdown on current question change
  useEffect(() => {
    setCountdown(seconds);
  }, [currentQuestionIndex]);

  // Display countdown timer
  return <div>{`00:${countdown < 10 ? `0${countdown}` : countdown}`}</div>;
}

export default Timer;

