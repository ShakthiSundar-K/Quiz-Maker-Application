import { Navigate } from "react-router-dom";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import CreateQuiz from "../components/common/CreateQuiz";
import JoinQuiz from "../components/common/JoinQuiz";

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
    path: "*",
    element: <Navigate to='/' />,
  },
];

export default AppRoutes;
