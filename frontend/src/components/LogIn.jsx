import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";

const Login = () => {
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/Dashboard");
    }
  }, [navigate]);

  // Function to handle OTP request
  const requestOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/mobial_otp_request/`, {
        phone_number: phoneNumber,
      });
      
      if (response.data.success) {
        setOtpSent(true);
        Swal.fire({
          title: "OTP Sent",
          text: `An OTP has been sent to your phone number. Your OTP is ${response.data.otp}`,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("OTP Request Failed:", error.response ? error.response.data : error.message);
      
      // Handle specific error cases for OTP
      const errorData = error.response?.data;
      let errorMessage = "Failed to send OTP. Please try again.";
      let errorTitle = "OTP Request Failed";
      
      if (errorData?.error === "account_not_found") {
        errorTitle = "Account Not Found";
        errorMessage = "You don't have an account. Please sign up.";
      } else if (errorData?.error === "account_deactivated") {
        errorTitle = "Account Deactivated";
        errorMessage = "Your account has been deactivated. Please contact the support team.";
      }
      
      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText: errorTitle === "Account Not Found" ? "Sign Up" : "OK",
      }).then((result) => {
        if (result.isConfirmed && errorTitle === "Account Not Found") {
          navigate("/register");
        }
      });
    }
  };

  // Function to handle OTP verification
  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/verify_mobial_otp/`, {
        phone_number: phoneNumber,
        otp: otp,
      });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("OTP Verification Failed:", error.response ? error.response.data : error.message);
      
      const errorData = error.response?.data;
      let errorMessage = "Invalid OTP. Please try again.";
      let errorTitle = "OTP Verification Failed";
      
      if (errorData?.error === "account_not_found") {
        errorTitle = "Account Not Found";
        errorMessage = "You don't have an account. Please sign up.";
      } else if (errorData?.error === "account_deactivated") {
        errorTitle = "Account Deactivated";
        errorMessage = "Your account has been deactivated. Please contact the support team.";
      }
      
      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText: errorTitle === "Account Not Found" ? "Sign Up" : "OK",
      }).then((result) => {
        if (result.isConfirmed && errorTitle === "Account Not Found") {
          navigate("/register");
        }
      });
    }
  };

  // Function to handle username/password login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/login/`, {
        email: email.toLowerCase(),
        password,
      });

      if (response.data.access) {
        // Store tokens and role
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("role", response.data.role.toLowerCase());

        // Decode user ID from JWT token
        const decoded = jwtDecode(response.data.access);
        const userId = decoded.user_id;

        // Get user details using the token
        const userResponse = await axios.get(`${API_BASE_URL}api/auth/user/get_user_data/${userId}/`, {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });

        // Check for a saved redirect URL and go there
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
          return;
        }

        // Role-based default redirection
        const { role_id } = userResponse.data;
        if (role_id === 1) {
          navigate("/Dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login Failed:", error.response ? error.response.data : error.message);
      
      const errorData = error.response?.data;
      let errorMessage = "Incorrect email or password.";
      let errorTitle = "Login Failed";
      let showSignUpButton = false;
      
      // Handle specific error cases
      if (errorData?.error === "account_not_found") {
        errorTitle = "Account Not Found";
        errorMessage = "You don't have an account. Please sign up.";
        showSignUpButton = true;
      } else if (errorData?.error === "account_deactivated") {
        errorTitle = "Account Deactivated";
        errorMessage = "Your account has been deactivated. Please contact the support team.";
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText: showSignUpButton ? "Sign Up" : "OK",
        showCancelButton: showSignUpButton,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed && showSignUpButton) {
          navigate("/register");
        }
      });
    }
  };

  return (
    <div className="login-screen" style={{ height: "111vh" }}>
      <div className="container ">
        <div className="row d-flex justify-content-center align-items-center py-4 shadow">
          <div className="col-md-5">
            <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-1.png`} alt="Login" className="img-fluid" />
          </div>
          <div className="col-md-5">
            <div className="">
              <h4 className="text-center mb-4 my-5">Sign In</h4>
              <form onSubmit={isOtpLogin ? (otpSent ? verifyOtp : requestOtp) : handleLogin} className="input-style">
            
                {isOtpLogin ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text">+91</span>
                        <input
                          type="tel"
                          className="form-control"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              setPhoneNumber(value);
                            }
                          }}
                          placeholder="Enter phone number"
                          required
                          maxLength={10}
                          disabled={otpSent}
                        />
                      </div>
                    </div>

                    {/* OTP Input Field */}
                    {otpSent && (
                      <div className="mb-3">
                        <label className="form-label">Enter OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          required
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                   <div className="mb-3 position-relative input-g">
  <label className="form-label">Password</label>
  <input
    type="password"
    className="form-control"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{ height: "47.5px" }}
  />
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
                  {isOtpLogin ? (otpSent ? "Verify OTP" : "Request OTP") : "Sign In"}
                </button>
              </form>

              {/* Toggle Login Methods */}
              <div className="text-center mt-3">
                <button
                  className="w-100 btn style2 btn-fw w-100 mb-2"
                  onClick={() => {
                    setIsOtpLogin(!isOtpLogin);
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  {isOtpLogin ? "Login with Email & Password" : "Login with OTP"}
                </button>
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