import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import api from "../../service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";
import { TbTargetArrow } from "react-icons/tb";
import { MdLeaderboard } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

const JoinQuiz = () => {
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [privateQuizCode, setPrivateQuizCode] = useState("");
  const [showPrivateQuizModal, setShowPrivateQuizModal] = useState(false);
  const navigate = useNavigate();

  // Fetch all public quizzes
  useEffect(() => {
    const fetchPublicQuizzes = async () => {
      try {
        const path = ApiRoutes.GETALLQUIZZES.PATH;
        const authenticate = ApiRoutes.GETALLQUIZZES.authenticate;
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

  // Search quizzes by name or creator
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query.");
      return;
    }

    try {
      const path = `${ApiRoutes.SEARCHQUIZ.PATH}?name=${searchQuery}`;
      const authenticate = ApiRoutes.SEARCHQUIZ.authenticate;
      const response = await api.get(path, { authenticate });

      if (response) {
        setPublicQuizzes(response); // Update quizzes with search results
      } else {
        toast.error("No quizzes found for your search.");
      }
    } catch (error) {
      console.error("Error searching quizzes:", error);
      toast.error("Error occurred while searching for quizzes.");
    }
  };

  // Join a public quiz
  const handleJoinPublicQuiz = async (quizId) => {
    try {
      const path = ApiRoutes.JOINPUBLICQUIZ.PATH.replace(":quizId", quizId);
      const authenticate = ApiRoutes.JOINPUBLICQUIZ.authenticate;
      const response = await api.post(path, {}, { authenticate });

      if (response) {
        toast.success("Successfully joined the public quiz!");
        navigate(`/questions/quiz/${quizId}`);
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
        navigate(`/questions/quiz/${response.quiz._id}`);
      } else {
        toast.error("Failed to join the private quiz.");
      }
    } catch (error) {
      console.error("Error joining private quiz:", error);
      toast.error("Error occurred while joining the private quiz.");
    }
  };

  // Navigate to the leaderboard page
  const handleLeaderboard = (quizId) => {
    navigate(`/participants/getLeaderboard/${quizId}`);
  };

  return (
    <div>
      <NavBar />
      <div className='min-h-screen flex flex-col items-center mt-10 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl w-full bg-white p-6 shadow-lg rounded-lg'>
          <div className='flex justify-between mb-6'>
            <h1 className='text-4xl font-bold text-gray-900'>Join a Quiz</h1>
            <button
              onClick={() => setShowPrivateQuizModal(true)}
              className='px-4 py-2 bg-gray-900 text-white font-bold rounded-md hover:bg-black'
            >
              Join a Private Quiz
            </button>
          </div>

          {/* Search Bar */}
          <div className='mb-6 flex items-center'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by quiz name or creator'
              className='px-4 py-2 border border-gray-300 rounded-md mr-4 w-full outline-none'
            />
            <button
              onClick={handleSearch}
              className='flex items-center px-4 py-2 rounded-md bg-white text-black border border-black hover:bg-black hover:text-white'
            >
              <AiOutlineSearch className='mr-2' />
              Search
            </button>
          </div>

          {/* Public Quizzes Table */}
          <div className='overflow-x-auto'>
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
                {publicQuizzes.length > 0 ? (
                  publicQuizzes.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {quiz.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {quiz.creator?.name || "Unknown"}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right'>
                        <div className='flex flex-col md:flex-row md:justify-end gap-2'>
                          <button
                            onClick={() => handleJoinPublicQuiz(quiz._id)}
                            className='flex items-center px-4 py-2 rounded-md bg-white text-black border border-black hover:bg-black hover:text-white'
                          >
                            <TbTargetArrow className='mr-2' />
                            Attempt
                          </button>
                          <button
                            onClick={() => handleLeaderboard(quiz._id)}
                            className='flex items-center px-4 py-2 rounded-md bg-white text-black border border-black hover:bg-black hover:text-white'
                          >
                            <MdLeaderboard className='mr-2' />
                            Leaderboard
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan='4'
                      className='px-6 py-4 text-center text-gray-500'
                    >
                      No public quizzes available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Private Quiz Modal */}
      {showPrivateQuizModal && (
        <div
          className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
          aria-modal='true'
          role='dialog'
        >
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
                className='px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700'
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
