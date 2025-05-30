import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ use named import

const PrivateRoute = () => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("accessToken"); // Clear expired token
        return <Navigate to="/Login" />;
      }

      return <Outlet />;
    } catch (error) {
      localStorage.removeItem("accessToken"); // Token is invalid
      return <Navigate to="/Login" />;
    }
  }

  return <Navigate to="/Login" />;
};

export default PrivateRoute;


// previous code 
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = () => {
//   const token = localStorage.getItem("accessToken"); // Get the token from local storage

//   return token ? <Outlet /> : <Navigate to="/Login" />;
// };