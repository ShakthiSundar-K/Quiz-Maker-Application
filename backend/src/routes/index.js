import express from "express";
import authRoutes from "./authRoutes.js";
import quizRoutes from "./quizRoutes.js";
import questionRoutes from "./questionRoutes.js";
import participantRoutes from "./participantRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/quizzes", quizRoutes);
router.use("/questions", questionRoutes);
router.use("/participants", participantRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
