import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuth = !!localStorage.getItem("userUID"); // your auth logic

  return isAuth ? <Outlet /> : <Navigate to="/login/student" replace />;
};

const CompanyProtectedRoute = () => {
    const isAuthcomp = !!localStorage.getItem("company UID"); // your auth logic
    return isAuthcomp ? <Outlet /> : <Navigate to="/login/company" replace />;
  };
  
export {ProtectedRoute, CompanyProtectedRoute};