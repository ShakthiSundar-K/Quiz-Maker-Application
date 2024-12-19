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
        .json({ message: "You already participated in this quiz" });
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
        .json({ message: "You already participated in this quiz" });
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
  const { quizId, answers } = req.body; // answers is an array of { questionId, userAnswer }
  const userId = req.user.id;

  try {
    // Step 1: Check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Step 2: Fetch all questions for the quiz
    const questions = await Question.find({ quiz: quizId }).lean();
    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this quiz" });
    }

    // Step 3: Prepare a map for question details
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id] = {
        text: q.text,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      };
    });

    // Step 4: Evaluate answers and calculate score
    let score = 0;
    const evaluatedAnswers = answers.map((submittedAnswer) => {
      const { questionId, userAnswer } = submittedAnswer;

      const question = questionMap[questionId];
      if (!question) {
        return {
          questionId,
          userAnswer,
          correctAnswer: null,
          isCorrect: false,
          explanation: null,
        };
      }

      const isCorrect =
        String(userAnswer).trim() === String(question.correctAnswer).trim();

      if (isCorrect) score += 1;

      return {
        questionId,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: !isCorrect ? question.explanation : null,
      };
    });

    // Step 5: Save the attempt to the database (exclude `questionText` at this point)
    const attempt = new Attempt({
      participant: userId,
      quiz: quizId,
      answers: evaluatedAnswers,
      score,
      timeTaken: req.body.timeTaken || 0,
    });

    await attempt.save();

    // Step 6: Add question text dynamically for the final response
    const responseAnswers = evaluatedAnswers.map((answer) => ({
      questionText:
        questionMap[answer.questionId]?.text || "Question not found",
      ...answer,
    }));

    // Step 7: Update the leaderboard
    let leaderboard = await Leaderboard.findOne({ quiz: quizId });

    if (!leaderboard) {
      leaderboard = new Leaderboard({
        quiz: quizId,
        rankings: [],
      });
    }

    const participantIndex = leaderboard.rankings.findIndex(
      (ranking) => ranking.participant.toString() === userId
    );

    if (participantIndex >= 0) {
      leaderboard.rankings[participantIndex].score = score;
      leaderboard.rankings[participantIndex].timeTaken =
        req.body.timeTaken || 0;
    } else {
      leaderboard.rankings.push({
        participant: userId,
        score,
        timeTaken: req.body.timeTaken || 0,
      });
    }

    await leaderboard.save();

    // Step 8: Respond with the results
    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: questions.length,
      evaluatedAnswers: responseAnswers,
    });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};
