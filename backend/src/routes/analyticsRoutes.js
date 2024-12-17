import express from "express";
import { getQuizAnalytics } from "../controller/analyticsController.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

// Get Quiz Analytics
router.get("/quiz/:quizId", verifyAuth, getQuizAnalytics);

export default router;
