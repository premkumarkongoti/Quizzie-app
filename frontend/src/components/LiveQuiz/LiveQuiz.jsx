import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./livequiz.module.css";
import { BASE_URL } from "../../utils";
import sampleImage from "../../assets/sampleIcon.png";
import axios from "axios";
import Timer from "../../components/Timer/Timer";

function LiveQuiz() {
 
  const [questionsArray, setQuestionsArray] = useState(null);
  const navigate = useNavigate();
  const [quizType, setQuizType] = useState(null);
  const [timerState, setTimerState] = useState("off");
  const { quizId } = useParams();
  const [optionType, setOptionType] = useState(null);
  
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersArray, setAnswersArray] = useState([]);
 
  const nextQuestion = () => {
    setSelectedOptionId(null);
  
    const questionId = questionsArray[currentQuestionIndex]._id;
    const updatedAnswers = [...answersArray];
    const answeredIndex = updatedAnswers.findIndex((el) => {
      return el.questionId === questionId;
    });
    if (answeredIndex === -1) {
      const answer = {
        questionId: questionId,
        selectedOptionId: null,
      };
      updatedAnswers.push(answer);
    
      setAnswersArray(updatedAnswers);
    }
   
    if (currentQuestionIndex + 1 < questionsArray.length) {  
      setCurrentQuestionIndex((currentIndex) => {
       
        return currentIndex + 1;
      });
      setOptionType(() => {
        if (currentQuestionIndex + 1 < questionsArray.length) {
          return questionsArray[currentQuestionIndex + 1].optionType;
        }
      });
    } else {
      return;
    }
  };

  const handleSubmit = () => {
    const quizId = quizId;
    axios
      .post(`${BASE_URL}/api/${quizId}/submit`, answersArray)
      .then((res) => {
        if (res.data.status === "OK") {
          if (quizType === "qna") {
            return navigate("/result", {
              state: {
                score: res.data.score,
                questionCount: questionsArray.length,
                isPoll: quizType === "poll",
              },
            });
          } else {
            return navigate("/result", { state: { isPoll: true } });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        return alert("Something went wrong in submitting");
      });
   
  };
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/quizz/${quizId}`);
      setQuestionsArray(res.data.data.questions);
      setQuizType(res.data.data.quizType);
      setTimerState(res.data.data.timer);
      setOptionType(res.data.data.questions[0].optionType);
     
    } catch (err) {
      console.log(err);
      return alert("something went wrong in getting questions");
    }
  };
  useEffect(() => {
    fetchQuestions();
   
  }, []);
  const getOptionClass = () => {
    if (optionType === "txt") {
      return styles.option;
    } else if (optionType === "img") {
      return styles.justImage;
    } else {
      return styles.withImage;
    }
  };
  function handleOptionSelect(optionId, questionIndex, optionIndex) {
    setSelectedOptionId(optionId);
    
    const updatedAnswers = [...answersArray];
    const answeredIndex = updatedAnswers.findIndex(
      (el) => el.questionId === questionsArray[questionIndex]._id
    );
    if (answeredIndex === -1) {
      const answer = {
        questionId: questionsArray[questionIndex]._id,
        selectedOptionId: optionId,
      };
      updatedAnswers.push(answer);
     
      setAnswersArray(updatedAnswers);
    } else {
      updatedAnswers[answeredIndex].selectedOptionId = optionId;
    
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.qnt}>
          <div className={styles.qno}>
            {questionsArray ? `0${currentQuestionIndex + 1}/0${questionsArray.length}` : "loading.."}
          </div>
          <div className={styles.timer}>
            {quizType === "poll" || timerState === "off" ? (
              ""
            ) : (            
              <Timer
                nextQuestion={nextQuestion}
                handleSubmit={handleSubmit}
                questionCount={questionsArray ? questionsArray.length : 0}
                timerState={timerState}
                currentQuestionIndex={currentQuestionIndex}
              />
            )}
          </div>
        </div>
        <div className={styles.question}>
          {questionsArray && currentQuestionIndex < questionsArray.length
            ? questionsArray[currentQuestionIndex].question
            : "loading..."}
        </div>
        <div className={styles.optContainer}>
          {questionsArray && currentQuestionIndex < questionsArray.length
            ? questionsArray[currentQuestionIndex].options.map((option, index) => (
                <div
                  onClick={() => handleOptionSelect(option._id, currentQuestionIndex, index)}
                  style={{ border: selectedOptionId === index ? "3px solid #5076FF" : "" }}
                  className={getOptionClass()}
                >
                  {optionType === "txt" ? option.value : ""}
                  {optionType === "img" ? (
                    <div>
                      <img
                        width={"200px"}
                        height={"110px"}
                        src={option.value || sampleImage}
                        alt="option"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {optionType === "txtimg" ? (
                    <>
                      {" "}
                      <div
                        style={{
                          paddingTop: "10px",
                          flex: "40%",
                        }}
                      >
                        {option.value || `option ${index + 1}`}
                      </div>
                      <div style={{ flex: "60%" }}>
                        <img
                          width={"100%"}
                          height={"100%"}
                          src={option.imgUrl || sampleImage}
                          alt="option"
                        />
                      </div>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))
            : "loading..."}       
        </div>
        <div className={styles.btn}>
          <button
            onClick={() => {
              if (currentQuestionIndex === questionsArray.length - 1) {
                handleSubmit();
              } else {
                nextQuestion();
              }
            }}
          >
            {questionsArray
              ? currentQuestionIndex === questionsArray.length - 1
                ? "Submit"
                : "Next"
              : "Next"}
          </button>{" "}
        </div>
      </div>
    </>
  );
}

export default LiveQuiz;
