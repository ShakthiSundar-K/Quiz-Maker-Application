import { Navigate } from "react-router-dom";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import CreateQuiz from "../components/common/CreateQuiz";
import JoinQuiz from "../components/common/JoinQuiz";
import AddQuestions from "../components/common/AddQuestions";
import DisplayQuestions from "../components/common/DisplayQuestions";
import MyQuizzes from "../components/common/MyQuizzes";
import EditQuestion from "../components/common/EditQuestion";
import EditQuiz from "../components/common/EditQuiz";
import Analysis from "../components/common/Analysis";
import LeaderBoard from "../components/common/LeaderBoard";

const AppRoutes = [
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/resetpassword/:token",
    element: <ResetPassword />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quizzes/create",
    element: (
      <ProtectedRoute>
        <CreateQuiz />
      </ProtectedRoute>
    ),
  },
  {
    path: "/participants/join-quiz",
    element: (
      <ProtectedRoute>
        <JoinQuiz />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quiz/questions/:quizId",
    element: (
      <ProtectedRoute>
        <AddQuestions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions/quiz/:quizId",
    element: (
      <ProtectedRoute>
        <DisplayQuestions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions/update/:quizId",
    element: (
      <ProtectedRoute>
        <EditQuestion />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quizzes/update/:id",
    element: (
      <ProtectedRoute>
        <EditQuiz />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics/quiz/:quizId",
    element: (
      <ProtectedRoute>
        <Analysis />
      </ProtectedRoute>
    ),
  },
  {
    path: "/quizzes/user-quizzes",
    element: (
      <ProtectedRoute>
        <MyQuizzes />
      </ProtectedRoute>
    ),
  },
  {
    path: "/participants/getLeaderboard/:quizId",
    element: (
      <ProtectedRoute>
        <LeaderBoard />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: <Navigate to='/home' />,
  },
];

export default AppRoutes;
