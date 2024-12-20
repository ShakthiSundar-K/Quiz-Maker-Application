import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import ApiRoutes from "../../utils/ApiRoutes";
import api from "../../service/ApiService";

const EditQuiz = () => {
  const [quizData, setQuizData] = useState({
    name: "",
    type: "public",
    timer: {
      type: "overall",
      duration: "",
    },
  });

  const navigate = useNavigate();
  const { id: quizId } = useParams();

  // Fetch quiz details by ID
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const path = ApiRoutes.GETQUIZBYID.PATH.replace(":id", quizId);
        const authenticate = ApiRoutes.GETQUIZBYID.authenticate;
        const response = await api.get(path, { authenticate });

        if (response) {
          setQuizData({
            name: response.name,
            type: response.type,
            timer: response.timer || { type: "overall", duration: "" },
          });
        } else {
          toast.error("Failed to load quiz details.");
        }
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        toast.error("Error occurred while fetching quiz details.");
      }
    };

    fetchQuizDetails();
  }, [quizId]);

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

  const handleUpdateQuiz = async () => {
    try {
      const path = ApiRoutes.UPDATEQUIZ.PATH.replace(":id", quizId);
      const authenticate = ApiRoutes.UPDATEQUIZ.authenticate;
      const response = await api.put(path, quizData, { authenticate });

      if (response) {
        toast.success("Quiz updated successfully!");
        navigate(`/quiz/details/${quizId}`); // Navigate to quiz details page
      } else {
        toast.error("Failed to update the quiz.");
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error("Error occurred while updating the quiz.");
    }
  };

  return (
    <div className='bg-gradient-to-tr from-gray-50 via-pink-100 to-pink-500'>
      <NavBar />
      <div className='bg-gray-50 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl w-full bg-white p-6 shadow-lg rounded-lg'>
          <h1 className='text-4xl font-bold text-gray-900 text-center mb-6'>
            Edit Quiz
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
                onClick={handleUpdateQuiz}
                className='w-full md:w-auto px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-md hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Update Quiz
              </button>
              <button
                type='button'
                onClick={() => navigate(-1)} // Go back to the previous page
                className='w-full md:w-auto px-8 py-3 text-lg font-bold text-white bg-gray-900 rounded-md hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
