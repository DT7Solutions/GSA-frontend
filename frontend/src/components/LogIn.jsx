import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
// import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";

const Login = () => {
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/Dashboard2");
    }


  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;
    if (isOtpLogin) {
      console.log("Phone Number:", phoneNumber);
    } else {
      console.log("email:", email, "Password:", password, "Remember Me:", rememberMe);
    }

    try {
      const endpoint = isOtpLogin ? "api/auth/login/" : "api/auth/login/";
      const payload = isOtpLogin
        ? { phone_number: phoneNumber }
        : { email, password };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, {
        withCredentials: true,
      }
      );



      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        debugger;
        //  const token = localStorage.getItem("authToken");
        if (response.data.access) {
          debugger;
          const decoded = jwtDecode(response.data.access);
          let userId = decoded.user_id
          axios
            .get(`${API_BASE_URL}api/auth/user/get_user_data/${userId}/`, {
              headers: {
                Authorization: `Bearer ${response.data.access}`,
              },
            })
            .then((response) => {
              let username = response.data.username;
              let roll_no = response.data.roll;
              let roll = "";

              if (roll_no == 1) {
                roll = "Admin";
              } else if (roll_no == 2) {
                roll = "Dealer";
              } else {
                roll = "Customer";
              }

              // Store in Local Storage
              localStorage.setItem("username", username);
              localStorage.setItem("role", roll);
            })
            .catch((error) => console.error("Error fetching user data:", error));
        }
        navigate("/Dashboard2");
      }
    } catch (error) {
      console.error("Login Failed:", error.response ? error.response.data : error.message);
      Swal.fire({
        title: "Login Failed",
        text: "Login Failed! Please check your credentials.",
        icon: "error",
        confirmButtonText: "Retry",
      });

    }

  };


  return (
    <div className="login-screen" style={{ height: "100vh" }}>
      <div className="container">
        <div className="row justify-content-center align-items-center py-4  shadow d-flex">
          {/* Left Column - Image */}
          <div className="col-md-5">
            <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-1.png`} alt="Login" className="img-fluid" />
          </div>

          {/* Right Column - Login Form */}
          <div className="col-md-5">
            <div className="">
              <h2 className="text-center mb-4 my-5">Sign In</h2>
              <form onSubmit={handleSubmit} className="input-style">
                {/* Toggle between Username/Password and OTP login */}
                {isOtpLogin ? (
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">+91</span>
                      <input
                        type="tel"
                        className="form-control"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="please enter your email"
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3 position-relative">
                      <label className="form-label">Password</label>
                      <div className="input-group password-input">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="btn eye-btn style2 btn-fw"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="d-flex justify-content-between mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label className="form-check-label">Remember Me</label>
                      </div>
                      <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                  </>
                )}

                <button type="submit" className="w-100 btn style2 btn-fw">
                  {isOtpLogin ? "Request OTP" : "Sign In"}
                </button>
              </form>

              {/* Toggle Login Methods */}
              <div className="text-center mt-3">
                <button
                  className="w-100 btn style2 btn-fw w-100 mb-2"
                  onClick={() => setIsOtpLogin(!isOtpLogin)}
                >
                  {isOtpLogin ? "Login with Username & Password" : "Login with OTP"}
                </button>
                {/* <button className="btn btn-danger w-100">Login with Google</button> */}
              </div>

              {/* Sign Up Link */}
              <p className="text-center mt-3">
                Not a member? <Link to="/register">Sign Up</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
