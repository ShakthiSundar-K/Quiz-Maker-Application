import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import api from "../../service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";

const CreateQuestion = () => {
  const { quizId } = useParams(); // Get the quizId from the URL params
  const [questionData, setQuestionData] = useState({
    text: "",
    type: "mcq", // Default type is mcq
    options: [""], // Initially one option field
    correctAnswer: "",
    explanation: "",
  });

  const [tempQuestions, setTempQuestions] = useState([]); // Temporary storage for questions
  const navigate = useNavigate();

  // Effect to update options based on question type
  useEffect(() => {
    if (questionData.type === "true/false") {
      setQuestionData((prev) => ({
        ...prev,
        options: ["True", "False"], // Automatically set True/False options
      }));
    } else if (
      questionData.type === "mcq" &&
      questionData.options.length === 2
    ) {
      // Reset options for MCQ if it was previously set to True/False
      setQuestionData((prev) => ({
        ...prev,
        options: [""],
      }));
    }
  }, [questionData.type]); // Run whenever question type changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "options") {
      const index = parseInt(e.target.dataset.index);
      const newOptions = [...questionData.options];
      newOptions[index] = value;
      setQuestionData((prev) => ({ ...prev, options: newOptions }));
    } else {
      setQuestionData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOption = () => {
    if (questionData.type !== "true/false") {
      setQuestionData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const path = ApiRoutes.CREATEQUESTION.PATH; // Path from ApiRoutes
      const authenticate = ApiRoutes.CREATEQUESTION.authenticate; // Authentication flag

      // Combine the temporary questions and the current question if not yet added
      const allQuestions = [
        ...tempQuestions,
        {
          quizId,
          text: questionData.text,
          type: questionData.type,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
        },
      ];

      // Payload with all questions
      const payload = { quizId, questions: allQuestions };

      const response = await api.post(path, payload, { authenticate });

      if (response) {
        toast.success("Questions saved successfully!");
        // Clear the temporary questions and form after saving
        setTempQuestions([]);
        setQuestionData({
          text: "",
          type: "mcq",
          options: [""],
          correctAnswer: "",
          explanation: "",
        });
        navigate("/home");
      } else {
        toast.error("Failed to save questions. Please try again.");
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      toast.error("Error occurred. Please try again.");
    }
  };

  const handleAddQuestion = () => {
    setTempQuestions((prev) => [
      ...prev,
      {
        quizId,
        text: questionData.text,
        type: questionData.type,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
      },
    ]);

    // Clear the form for the next question
    setQuestionData({
      text: "",
      type: "mcq",
      options: [""],
      correctAnswer: "",
      explanation: "",
    });
    toast.success("Question added to temporary data.");
  };

  return (
    <div>
      <NavBar />
      <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl w-full bg-white p-6 shadow-lg rounded-lg'>
          <h1 className='text-4xl font-bold text-gray-900 text-center mb-6'>
            Create a New Question
          </h1>
          <form className='space-y-6'>
            {/* Question Type */}
            <div>
              <label
                htmlFor='type'
                className='block text-sm font-medium text-gray-700'
              >
                Question Type
              </label>
              <select
                name='type'
                id='type'
                value={questionData.type}
                onChange={handleChange}
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              >
                <option value='mcq'>Multiple Choice</option>
                <option value='true/false'>True/False</option>
                <option value='short-answer'>Short Answer</option>
              </select>
            </div>

            {/* Question Text */}
            <div>
              <label
                htmlFor='text'
                className='block text-sm font-medium text-gray-700'
              >
                Question Text
              </label>
              <textarea
                name='text'
                id='text'
                value={questionData.text}
                onChange={handleChange}
                placeholder='Enter question text'
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              />
            </div>

            {/* Options (only for mcq or true/false) */}
            {(questionData.type === "mcq" ||
              questionData.type === "true/false") && (
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Options
                </label>
                {questionData.options.map((option, index) => (
                  <div key={index} className='flex items-center space-x-2'>
                    <input
                      type='text'
                      name='options'
                      data-index={index}
                      value={option}
                      onChange={handleChange}
                      placeholder={`Option ${index + 1}`}
                      className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
                      disabled={questionData.type === "true/false"} // Disable for true/false
                    />
                    {index === questionData.options.length - 1 &&
                      questionData.type !== "true/false" && (
                        <button
                          type='button'
                          onClick={handleAddOption}
                          className='text-blue-500 hover:text-blue-700'
                        >
                          + Add Option
                        </button>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Correct Answer */}
            <div>
              <label
                htmlFor='correctAnswer'
                className='block text-sm font-medium text-gray-700'
              >
                Correct Answer
              </label>
              <input
                type='text'
                name='correctAnswer'
                id='correctAnswer'
                value={questionData.correctAnswer}
                onChange={handleChange}
                placeholder='Enter correct answer'
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              />
            </div>

            {/* Explanation */}
            <div>
              <label
                htmlFor='explanation'
                className='block text-sm font-medium text-gray-700'
              >
                Explanation
              </label>
              <textarea
                name='explanation'
                id='explanation'
                value={questionData.explanation}
                onChange={handleChange}
                placeholder='Explain the answer'
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              />
            </div>

            {/* Buttons */}
            <div className='flex justify-center items-center gap-4'>
              <button
                type='button'
                onClick={handleSaveQuestion}
                className='w-full md:w-auto px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-md hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Save Question
              </button>
              <button
                type='button'
                onClick={handleAddQuestion}
                className='w-full md:w-auto px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-md hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
