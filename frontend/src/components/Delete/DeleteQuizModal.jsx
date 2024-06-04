import React from "react";
import styles from "./deletequizmodal.module.css";
import axios from "axios";
import { BASE_URL } from "../../utils";

 function DeleteQuiz({ handleConfirmDelete, quizId }) {
  const handleDelete = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return alert("You are not logged in");

    const headers = {
      "Content-Type": "application/json",
      Authorization: authToken,
    };

    axios
      .delete(`${BASE_URL}/api/delete-quiz/${quizId}`, { headers: headers })
      .then((res) => {
        if (res.data.status === "OK") {
          handleConfirmDelete(false);
          window.location.reload();
          return alert("Quiz Deleted");
        }
      })
      .catch((err) => {
        return alert("Something went wrong");
      });
  };

  return (
    <div className={styles.container}>
      <h1>Are you sure you want to delete?</h1>
      <div className={styles.buttons}>
        <button onClick={handleDelete} className={styles.confirm}>
          Confirm Delete
        </button>
        <button
          onClick={() => handleConfirmDelete(false)}
          className={styles.cancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


export default DeleteQuiz;