import Quiz from "../model/Quiz.js";
import User from "../model/User.js";
import { sendEmail } from "../service/emailService.js";

// Create Quiz
export const createQuiz = async (req, res) => {
  const { name, type, timer } = req.body;

  try {
    const code =
      type === "private"
        ? Math.random().toString(36).substring(2, 8).toUpperCase()
        : "public"; // Fixed value for public quizzes

    const quiz = new Quiz({
      name,
      type,
      code, // Assign the code only if it's private
      creator: req.user.id,
      timer,
      participants: [], // Initialize with an empty participants array
    });

    await quiz.save();
    if (quiz.code !== "public") {
      try {
        await sendEmail(
          req.user.email,
          "QuizMakerPro",
          `Thank you for creating a quiz with us.The quiz code for the quiz "${quiz.name}" is ${quiz.code}`
        );
        console.log("email sent for private quiz");
      } catch (emailError) {
        console.error("Error sending email:", emailError.message);
        // Optionally, you can notify the user that the email failed
      }
    }

    res.status(201).json(quiz);
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Get Quiz by ID
export const getQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id).populate("creator", "name");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ type: "public" })
      .populate("creator", "name") // Populating the creator field with the creator's name
      .select("-__v"); // Exclude the `__v` field

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes found" });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error(`Error in ${req.originalUrl}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Quizzes for User
export const getUserQuizzes = async (req, res) => {
  try {
    console.log("User ID from req.user:", req.user.id); // Debugging
    const quizzes = await Quiz.find({ creator: req.user.id });
    console.log("Quizzes found:", quizzes); // Log the retrieved quizzes

    res.json(quizzes);
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Update Quiz
export const updateQuiz = async (req, res) => {
  const { id } = req.params; // Quiz ID from route
  const { name, type, timer } = req.body; // Fields to update

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Ensure the user updating the quiz is the creator
    if (quiz.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this quiz" });
    }

    // Update fields if provided
    if (name) quiz.name = name;
    if (type) quiz.type = type;
    if (timer) quiz.timer = timer;

    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Delete Quiz
export const deleteQuiz = async (req, res) => {
  const { id } = req.params; // Quiz ID from route

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Ensure the user deleting the quiz is the creator
    if (quiz.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this quiz" });
    }

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

// Search Quiz by Name
export const searchQuizzes = async (req, res) => {
  const { name } = req.query; // Get search query from URL

  try {
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "Please provide a valid search query" });
    }

    // Perform a case-insensitive search for quizzes by name or creator's name
    const quizzes = await Quiz.find({
      $or: [
        { name: { $regex: name, $options: "i" } }, // Search by quiz name
        { "creator.name": { $regex: name, $options: "i" } }, // Search by creator's name
      ],
    }).populate("creator", "name"); // Populate creator's name

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes found" });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.log(`Error in ${req.originalUrl}`, error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
