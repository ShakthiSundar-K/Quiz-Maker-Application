import Question from "../model/Question.js";
import Quiz from "../model/Quiz.js";

// Bulk Create Questions

export const createQuestion = async (req, res) => {
  const { questions } = req.body;

  try {
    // Ensure that questions array is not empty
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "No questions provided" });
    }

    // Process each question in the array
    const questionsToSave = await Promise.all(
      questions.map(async (questionData) => {
        const { quizId, text, type, options, correctAnswer, explanation } =
          questionData;

        const quiz = await Quiz.findById(quizId); // The await here is valid now inside the async map

        if (!quiz) {
          throw new Error("Quiz not found");
        }

        return new Question({
          quiz: quizId,
          text,
          type,
          options,
          correctAnswer,
          explanation,
        });
      })
    );

    // Save all questions in bulk
    const savedQuestions = await Question.insertMany(questionsToSave);

    res.status(201).json(savedQuestions);
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Get Questions for a Quiz
export const getQuizQuestions = async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware

  try {
    // Check if the quiz exists and populate the necessary fields (name, timer)
    const quiz = await Quiz.findById(quizId)
      .populate("creator", "name")
      .select("name timer participants");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Ensure participants is an array before calling includes
    if (!quiz.participants || !Array.isArray(quiz.participants)) {
      return res
        .status(404)
        .json({ message: "No participants found for this quiz" });
    }

    // Check if the user is a participant
    // if (!quiz.participants.includes(userId)) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not authorized to view this quiz" });
    // }

    // Fetch questions for the quiz
    const questions = await Question.find({ quiz: quizId });

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this quiz" });
    }

    // Returning populated quiz and questions
    res.status(200).json({ quiz, questions });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Update Question
export const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { text, type, options, correctAnswer, explanation } = req.body;

  try {
    const question = await Question.findById(questionId).populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    // console.log(question.quiz.creator.toString());
    // console.log(req.user.id);
    // Ensure the user updating the question is the quiz creator
    if (question.quiz.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this question" });
    }

    // Update fields if provided
    if (text) question.text = text;
    if (type) question.type = type;
    if (options) question.options = options;
    if (correctAnswer) question.correctAnswer = correctAnswer;
    if (explanation) question.explanation = explanation;

    await question.save();
    res
      .status(200)
      .json({ message: "Question updated successfully", question });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId).populate("quiz");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Ensure the user deleting the question is the quiz creator
    if (question.quiz.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this question" });
    }

    await question.deleteOne();
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};
