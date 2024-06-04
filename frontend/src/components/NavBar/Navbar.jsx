import React, { useState } from "react";
import styles from "./navbar.module.css";

const Navbar = ({ handleNavigation }) => {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    handleNavigation(buttonId);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
    window.location.href = "http://localhost:3000";
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.title}>QUIZZIE</div>
        <div className={styles.menu}>
          <div>
            <button
              style={{
                backgroundColor: activeButton === 1 ? "#FFF" : "",
                boxShadow:
                  activeButton === 1
                    ? "0px 0px 14px 0px rgba(0, 0, 0, 0.12)"
                    : "",
              }}
              onClick={() => handleButtonClick(1)}
            >
              Dashboard
            </button>
          </div>
          <div>
            <button
              style={{
                backgroundColor: activeButton === 2 ? "#FFF" : "",
                boxShadow:
                  activeButton === 2
                    ? "0px 0px 14px 0px rgba(0, 0, 0, 0.12)"
                    : "",
              }}
              onClick={() => handleButtonClick(2)}
            >
              Analytics
            </button>
          </div>
          <div>
            <button
              style={{
                backgroundColor: activeButton === 3 ? "#FFF" : "",
                boxShadow:
                  activeButton === 3
                    ? "0px 0px 14px 0px rgba(0, 0, 0, 0.12)"
                    : "",
              }}
              onClick={() => handleButtonClick(3)}
            >
              Create Quiz
            </button>
          </div>
        </div>
        <div className={styles.logout}>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
