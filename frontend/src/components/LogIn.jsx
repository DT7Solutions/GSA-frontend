import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import "../assets/css/Auth.css";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/Dashboard");
    }
  }, [navigate]);

  // Initialize Google Sign-In
 
 // Initialize Google Sign-In
useEffect(() => {
  const initializeGoogle = () => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: '213344695442-ook0blqsmavr33kqser6i359lpcbvfau.apps.googleusercontent.com', // ✅ Hardcoded as string
          callback: handleGoogleResponse,
        });
        
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );
      } catch (error) {
        console.error("Google initialization error:", error);
      }
    }
  };

  // Load Google script
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = initializeGoogle;
  document.head.appendChild(script);

  return () => {
    // Cleanup
    if (window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript && document.head.contains(existingScript)) {
      document.head.removeChild(existingScript);
    }
  };
}, []);

  // Handle Google Response
// Handle Google Response
const handleGoogleResponse = async (response) => {
  if (!response.credential) {
    console.error("No credential received from Google");
    Swal.fire({
      title: "Error",
      text: "Failed to get Google credentials",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  setGoogleLoading(true);

  try {
    // Send token to backend
    const backendResponse = await axios.post(
      `${API_BASE_URL}api/auth/google_login/`,
      {
        token: response.credential,
      }
    );

    if (backendResponse.data.access) {
      // Store tokens
      localStorage.setItem("accessToken", backendResponse.data.access);
      localStorage.setItem("refreshToken", backendResponse.data.refresh);
      localStorage.setItem(
        "role",
        backendResponse.data.role?.toLowerCase() || ""
      );

      const userId = backendResponse.data.user_id;

      // Fetch user data
      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}api/auth/user/get_user_data/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${backendResponse.data.access}`,
            },
          }
        );

        // Check for redirect
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
          return;
        }

        // Navigate based on role
        const { role_id } = userResponse.data;
        if (role_id === 1) {
          navigate("/Dashboard");
        } else {
          navigate("/");
        }

        // Show success message
        const userName = backendResponse.data.user?.first_name || 
                        backendResponse.data.user?.username || 
                        "User";
        
        Swal.fire({
          title: "Login Successful",
          text: `Welcome ${userName}!`,
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        });
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        // Still navigate to home even if user data fetch fails
        navigate("/");
        
        Swal.fire({
          title: "Login Successful",
          text: "Welcome!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        });
      }
    }
  } catch (error) {
    console.error("Google login error:", error);

    const errorData = error.response?.data;
    let errorMessage = "Google login failed. Please try again.";
    let errorTitle = "Login Failed";

    // Handle specific errors (account_not_found removed - backend auto-creates accounts)
    if (errorData?.error === "account_deactivated") {
      errorTitle = "Account Deactivated";
      errorMessage = "Your account has been deactivated. Please contact support.";
    } else if (errorData?.error === "invalid_token") {
      errorTitle = "Invalid Token";
      errorMessage = "The Google token is invalid. Please try again.";
    } else if (errorData?.error === "email_not_verified") {
      errorTitle = "Email Not Verified";
      errorMessage = "Please verify your email with Google first.";
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    }

    Swal.fire({
      title: errorTitle,
      text: errorMessage,
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    setGoogleLoading(false);
  }
};

  // Request Email OTP
  const requestEmailOtp = async () => {
    if (!email) {
      Swal.fire({
        title: "Error",
        text: "Please enter your email address",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/auth/email_otp_request/`,
        { email: email.toLowerCase() }
      );

      if (response.data.success) {
        setOtpSent(true);
        Swal.fire({
          title: "OTP Sent",
          text: "An OTP has been sent to your email address.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("OTP Request Failed:", error);

      const errorData = error.response?.data;
      let errorMessage = "Failed to send OTP. Please try again.";
      let errorTitle = "OTP Request Failed";

      if (errorData?.error === "account_not_found") {
        errorTitle = "Account Not Found";
        errorMessage = "You don't have an account. Please sign up.";
      } else if (errorData?.error === "account_deactivated") {
        errorTitle = "Account Deactivated";
        errorMessage =
          "Your account has been deactivated. Please contact the support team.";
      }

      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText:
          errorTitle === "Account Not Found" ? "Sign Up" : "OK",
      }).then((result) => {
        if (result.isConfirmed && errorTitle === "Account Not Found") {
          navigate("/register");
        }
      });
    }
  };

  // Verify Email OTP
  const verifyEmailOtp = async () => {
    if (!otp) {
      Swal.fire({
        title: "Error",
        text: "Please enter the OTP",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/auth/verify_email_otp/`,
        {
          email: email.toLowerCase(),
          otp: otp,
        }
      );

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
      console.error("OTP Verification Failed:", error);

      const errorData = error.response?.data;
      let errorMessage = "Invalid OTP. Please try again.";
      let errorTitle = "OTP Verification Failed";

      if (errorData?.error === "account_not_found") {
        errorTitle = "Account Not Found";
        errorMessage = "You don't have an account. Please sign up.";
      } else if (errorData?.error === "account_deactivated") {
        errorTitle = "Account Deactivated";
        errorMessage =
          "Your account has been deactivated. Please contact the support team.";
      }

      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        confirmButtonText:
          errorTitle === "Account Not Found" ? "Sign Up" : "OK",
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

    if (!email || !password) {
      Swal.fire({
        title: "Error",
        text: "Please enter both email and password",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

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
      }
    } catch (error) {
      console.error("Login Failed:", error);

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
        errorMessage =
          "Your account has been deactivated. Please contact the support team.";
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
              <img
                className="bg-white p-2 rounded-md"
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
                  <svg
                    id="fi_7263687"
                    fill="#fff"
                    enable-background="new 0 0 511.99 511.99"
                    height="512"
                    viewBox="0 0 511.99 511.99"
                    width="512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="m281.483 126.082c13.376 4.479 25.213 12.436 34.3 22.903l-.297.016c-5.376.293-10.037 3.335-12.469 8.137-2.432 4.801-2.125 10.358.818 14.863l35.095 53.732c2.782 4.272 7.382 6.755 12.429 6.755.282 0 .565-.008.85-.023 5.376-.295 10.035-3.339 12.456-8.134l6.569-12.96c1.873-3.695.396-8.208-3.299-10.081-3.694-1.874-8.208-.396-10.08 3.298l-6.476 12.774-34.874-53.395 13.841-.759c2.629-.144 4.99-1.657 6.221-3.986 1.229-2.329 1.148-5.132-.215-7.385-11.352-18.763-29.146-32.961-50.115-39.983-1.898-.633-3.437-1.968-4.326-3.752-.895-1.8-1.037-3.842-.404-5.74.636-1.897 1.975-3.435 3.771-4.33 1.795-.894 3.83-1.037 5.727-.401 29.457 9.859 52.481 30.913 64.835 59.282 1.25 2.874 4.147 4.653 7.288 4.495l17.067-.938-6.561 12.962c-1.871 3.696-.392 8.208 3.305 10.079 3.695 1.869 8.208.392 10.078-3.305l6.649-13.136c2.432-4.8 2.129-10.356-.812-14.862-2.939-4.506-7.895-7.019-13.281-6.728l-12.179.67c-14.509-29.9-39.767-52.079-71.627-62.743-5.699-1.909-11.797-1.483-17.18 1.199-5.381 2.681-9.396 7.294-11.308 13-1.899 5.696-1.474 11.794 1.203 17.179 2.686 5.386 7.306 9.398 13.001 11.297z"></path>
                    </g>
                  </svg>
                </div>
                <h4>1000+</h4>
                <span>Products</span>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    fill="#fff"
                    height="513"
                    viewBox="0 0 513 513"
                    width="513"
                    xmlns="http://www.w3.org/2000/svg"
                    id="fi_10867526"
                  >
                    <path d="m488.565 224.623c-3-5-32.61-17.79-32.61-17.79 5.15-2.66 8.67-3.21 8.67-14.21 0-12-.06-16-8.06-16h-27.14c-.11-.24-.23-.49-.34-.74-17.52-38.26-19.87-47.93-46-60.95-35.05-17.43-100.76-18.31-126.52-18.31s-91.47.88-126.49 18.31c-26.16 13-25.51 19.69-45.9996 60.95 0 .11-.21.4-.4.74h-27.17c-7.94 0-8 4-8 16 0 11 3.52 11.55 8.67 14.21 0 0-28.61 13.79-32.61 17.79s-8 32-8 80 4 96 4 96h11.94c0 14 2.06 16 8.06 16h79.9996c6 0 8-2 8-16h256c0 14 2 16 8 16h82c4 0 6-3 6-16h12s4-49 4-96-5-75-8-80zm-362.74 44.94c-18.212 1.991-36.5183 3.013-54.8396 3.06-20.42 0-21.12 1.31-22.56-11.44-.5417-5.836-.3704-11.716.51-17.51l.63-3.05h3c12 0 23.27.51 44.55 6.78 10.8236 3.248 21.0036 8.343 30.0896 15.06 4.36 3.16 5.36 6.16 5.36 6.16zm247.16 72-4.42 11.06h-224s.39-.61-5-11.18c-4-7.82 1-12.82 8.91-15.66 15.32-5.52 60.09-21.16 108.09-21.16s93.66 13.48 108.5 21.16c5.5 2.84 12.33 4.84 7.92 15.84zm-257-136.53c-3.23.186-6.467.21-9.7.07 2.61-4.64 4.06-9.81 6.61-15.21 8-17 17.15-36.24 33.44-44.35 23.54-11.72 72.33-17 110.23-17s86.69 5.24 110.23 17c16.29 8.11 25.4 27.36 33.44 44.35 2.57 5.45 4 10.66 6.68 15.33-2 .11-4.3 0-9.79-.19zm347.72 56.11c-2.14 12.48-.14 11.48-21.56 11.48-18.321-.047-36.627-1.069-54.84-3.06-2.85-.51-3.66-5.32-1.38-7.1 9.041-6.792 19.235-11.894 30.09-15.06 21.28-6.27 33.26-7.11 45.09-6.69.795.03 1.55.354 2.121.907.57.554.916 1.3.969 2.093.566 5.821.401 11.69-.49 17.47z"></path>
                  </svg>
                </div>
                <h4>50+</h4>
                <span>Brands</span>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    height="512pt"
                    fill="#fff"
                    viewBox="0 -16 512 512"
                    width="512pt"
                    xmlns="http://www.w3.org/2000/svg"
                    id="fi_1322236"
                  >
                    <path d="m266 390c0 5.523438-4.476562 10-10 10s-10-4.476562-10-10 4.476562-10 10-10 10 4.476562 10 10zm0 0"></path>
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
              className={`method-tab ${
                loginMethod === "emailOtp" ? "active" : ""
              }`}
              onClick={() => handleMethodSwitch("emailOtp")}
            >
              Email OTP
            </button>
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
                  className="modern-btn-primary text-center"
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
                      className="modern-input password-input-field"
                    />
                    {password && (
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password
                  </Link>
                </div>

                <button onClick={handleLogin} className="modern-btn-primary text-center">
                  Sign in
                </button>
              </>
            )}

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/register" className="signup-link">
                Sign up
              </Link>
            </p>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0",
              gap: "10px",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }}
            ></div>
            <span style={{ color: "#999", fontSize: "14px" }}>
              Or continue with
            </span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#e0e0e0" }}
            ></div>
          </div>
              {/* Google Sign-In Button */}
          <div
            ref={googleButtonRef}
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          ></div>

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
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
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