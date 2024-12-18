import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export const useLogout = () => {
  let navigate = useNavigate();
  return () => {
    console.log("Logging out...");
    sessionStorage.clear();
    toast.success("Logout Successfull");
    navigate("/");
  };
};
