const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// Error Handling Middleware
const errorHandler = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Submit Quiz
router.post("/:quizId/submit", async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const bodyReceived = req.body;
    const quizDb = await Quiz.findOne({ _id: quizId });
    if (!quizDb) {
      return res.status(404).json({ error: "Quiz Not found" });
    }
            
    let score = 0;
    if (quizDb.quizType === "qna") {
      score = calculateQNAScore(quizDb, bodyReceived);
    } else if (quizDb.quizType === "poll") {
      updatePollVotes(quizDb, bodyReceived);
    }

    await quizDb.save();
    res.status(200).json({
      status: "OK",
      score: score,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// Calculate Q&A Score
const calculateQNAScore = (quizDb, bodyReceived) => {
  let score = 0;
  const questionsArray = quizDb.questions;
  bodyReceived.forEach((q, index) => {
    const qId = q.questionId;
    const ansId = q.ansSelectedId;
    if (ansId) {
      const qFound = questionsArray.find((que) => que._id.toString() === qId);
      if (qFound) {
        const optFound = qFound.options.find((op) => op._id.toString() === ansId.toString());
        if (optFound && optFound.isAnswer) {
          score++;
          quizDb.questions[index].correct++;
        }
        quizDb.questions[index].attempted++;
        if (!optFound || !optFound.isAnswer) {
          quizDb.questions[index].incorrect++;
        }
      }
    } else {
      quizDb.questions[index].incorrect++;
    }
  });
  return score;
};

// Update Poll Votes
const updatePollVotes = (quizDb, bodyReceived) => {
  bodyReceived.forEach((q, index) => {
    const qId = q.questionId;
    const ansId = q.ansSelectedId;
    if (ansId) {
      const ansIdx = quizDb.questions[index].options.findIndex((op) => op._id.toString() === ansId.toString());
      if (ansIdx !== -1) {
        quizDb.questions[index].options[ansIdx].votes++;
      }
    }
  });
};

module.exports = router;
