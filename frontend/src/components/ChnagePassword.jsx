import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import { jwtDecode } from "jwt-decode";
import "../assets/css/Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = localStorage.getItem("accessToken");

  const sendOTP = async (userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}api/auth/user/send-otp/${userId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStep(2);
      Swal.fire("OTP Sent", "OTP sent to your registered email.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP.", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire("Error", "Authentication token missing.", "error");
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }

    const decoded = jwtDecode(token);
    sendOTP(decoded.user_id);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const decoded = jwtDecode(token);

      const response = await axios.post(
        `${API_BASE_URL}api/auth/user/verify_otp_change_password/`,
        {
          user_id: decoded.user_id,
          otp,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Password changed successfully.", "success");
        localStorage.clear();
        navigate("/login");
      } else {
        Swal.fire("Error", response.data.message || "Invalid OTP.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "OTP verification failed.", "error");
    }
  };

  return (
    <div className="modern-auth-container">
      {/* Left Image */}
      <div className="modern-auth-left">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/normal/gowrisankaragencies.jpg`}
          alt="Forgot Password"
          className="auth-side-image"
        />
      </div>

      {/* Right Form */}
      <div className="modern-auth-right">
        <div className="modern-auth-form-wrapper">

          <button className="back-button" onClick={() => navigate("/login")}>
            ← Back to login
          </button>

          <div className="modern-auth-header">
            <h1>{step === 1 ? "Change Password" : "Verify OTP"}</h1>
            <p>
              {step === 1
                ? "Set a new password for your account"
                : "Enter the OTP sent to your email"}
            </p>
          </div>

          {step === 1 && (
            <form className="modern-auth-form" onSubmit={handleChangePassword}>
              <div className="form-group-modern">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="modern-input"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group-modern">
                <label>Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="modern-input"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="modern-btn-primary">
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="modern-auth-form" onSubmit={handleVerifyOtp}>
              <div className="form-group-modern">
                <label>OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="modern-input"
                  placeholder="Enter OTP"
                  required
                />
              </div>

              <button type="submit" className="modern-btn-primary">
                Verify & Update Password
              </button>

              <p className="signin-text">
                Didn’t receive OTP?{" "}
                <span
                  className="signup-link"
                  onClick={() => setStep(1)}
                  style={{ cursor: "pointer" }}
                >
                  Resend
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
