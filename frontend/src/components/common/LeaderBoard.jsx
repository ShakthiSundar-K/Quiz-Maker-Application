import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";
import toast from "react-hot-toast";
import NavBar from "./NavBar";

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const { quizId } = useParams(); // Get quizId from URL parameters

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const path = ApiRoutes.GETLEADERBOARD.PATH.replace(":quizId", quizId);
        const authenticate = ApiRoutes.GETLEADERBOARD.authenticate;
        const response = await api.get(path, { authenticate });

        if (response) {
          setLeaderboardData(response); // Store the leaderboard data
        } else {
          toast.error("Failed to fetch leaderboard data.");
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Error occurred while fetching leaderboard data.");
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  // Helper function to determine the ranking style
  const getRankingStyle = (rank) => {
    switch (rank) {
      case 0:
        return "bg-yellow-400 text-white"; // 1st place (gold)
      case 1:
        return "bg-gray-300 text-gray-800"; // 2nd place (silver)
      case 2:
        return "bg-orange-400 text-white"; // 3rd place (bronze)
      default:
        return "bg-white text-gray-900"; // Rest
    }
  };

  if (!leaderboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className='min-h-screen flex flex-col items-center mt-10 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl w-full bg-white p-6 shadow-lg rounded-lg'>
          <h1 className='text-4xl font-bold text-gray-900 mb-6'>
            Leaderboard - {leaderboardData.quiz}
          </h1>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Rank
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Participant
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Score
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Time Taken (s)
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {leaderboardData.rankings.map((ranking, index) => (
                  <tr
                    key={ranking._id}
                    className={`${getRankingStyle(index)} border-b`}
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {ranking.participant.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {ranking.score}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {ranking.timeTaken}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
