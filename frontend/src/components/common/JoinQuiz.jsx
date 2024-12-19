import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import api from "../../service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";

const JoinQuiz = () => {
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [privateQuizCode, setPrivateQuizCode] = useState("");
  const [showPrivateQuizModal, setShowPrivateQuizModal] = useState(false);
  const navigate = useNavigate();

  // Fetch all public quizzes
  useEffect(() => {
    const fetchPublicQuizzes = async () => {
      try {
        const path = ApiRoutes.GETALLQUIZZES.PATH; // Adjust to your endpoint
        const authenticate = ApiRoutes.GETALLQUIZZES.authenticate; // Adjust if needed
        const response = await api.get(path, { authenticate });

        if (response) {
          setPublicQuizzes(response);
        } else {
          toast.error("Failed to fetch public quizzes.");
        }
      } catch (error) {
        console.error("Error fetching public quizzes:", error);
        toast.error("Error occurred while fetching public quizzes.");
      }
    };

    fetchPublicQuizzes();
  }, []);

  // Join a public quiz
  const handleJoinPublicQuiz = async (quizId) => {
    try {
      const path = ApiRoutes.JOINPUBLICQUIZ.PATH.replace(":quizId", quizId);
      const authenticate = ApiRoutes.JOINPUBLICQUIZ.authenticate;
      const response = await api.post(path, {}, { authenticate });

      if (response) {
        toast.success("Successfully joined the public quiz!");
        navigate(`/questions/quiz/${quizId}`); // Navigate to the quiz page or as needed
      } else {
        toast.error("Failed to join the public quiz.");
      }
    } catch (error) {
      console.error("Error joining public quiz:", error);
      toast.error("Error occurred while joining the public quiz.");
    }
  };

  // Join a private quiz
  const handleJoinPrivateQuiz = async () => {
    if (!privateQuizCode) {
      toast.error("Please enter a valid quiz code.");
      return;
    }

    try {
      const path = ApiRoutes.JOINPRIVATEQUIZ.PATH;
      const authenticate = ApiRoutes.JOINPRIVATEQUIZ.authenticate;
      const response = await api.post(
        path,
        { quizCode: privateQuizCode },
        { authenticate }
      );

      if (response) {
        toast.success("Successfully joined the private quiz!");
        navigate(`/questions/quiz/${response.quiz._id}`); // Navigate to the quiz page or as needed
      } else {
        toast.error("Failed to join the private quiz.");
      }
    } catch (error) {
      console.error("Error joining private quiz:", error);
      toast.error("Error occurred while joining the private quiz.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className='min-h-screen flex flex-col items-center mt-10 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl w-full bg-white p-6 shadow-lg rounded-lg'>
          <div className='flex justify-between  mb-6'>
            <h1 className='text-4xl font-bold text-gray-900'>Join a Quiz</h1>
            <button
              onClick={() => setShowPrivateQuizModal(true)}
              className='px-4 py-2 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-600'
            >
              Join a Private Quiz
            </button>
          </div>
          {/* Public Quizzes Table */}
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  S.No
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Quiz Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Creator
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {publicQuizzes.map((quiz, index) => (
                <tr key={quiz._id}>
                  <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{quiz.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {quiz.creator.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right'>
                    <button
                      onClick={() => handleJoinPublicQuiz(quiz._id)}
                      className='px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-blue-500'
                    >
                      Attempt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Quiz Modal */}
      {showPrivateQuizModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-md shadow-lg max-w-sm w-full'>
            <h2 className='text-xl font-bold mb-4'>Enter Private Quiz Code</h2>
            <input
              type='text'
              value={privateQuizCode}
              onChange={(e) => setPrivateQuizCode(e.target.value)}
              placeholder='Enter Quiz Code'
              className='w-full px-3 py-2 border border-gray-300 rounded-md mb-4'
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowPrivateQuizModal(false)}
                className='px-4 py-2 bg-gray-300 text-gray-900 font-bold rounded-md hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleJoinPrivateQuiz}
                className='px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500'
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinQuiz;
