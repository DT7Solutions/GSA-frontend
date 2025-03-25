import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("accessToken"); // Get the token from local storage

  return token ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
