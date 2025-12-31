import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import "../assets/css/Auth.css";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email", "phone", "emailOtp"
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

  // Request OTP for phone
  const requestPhoneOtp = async () => {
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

  // Request OTP for email
  const requestEmailOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/email_otp_request/`, {
        email: email.toLowerCase(),
      });
      
      if (response.data.success) {
        setOtpSent(true);
        Swal.fire({
          title: "OTP Sent",
          text: `An OTP has been sent to your email address.`,
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

  // Verify phone OTP
  const verifyPhoneOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/verify_mobial_otp/`, {
        phone_number: phoneNumber,
        otp: otp,
      });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("role", response.data.role?.toLowerCase() || "");

        const userId = response.data.user_id;
        
        try {
          const userResponse = await axios.get(
            `${API_BASE_URL}api/auth/user/get_user_data/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${response.data.access}`,
              },
            }
          );

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
        } catch (userError) {
          console.error("Error fetching user data:", userError);
          navigate("/");
        }
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

  // Verify email OTP
  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/auth/verify_email_otp/`, {
        email: email.toLowerCase(),
        otp: otp,
      });

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("role", response.data.role?.toLowerCase() || "");

        const userId = response.data.user_id;
        
        try {
          const userResponse = await axios.get(
            `${API_BASE_URL}api/auth/user/get_user_data/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${response.data.access}`,
              },
            }
          );

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
        } catch (userError) {
          console.error("Error fetching user data:", userError);
          navigate("/");
        }
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

  // Email & Password Login
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

  const handleMethodSwitch = (method) => {
    setLoginMethod(method);
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="modern-auth-container">
      {/* Left Side - Enhanced Content */}
      <div className="modern-auth-left login-left-content">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/service/register-background-banner-img.jpg`}
          alt="Login"
          className="auth-side-image"
        />
        
        <div className="auth-overlay">
          <div className="login-background-blobs">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>

          <div className="login-left-inner">
            <div className="login-left-logo">
              <img className="bg-white p-2 rounded-md"
                src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
                alt="Gowrisankar Auto Express"
              />
            </div>

            <div className="login-left-hero">
              <h1 className="text-center">Welcome Back!</h1>
              <p className="login-left-tagline text-center">
                Your trusted partner for genuine automotive parts & accessories
              </p>
            </div>

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

            <div className="login-bottom-cta">
              <div className="footer-divider-login"></div>
              <p className="footer-tagline-login">Trusted Since 1985</p>
              <div className="footer-divider-login"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="modern-auth-right">
        <div className="modern-auth-form-wrapper">
          <div className="modern-auth-header">
            <h1>Welcome back</h1>
            <p>Please enter your details</p>
          </div>

          {/* Login Method Tabs */}
          <div className="login-method-tabs text-center">
            <button
              className={`method-tab ${loginMethod === "email" ? "active" : ""}`}
              onClick={() => handleMethodSwitch("email")}
            >
              Email & Password
            </button>
            <button
              className={`method-tab ${loginMethod === "emailOtp" ? "active" : ""}`}
              onClick={() => handleMethodSwitch("emailOtp")}
            >
              Email OTP
            </button>
            {/* <button
              className={`method-tab ${loginMethod === "phone" ? "active" : ""}`}
              onClick={() => handleMethodSwitch("phone")}
            >
              Phone OTP
            </button> */}
          </div>

          <div className="modern-auth-form">
            {/* Email OTP Login */}
            {loginMethod === "emailOtp" && (
              <>
                <div className="form-group-modern">
                  <label>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={otpSent}
                    className="modern-input"
                  />
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

                <button
                  onClick={otpSent ? verifyEmailOtp : requestEmailOtp}
                  className="modern-btn-primary"
                >
                  {otpSent ? "Verify OTP" : "Request OTP"}
                </button>
              </>
            )}
            {/* Email & Password Login */}
            {loginMethod === "email" && (
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

                <button onClick={handleLogin} className="modern-btn-primary">
                  Sign in
                </button>
              </>
            )}

            

            {/* Phone OTP Login */}
            {loginMethod === "phone" && (
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

                <button
                  onClick={otpSent ? verifyPhoneOtp : requestPhoneOtp}
                  className="modern-btn-primary"
                >
                  {otpSent ? "Verify OTP" : "Request OTP"}
                </button>
               
              </>
            )}

            <p className="signup-text">
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* Login Method Tabs */
        .login-method-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background: #f5f5f5;
          padding: 4px;
          border-radius: 10px;
        }

        .method-tab {
          flex: 1;
          padding: 10px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .method-tab.active {
          background: white;
          color: #0066cc;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .method-tab:hover:not(.active) {
          color: #333;
        }

        /* Phone Input Group */
        .phone-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phone-prefix {
          padding: 12px 14px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-weight: 500;
          color: #333;
        }

        .phone-input-group .modern-input {
          flex: 1;
        }

        /* Left Side Styles */
        .modern-auth-left {
          position: relative;
          overflow: hidden;
        }

        .auth-side-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .auth-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, hsl(202 100% 32% / 0.9), hsl(202 100% 15% / 0.95));
          backdrop-filter: blur(2px);
          z-index: 2;
        }

        .login-background-blobs {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0.1;
          top: 0;
          left: 0;
          z-index: 1;
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
          background: rgba(255, 255, 255, 0.3);
          top: -50px;
          left: 50px;
        }

        .blob-2 {
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.2);
          bottom: 100px;
          right: -30px;
          animation-delay: 2s;
        }

        .blob-3 {
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.25);
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
          justify-content: center;
          align-items: center;
          padding: 50px 40px;
        }

        .login-left-logo {
          margin-bottom: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-left-logo img {
          height: 85px;
          width: auto;
          object-fit: contain;
          border-radius: 7px;
        }

        .login-left-hero {
          margin-bottom: 40px;
          max-width: 450px;
          width: 100%;
        }

        .login-left-hero h1 {
          font-size: 38px;
          font-weight: 800;
          color: white;
          margin: 0 0 14px 0;
          letter-spacing: -1px;
          line-height: 1.1;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        }

        .login-left-tagline {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.6;
        }

        .login-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 40px;
          max-width: 480px;
          width: 100%;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          padding: 18px 12px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .feature-icon {
          margin-bottom: 10px;
          color: white;
          display: flex;
          justify-content: center;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
        }

        .feature-icon svg {
          width: 28px;
          height: 28px;
        }

        .feature-card h4 {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin: 6px 0 3px 0;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        }

        .feature-card span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.85);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .login-bottom-cta {
          padding-top: 22px;
          display: flex;
          align-items: center;
          gap: 18px;
          max-width: 480px;
          width: 100%;
        }

        .footer-divider-login {
          flex: 1;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
        }

        .footer-tagline-login {
          font-size: 13px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 2.2px;
          white-space: nowrap;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
          margin: 0;
        }

        @media (max-width: 992px) {
          .modern-auth-left {
            display: none;
          }

          .login-method-tabs {
            flex-direction: column;
          }

          .method-tab {
            width: 100%;
          }
        }

        @media (min-width: 1400px) {
          .login-left-inner {
            padding: 60px 50px;
          }
          
          .login-left-logo img {
            height: 100px;
          }
          
         
    
    .login-left-hero {
      max-width: 460px;
      margin-bottom: 38px;
    }
    
    .login-left-hero h1 {
      font-size: 40px;
    }
    
    .login-left-tagline {
      font-size: 16px;
    }
    
    .login-features-grid {
      gap: 13px;
      margin-bottom: 38px;
      max-width: 500px;
    }
    
    .feature-card {
      padding: 18px 12px;
    }
    
    .feature-icon svg {
      width: 28px;
      height: 28px;
    }
    
    .feature-card h4 {
      font-size: 23px;
    }
    
    .feature-card span {
      font-size: 11px;
    }
    
    .login-bottom-cta {
      max-width: 500px;
    }
    
    .footer-tagline-login {
      font-size: 12px;
      letter-spacing: 2px;
    }
  }
`}</style>
    </div>
  );
};

export default Login;