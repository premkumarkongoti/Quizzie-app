import React, { useEffect, useState } from "react";
import styles from "./questionform.module.css";
import addImg from "../../assets/addIcon.png";
import delImg from "../../assets/deleteIcon.png";
import { BASE_URL } from "../../utils";
import axios from "axios";

function QuestionModal({
  handleFinalCancel,
  quizType,
  quizName,
  handleSuccessModal,
  handleQuizLink,
  edit,
  quizzId,
  handleQuizType,
}) {
  const [optionType, setOptionType] = useState("");
  const [showQuestionIndex, setShowQuestionIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [timer, setTimer] = useState(null);
  const [quizTypeEdit, setQuizTypeEdit] = useState("");
  const initialOptionsArray = [
    { value: "", isCorrect: false, imgUrl: "" },
    { value: "", isCorrect: false, imgUrl: "" },
    { value: "", isCorrect: false, imgUrl: "" },
    { value: "", isCorrect: false, imgUrl: "" },
  ];
  const [questionArray, setQuestionArray] = useState([
    { question: "", optionType: "", options: initialOptionsArray },
  ]);
  const quizId = quizzId;
  useEffect(() => {
    if (edit) {
      const jwToken = localStorage.getItem("jwToken");
      if (!jwToken) {
        return alert("You are not logged in");
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: jwToken,
      };
      axios
        .get(`${BASE_URL}/api/fetch/${quizId}`, { headers: headers })
        .then((res) => {
          setQuestionArray(res.data.quizData[0].questions);
          setTimer(res.data.quizData[0].timer);
          setQuizTypeEdit(res.data.quizData[0].quizType);
        })
        .catch((err) => {
          console.log(err);
          return alert("Something went wrong while fetching data");
        });
    }
    
  }, []);

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

  const handleUpdateQuiz = async () => {
    try {
      const quizId = quizzId;
      const jwToken = localStorage.getItem("jwToken");
      if (!jwToken) {
        return alert("You are not logged in");
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: jwToken,
      };
      const payload = {
        timer: timer,
        questionArray,
      };
      axios
        .put(`${BASE_URL}/api/update-quizz/${quizId}`, payload, {
          headers: headers,
        })
        .then((res) => {
          const quizId = res.data.quizId;
          handleFinalCancel();
          handleSuccessModal(true);
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong while updating the quiz");
        });
    } catch (err) {
      console.log(err);
      alert("Something went wrong while updating the quiz");
    }
  };

  const handleCreateQuiz = async () => {
    const quizData = {
      quizName: quizName,
      quizType: quizType,
      questions: questionArray,
      timer: timer,
    };
    if (quizData.quizType === "qna") {
      let ans = 0;
      quizData.questions.forEach((question) => {
        const found = question.options.findIndex(
          (option) =>
            option.isCorrect === true && (option.value !== "" || option.imgUrl !== "")
        );
        if (found !== -1) {
          ans++;
        }
      });
      if (!(ans === quizData.questions.length))
        return alert("All fields are required for answers");
    }

    const jwToken = localStorage.getItem("jwToken");
    if (!jwToken) {
      return alert("You are not logged in");
    }
    const headers = {
      "Content-type": "application/json",
      Authorization: jwToken,
    };
    axios
      .post(`${BASE_URL}/api/create-quiz`, quizData, { headers: headers })
      .then((res) => {
        if (res.data.status === "OK") {
          const quizId = res.data.quizId;
          handleFinalCancel();
          handleSuccessModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        return alert("Internal server error");
      });
  };

  const addQuestion = (index) => {
    const updated = [...questionArray];
    if (updated.length === 5) return;
    if (updated[index - 1].question === "") return alert("Question required");
    if (updated[index - 1].optionType === "")
      return alert("Option type required");
    const foundIndex = updated[index - 1].options.findIndex(
      (el) => el.value === "" && el.imgUrl === ""
    );
    if (foundIndex !== -1) {
      return alert("Fill all options");
    }
    if (quizType === "qna") {
      const foundIndex = updated[index - 1].options.findIndex(
        (el) => el.isCorrect === true
      );
      if (foundIndex === -1) {
        return alert("You must select an answer");
      }
    }
    updated.push({
      question: "",
      optionType: "",
      options: initialOptionsArray,
    });
    updated[index].question = question;
    updated[index].optionType = optionType;
    setQuestionArray(updated);
    setShowQuestionIndex(updated.length - 1);
    setQuestion("");
    setOptionType("");
  };

  const deleteQuestion = (index) => {
    const updatedQuestionArray = [...questionArray];
    updatedQuestionArray.splice(index, 1);
    setQuestionArray(updatedQuestionArray);
    if (index === updatedQuestionArray.length) {
      setShowQuestionIndex(index - 1);
    } else {
      setShowQuestionIndex(index);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedQuestionArray = [...questionArray];
    updatedQuestionArray[showQuestionIndex].options[index].value = value;
    setQuestionArray(updatedQuestionArray);
  };

  const handleOptionChangeURL = (index, value) => {
    const updatedQuestionArray = [...questionArray];
    updatedQuestionArray[showQuestionIndex].options[index].imgUrl = value;
    setQuestionArray(updatedQuestionArray);
  };

  const handleDeleteOptions = (index) => {
    const updatedQuestionArray = [...questionArray];
    updatedQuestionArray[showQuestionIndex].options.splice(index, 1);
    setQuestionArray(updatedQuestionArray);
    if (index === correctAnswerIndex) {
      setCorrectAnswerIndex(null);
    }
  };

  const handleAddOption = () => {
    const updatedQuestionArray = [...questionArray];
    updatedQuestionArray[showQuestionIndex].options.push({
      value: "",
      isCorrect: false,
      imgUrl: "",
    });
    setQuestionArray(updatedQuestionArray);
  };

  const handleAnswerSelect = (index) => {
    setCorrectAnswerIndex(index);
    const oldQuestionArray = [...questionArray];
    if (
      oldQuestionArray[showQuestionIndex] &&
      oldQuestionArray[showQuestionIndex].options
    ) {
      const options = oldQuestionArray[showQuestionIndex].options.map(
        (option, idx) => ({
          ...option,
          isCorrect: idx === index,
        })
      );
      oldQuestionArray[showQuestionIndex].options = options;
      setQuestionArray(oldQuestionArray);
    }
  };

  const handleCancel = () => {
    handleFinalCancel();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.qContainer}>
          <div className={styles.qno}>
            {questionArray.map((el, index) => (
              <div
                onClick={() => setShowQuestionIndex(index)}
                style={{
                  opacity: showQuestionIndex === index ? "1" : "0.5",
                  cursor: "pointer",
                }}
                key={index}
                className={styles.qBanner}
              >
                {index + 1}
                {index !== 0 ? (
                  <span
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(index);
                    }}
                    style={{
                      position: "absolute",
                      top: "-12px",
                      right: "-1px",
                      cursor: "pointer",
                    }}
                  >
                    x
                  </span>
                ) : (
                  ""
                )}
              </div>
            ))}
            <div
              onClick={() => addQuestion(questionArray.length)}
              style={{
                marginTop: "10px",
                cursor: "pointer",
                opacity: questionArray.length === 5 ? "0.1" : "",
              }}
            >
              {" "}
              <img src={addImg} alt="add" />{" "}
            </div>
          </div>
          <div className={styles.caption}>Max 5 Questions</div>
        </div>
        <div className={styles.questionIn}>
          <input
            onChange={(e) => {
              setQuestion(e.target.value);
              const updatedQuestionArray = [...questionArray];
              updatedQuestionArray[showQuestionIndex].question = e.target.value;
              setQuestionArray(updatedQuestionArray);
            }}
            value={
              showQuestionIndex < questionArray.length
                ? questionArray[showQuestionIndex].question || question
                : question
            }
            placeholder="Enter Question"
            type="text"
            name="question"
          />
        </div>
        <div className={styles.optionType}>
          <div
            style={{
              color: "#9F9F9F",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              flex: "20%",
            }}
          >
            Option type
          </div>
          <div className={styles.types}>
            <div>
              <input
                checked={
                  questionArray[showQuestionIndex].optionType === "txt" ||
                  optionType === "txt"
                }
                onClick={(e) => {
                  setOptionType(e.target.value);
                  const updatedQuestionArray = [...questionArray];
                  updatedQuestionArray[showQuestionIndex].optionType = e.target.value;
                  setQuestionArray(updatedQuestionArray);
                }}
                type="radio"
                name="optionType"
                value="txt"
              />{" "}
              <label>Text</label>
            </div>
            <div>
              <input
                checked={
                  questionArray[showQuestionIndex].optionType === "img" ||
                  optionType === "img"
                }
                onClick={(e) => {
                  setOptionType(e.target.value);
                  const updatedQuestionArray = [...questionArray];
                  updatedQuestionArray[showQuestionIndex].optionType = e.target.value;
                  setQuestionArray(updatedQuestionArray);
                }}
                type="radio"
                name="optionType"
                value="img"
              />{" "}
              <label>Image URL</label>
            </div>
            <div>
              <input
                checked={
                  questionArray[showQuestionIndex].optionType === "txtimg" ||
                  optionType === "txtimg"
                }
                onClick={(e) => {
                  setOptionType(e.target.value);
                  const updatedQuestionArray = [...questionArray];
                  updatedQuestionArray[showQuestionIndex].optionType = e.target.value;
                  setQuestionArray(updatedQuestionArray);
                }}
                type="radio"
                name="optionType"
                value="txtimg"
              />{" "}
              <label>Text & Image URL</label>
            </div>
          </div>
        </div>
        <div className={styles.optionsContainer}>
          <div className={styles.left}>
            {questionArray[showQuestionIndex]?.options?.map((el, index) => (
              <div
                key={index}
                className={
                  optionType === "txtimg" ? styles.mvalues : styles.values
                }
              >
                {quizType !== "poll" ? (
                  <input
                    checked={questionArray[showQuestionIndex]?.options[index].isCorrect === true}
                    onChange={() => handleAnswerSelect(index)}
                    type="radio"
                    name="option"
                  />
                ) : (
                  ""
                )}
                <input
                  style={{
                    background: el.isCorrect ? "#60B84B" : "",
                    color: el.isCorrect ? "white" : "",
                  }}
                  value={
                    showQuestionIndex < questionArray.length &&
                    questionArray[showQuestionIndex].options.length !== 0
                      ? questionArray[showQuestionIndex].options[index].value || el.value
                      : el.value
                  }
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={
                    optionType === "txt" || optionType === "txtimg"
                      ? "Text"
                      : "Image Url"
                  }
                  className={styles.option}
                />
                {optionType === "txtimg" && quizTypeEdit !== "poll" ? (
                  <input
                    style={{ background: el.isCorrect ? "#60B84B" : "" }}
                    value={el.imgUrl}
                    onChange={(e) => handleOptionChangeURL(index, e.target.value)}
                    placeholder={optionType === "txtimg" ? "Image URL" : ""}
                    className={styles.option}
                  />
                ) : (
                  ""
                )}
                {index > 1 ? (
                  <img
                    onClick={(e) => handleDeleteOptions(index)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    src={delImg}
                    alt="delete"
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
            <button
              onClick={handleAddOption}
              disabled={questionArray[showQuestionIndex].options.length === 4}
              style={{
                color: "#9F9F9F",
                fontFamily: "Poppins",
                fontWeight: questionArray[showQuestionIndex].options.length === 4 ? "400" : "bold",
                fontSize: "1rem",
                cursor: "pointer",
                width: "18vw",
                border: "none",
                height: "40px",
                borderRadius: "10px",
                background: "#FFF",
                flex: "20%",
                marginLeft:"2vw",
                boxShadow: "0px 0px 25px 0px rgba(0, 0, 0, 0.15)",
              }}
            >
              Add Option
            </button>
          </div>
          {quizType !== "poll" && quizTypeEdit !== "poll" ? (
            <div className={styles.right}>
              <div>Timer</div>
              <button
                style={{
                  background: timer === "5" ? "#D60000" : "",
                  color: timer === "5" ? "white" : "",
                }}
                onClick={() => setTimer("5")}
              >
                5 Sec
              </button>
              <button
                style={{
                  background: timer === "10" ? "#D60000" : "",
                  color: timer === "10" ? "white" : "",
                }}
                onClick={() => setTimer("10")}
              >
                10 Sec
              </button>
              <button
                style={{
                  background: timer === "off" ? "#D60000" : "",
                  color: timer === "off" ? "white" : "",
                }}
                onClick={() => setTimer("off")}
              >
                OFF
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.action}>
          <button onClick={handleCancel}>Cancel</button>
          <button
            onClick={() => {
              if (edit) {
                handleUpdateQuiz();
              } else {
                handleCreateQuiz();
              }
            }}
            style={{ background: "#60B84B", color: "white" }}
          >
            {edit ? "Update Quiz" : "Create Quiz"}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionModal;
