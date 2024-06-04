import React, { useEffect, useState } from "react";
import styles from "./result.module.css";
import { Navigate, useLocation } from "react-router-dom";
import prizeImage from "../../assets/prizeIcon.png";

function ResultComponent() {
  const [isPoll, setIsPoll] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setIsPoll(location.state.poll);
    }
  
  }, []);

  if (!location.state) {
    return <Navigate to="/not-found" />;
  }

  return (
    <>
      {!isPoll ? (
        <div>
          <div className={styles.caption}>Congratulations! Quiz is completed</div>
          <div
            className={styles.imageContainer}
            style={{         
              width: "fit-content",
              margin: "auto",
            }}
          >
            <img alt="prize" src={prizeImage} />
          </div>
          <div className={styles.score}>
            Your Score is:{" "}
            <span>{`0${location.state.score}/0${location.state.ques}`}</span>
          </div>
        </div>
      ) : (
        <div className={styles.poll}>
          Thank You <br /> for Participating in <br /> the Poll
        </div>
      )}
    </>
  );
}

export default ResultComponent;
