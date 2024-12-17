import express from "express";
import {
  joinPublicQuiz,
  joinPrivateQuiz,
  submitAnswers,
} from "../controller/participantController.js";
import { getLeaderboardByQuizId } from "../controller/leaderboardController.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

// Submit Answers
router.post("/submit", verifyAuth, submitAnswers);

// Get LeaderBoard
router.get("/getLeaderboard/:quizId", verifyAuth, getLeaderboardByQuizId);

// Join Quiz
router.post("/join-private-quiz", verifyAuth, joinPrivateQuiz);
router.post("/join-public-quiz/:quizId", verifyAuth, joinPublicQuiz);

export default router;
