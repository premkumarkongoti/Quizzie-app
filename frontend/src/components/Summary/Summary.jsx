import React, { useEffect, useState } from "react";
import styles from "./summary.module.css";
import eyeIcon from "../../assets/eyeIcon.png"; 
import { BASE_URL } from "../../utils";
import axios from "axios";

function OverviewComponent() { 
  const [totalQuestions, setTotalQuestions] = useState(null); 
  const [quizList, setQuizList] = useState([]); 
  const [totalImpressions, setTotalImpressions] = useState(null); 


  async function fetchData() { 
    try {
      const token = localStorage.getItem("jwtToken"); 
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token,
      };
      const response = await axios.get(`${BASE_URL}/api/quizzes`, { 
        headers: headers,
      });
   
      let impressionsCount = 0; 
      let questionsCount = 0; 
  
      response.data.data.map((item) => {
        impressionsCount += item.impressions; 
        questionsCount += item.questions; 
      });
      setTotalImpressions(() => impressionsCount); 
      setTotalQuestions(() => questionsCount);
      setQuizList(response.data.data); 
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.data}>
          <div
            style={{
              color: "#FF5D01",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {quizList.length}
            </span>{" "}
            Quiz <br /> Created
          </div>
          <div
            style={{
              color: "#60B84B",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {totalQuestions}
            </span>{" "}
            Questions <br /> Created
          </div>
          <div
            style={{
              color: "#5076FF",
              fontFamily: "Poppins",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "600",
              }}
            >
              {totalImpressions > 1000
                ? `${(totalImpressions / 1000).toFixed(1)}K`
                : totalImpressions}
            </span>{" "}
            Total <br /> Impressions
          </div>
        </div>
        <div className={styles.trending}>
          <div
            style={{
              color: "#474444",
              fontFamily: "Poppins",
              fontSize: "1.8rem",
              fontWeight: "800",
              paddingLeft: "7%",
            }}
          >
            Trending Quizzes
          </div>

          <div className={styles.quizContainer}>
            {quizList.map((item, index) => ( 
              <div key={index} className={styles.quizBanner}>
                <div className={styles.bannerTop}>
                  <div className={styles.quizName}>{item.quizName}</div> 
                  <div className={styles.views}>
                    {item.impressions} <img alt="eye" src={eyeIcon} /> 
                  </div>
                </div>
                <div className={styles.bannerBottom}>
                  Created on: &nbsp;{item.createdOn} 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewComponent;
