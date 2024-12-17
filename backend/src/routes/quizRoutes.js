import express from "express";
import {
  createQuiz,
  getQuizById,
  getUserQuizzes,
  updateQuiz,
  deleteQuiz,
  searchQuizzes,
} from "../controller/quizController.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

// Create Quiz
router.post("/create", verifyAuth, createQuiz);

// Get All Quizzes Created by User
router.get("/user-quizzes", verifyAuth, getUserQuizzes);

// Update Quiz
router.put("/update/:id", verifyAuth, updateQuiz);

//Delete Quiz
router.delete("/delete/:id", verifyAuth, deleteQuiz);

// Search Quiz
router.get("/searchQuizzes", verifyAuth, searchQuizzes);

// Get Quiz by ID
router.get("/:id", verifyAuth, getQuizById);

export default router;
