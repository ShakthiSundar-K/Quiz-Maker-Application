import mongoose from "./index.js";

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    type: {
      type: String,
      enum: ["mcq", "true/false", "short-answer"],
      required: true,
    },
    text: { type: String, required: true },
    options: [{ type: String }], // For MCQs
    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
    explanation: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
