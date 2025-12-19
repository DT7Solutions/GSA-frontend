import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../assets/css/Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}api/auth/forgotpassword/request-password-reset/`,
        { email: email.toLowerCase() }
      );
      Swal.fire("Success", response.data.message, "success");
      setStep(2);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Email not found.",
        "error"
      );
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}api/auth/forgotpassword/verify-otp/`,
        { email: email.toLowerCase(), otp }
      );
      Swal.fire("Success", "OTP verified successfully.", "success");
      setStep(3);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Invalid OTP.",
        "error"
      );
    }
  };

  // Step 3: Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match.", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}api/auth/forgotpassword/forgot_change_password/`,
        { email: email.toLowerCase(), password }
      );

      if (response.data.success) {
        Swal.fire("Success", "Password reset successfully.", "success");
        navigate("/login");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to reset password.", "error");
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
            <h1>
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Set New Password"}
            </h1>
            <p>
              {step === 1 && "Enter your registered email"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Choose a strong new password"}
            </p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form className="modern-auth-form" onSubmit={handleRequestOtp}>
              <div className="form-group-modern">
                <label>Email Address</label>
                <input
                  type="email"
                  className="modern-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button className="modern-btn-primary" type="submit">
                Request OTP
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form className="modern-auth-form" onSubmit={handleVerifyOtp}>
              <div className="form-group-modern">
                <label>OTP</label>
                <input
                  type="text"
                  className="modern-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button className="modern-btn-primary" type="submit">
                Verify OTP
              </button>

              <p className="signin-text">
                Didn’t receive OTP?{" "}
                <span
                  className="signup-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => setStep(1)}
                >
                  Resend
                </span>
              </p>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form className="modern-auth-form" onSubmit={handleChangePassword}>
              <div className="form-group-modern">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="modern-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    className="modern-input"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button className="modern-btn-primary" type="submit">
                Update Password
              </button>
            </form>
          )}

          <p className="signin-text">
            Remember your password?{" "}
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
