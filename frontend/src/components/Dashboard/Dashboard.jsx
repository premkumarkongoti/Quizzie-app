import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/Navbar";
import Summary from "../../components/Summary/Summary";
import Metrics from "../../components/Metrics/Metrics";
import styles from "./dashboard.module.css";
import QuizForm from "../../components/Quizz/QuizForm";
import QuestionForm from "../../components/Quizz/QuestionForm";
import Notification from "../../components/Notification/Notification";
import DeleteQuizModal from "../../components/Delete/DeleteQuizModal";
import AnalysisPanel from "../../components/AnalysisPanel/AnalysisPanel";

function Dashboard() {
  const [summaryView, setSummaryView] = useState(true); 
  const [metricsView, setMetricsView] = useState(false);
  const [analysisView, setAnalysisView] = useState(true);
  const [createQuizModal, setCreateQuizModal] = useState(false);
  const [quizTypeModal, setQuizTypeModal] = useState(false);
  const [questionModal, setQuestionModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [quizLink, setQuizLink] = useState(null);
  const [deleteQuizModal, setDeleteQuizModal] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleAnalysisView = (state) => {
    setAnalysisView(state);
    setMetricsView(!state);
  };

  const handleEditMode = (state) => {
    setEditMode(state);
    if (state) {
      setQuizTypeModal(false);
      setQuestionModal(true);
    }
  };

  const handleQuizId = (id) => {
    setQuizId(id);
  };

  const handleDeleteQuizModal = (state) => {
    setDeleteQuizModal(state);
  };

  const handleQuizLink = (link) => {
    setQuizLink(link);
  };

  const handleNotificationModal = (state) => {
    setNotificationModal(state);
  };
  
  const [quizType, setQuizType] = useState("");
  const [quizName, setQuizName] = useState("");

  const handleCancel = () => {
    setCreateQuizModal(false);
    setQuizTypeModal(false);
    setQuestionModal(false);
    setQuizName("");
    setQuizType("");
  };

  const handleContinue = () => {
    if (quizName === "" || quizType === "") {
      return alert("All fields are required");
    }
    setQuizTypeModal(false);
    setQuestionModal(true);
  };

  const handleQuizType = (type) => {
    setQuizType(type);
  };

  const handleQuizName = (name) => {
    setQuizName(name);
  };

  const handleFinalCancel = () => {
    setCreateQuizModal(false);
    setQuizTypeModal(false);
    setQuestionModal(false);
    setEditMode(false);
    setQuizName("");
    setQuizType("");
  };

  const handleNavigation = (btnId) => {
    if (btnId === 1) {
      setSummaryView(true);
      setMetricsView(false);
    } else if (btnId === 2) {
      setSummaryView(false);
      setMetricsView(true);
    } else if (btnId === 3) {
      setCreateQuizModal(true);
      setQuizTypeModal(true);
    }
  };

  useEffect(() => {
    
  }, []);

  const jwToken = localStorage.getItem("jwToken");
  if (!jwToken) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.navbarContainer}>
          <NavBar handleNavigation={handleNavigation} />
          {/* <Outlet /> */}
        </div>
        <div className={styles.content}>
          {summaryView ? (
            <div
              style={{
                width: "95%",
                margin: "auto",
                height: "90%",
                marginTop: "5%",
              }}
            >
              <Summary />
            </div>
          ) : metricsView ? (
            <div
              style={{
                width: "95%",
                margin: "auto",
                height: "90%",
                marginTop: "3%",
              }}
            >
              <Metrics
                handleEditMode={handleEditMode}
                handleQuizId={handleQuizId}
                handleDeleteQuizModal={handleDeleteQuizModal}
                handleAnalysisView={handleAnalysisView}
              />
            </div>
          ) : analysisView ? (
            <div
              style={{
                width: "95%",
                margin: "auto",
                height: "90%",
                marginTop: "3%",
              }}
            >
              <AnalysisPanel quizId={quizId} />
            </div>
          ) : (
            ""
          )}
        </div>
        {createQuizModal || notificationModal || deleteQuizModal || editMode ? (
          <div className={styles.modals}>
            {quizTypeModal ? (
              <QuizForm
                handleQuizType={handleQuizType}
                handleQuizName={handleQuizName}
                handleContinue={handleContinue}
                handleCancel={handleCancel}
                quizType={quizType}
                quizName={quizName}
              />
            ) : (
              ""
            )}
            {questionModal ? (
              <QuestionForm
               // handleCancelModal={handleCancelModal} 
                editMode={editMode}
                quizType={quizType}
                quizName={quizName}
                handleFinalCancel={handleFinalCancel}
                handleNotificationModal={handleNotificationModal}
                handleQuizLink={handleQuizLink}
                quizId={quizId}
                handleQuizType={handleQuizType}
                handleCancel={handleCancel}
              />
            ) : (
              ""
            )}
            {notificationModal ? (
              <Notification
                quizLink={quizLink}
                handleNotificationModal={handleNotificationModal}
              />
            ) : (
              ""
            )}
            {deleteQuizModal ? (
              <DeleteQuizModal quizId={quizId} handleDeleteQuizModal={handleDeleteQuizModal} />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Dashboard;
