import React from "react";

const ScorePage = ({ score, totalQuestions, evaluatedAnswers }) => {
  // Calculate the number of attended questions
  const attendedQuestions = evaluatedAnswers.filter(
    (answer) => answer.userAnswer
  ).length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-8'>
      {/* Score Display */}
      <div className='text-center bg-white shadow-xl p-8 rounded-lg w-11/12 md:w-2/3 lg:w-1/2'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4 animate-fade-in'>
          🎉 Your Score 🎉
        </h1>
        <div className='text-6xl font-extrabold text-indigo-600 mb-2'>
          {score} / {totalQuestions}
        </div>
        <p className='text-gray-700 text-lg mb-4'>
          Attended Questions: {attendedQuestions} / {totalQuestions}
        </p>
        <div className='flex justify-center gap-4'>
          <button className='px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none transition-transform transform hover:scale-105'>
            Retry Quiz
          </button>
          <button className='px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 focus:outline-none transition-transform transform hover:scale-105'>
            View Leaderboard
          </button>
        </div>
      </div>

      {/* Questions Review */}
      <div className='mt-8 w-11/12 md:w-2/3 lg:w-1/2 space-y-6'>
        {evaluatedAnswers.map((answer, index) => (
          <div
            key={index}
            className={`p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 ${
              !answer.isCorrect
                ? "border-l-4 border-red-500 bg-red-50"
                : "border-l-4 border-green-500 bg-green-50"
            }`}
          >
            <h2 className='text-lg font-bold text-gray-800 mb-2'>
              {index + 1}. {answer.questionText}
            </h2>
            <p className='text-gray-700'>
              <strong>Your Answer:</strong>{" "}
              <span
                className={`${
                  answer.isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {answer.userAnswer}
              </span>
            </p>
            <p className='text-gray-700'>
              <strong>Correct Answer:</strong> {answer.correctAnswer}
            </p>
            {!answer.isCorrect && answer.explanation && (
              <p className='text-sm text-gray-600 mt-2'>
                <strong>Explanation:</strong> {answer.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorePage;
