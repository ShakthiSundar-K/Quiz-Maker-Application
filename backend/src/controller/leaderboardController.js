import Leaderboard from "../model/Leaderboard.js";

// Get Leaderboard for a Quiz
export const getLeaderboardByQuizId = async (req, res) => {
  const { quizId } = req.params; // Extract quizId from URL parameters

  try {
    // Find the leaderboard for the specified quiz
    const leaderboard = await Leaderboard.findOne({ quiz: quizId })
      .populate("rankings.participant", "name") // Populate participant details (like name)
      .populate("quiz", "name"); // Optionally populate quiz details (like name)

    if (!leaderboard) {
      return res
        .status(404)
        .json({ message: "Leaderboard not found for this quiz" });
    }

    // Sort rankings by score (descending) and timeTaken (ascending for tiebreakers)
    const sortedRankings = leaderboard.rankings.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      return a.timeTaken - b.timeTaken; // Shorter time first in case of a tie
    });

    res.status(200).json({
      quiz: leaderboard.quiz.name,
      rankings: sortedRankings,
    });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
