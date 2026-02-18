import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ requiredRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token || !role) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    if (!requiredRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  } catch (err) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
};


export default PrivateRoute;







// previous code 
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   const token = localStorage.getItem("accessToken"); // Get the token from local storage

//   return token ? <Outlet /> : <Navigate to="/Login" />;
// };