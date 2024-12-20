import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../service/ApiService";
import ApiRoutes from "../../utils/ApiRoutes";
import NavBar from "./NavBar";

const DisplayQuestions = () => {
  const { quizId } = useParams();
  const timerRef = useRef(null);
  const [quizData, setQuizData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [viewOption, setViewOption] = useState("single");
  const [score, setScore] = useState(0);
  const [evaluatedAnswers, setEvaluatedAnswers] = useState([]);
  const [timer, setTimer] = useState(0); // Timer for current question
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isOverallTimer, setIsOverallTimer] = useState(false);
  const [isTrackingDisabled, setIsTrackingDisabled] = useState(false); // New state to disable tracking features

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const authenticate = ApiRoutes.GETQUESTIONBYQUIZ.authenticate;
        const response = await api.get(
          ApiRoutes.GETQUESTIONBYQUIZ.PATH.replace(":quizId", quizId),
          { authenticate }
        );
        const quiz = response.quiz;
        const questions = response.questions;

        setQuizData(quiz);
        setQuestions(questions);

        // Check for quiz timer and set default to 0 if undefined
        const quizTimer = quiz.timer?.duration || 0;
        setTimer(quizTimer); // Set the overall quiz timer from quiz data

        if (quiz.timer?.type === "overall") {
          setIsOverallTimer(true);
          setIsSoundOn(true); // Sound alert for countdown
        }

        if (quiz.timer?.type === "per_question") {
          setIsSoundOn(true); // Sound alert for per question countdown
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("Failed to load quiz data.");
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    // Reset the timer each time the current question index changes
    if (!isQuizFinished && questions.length > 0) {
      setTimer(quizData.timer?.duration || 0); // Reset to quiz timer duration
      setIsTimerActive(true);
    }
  }, [currentQuestionIndex, quizData.timer?.duration, isQuizFinished]);

  useEffect(() => {
    let interval;
    if (timer > 0 && !isQuizFinished && isTimerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer <= 0 && !isQuizFinished) {
      if (isOverallTimer) {
        handleSubmitQuiz(); // Auto-submit when overall timer ends
      } else if (currentQuestionIndex === questions.length - 1) {
        handleSubmitQuiz(); // Auto-submit when last question timer ends
      } else {
        handleNextQuestion(); // Auto-move to next question
      }
    }

    return () => clearInterval(interval);
  }, [timer, isQuizFinished, isTimerActive]);

  const handleAnswerChange = (questionId, userAnswer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const answerIndex = updatedAnswers.findIndex(
        (answer) => answer.questionId === questionId
      );
      if (answerIndex === -1) {
        updatedAnswers.push({ questionId, userAnswer });
      } else {
        updatedAnswers[answerIndex] = { questionId, userAnswer };
      }
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (answers.length === 0 || answers.some((answer) => !answer.userAnswer)) {
      toast.error("You need to answer at least one question.");
      return; // Prevent submission if no answers
    }

    try {
      const authenticate = ApiRoutes.SUBMITANSWER.authenticate;
      const response = await api.post(
        ApiRoutes.SUBMITANSWER.PATH,
        { quizId, answers },
        { authenticate }
      );

      const evaluated = response.evaluatedAnswers;
      const calculatedScore = evaluated.filter(
        (answer) => answer.isCorrect
      ).length;

      setScore(calculatedScore);
      setEvaluatedAnswers(evaluated);
      setIsQuizFinished(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Error occurred while submitting quiz.");
    }
  };

  useEffect(() => {
    if (timer <= 10 && isSoundOn) {
      const audio = new Audio("../../assets/countdown.mp3");
      audio.play();
    }
  }, [timer, isSoundOn]);

  const attendedQuestionsCount = answers.filter(
    (answer) => answer.userAnswer
  ).length;

  return (
    <div>
      <NavBar />
      <div className='max-w-3xl mx-auto p-4'>
        <div className='text-center mb-8'>
          <h3 className='text-xl font-semibold'>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <h4 className='text-lg mt-2'>
            Attended Questions: {attendedQuestionsCount} / {questions.length}
          </h4>
        </div>

        <div className='text-center mb-8'>
          {!isQuizFinished && (
            <div className='mt-4 flex justify-center'>
              <button
                onClick={() => setViewOption("single")}
                className={`py-2 px-6 mx-2 rounded-lg transition-all duration-300 ${
                  viewOption === "single"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                disabled={isTrackingDisabled} // Disable when quiz is finished
              >
                One Question at a Time
              </button>
              <button
                onClick={() => setViewOption("all")}
                className={`py-2 px-6 mx-2 rounded-lg transition-all duration-300 ${
                  viewOption === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                disabled={isTrackingDisabled} // Disable when quiz is finished
              >
                All Questions
              </button>
            </div>
          )}
        </div>

        <div className='space-y-6'>
          {!isQuizFinished && (
            <div className='bg-white p-6 rounded-lg shadow-lg mb-4'>
              <h2 className='text-2xl font-bold'>{timer} seconds</h2>
              <div className='flex justify-center'>
                <span className='text-sm text-gray-500'>
                  {isOverallTimer ? "Overall Time" : "Per Question Time"}
                </span>
              </div>
              <div className='relative pt-1'>
                <div className='flex mb-2 items-center justify-between'>
                  <div className='flex w-full'>
                    <span
                      style={{
                        width: `${(timer / quizData.timer?.duration) * 100}%`,
                        backgroundColor: timer <= 10 ? "red" : "green", // Change color when timer is <= 10 seconds
                      }}
                      className='h-1 rounded-full'
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {viewOption === "single" && !isQuizFinished && (
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-semibold mb-4'>
              {questions[currentQuestionIndex]?.text}
            </h2>
            <div className='space-y-4'>
              {questions[currentQuestionIndex]?.options?.map(
                (option, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-2'
                    onClick={() =>
                      handleAnswerChange(
                        questions[currentQuestionIndex]._id,
                        option
                      )
                    }
                  >
                    <input
                      type='radio'
                      name={`question-${questions[currentQuestionIndex]._id}`}
                      value={option}
                      checked={answers.find(
                        (answer) =>
                          answer.questionId ===
                            questions[currentQuestionIndex]._id &&
                          answer.userAnswer === option
                      )}
                      onChange={(e) =>
                        handleAnswerChange(
                          questions[currentQuestionIndex]._id,
                          e.target.value
                        )
                      }
                      className='form-radio text-purple-600 transition-all duration-300 transform hover:scale-105'
                    />
                    <label className='text-lg'>{option}</label>
                  </div>
                )
              )}

              {!questions[currentQuestionIndex]?.options && (
                <textarea
                  onChange={(e) =>
                    handleAnswerChange(
                      questions[currentQuestionIndex]._id,
                      e.target.value
                    )
                  }
                  placeholder='Write your answer'
                  className='w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
                />
              )}
            </div>

            <div className='flex justify-between mt-6'>
              <button
                onClick={handlePrevQuestion}
                disabled={
                  currentQuestionIndex === 0 ||
                  quizData.timer?.type === "per_question"
                }
                className='py-2 px-4 bg-gray-300 rounded-lg cursor-pointer disabled:opacity-50'
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex === questions.length - 1 ||
                  quizData.timer?.type === "per_question"
                }
                className='py-2 px-4 bg-purple-600 text-white rounded-lg disabled:opacity-50'
              >
                Next Question
              </button>
              <button
                onClick={handleSubmitQuiz}
                className='py-2 px-4 bg-purple-600 text-white rounded-lg'
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {viewOption === "all" && !isQuizFinished && (
          <div className='space-y-6'>
            {questions.map((question) => (
              <div
                key={question._id}
                className='bg-white p-6 rounded-lg shadow-lg'
              >
                <h2 className='text-2xl font-semibold mb-4'>{question.text}</h2>
                <div className='space-y-4'>
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-2'
                      onClick={() => handleAnswerChange(question._id, option)}
                    >
                      <input
                        type='radio'
                        name={`question-${question._id}`}
                        value={option}
                        checked={answers.find(
                          (answer) =>
                            answer.questionId === question._id &&
                            answer.userAnswer === option
                        )}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        }
                        className='form-radio text-purple-600 transition-all duration-300 transform hover:scale-105'
                      />
                      <label className='text-lg'>{option}</label>
                    </div>
                  ))}

                  {!question.options && (
                    <textarea
                      onChange={(e) =>
                        handleAnswerChange(question._id, e.target.value)
                      }
                      placeholder='Write your answer'
                      className='w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
                    />
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmitQuiz}
              className='py-2 px-6 bg-purple-600 text-white rounded-lg w-full mt-6'
            >
              Submit Quiz
            </button>
          </div>
        )}

        {isQuizFinished && (
          <div className='text-center'>
            <h2 className='text-3xl font-semibold'>🎉 Quiz Completed! 🥳</h2>
            <p className='text-lg mt-4'>
              Your score: {score} / {questions.length} 🎯
            </p>
            <p className='text-lg mt-2'>
              Questions Attended: {evaluatedAnswers.length} / {questions.length}{" "}
              📋
            </p>

            <div className='mt-6'>
              <h3 className='text-2xl font-semibold mb-4'>Evaluation</h3>
              <div className='space-y-4'>
                {evaluatedAnswers.map((evaluatedAnswer, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      evaluatedAnswer.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <p className='font-bold'>{questions[index].text}</p>
                    <p>
                      Your Answer:{" "}
                      <span className='font-semibold'>
                        {evaluatedAnswer.userAnswer}
                      </span>
                      {evaluatedAnswer.isCorrect ? (
                        <span className='ml-2 text-green-700'>✅</span>
                      ) : (
                        <span className='ml-2 text-red-700'>❌</span>
                      )}
                    </p>
                    <p>
                      Correct Answer:{" "}
                      <span className='font-semibold'>
                        {evaluatedAnswer.correctAnswer}
                      </span>
                      {evaluatedAnswer.isCorrect ? (
                        <span className='ml-2 text-green-700'>✅</span>
                      ) : (
                        <span className='ml-2 text-red-700'>❌</span>
                      )}
                    </p>
                    <p className='italic'>{questions[index].explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-6'>
              <button
                onClick={() => window.location.reload()}
                className='py-2 px-6 bg-purple-600 text-white rounded-lg w-full'
              >
                Retry Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayQuestions;
