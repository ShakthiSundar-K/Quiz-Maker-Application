import express from "express";
import {
  createQuestion,
  getQuizQuestions,
  updateQuestion,
  deleteQuestion,
} from "../controller/questionController.js";
import {
  addQuestionToPool,
  getQuestionsFromPool,
  addReusableQuestionsToQuiz,
  searchReusableQuestions,
  updateReusableQuestion,
  deleteReusableQuestion,
} from "../controller/reusableQuestionController.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

// Create Question
router.post("/create", verifyAuth, createQuestion);

// Update Question
router.put("/update/:questionId", verifyAuth, updateQuestion);

// Delete Question
router.delete("/delete/:questionId", verifyAuth, deleteQuestion);

// Get Questions for a Specific Quiz
router.get("/quiz/:quizId", verifyAuth, getQuizQuestions);

// Reusable Questions
router.post("/pool/create", verifyAuth, addQuestionToPool);
router.get("/pool", verifyAuth, getQuestionsFromPool);
router.put("/pool/update/:questionId", verifyAuth, updateReusableQuestion);
router.delete("/pool/delete/:questionId", verifyAuth, deleteReusableQuestion);
router.get("/pool/search", verifyAuth, searchReusableQuestions);

// Adding Reusable Questions to a Quiz
router.post(
  "/pool/add-to-quiz/:quizId",
  verifyAuth,
  addReusableQuestionsToQuiz
);

export default router;
