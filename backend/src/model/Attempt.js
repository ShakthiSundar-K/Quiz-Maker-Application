import mongoose from "./index.js";

const attemptSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        userAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
        correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
        isCorrect: { type: Boolean, required: true },
        explanation: { type: String }, // Optional: Explanation for incorrect answers
      },
    ],
    score: { type: Number, required: true },
    timeTaken: { type: Number }, // in milliseconds
  },
  { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);
