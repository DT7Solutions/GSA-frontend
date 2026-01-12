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
                  <svg id="fi_7263687" fill="#fff" enable-background="new 0 0 511.99 511.99" height="512" viewBox="0 0 511.99 511.99" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m281.483 126.082c13.376 4.479 25.213 12.436 34.3 22.903l-.297.016c-5.376.293-10.037 3.335-12.469 8.137-2.432 4.801-2.125 10.358.818 14.863l35.095 53.732c2.782 4.272 7.382 6.755 12.429 6.755.282 0 .565-.008.85-.023 5.376-.295 10.035-3.339 12.456-8.134l6.569-12.96c1.873-3.695.396-8.208-3.299-10.081-3.694-1.874-8.208-.396-10.08 3.298l-6.476 12.774-34.874-53.395 13.841-.759c2.629-.144 4.99-1.657 6.221-3.986 1.229-2.329 1.148-5.132-.215-7.385-11.352-18.763-29.146-32.961-50.115-39.983-1.898-.633-3.437-1.968-4.326-3.752-.895-1.8-1.037-3.842-.404-5.74.636-1.897 1.975-3.435 3.771-4.33 1.795-.894 3.83-1.037 5.727-.401 29.457 9.859 52.481 30.913 64.835 59.282 1.25 2.874 4.147 4.653 7.288 4.495l17.067-.938-6.561 12.962c-1.871 3.696-.392 8.208 3.305 10.079 3.695 1.869 8.208.392 10.078-3.305l6.649-13.136c2.432-4.8 2.129-10.356-.812-14.862-2.939-4.506-7.895-7.019-13.281-6.728l-12.179.67c-14.509-29.9-39.767-52.079-71.627-62.743-5.699-1.909-11.797-1.483-17.18 1.199-5.381 2.681-9.396 7.294-11.308 13-1.899 5.696-1.474 11.794 1.203 17.179 2.686 5.386 7.306 9.398 13.001 11.297z"></path><path d="m51.584 106.625 6.682 3.859-6.685 3.844c-12.713 7.35-17.082 23.671-9.742 36.381l17.331 30.032c3.561 6.164 9.305 10.574 16.175 12.417 6.875 1.844 14.055.897 20.206-2.661l6.675-3.848v7.691c0 14.684 11.95 26.63 26.64 26.63h34.68c14.684 0 26.63-11.946 26.63-26.63v-7.686l6.656 3.838c6.162 3.562 13.342 4.508 20.215 2.665 6.87-1.842 12.614-6.252 16.176-12.419l17.331-30.033c7.327-12.712 2.963-29.03-9.749-36.388l-6.669-3.834 6.677-3.856c6.158-3.551 10.562-9.293 12.401-16.169 1.838-6.871.892-14.047-2.663-20.208l-17.329-30.021c-3.561-6.164-9.305-10.574-16.175-12.417-6.873-1.843-14.053-.897-20.209 2.661l-6.662 3.843v-7.686c0-14.684-11.946-26.63-26.63-26.63h-34.68c-14.689 0-26.64 11.946-26.64 26.63v7.692l-6.667-3.845c-6.162-3.563-13.341-4.51-20.214-2.665-6.87 1.843-12.614 6.253-16.177 12.42l-1.54 2.67c-2.069 3.588-.838 8.175 2.75 10.244 3.588 2.07 8.174.839 10.244-2.749l1.538-2.667c1.557-2.697 4.068-4.625 7.07-5.431 2.998-.805 6.132-.392 8.827 1.167l7.66 4.418c4.294 2.496 9.615 2.561 13.979.194.148-.074.294-.153.438-.237 4.374-2.561 7.091-7.298 7.091-12.362v-8.85c0-6.413 5.222-11.63 11.64-11.63h34.68c6.413 0 11.63 5.217 11.63 11.63v8.85c0 5.061 2.721 9.797 7.101 12.362.07.041.159.09.246.137 4.395 2.465 9.801 2.433 14.132-.082l7.686-4.434c2.688-1.555 5.82-1.968 8.821-1.163 3.002.806 5.514 2.734 7.07 5.43l17.328 30.019c1.554 2.692 1.967 5.83 1.163 8.834-.802 3-2.721 5.504-5.407 7.053l-7.673 4.432c-4.408 2.549-7.146 7.29-7.146 12.463 0 5.084 2.738 9.825 7.162 12.382l7.651 4.399c5.547 3.21 7.452 10.345 4.25 15.9l-17.328 30.027c-1.557 2.697-4.068 4.625-7.07 5.431-2.999.804-6.132.392-8.829-1.167l-7.701-4.441c-4.362-2.514-9.742-2.538-14.099-.077-.07.038-.14.077-.209.117v-.001c-4.409 2.54-7.147 7.271-7.147 12.349v8.89c0 6.413-5.217 11.63-11.63 11.63h-34.68c-6.418 0-11.64-5.217-11.64-11.63v-8.89c0-5.056-2.725-9.782-7.109-12.333-.136-.079-.273-.153-.414-.224-4.338-2.362-9.645-2.307-13.943.169l-7.708 4.444c-2.688 1.554-5.819 1.967-8.82 1.163-3.002-.805-5.514-2.734-7.069-5.428l-17.333-30.031c-3.207-5.553-1.297-12.684 4.243-15.887l7.697-4.426c4.396-2.552 7.125-7.29 7.125-12.456 0-5.075-2.729-9.813-7.14-12.375l-7.672-4.431c-4.897-2.827-7.052-8.722-5.122-14.016 1.418-3.892-.587-8.196-4.479-9.615-3.894-1.419-8.197.587-9.615 4.478-4.428 12.151.5 25.67 11.717 32.144z"></path><path d="m146.193 159.745c27.166 0 49.268-22.101 49.268-49.267 0-27.157-22.102-49.251-49.268-49.251-27.157 0-49.251 22.094-49.251 49.251 0 27.166 22.094 49.267 49.251 49.267zm0-83.518c18.896 0 34.268 15.365 34.268 34.251 0 18.895-15.372 34.267-34.268 34.267-18.886 0-34.251-15.372-34.251-34.267 0-18.887 15.366-34.251 34.251-34.251z"></path><path d="m485.685 292.406-68.41-47.613c-.014-.01-.03-.015-.044-.024-1.223-.839-2.691-1.32-4.24-1.32h-313.991c-1.549 0-3.016.481-4.24 1.32-.014.009-.03.014-.044.024l-68.41 47.613c-3.4 2.366-4.238 7.041-1.872 10.44 1.458 2.095 3.791 3.216 6.163 3.216 1.479 0 2.972-.436 4.277-1.345l47.485-33.049-16.439 39.933c-2.237 5.436-1.62 11.596 1.65 16.48 3.271 4.884 8.732 7.799 14.61 7.799h9.324v152.56c0 12.985 10.564 23.55 23.55 23.55h30.9c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-30.9c-4.715 0-8.55-3.835-8.55-8.55v-152.56h298.98v152.56c0 4.714-3.835 8.55-8.55 8.55h-215.98c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h215.98c12.985 0 23.55-10.564 23.55-23.55v-152.56h9.324c5.878 0 11.339-2.916 14.61-7.799 3.271-4.884 3.888-11.044 1.65-16.48l-16.439-39.933 47.485 33.049c1.306.909 2.799 1.345 4.277 1.345 2.372 0 4.705-1.122 6.163-3.216 2.369-3.4 1.531-8.074-1.869-10.44zm-53.728 27.327c-.287.428-.947 1.146-2.147 1.146h-347.629c-1.2 0-1.86-.718-2.147-1.146-.286-.428-.699-1.312-.242-2.423l24.232-58.862h303.943l24.232 58.862c.457 1.111.044 1.995-.242 2.423z"></path><path d="m330.702 472.117h53.086c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-53.086c-4.143 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5z"></path><path d="m330.702 447.687h53.086c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-53.086c-4.143 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5z"></path></g></svg>
                </div>
                <h4>1000+</h4>
                <span>Products</span>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                 <svg fill="#fff" height="513" viewBox="0 0 513 513" width="513" xmlns="http://www.w3.org/2000/svg" id="fi_10867526"><path d="m488.565 224.623c-3-5-32.61-17.79-32.61-17.79 5.15-2.66 8.67-3.21 8.67-14.21 0-12-.06-16-8.06-16h-27.14c-.11-.24-.23-.49-.34-.74-17.52-38.26-19.87-47.93-46-60.95-35.05-17.43-100.76-18.31-126.52-18.31s-91.47.88-126.49 18.31c-26.16 13-25.51 19.69-45.9996 60.95 0 .11-.21.4-.4.74h-27.17c-7.94 0-8 4-8 16 0 11 3.52 11.55 8.67 14.21 0 0-28.61 13.79-32.61 17.79s-8 32-8 80 4 96 4 96h11.94c0 14 2.06 16 8.06 16h79.9996c6 0 8-2 8-16h256c0 14 2 16 8 16h82c4 0 6-3 6-16h12s4-49 4-96-5-75-8-80zm-362.74 44.94c-18.212 1.991-36.5183 3.013-54.8396 3.06-20.42 0-21.12 1.31-22.56-11.44-.5417-5.836-.3704-11.716.51-17.51l.63-3.05h3c12 0 23.27.51 44.55 6.78 10.8236 3.248 21.0036 8.343 30.0896 15.06 4.36 3.16 5.36 6.16 5.36 6.16zm247.16 72-4.42 11.06h-224s.39-.61-5-11.18c-4-7.82 1-12.82 8.91-15.66 15.32-5.52 60.09-21.16 108.09-21.16s93.66 13.48 108.5 21.16c5.5 2.84 12.33 4.84 7.92 15.84zm-257-136.53c-3.23.186-6.467.21-9.7.07 2.61-4.64 4.06-9.81 6.61-15.21 8-17 17.15-36.24 33.44-44.35 23.54-11.72 72.33-17 110.23-17s86.69 5.24 110.23 17c16.29 8.11 25.4 27.36 33.44 44.35 2.57 5.45 4 10.66 6.68 15.33-2 .11-4.3 0-9.79-.19zm347.72 56.11c-2.14 12.48-.14 11.48-21.56 11.48-18.321-.047-36.627-1.069-54.84-3.06-2.85-.51-3.66-5.32-1.38-7.1 9.041-6.792 19.235-11.894 30.09-15.06 21.28-6.27 33.26-7.11 45.09-6.69.795.03 1.55.354 2.121.907.57.554.916 1.3.969 2.093.566 5.821.401 11.69-.49 17.47z" ></path></svg>
                </div>
                <h4>50+</h4>
                <span>Brands</span>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                 <svg height="512pt" fill="#fff" viewBox="0 -16 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg" id="fi_1322236"><path d="m266 390c0 5.523438-4.476562 10-10 10s-10-4.476562-10-10 4.476562-10 10-10 10 4.476562 10 10zm0 0"></path><path d="m479 300c0-33.085938-26.914062-60-60-60s-60 26.914062-60 60 26.914062 60 60 60 60-26.914062 60-60zm-60 40c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0"></path><path d="m419 360c-25.199219 0-50.328125 10.460938-67.445312 27.421875-22.53125-29.609375-57.273438-47.421875-95.554688-47.421875-36.660156 0-72.183594 16.726562-95.550781 47.421875-17.121094-16.957031-42.246094-27.421875-67.449219-27.421875-50.410156 0-93 41.214844-93 90v20c0 5.523438 4.476562 10 10 10h492c5.523438 0 10-4.476562 10-10v-20c0-48.785156-42.589844-90-93-90zm-399 90c0-37.945312 33.429688-70 73-70 21.652344 0 43.125 9.59375 56.417969 24.84375-8.789063 16.976562-13.417969 35.898438-13.417969 55.15625h-116zm236-90c55.644531 0 100 45.148438 100 100h-200c0-55.582031 45.261719-100 100-100zm236 100h-116c0-19.257812-4.628906-38.179688-13.417969-55.15625 13.292969-15.25 34.765625-24.84375 56.417969-24.84375 39.570312 0 73 32.054688 73 70zm0 0"></path><path d="m153 300c0-33.085938-26.914062-60-60-60s-60 26.914062-60 60 26.914062 60 60 60 60-26.914062 60-60zm-60 40c-22.054688 0-40-17.945312-40-40s17.945312-40 40-40 40 17.945312 40 40-17.945312 40-40 40zm0 0"></path><path d="m336 260c0-44.113281-35.886719-80-80-80s-80 35.886719-80 80 35.886719 80 80 80 80-35.886719 80-80zm-80 60c-33.085938 0-60-26.914062-60-60s26.914062-60 60-60 60 26.914062 60 60-26.914062 60-60 60zm0 0"></path><path d="m335.140625 58.160156c-1.175781-3.621094-4.304687-6.257812-8.074219-6.804687l-43.132812-6.261719-19.3125-39.484375c-1.675782-3.433594-5.160156-5.609375-8.980469-5.609375s-7.304687 2.175781-8.984375 5.605469l-19.308594 39.488281-43.132812 6.257812c-3.769532.546876-6.898438 3.1875-8.074219 6.808594s-.195313 7.59375 2.53125 10.25l31.234375 30.441406-7.371094 42.988282c-.644531 3.75.898438 7.542968 3.980469 9.777344 3.0625 2.226562 7.140625 2.542968 10.53125.761718l38.59375-20.292968 38.609375 20.292968c3.367188 1.773438 7.449219 1.476563 10.53125-.761718 3.078125-2.238282 4.621094-6.027344 3.976562-9.78125l-7.378906-42.984376 31.230469-30.441406c2.726563-2.65625 3.707031-6.628906 2.53125-10.25zm-51.492187 30.039063c-2.355469 2.296875-3.433594 5.609375-2.875 8.851562l4.839843 28.199219-25.320312-13.3125c-2.914063-1.53125-6.394531-1.53125-9.308594 0l-25.3125 13.3125 4.835937-28.199219c.554688-3.246093-.523437-6.554687-2.878906-8.851562l-20.484375-19.964844 28.300781-4.109375c3.273438-.472656 6.097657-2.535156 7.546876-5.503906l12.648437-25.859375 12.644531 25.859375c1.453125 2.972656 4.277344 5.03125 7.546875 5.503906l28.304688 4.109375zm0 0"></path><path d="m484.609375 133.109375c-1.175781-3.621094-4.304687-6.257813-8.074219-6.804687l-29.222656-4.246094-13.066406-26.484375c-1.683594-3.414063-5.15625-5.574219-8.964844-5.574219 0 0 0 0-.003906 0-3.804688 0-7.28125 2.160156-8.964844 5.574219l-13.074219 26.484375-29.226562 4.246094c-3.765625.546874-6.894531 3.183593-8.070313 6.804687-1.179687 3.621094-.199218 7.59375 2.527344 10.25l21.144531 20.621094-4.992187 29.101562c-.640625 3.75.898437 7.539063 3.980468 9.777344 3.078126 2.238281 7.160157 2.535156 10.527344.765625l26.148438-13.738281 26.140625 13.738281c3.367187 1.769531 7.453125 1.472656 10.53125-.765625 3.078125-2.234375 4.617187-6.027344 3.976562-9.777344l-4.992187-29.101562 21.148437-20.621094c2.726563-2.65625 3.703125-6.628906 2.527344-10.25zm-41.398437 20.222656c-2.359376 2.296875-3.433594 5.605469-2.875 8.847657l2.453124 14.3125-12.855468-6.753907c-2.914063-1.53125-6.394532-1.53125-9.304688 0l-12.867187 6.757813 2.457031-14.316406c.554688-3.242188-.519531-6.550782-2.875-8.847657l-10.40625-10.148437 14.378906-2.085938c3.257813-.472656 6.074219-2.519531 7.53125-5.46875l6.429688-13.027344 6.425781 13.023438c1.457031 2.953125 4.273437 5 7.53125 5.472656l14.378906 2.085938zm0 0"></path><path d="m144.609375 133.109375c-1.175781-3.621094-4.304687-6.257813-8.074219-6.804687l-29.222656-4.246094-13.066406-26.484375c-1.683594-3.414063-5.15625-5.574219-8.964844-5.574219s-7.285156 2.160156-8.96875 5.574219l-13.074219 26.484375-29.226562 4.246094c-3.765625.546874-6.894531 3.183593-8.070313 6.804687-1.179687 3.621094-.199218 7.59375 2.527344 10.25l21.144531 20.621094-4.988281 29.101562c-.644531 3.75.898438 7.539063 3.976562 9.777344 3.078126 2.238281 7.160157 2.535156 10.53125.765625l26.144532-13.738281 26.140625 13.738281c3.390625 1.78125 7.46875 1.460938 10.53125-.765625 3.078125-2.234375 4.621093-6.027344 3.976562-9.777344l-4.992187-29.101562 21.148437-20.621094c2.726563-2.65625 3.703125-6.628906 2.527344-10.25zm-41.402344 20.222656c-2.355469 2.296875-3.429687 5.605469-2.875 8.847657l2.457031 14.3125-12.859374-6.753907c-2.910157-1.53125-6.390626-1.53125-9.300782 0l-12.871094 6.757813 2.457032-14.316406c.558594-3.242188-.519532-6.550782-2.875-8.847657l-10.40625-10.148437 14.382812-2.085938c3.253906-.472656 6.070313-2.519531 7.527344-5.46875l6.429688-13.027344 6.425781 13.023438c1.457031 2.953125 4.273437 5 7.53125 5.472656l14.378906 2.085938zm0 0"></path><path d="m299.820312 393.09375c-4.617187-3.035156-10.816406-1.75-13.847656 2.867188-3.035156 4.613281-1.75 10.8125 2.867188 13.847656 9.246094 6.074218 16.636718 14.542968 21.371094 24.488281 2.367187 4.980469 8.328124 7.109375 13.324218 4.730469 4.988282-2.371094 7.105469-8.339844 4.734375-13.324219-6.304687-13.25-16.144531-24.527344-28.449219-32.609375zm0 0"></path></svg>
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
                    {/* <span>Remember for 30 days</span> */}
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