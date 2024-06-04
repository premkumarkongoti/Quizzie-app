import React, { useState, useEffect } from "react";
import styles from "./metrics.module.css";
import editIcon from "../../assets/editIcon.png";
import deleteIcon from "../../assets/deleteIcon.png";
import shareIcon from "../../assets/shareIcon.png";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Analytics({
  handleConfirmDelete,
  handleSelectedQuizId,
  handleEditModal,
  handleAnalysisModal,
}) {
  const [quizzes, setQuizzes] = useState([]);

  async function fetchQuizData() {
    try {
      const authToken = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: authToken,
      };
      const response = await axios.get(`${BASE_URL}/api/quizzes`, {
        headers: headers,
      });
      setQuizzes(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditQuiz = async (quizId) => {
    try {
      handleEditModal(true);
      handleSelectedQuizId(quizId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async (quizId) => {
    try {
      // await navigator.clipboard.writeText(`${BASE_URL}/quiz/${quizId}`);
      return toast("Link copied");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <ToastContainer />
        <div className={styles.title}>Quiz Analysis</div>
        <div className={styles.data}>
          <div className={styles.info}>
            <table>
              <tbody>
                <tr>
                  <th>S.No</th>
                  <th>Quiz Name</th>
                  <th>Created on</th>
                  <th>Impressions</th>
                  <th></th>
                  <th></th>
                </tr>
                {quizzes.map((quiz, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{quiz.quizName}</td>
                    <td>{quiz.createdOn}</td>
                    <td>{quiz.impressions}</td>
                    <td>
                      <img
                        onClick={() => handleEditQuiz(quiz.quizId)}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        src={editIcon}
                        alt="edit"
                      />
                      <img
                        onClick={() => {
                          handleConfirmDelete(true);
                          handleSelectedQuizId(quiz.quizId);
                        }}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        src={deleteIcon}
                        alt="delete"
                      />
                      <img
                        onClick={() => handleShare(quiz.quizId)}
                        style={{ cursor: "pointer", marginRight: "5px" }}
                        src={shareIcon}
                        alt="share"
                      />
                    </td>
                    <td
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      <span
                        onClick={() => {
                          handleAnalysisModal(true);
                          handleSelectedQuizId(quiz.quizId);
                        }}
                      >
                        Question Wise Analysis
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Analytics;
