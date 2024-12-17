import mongoose from "./index.js";

const reusableQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["mcq", "true/false", "short-answer"],
      required: true,
    },
    options: [{ type: String }], // For MCQs
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    explanation: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Owner of the question
  },
  { timestamps: true }
);

export default mongoose.model("ReusableQuestion", reusableQuestionSchema);
