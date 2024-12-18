import Quiz from "../model/Quiz.js";
import ReusableQuestion from "../model/ReusableQuestion.js";
import Question from "../model/Question.js";

export const addQuestionToPool = async (req, res) => {
  const { text, type, options, correctAnswer, explanation } = req.body;
  const userId = req.user.id;

  try {
    const question = new ReusableQuestion({
      text,
      type,
      options,
      correctAnswer,
      explanation,
      creator: userId,
    });

    await question.save();
    res.status(201).json({ message: "Question added to the pool", question });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getQuestionsFromPool = async (req, res) => {
  const userId = req.user.id;

  try {
    const questions = await ReusableQuestion.find({ creator: userId });
    res.status(200).json(questions);
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateReusableQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { text, type, options, correctAnswer, explanation } = req.body;
  const userId = req.user.id;

  try {
    // Step 1: Find the reusable question
    const question = await ReusableQuestion.findOne({
      _id: questionId,
      creator: userId, // Ensure the question belongs to the user
    });

    if (!question) {
      return res.status(404).json({ message: "Reusable question not found" });
    }

    // Step 2: Update fields
    question.text = text || question.text;
    question.type = type || question.type;
    question.options = options || question.options;
    question.correctAnswer = correctAnswer || question.correctAnswer;
    question.explanation = explanation || question.explanation;

    // Step 3: Save updated question
    await question.save();
    res
      .status(200)
      .json({ message: "Reusable question updated successfully", question });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteReusableQuestion = async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user.id;

  try {
    // Step 1: Find and delete the reusable question
    const question = await ReusableQuestion.findOneAndDelete({
      _id: questionId,
      creator: userId, // Ensure the question belongs to the user
    });

    if (!question) {
      return res.status(404).json({ message: "Reusable question not found" });
    }

    res.status(200).json({ message: "Reusable question deleted successfully" });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const addReusableQuestionsToQuiz = async (req, res) => {
  const { quizId } = req.params; // Quiz ID from params
  const { reusableQuestionIds } = req.body; // Array of reusable question IDs selected by the user

  try {
    // Step 1: Validate quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Step 2: Fetch reusable questions based on IDs
    const reusableQuestions = await ReusableQuestion.find({
      _id: { $in: reusableQuestionIds },
      creator: req.user.id, // Ensure the questions belong to the creator
    });

    if (reusableQuestions.length !== reusableQuestionIds.length) {
      return res.status(400).json({
        message: "Some reusable questions were not found or are unauthorized",
      });
    }

    // Step 3: Add reusable questions directly to the quiz
    const createdQuestions = await Promise.all(
      reusableQuestions.map(async (question) => {
        const newQuestion = new Question({
          quiz: quizId,
          text: question.text,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        });
        return await newQuestion.save();
      })
    );

    // Step 4: Respond with the added questions
    res.status(201).json({
      message: "Selected reusable questions added to the quiz successfully",
      questions: createdQuestions,
    });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const searchReusableQuestions = async (req, res) => {
  const { query } = req.query; // `query` is the search term provided by the user

  try {
    // Step 1: Ensure a search term is provided
    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    // Step 2: Search for reusable questions matching the text (case-insensitive)
    const reusableQuestions = await ReusableQuestion.find({
      text: { $regex: query, $options: "i" }, // Case-insensitive search
      creator: req.user.id, // Ensure the creator is the current user
    });

    // Step 3: Handle no results
    if (!reusableQuestions.length) {
      return res
        .status(404)
        .json({ message: "No reusable questions found matching your query" });
    }

    // Step 4: Return the matched reusable questions
    res.status(200).json({ reusableQuestions });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
