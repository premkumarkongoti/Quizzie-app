import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/AuthenticationPage/Auth";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import LiveQuizPage from "./pages/QuizPage/LiveQuiz";
import ResultPage from "./pages/ResultsPage/Result";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quiz/:quizId" element={<LiveQuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route
          path="/not-found"
          element={
            <div>
              {" "}
              <h1>
                404 <br />
                Not Found
              </h1>{" "}
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
