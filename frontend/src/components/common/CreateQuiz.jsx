import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import ApiRoutes from "../../utils/ApiRoutes";
import api from "../../service/ApiService";

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    name: "",
    type: "public",
    timer: {
      type: "overall",
      duration: "",
    },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("timer")) {
      const key = name.split(".")[1];
      setQuizData((prev) => ({
        ...prev,
        timer: {
          ...prev.timer,
          [key]: value,
        },
      }));
    } else {
      setQuizData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const path = ApiRoutes.CREATEQUIZ.PATH;
      const authenticate = ApiRoutes.CREATEQUIZ.authenticate;
      const response = await api.post(path, quizData, { authenticate });

      if (response) {
        toast.success("Quiz created successfully!");
        return response._id; // Returning quizId from the response
      } else {
        toast.error("Failed to create quiz.");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Error creating quiz.");
    }
  };

  const handleAddQuestions = async () => {
    const quizId = await handleCreateQuiz(); // First create the quiz and get quizId
    if (quizId) {
      // Navigate to the questions page with quizId
      navigate(`/quiz/questions/${quizId}`);
    }
  };

  const handleAddFromPool = async () => {
    const quizId = await handleCreateQuiz(); // First create the quiz and get quizId
    if (quizId) {
      // Navigate to the "add from pool" page with quizId
      navigate(`/add-from-pool/${quizId}`);
    }
  };

  return (
    <div className='bg-gradient-to-tr from-gray-50 via-pink-100 to-pink-500'>
      <NavBar />
      <div className='bg-gray-50 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl w-full bg-white p-6 shadow-lg rounded-lg'>
          <h1 className='text-4xl font-bold text-gray-900 text-center mb-6'>
            Create a New Quiz
          </h1>
          <form className='space-y-6'>
            {/* Quiz Name */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Quiz Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                value={quizData.name}
                onChange={handleChange}
                placeholder='Enter quiz name'
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              />
            </div>

            {/* Quiz Type */}
            <div>
              <label
                htmlFor='type'
                className='block text-sm font-medium text-gray-700'
              >
                Quiz Type
              </label>
              <select
                name='type'
                id='type'
                value={quizData.type}
                onChange={handleChange}
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              >
                <option value='public'>Public</option>
                <option value='private'>Private</option>
              </select>
            </div>

            {/* Timer Type */}
            <div>
              <label
                htmlFor='timer.type'
                className='block text-sm font-medium text-gray-700'
              >
                Timer Type
              </label>
              <select
                name='timer.type'
                id='timer.type'
                value={quizData.timer.type}
                onChange={handleChange}
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              >
                <option value='overall'>Overall</option>
                <option value='per-question'>Per Question</option>
              </select>
            </div>

            {/* Timer Duration */}
            <div>
              <label
                htmlFor='timer.duration'
                className='block text-sm font-medium text-gray-700'
              >
                Timer Duration (in seconds)
              </label>
              <input
                type='number'
                name='timer.duration'
                id='timer.duration'
                value={quizData.timer.duration}
                onChange={handleChange}
                placeholder='Enter duration in seconds'
                className='mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-900 focus:border-gray-900'
              />
            </div>

            {/* Buttons */}
            <div className='flex justify-center items-center gap-4'>
              <button
                type='button'
                onClick={handleAddQuestions}
                className='w-full md:w-auto px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-md hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Add Questions
              </button>
              <button
                type='button'
                onClick={handleAddFromPool}
                className='w-full md:w-auto px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-md hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Add From Pool
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
