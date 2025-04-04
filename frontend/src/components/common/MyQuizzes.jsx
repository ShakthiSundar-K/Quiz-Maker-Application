import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaChartBar } from "react-icons/fa";
import ApiRoutes from "../../utils/ApiRoutes";
import api from "../../service/ApiService";
import toast from "react-hot-toast";
import NavBar from "./NavBar";

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const path = ApiRoutes.GETQUIZBYUSER.PATH;
        const authenticate = ApiRoutes.GETQUIZBYUSER.authenticate;

        const response = await api.get(path, { authenticate });

        if (response) {
          setQuizzes(response);
          toast.success("Quizzes loaded successfully!");
        } else {
          toast.error("Failed to load quizzes.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch quizzes. Please try again."
        );
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <NavBar />
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-6 text-center'>My Quizzes</h1>
        {quizzes.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='table-auto w-full max-w-4xl mx-auto bg-white border border-gray-300 shadow-md rounded-lg'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-sm font-medium text-gray-800'>
                    S.No
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-medium text-gray-800'>
                    Quiz Name
                  </th>
                  <th className='px-6 py-3 text-center text-sm font-medium text-gray-800'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={quiz._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm text-gray-800'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-800 font-medium'>
                      {quiz.name}
                    </td>
                    <td className='px-6 py-4 space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-start sm:items-center'>
                      <button
                        className='px-4 py-2 text-black round`ed-md hover:bg-black hover:text-white flex items-center space-x-2 border border-black'
                        onClick={() => navigate(`/quizzes/update/${quiz._id}`)}
                      >
                        <FaEdit className='text-lg' />
                        <span>Edit Quiz</span>
                      </button>
                      <button
                        className='px-4 py-2 text-black rounded-md hover:bg-black hover:text-white flex items-center space-x-2 border border-black'
                        onClick={() =>
                          navigate(`/questions/update/${quiz._id}`)
                        }
                      >
                        <FaEdit className='text-lg' />
                        <span>Edit Questions</span>
                      </button>
                      <button
                        className='px-4 py-2 text-black rounded-md hover:bg-black hover:text-white flex items-center space-x-2 border border-black'
                        onClick={() => navigate(`/analytics/quiz/${quiz._id}`)}
                      >
                        <FaChartBar className='text-lg' />
                        <span>Analysis</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-center text-gray-600'>
            No quizzes found. Create your first quiz!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;
