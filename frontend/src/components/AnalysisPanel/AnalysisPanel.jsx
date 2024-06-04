import React, { useEffect, useState } from "react";
import styles from "./analysispanel.module.css";
import axios from "axios";
import { BASE_URL } from "../../utils";

function Analysis({ quizId }) {
  // State to store quiz data
  const [quizData, setQuizData] = useState(null);

  // Function to fetch quiz data
  const fetchQuizData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };
      const response = await axios.get(
        `${BASE_URL}/api/fetch/${quizId}`,
        {
          headers: headers,
        }
      );

      if (response.data.status === "OK") {
        setQuizData(() => response.data.quizData[0]);
      }
    } catch (error) {
      console.log(error);
      // Handle error if needed
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.caption}>
          {/* Display Quiz Title and Details */}
          <div className={styles.title}>
            {quizData ? quizData.title : "Loading.."} Question Analysis
          </div>
          <div className={styles.details}>
            <div>
              Created on:{" "}
              {quizData
                ? new Date(quizData.created).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Loading.."}
            </div>
            <div>Impressions: {quizData ? quizData.impressions : "Loading.."}</div>
          </div>
        </div>
        <div className={styles.analyticsContainer}>
          {/* Display Question Analytics */}
          {quizData ? (
            quizData.questions.map((item, index) => (
              <div key={index} className={styles.qContainer}>
                <div className={styles.question}>{item.question}</div>
                {item && quizData.type === "qna" ? (
                  // Display stats for Q&A type questions
                  <div className={styles.stats}>
                    <div>
                      <span style={{ fontSize: "2.5rem", fontFamily: "Poppins" }}>
                        {item ? item.attempted : "Loading.."}
                      </span>{" "}
                      <br />{" "}
                      <span style={{ fontSize: "1rem", fontFamily: "Poppins" }}>
                        People Attempted question
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "2.5rem", fontFamily: "Poppins" }}>
                        {item ? item.correct : "Loading.."}
                      </span>{" "}
                      <br />{" "}
                      <span style={{ fontSize: "1rem", fontFamily: "Poppins" }}>
                        People answered correctly
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "2.5rem", fontFamily: "Poppins" }}>
                        {item ? item.incorrect : "Loading.."}
                      </span>{" "}
                      <br />{" "}
                      <span style={{ fontSize: "1rem", fontFamily: "Poppins" }}>
                        People answered Incorrectly
                      </span>
                    </div>
                  </div>
                ) : (
                  // Display stats for Poll type questions
                  <div className={styles.pollStats}>
                    {item
                      ? item.options.map((option, idx) => (
                          <div key={idx}>
                            <span style={{ fontSize: "2.5rem", fontFamily: "Poppins" }}>
                              {option.votes}
                            </span>{" "}
                            <span
                              style={{
                                fontSize: "1.2rem",
                                fontFamily: "Poppins",
                                marginLeft: "10px",
                              }}
                            >
                              {item.optionType === "txt" ? option.value : `Option ${idx + 1}`}
                            </span>
                          </div>
                        ))
                      : "Loading.."}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>Loading..</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Analysis;
