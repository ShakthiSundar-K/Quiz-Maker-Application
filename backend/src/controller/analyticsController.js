import Attempt from "../model/Attempt.js";
import Quiz from "../model/Quiz.js";
import Question from "../model/Question.js";

// Get Analytics for a Quiz
export const getQuizAnalytics = async (req, res) => {
  const { quizId } = req.params;

  try {
    // Step 1: Check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Step 2: Get all attempts for the quiz
    const attempts = await Attempt.find({ quiz: quizId }).populate(
      "participant",
      "name email"
    );

    if (!attempts.length) {
      return res.json({
        message: "No attempts yet for this quiz",
        performance: [],
      });
    }

    // Step 3: Collect participant performance
    const performance = attempts.map((attempt) => ({
      participant: {
        id: attempt.participant._id,
        name: attempt.participant.name,
        email: attempt.participant.email,
      },
      score: attempt.score,
      totalQuestions: attempt.answers.length,
      timeTaken: attempt.timeTaken,
      correctAnswers: attempt.answers.filter((ans) => ans.isCorrect).length,
      incorrectAnswers: attempt.answers.filter((ans) => !ans.isCorrect).length,
    }));

    // Step 4: Analyze most missed questions
    const questionStats = {};

    attempts.forEach((attempt) => {
      attempt.answers.forEach((answer) => {
        if (!answer.isCorrect) {
          const questionId = answer.questionId.toString();
          if (!questionStats[questionId]) {
            questionStats[questionId] = { misses: 0, questionId };
          }
          questionStats[questionId].misses += 1;
        }
      });
    });

    // Sort most missed questions
    const missedQuestions = Object.values(questionStats).sort(
      (a, b) => b.misses - a.misses
    );

    // Fetch question details for most missed questions
    const mostMissedQuestions = await Promise.all(
      missedQuestions.map(async (stat) => {
        const question = await Question.findById(stat.questionId);
        return {
          questionId: question._id,
          text: question.text,
          misses: stat.misses,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation || "No explanation available",
        };
      })
    );

    // Step 5: Send response with analytics
    res.json({
      quiz: { id: quiz._id, name: quiz.name },
      performance,
      mostMissedQuestions,
    });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};
