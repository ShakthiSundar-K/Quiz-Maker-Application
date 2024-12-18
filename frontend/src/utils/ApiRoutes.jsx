const ApiRoutes = {
  LOGIN: {
    path: "/auth/login",
    authenticate: false,
  },
  SIGNUP: {
    path: "/auth/createUser",
    authenticate: false,
  },
  ForgotPassword: {
    path: "/auth/forgotPassword",
    authenticate: false,
  },
  RESETPASSWORD: {
    path: "/auth/resetPassword",
    authenticate: false,
  },
  // Create Quiz
  CREATEQUIZ: {
    PATH: "/quizzes/create",
    authenticate: true,
  },
  // Get All Quizzes Created by User
  GETQUIZBYUSER: {
    PATH: "/quizzes/user-quizzes",
    authenticate: true,
  },
  // Get all quizzes
  GETALLQUIZZES: {
    PATH: "/quizzes/getAllQuizzes",
    authenticate: true,
  },
  // Update Quiz
  UPDATEQUIZ: {
    PATH: "/quizzes/update/:id",
    authenticate: true,
  },
  //Delete Quiz
  DELETEQUIZ: {
    PATH: "/quizzes/delete/:id",
    authenticate: true,
  },
  // Search Quiz
  SEARCHQUIZ: {
    PATH: "/quizzes/searchQuizzes",
    authenticate: true,
  },
  // Get Quiz by ID
  GETQUIZBYID: {
    PATH: "/quizzes/:id",
    authenticate: true,
  },
  // Create Question
  CREATEQUESTION: {
    PATH: "/questions/create",
    authenticate: true,
  },
  // Update Question
  UPDATEQUESTION: {
    PATH: "/questions/update/:questionId",
    authenticate: true,
  },
  // Delete Question
  DELETEQUESTION: {
    PATH: "/questions/delete/:questionId",
    authenticate: true,
  },
  // Get Questions for a Specific Quiz
  GETQUESTIONBYQUIZ: {
    PATH: "/questions/quiz/:quizId",
    authenticate: true,
  },
  // Reusable Questions
  ADDQUESTIONTOPOOL: {
    PATH: "/questions/pool/create",
    authenticate: true,
  },
  UPDATEQUESTIONINPOOL: {
    PATH: "/questions/pool/update/:questionId",
    authenticate: true,
  },
  DELETEQUESTIONINPOOL: {
    PATH: "/questions/pool/delete/:questionId",
    authenticate: true,
  },
  SEARCHQUESTIONINPOOL: {
    PATH: "/questions/pool/search",
    authenticate: true,
  },
  // Adding Reusable Questions to a Quiz
  ADDQUESTIONTOQUIZ: {
    PATH: "/questions/pool/add-to-quiz/:quizId",
    authenticate: true,
  },
  GETQUESTIONSFROMPOOL: {
    PATH: "/questions/pool",
    authenticate: true,
  },
  // Submit Answers
  SUBMITANSWER: {
    PATH: "/participants/submit",
    authenticate: true,
  },
  // Get LeaderBoard
  GETLEADERBOARD: {
    PATH: "/participants/getLeaderboard/:quizId",
    authenticate: true,
  },
  // Join private Quiz
  JOINPRIVATEQUIZ: {
    PATH: "/participants/join-private-quiz",
    authenticate: true,
  },
  // Join public Quiz
  JOINPUBLICQUIZ: {
    PATH: "/participants/join-public-quiz/:quizId",
    authenticate: true,
  },
  // Get Quiz Analytics
  GETQUIZANALYTICS: {
    PATH: "/analytics/quiz/:quizId",
    authenticate: true,
  },
};

export default ApiRoutes;
