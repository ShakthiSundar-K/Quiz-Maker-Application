import mongoose from "./index.js";

const leaderboardSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    rankings: [
      {
        participant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, required: true },
        timeTaken: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
