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
                  <svg id="fi_4059951" enable-background="new 0 0 512.002 512.002" fill="#fff" height="512" viewBox="0 0 512.002 512.002" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m162.14 512.002h187.733c18.851 0 34.133-15.282 34.133-34.133v-111.505l75.162-20.565c11.04-3.087 18.682-13.138 18.705-24.602v-146.816l4.608-1.289c21.492-6.024 34.031-28.33 28.007-49.822-.971-3.464-2.4-6.783-4.25-9.869l-29.577-49.493-.077.051c-1.082-1.875-2.841-3.264-4.915-3.883l-206.438-58.802c-6.041-1.698-12.434-1.698-18.475 0l-206.421 58.803c-2.071.622-3.826 2.01-4.907 3.883l-.077-.051-29.568 49.493c-11.496 19.132-5.306 43.96 13.826 55.456 3.101 1.863 6.438 3.302 9.922 4.277l4.608 1.289v146.773c.028 11.486 7.703 21.547 18.773 24.61l75.093 20.557v111.505c.001 18.851 15.283 34.133 34.135 34.133zm204.8-34.133c0 9.426-7.641 17.067-17.067 17.067h-187.733c-9.426 0-17.067-7.641-17.067-17.067v-213.333c0-9.426 7.641-17.067 17.067-17.067h187.733c9.426 0 17.067 7.641 17.067 17.067zm93.866-156.672c-.023 3.786-2.539 7.104-6.178 8.149l-70.622 19.319v-84.13c0-18.851-15.282-34.133-34.133-34.133h-85.333v-71.569l22.818 38.042c7.318 12.175 20.483 19.624 34.688 19.627 3.667.004 7.317-.498 10.846-1.493l127.915-35.806v141.994zm32.427-178.347c-2.67 6.758-8.357 11.87-15.36 13.807l-149.589 41.907c-10.124 2.822-20.886-1.462-26.3-10.47l-32.913-54.878 196.267-54.955 26.231 43.904c3.77 6.236 4.387 13.883 1.664 20.642zm-241.826-125.141c2.999-.845 6.174-.845 9.173 0l177.357 50.509-181.931 50.935-181.93-50.935zm-232.627 125.099c-2.713-6.771-2.08-14.425 1.707-20.659l26.163-43.888 196.267 54.955-32.913 54.878c-5.408 9.015-16.176 13.302-26.3 10.47l-149.564-41.907c-7.011-1.948-12.699-7.077-15.36-13.849zm38.639 186.581c-3.668-1.037-6.204-4.38-6.212-8.192v-141.995l127.915 35.84c17.525 4.887 36.156-2.526 45.534-18.116l22.818-38.093v71.569h-85.334c-18.851 0-34.133 15.282-34.133 34.133v84.13z"></path><path d="m207.307 275.569-19.567 19.567-2.5-2.5c-3.39-3.274-8.792-3.18-12.066.209-3.194 3.307-3.194 8.55 0 11.857l8.533 8.533c3.332 3.331 8.734 3.331 12.066 0l25.6-25.6c3.274-3.39 3.18-8.792-.209-12.066-3.308-3.194-8.551-3.194-11.857 0z"></path><path d="m332.806 290.136h-85.333c-4.713 0-8.533 3.821-8.533 8.533s3.821 8.533 8.533 8.533h85.333c4.713 0 8.533-3.82 8.533-8.533s-3.82-8.533-8.533-8.533z"></path><path d="m207.307 326.769-19.567 19.567-2.5-2.5c-3.39-3.274-8.792-3.18-12.066.209-3.194 3.307-3.194 8.55 0 11.857l8.533 8.533c3.332 3.331 8.734 3.331 12.066 0l25.6-25.6c3.274-3.39 3.18-8.792-.209-12.066-3.308-3.194-8.551-3.194-11.857 0z"></path><path d="m332.806 341.336h-85.333c-4.713 0-8.533 3.82-8.533 8.533s3.821 8.533 8.533 8.533h85.333c4.713 0 8.533-3.821 8.533-8.533s-3.82-8.533-8.533-8.533z"></path><path d="m207.307 377.969-19.567 19.567-2.5-2.5c-3.39-3.274-8.792-3.18-12.066.209-3.194 3.307-3.194 8.55 0 11.857l8.533 8.533c3.332 3.331 8.734 3.331 12.066 0l25.6-25.6c3.274-3.39 3.18-8.792-.209-12.066-3.308-3.194-8.551-3.194-11.857 0z"></path><path d="m332.806 392.536h-85.333c-4.713 0-8.533 3.82-8.533 8.533s3.821 8.533 8.533 8.533h85.333c4.713 0 8.533-3.82 8.533-8.533s-3.82-8.533-8.533-8.533z"></path><path d="m207.307 429.169-19.567 19.567-2.5-2.5c-3.39-3.274-8.792-3.18-12.066.209-3.194 3.307-3.194 8.55 0 11.857l8.533 8.533c3.332 3.331 8.734 3.331 12.066 0l25.6-25.6c3.274-3.39 3.18-8.792-.209-12.066-3.308-3.194-8.551-3.194-11.857 0z"></path><path d="m332.806 443.736h-85.333c-4.713 0-8.533 3.821-8.533 8.533s3.821 8.533 8.533 8.533h85.333c4.713 0 8.533-3.82 8.533-8.533s-3.82-8.533-8.533-8.533z"></path></g></svg>
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
                  <svg height="512pt" viewBox="0 -16 512 512" width="512pt" fill="#fff" xmlns="http://www.w3.org/2000/svg" id="fi_1322236"><path d="m266 390c0 5.523438-4.476562 10-10 10s-10-4.476562-10-10 4.476562-10 10-10 10 4.476562 10 10zm0 0"></path><path d="m479 300c0-33.085938-26.914062-60-60-60s-60 26.914062-60 60 26.914062 60 60 60 60-26.914062 60-60zm-60 40c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0"></path><path d="m419 360c-25.199219 0-50.328125 10.460938-67.445312 27.421875-22.53125-29.609375-57.273438-47.421875-95.554688-47.421875-36.660156 0-72.183594 16.726562-95.550781 47.421875-17.121094-16.957031-42.246094-27.421875-67.449219-27.421875-50.410156 0-93 41.214844-93 90v20c0 5.523438 4.476562 10 10 10h492c5.523438 0 10-4.476562 10-10v-20c0-48.785156-42.589844-90-93-90zm-399 90c0-37.945312 33.429688-70 73-70 21.652344 0 43.125 9.59375 56.417969 24.84375-8.789063 16.976562-13.417969 35.898438-13.417969 55.15625h-116zm236-90c55.644531 0 100 45.148438 100 100h-200c0-55.582031 45.261719-100 100-100zm236 100h-116c0-19.257812-4.628906-38.179688-13.417969-55.15625 13.292969-15.25 34.765625-24.84375 56.417969-24.84375 39.570312 0 73 32.054688 73 70zm0 0"></path><path d="m153 300c0-33.085938-26.914062-60-60-60s-60 26.914062-60 60 26.914062 60 60 60 60-26.914062 60-60zm-60 40c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0"></path><path d="m336 260c0-44.113281-35.886719-80-80-80s-80 35.886719-80 80 35.886719 80 80 80 80-35.886719 80-80zm-80 60c-33.085938 0-60-26.914062-60-60s26.914062-60 60-60 60 26.914062 60 60-26.914062 60-60 60zm0 0"></path><path d="m335.140625 58.160156c-1.175781-3.621094-4.304687-6.257812-8.074219-6.804687l-43.132812-6.261719-19.3125-39.484375c-1.675782-3.433594-5.160156-5.609375-8.980469-5.609375s-7.304687 2.175781-8.984375 5.605469l-19.308594 39.488281-43.132812 6.257812c-3.769532.546876-6.898438 3.1875-8.074219 6.808594s-.195313 7.59375 2.53125 10.25l31.234375 30.441406-7.371094 42.988282c-.644531 3.75.898438 7.542968 3.980469 9.777344 3.0625 2.226562 7.140625 2.542968 10.53125.761718l38.59375-20.292968 38.609375 20.292968c3.367188 1.773438 7.449219 1.476563 10.53125-.761718 3.078125-2.238282 4.621094-6.027344 3.976562-9.78125l-7.378906-42.984376 31.230469-30.441406c2.726563-2.65625 3.707031-6.628906 2.53125-10.25zm-51.492187 30.039063c-2.355469 2.296875-3.433594 5.609375-2.875 8.851562l4.839843 28.199219-25.320312-13.3125c-2.914063-1.53125-6.394531-1.53125-9.308594 0l-25.3125 13.3125 4.835937-28.199219c.554688-3.246093-.523437-6.554687-2.878906-8.851562l-20.484375-19.964844 28.300781-4.109375c3.273438-.472656 6.097657-2.535156 7.546876-5.503906l12.648437-25.859375 12.644531 25.859375c1.453125 2.972656 4.277344 5.03125 7.546875 5.503906l28.304688 4.109375zm0 0"></path><path d="m484.609375 133.109375c-1.175781-3.621094-4.304687-6.257813-8.074219-6.804687l-29.222656-4.246094-13.066406-26.484375c-1.683594-3.414063-5.15625-5.574219-8.964844-5.574219 0 0 0 0-.003906 0-3.804688 0-7.28125 2.160156-8.964844 5.574219l-13.074219 26.484375-29.226562 4.246094c-3.765625.546874-6.894531 3.183593-8.070313 6.804687-1.179687 3.621094-.199218 7.59375 2.527344 10.25l21.144531 20.621094-4.992187 29.101562c-.640625 3.75.898437 7.539063 3.980468 9.777344 3.078126 2.238281 7.160157 2.535156 10.527344.765625l26.148438-13.738281 26.140625 13.738281c3.367187 1.769531 7.453125 1.472656 10.53125-.765625 3.078125-2.234375 4.617187-6.027344 3.976562-9.777344l-4.992187-29.101562 21.148437-20.621094c2.726563-2.65625 3.703125-6.628906 2.527344-10.25zm-41.398437 20.222656c-2.359376 2.296875-3.433594 5.605469-2.875 8.847657l2.453124 14.3125-12.855468-6.753907c-2.914063-1.53125-6.394532-1.53125-9.304688 0l-12.867187 6.757813 2.457031-14.316406c.554688-3.242188-.519531-6.550782-2.875-8.847657l-10.40625-10.148437 14.378906-2.085938c3.257813-.472656 6.074219-2.519531 7.53125-5.46875l6.429688-13.027344 6.425781 13.023438c1.457031 2.953125 4.273437 5 7.53125 5.472656l14.378906 2.085938zm0 0"></path><path d="m144.609375 133.109375c-1.175781-3.621094-4.304687-6.257813-8.074219-6.804687l-29.222656-4.246094-13.066406-26.484375c-1.683594-3.414063-5.15625-5.574219-8.964844-5.574219s-7.285156 2.160156-8.96875 5.574219l-13.074219 26.484375-29.226562 4.246094c-3.765625.546874-6.894531 3.183593-8.070313 6.804687-1.179687 3.621094-.199218 7.59375 2.527344 10.25l21.144531 20.621094-4.988281 29.101562c-.644531 3.75.898438 7.539063 3.976562 9.777344 3.078126 2.238281 7.160157 2.535156 10.53125.765625l26.144532-13.738281 26.140625 13.738281c3.390625 1.78125 7.46875 1.460938 10.53125-.765625 3.078125-2.234375 4.621093-6.027344 3.976562-9.777344l-4.992187-29.101562 21.148437-20.621094c2.726563-2.65625 3.703125-6.628906 2.527344-10.25zm-41.402344 20.222656c-2.355469 2.296875-3.429687 5.605469-2.875 8.847657l2.457031 14.3125-12.859374-6.753907c-2.910157-1.53125-6.390626-1.53125-9.300782 0l-12.871094 6.757813 2.457032-14.316406c.558594-3.242188-.519532-6.550782-2.875-8.847657l-10.40625-10.148437 14.382812-2.085938c3.253906-.472656 6.070313-2.519531 7.527344-5.46875l6.429688-13.027344 6.425781 13.023438c1.457031 2.953125 4.273437 5 7.53125 5.472656l14.378906 2.085938zm0 0"></path><path d="m299.820312 393.09375c-4.617187-3.035156-10.816406-1.75-13.847656 2.867188-3.035156 4.613281-1.75 10.8125 2.867188 13.847656 9.246094 6.074218 16.636718 14.542968 21.371094 24.488281 2.367187 4.980469 8.328124 7.109375 13.324218 4.730469 4.988282-2.371094 7.105469-8.339844 4.734375-13.324219-6.304687-13.25-16.144531-24.527344-28.449219-32.609375zm0 0"></path></svg>
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
          <Link to="/" className="back-to-home-link">
            ← Back to Home
          </Link>
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

                <button onClick={handleLogin} className="modern-btn-primary flg text-center">
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
        /* Back to Home Link */
        .back-to-home-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          margin-bottom: 24px;
          transition: color 0.3s ease;
        }

        .back-to-home-link:hover {
          color: #0066cc;
        }

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