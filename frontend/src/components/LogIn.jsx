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
      {/* Left Side - Enhanced Content */}
      <div className="modern-auth-left login-left-content">
        {/* Background Blobs */}
        <div className="login-background-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="login-left-inner">
          
          {/* Logo */}
          <div className="login-left-logo ">
            <img className="bg-white p-2 rounded-md"
              src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
              alt="Gowrisankar Auto Express"
            />
          </div>

          {/* Main Heading */}
          <div className="login-left-hero">
            <h1 className="text-center">Welcome Back!</h1>
            <p className="login-left-tagline text-center">
              Your trusted partner for genuine automotive parts & accessories
            </p>
          </div>

          {/* Features Grid */}
          <div className="login-features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 7.732 6.268 14 14 14s14-6.268 14-14S23.732 2 16 2zm0 26c-6.627 0-12-5.373-12-12S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z" fill="currentColor"/>
                  <path d="M13 10h-2v8h8v-2h-6v-6z" fill="currentColor"/>
                </svg>
              </div>
              <h4>1000+</h4>
              <span>Products</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 7.732 6.268 14 14 14s14-6.268 14-14S23.732 2 16 2zm0 26c-6.627 0-12-5.373-12-12S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z" fill="currentColor"/>
                  <path d="M13 10h-2v8h8v-2h-6v-6z" fill="currentColor"/>
                </svg>
              </div>
              <h4>50+</h4>
              <span>Brands</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 7.732 6.268 14 14 14s14-6.268 14-14S23.732 2 16 2zm0 26c-6.627 0-12-5.373-12-12S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z" fill="currentColor"/>
                  <path d="M13 10h-2v8h8v-2h-6v-6z" fill="currentColor"/>
                </svg>
              </div>
              <h4>10K+</h4>
              <span>Customers</span>
            </div>
          </div>

       

          {/* Bottom CTA */}
          <div className="login-bottom-cta">
            <p>New to Gowrisankar Auto Express?</p>
            <Link to="/register" className="explore-link">
              Explore our catalog →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (UNCHANGED) */}
      <div className="modern-auth-right">
        <div className="modern-auth-form-wrapper">
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

      {/* Additional Styles */}
      <style>{`
        .login-background-blobs {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0.15;
          top: 0;
          left: 0;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 8s ease-in-out infinite;
        }

        .blob-1 {
          width: 300px;
          height: 300px;
          background: #667eea;
          top: -50px;
          left: 50px;
        }

        .blob-2 {
          width: 250px;
          height: 250px;
          background: #764ba2;
          bottom: 100px;
          right: -30px;
          animation-delay: 2s;
        }

        .blob-3 {
          width: 200px;
          height: 200px;
          background: #667eea;
          bottom: 50px;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-30px) translateX(20px);
          }
          50% {
            transform: translateY(-60px) translateX(-20px);
          }
          75% {
            transform: translateY(-30px) translateX(20px);
          }
        }

        .login-left-inner {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content:center;
          padding: 60px 40px;
        }

        .login-left-logo {
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-left-logo img {
          height: 100px;
          width: auto;
          object-fit: contain;
        }

        .login-left-hero {
          margin-bottom: 50px;
        }

        .login-left-hero h1 {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
          line-height: 1.1;
        }

        .login-left-tagline {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
          line-height: 1.6;
        }

        .login-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 50px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 24px 16px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-4px);
        }

        .feature-icon {
          margin-bottom: 12px;
          color: #0068a5;
          display: flex;
          justify-content: center;
        }

        .feature-card h4 {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 8px 0 4px 0;
        }

        .feature-card span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-benefits {
          margin-bottom: 40px;
        }

        .login-benefits h5 {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }

        .benefit-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(0, 212, 255, 0.3);
          border-radius: 50%;
          color: #0068a5;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .login-bottom-cta {
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .login-bottom-cta p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 12px 0;
        }

        .explore-link {
          display: inline-block;
          color: #0068a5;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.3s ease;
          position: relative;
        }

        .explore-link:after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #0068a5;
          transition: width 0.3s ease;
        }

        .explore-link:hover:after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .login-left-inner {
            padding: 40px 24px;
          }

          .login-left-hero h1 {
            font-size: 36px;
          }

          .login-features-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .login-benefits {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;