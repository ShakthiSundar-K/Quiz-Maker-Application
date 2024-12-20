import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ApiRoutes from "../../utils/ApiRoutes";
import api from "../../service/ApiService";
import NavBar from "./NavBar";

const Analysis = () => {
  const [analytics, setAnalytics] = useState(null);
  const { quizId } = useParams();

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const path = ApiRoutes.GETQUIZANALYTICS.PATH.replace(":quizId", quizId);
        const authenticate = ApiRoutes.GETQUIZANALYTICS.authenticate;
        const response = await api.get(path, { authenticate });

        if (response) {
          setAnalytics(response);
        } else {
          toast.error("Failed to load quiz analytics.");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Error occurred while loading quiz analytics.");
      }
    };

    fetchAnalytics();
  }, [quizId]);

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className='p-6 bg-gray-100 min-h-screen'>
        <div className='max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8'>
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
            Quiz Analysis for {analytics.quiz.name}
          </h1>

          {/* Most Missed Questions */}
          <div className='p-4 bg-gray-50 shadow-md rounded-lg mb-8'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Most Missed Questions
            </h2>
            <div className='space-y-4'>
              {analytics.mostMissedQuestions.map((q) => (
                <div
                  key={q.questionId}
                  className='p-4 bg-gray-200 rounded-lg shadow-md'
                >
                  <h3 className='text-lg font-bold text-gray-800'>{q.text}</h3>
                  <p className='text-gray-600'>
                    <span className='font-semibold'>Correct Answer:</span>{" "}
                    {q.correctAnswer ? "True" : "False"}
                  </p>
                  <p className='text-gray-600'>
                    <span className='font-semibold'>Explanation:</span>{" "}
                    {q.explanation}
                  </p>
                  <p className='text-gray-600'>
                    <span className='font-semibold'>Misses:</span> {q.misses}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Participant Performance Table */}
          <div className='p-4 bg-gray-50 shadow-md rounded-lg'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Participant Performance
            </h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 border-b text-left'>Name</th>
                    <th className='px-4 py-2 border-b text-left'>Email</th>
                    <th className='px-4 py-2 border-b text-right'>Score</th>
                    <th className='px-4 py-2 border-b text-right'>
                      Correct Answers
                    </th>
                    <th className='px-4 py-2 border-b text-right'>
                      Incorrect Answers
                    </th>
                    <th className='px-4 py-2 border-b text-right'>
                      Time Taken
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.performance.map((p) => (
                    <tr key={p.participant.id}>
                      <td className='px-4 py-2 border-b'>
                        {p.participant.name}
                      </td>
                      <td className='px-4 py-2 border-b'>
                        {p.participant.email}
                      </td>
                      <td className='px-4 py-2 border-b text-right'>
                        {p.score}/{p.totalQuestions}
                      </td>
                      <td className='px-4 py-2 border-b text-right'>
                        {p.correctAnswers}
                      </td>
                      <td className='px-4 py-2 border-b text-right'>
                        {p.incorrectAnswers}
                      </td>
                      <td className='px-4 py-2 border-b text-right'>
                        {p.timeTaken}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
