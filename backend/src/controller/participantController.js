import Attempt from "../model/Attempt.js";
import Quiz from "../model/Quiz.js";
import Question from "../model/Question.js";
import Leaderboard from "../model/Leaderboard.js";

// Join Quiz
export const joinPublicQuiz = async (req, res) => {
  const { quizId } = req.params; // Get quizId from the URL parameters

  try {
    // Ensure the quiz ID is provided
    if (!quizId) {
      return res
        .status(400)
        .json({ message: "Quiz ID is required to join a public quiz" });
    }

    // Find the quiz by ID and ensure it's public
    const quiz = await Quiz.findOne({ _id: quizId, type: "public" });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found or not public" });
    }

    // Check if the user is already a participant
    if (quiz.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You are already a participant in this quiz" });
    }

    // Add user to participants list
    quiz.participants.push(req.user.id);
    await quiz.save();

    res.status(200).json({ message: "Joined public quiz successfully", quiz });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

export const joinPrivateQuiz = async (req, res) => {
  const { quizCode } = req.body;

  try {
    // Ensure the quiz code is provided
    if (!quizCode) {
      return res
        .status(400)
        .json({ message: "Quiz code is required to join a private quiz" });
    }

    // Find the quiz by code
    const quiz = await Quiz.findOne({ code: quizCode, type: "private" });

    if (!quiz) {
      return res
        .status(404)
        .json({ message: "Invalid quiz code or quiz not found" });
    }

    // Check if the user is already a participant
    if (quiz.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You are already a participant in this quiz" });
    }

    // Add user to participants list
    quiz.participants.push(req.user.id);
    await quiz.save();

    res.status(200).json({ message: "Joined private quiz successfully", quiz });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Submit Answers for Quiz Attempt

export const submitAnswers = async (req, res) => {
  const { quizId, answers } = req.body; // `answers` is an array of { questionId, userAnswer }
  const userId = req.user.id;

  try {
    // Step 1: Check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Step 2: Fetch all questions for the quiz
    const questions = await Question.find({ quiz: quizId });
    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this quiz" });
    }

    // Step 3: Create a map of questionId to question details (correctAnswer + explanation)
    const questionMap = {};
    questions.forEach((question) => {
      questionMap[question._id] = {
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
      };
    });

    // Step 4: Compare submitted answers with correct answers and calculate score
    let score = 0;
    const evaluatedAnswers = answers.map((submittedAnswer) => {
      const { questionId, userAnswer } = submittedAnswer;

      const { correctAnswer, explanation } = questionMap[questionId] || {};
      const isCorrect =
        String(userAnswer).trim() === String(correctAnswer).trim();

      if (isCorrect) score += 1;

      return {
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: !isCorrect ? explanation : null, // Add explanation only for incorrect answers
      };
    });

    // Step 5: Save the attempt to the database
    const attempt = new Attempt({
      participant: userId,
      quiz: quizId,
      answers: evaluatedAnswers, // Detailed answer evaluation
      score,
      timeTaken: req.body.timeTaken || 0, // Optional: Time taken to complete the quiz
    });

    await attempt.save();

    // Step 6: Update the leaderboard
    let leaderboard = await Leaderboard.findOne({ quiz: quizId });

    if (!leaderboard) {
      // Create a new leaderboard entry if it doesn't exist
      leaderboard = new Leaderboard({
        quiz: quizId,
        rankings: [],
      });
    }

    // Check if the user is already in the leaderboard
    const participantIndex = leaderboard.rankings.findIndex(
      (ranking) => ranking.participant.toString() === userId
    );

    if (participantIndex >= 0) {
      // Update existing participant's score and timeTaken if they retake the quiz
      leaderboard.rankings[participantIndex].score = score;
      leaderboard.rankings[participantIndex].timeTaken =
        req.body.timeTaken || 0;
    } else {
      // Add a new participant to the leaderboard
      leaderboard.rankings.push({
        participant: userId,
        score,
        timeTaken: req.body.timeTaken || 0,
      });
    }

    // Save the updated leaderboard
    await leaderboard.save();

    // Step 7: Respond with the results
    res.status(201).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: questions.length,
      evaluatedAnswers,
    });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};
