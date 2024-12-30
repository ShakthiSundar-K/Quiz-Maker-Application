import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import ApiRoutes from "../../utils/ApiRoutes";
import api from "../../service/ApiService";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const EditQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [quizName, setQuizName] = useState("");
  const { quizId } = useParams();
  const navigate = useNavigate(); // Initialize navigate

  // Fetch questions for the quiz
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const path = ApiRoutes.GETQUESTIONBYQUIZ.PATH.replace(
          ":quizId",
          quizId
        );
        const authenticate = ApiRoutes.GETQUESTIONBYQUIZ.authenticate;
        const response = await api.get(path, { authenticate });

        if (response && response.questions) {
          setQuestions(response.questions);
          setQuizName(response.quiz.name || "Quiz");
        } else {
          toast.error("Failed to load questions.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Error occurred while loading questions.");
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleEdit = (questionId) => {
    setEditingQuestionId(questionId);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };

  const handleChange = (e, questionId) => {
    const { name, value } = e.target;
    setQuestions((prev) =>
      prev.map((question) =>
        question._id === questionId
          ? {
              ...question,
              [name]:
                name === "correctAnswer" && question.type === "true/false"
                  ? value === "true"
                  : value,
            }
          : question
      )
    );
  };

  const handleSave = async (questionId) => {
    const question = questions.find((q) => q._id === questionId);

    try {
      const path = ApiRoutes.UPDATEQUESTION.PATH.replace(
        ":questionId",
        questionId
      );
      const authenticate = ApiRoutes.UPDATEQUESTION.authenticate;
      const requestBody = { options: question.options, ...question };

      const response = await api.put(path, requestBody, { authenticate });

      if (response) {
        toast.success("Question updated successfully!");
        setEditingQuestionId(null);
      } else {
        toast.error("Failed to update question.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Error occurred while updating question.");
    }
  };
  // Handle adding a new question
  const handleAddQuestions = () => {
    console.log(quizId);
    navigate(`/quiz/questions/${quizId}`); // Use quizId from useParams
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      const path = ApiRoutes.DELETEQUESTION.PATH.replace(
        ":questionId",
        questionId
      );
      const authenticate = ApiRoutes.DELETEQUESTION.authenticate;

      const response = await api.delete(path, { authenticate });

      if (response) {
        toast.success("Question deleted successfully!");
        setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      } else {
        toast.error("Failed to delete question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Error occurred while deleting question.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Manage Questions for {quizName}
          </h1>
          <button
            onClick={handleAddQuestions}
            className='p-2  text-black rounded-full shadow-md hover:bg-black hover:text-white'
            title='Add Question'
          >
            <FaPlus />
          </button>
        </div>

        <div className='space-y-6'>
          {questions.map((question) => (
            <div
              key={question._id}
              className='border p-4 rounded-lg shadow-md bg-gray-50'
            >
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Question Text
                </label>
                <textarea
                  name='text'
                  value={question.text}
                  onChange={(e) => handleChange(e, question._id)}
                  disabled={editingQuestionId !== question._id}
                  className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900 ${
                    editingQuestionId === question._id
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Options
                </label>
                {question.options.map((option, index) => (
                  <input
                    key={index}
                    name='options'
                    value={option}
                    onChange={(e) =>
                      handleChange(
                        {
                          target: {
                            name: "options",
                            value: [
                              ...question.options.slice(0, index),
                              e.target.value,
                              ...question.options.slice(index + 1),
                            ],
                          },
                        },
                        question._id
                      )
                    }
                    disabled={editingQuestionId !== question._id}
                    className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900 ${
                      editingQuestionId === question._id
                        ? "bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                ))}
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Correct Answer
                </label>
                {question.type === "true/false" ? (
                  <select
                    name='correctAnswer'
                    value={question.correctAnswer}
                    onChange={(e) => handleChange(e, question._id)}
                    disabled={editingQuestionId !== question._id}
                    className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900 ${
                      editingQuestionId === question._id
                        ? "bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                ) : (
                  <input
                    name='correctAnswer'
                    value={question.correctAnswer}
                    onChange={(e) => handleChange(e, question._id)}
                    disabled={editingQuestionId !== question._id}
                    className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900 ${
                      editingQuestionId === question._id
                        ? "bg-white"
                        : "bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                )}
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Explanation
                </label>
                <textarea
                  name='explanation'
                  value={question.explanation || ""}
                  onChange={(e) => handleChange(e, question._id)}
                  disabled={editingQuestionId !== question._id}
                  className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900 ${
                    editingQuestionId === question._id
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className='flex justify-end space-x-4'>
                {editingQuestionId === question._id ? (
                  <>
                    <button
                      onClick={() => handleSave(question._id)}
                      className='px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500'
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className='px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(question._id)}
                      className='px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question._id)}
                      className='px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
