import mongoose from "./index.js";

const quizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["public", "private"], default: "public" },
    code: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timer: {
      type: { type: String, enum: ["overall", "per-question"], required: true },
      duration: { type: Number, required: true },
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
