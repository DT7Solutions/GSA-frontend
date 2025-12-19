import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import "../assets/css/Auth.css";

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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/login/`, {
        email: email.toLowerCase(),
        password,
      });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("role", response.data.role.toLowerCase());

        const decoded = jwtDecode(response.data.access);
        const userId = decoded.user_id;

        const userResponse = await axios.get(`${API_BASE_URL}api/auth/user/get_user_data/${userId}/`, {
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });

        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
          return;
        }

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
    <div className="modern-auth-container">
      {/* Left Side - Image */}
      <div className="modern-auth-left">
        <img 
          src={`${process.env.PUBLIC_URL}/assets/img/normal/gowrisankaragencies.jpg`}
          alt="Login Illustration" 
          className="auth-side-image"
        />
      </div>
      {/* Right Side - Login Form */}
      <div className="modern-auth-right">
        <div className="modern-auth-form-wrapper">
          {/* Logo */}
          {/* <div className="modern-auth-logo">
            <span className="logo-text">TheCubeFactory</span>
          </div> */}

          {/* Welcome text */}
          <div className="modern-auth-header">
            <h1>Welcome back</h1>
            <p>Please enter your details</p>
          </div>

          {/* Form Fields */}
          <div className="modern-auth-form">
            {isOtpLogin ? (
              <>
                <div className="form-group-modern">
                  <label>Phone Number</label>
                  <div className="phone-input-group">
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
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
                      className="modern-input"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="form-group-modern">
                    <label>Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                      className="modern-input"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-group-modern">
                  <label>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="modern-input"
                  />
                </div>

                <div className="form-group-modern">
                  <label>Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="modern-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-btn"
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember for 30 days</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password
                  </Link>
                </div>
              </>
            )}

            <button
              onClick={isOtpLogin ? (otpSent ? verifyOtp : requestOtp) : handleLogin}
              className="modern-btn-primary"
            >
              {isOtpLogin ? (otpSent ? "Verify OTP" : "Request OTP") : "Sign in"}
            </button>

            <button
              onClick={() => {
                setIsOtpLogin(!isOtpLogin);
                setOtpSent(false);
                setOtp("");
              }}
              className="modern-btn-secondary"
            >
              {isOtpLogin ? "Login with Email & Password" : "Login with OTP"}
            </button>

            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;