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
      {/* Left Side - Image with Overlay */}
      <div className="modern-auth-left">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/normal/gowrisankaragencies.jpg`}
          alt="Forgot Password"
          className="auth-side-image"
        />
        <div className="auth-overlay">
          <div className="overlay-content">
            <div className="overlay-logo-section">
              <div className="overlay-logo-container">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
                  alt="Logo"
                  className="overlay-logo"
                />
              </div>
              <h5 className="overlay-title">Gowrisankar Agencies</h5>
              <p className="overlay-subtitle">Trusted Car Spare Parts Provider</p>
            </div>

            {/* <div className="overlay-features">
              <div className="overlay-feature">
                <div className="feature-icon-overlay">🔒</div>
                <div>
                  <h6>Secure Reset</h6>
                  <p>Your account security is our priority</p>
                </div>
              </div>
              <div className="overlay-feature">
                <div className="feature-icon-overlay">⚡</div>
                <div>
                  <h6>Quick Process</h6>
                  <p>Reset password in 3 simple steps</p>
                </div>
              </div>
              <div className="overlay-feature">
                <div className="feature-icon-overlay">✉️</div>
                <div>
                  <h6>Email Verification</h6>
                  <p>OTP sent to your registered email</p>
                </div>
              </div>
            </div> */}

            {/* <div className="overlay-footer">
              <div className="footer-divider"></div>
              <p className="footer-tagline">Driven By Quality</p>
              <div className="footer-divider"></div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Right Form - UNCHANGED */}
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
                Didn't receive OTP?{" "}
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
      <style>
        {`
        /* Left Side with Image and Overlay */
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

/* Overlay Styling */
.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
  135deg,
  hsl(202 100% 32% / 0.9),
  hsl(202 100% 15% / 0.95)
);

  backdrop-filter: blur(2px);
  z-index: 2;
}

.overlay-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 50px;
  color: white;
}

/* Logo Section */
.overlay-logo-section {
  text-align: center;
  margin-bottom: 50px;
}

.overlay-logo-container {
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: inline-block;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.overlay-logo-container:hover {
  transform: translateY(-8px) scale(1.02);
}

.overlay-logo {
  width: 160px;
  height: auto;
  display: block;
}

.overlay-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.overlay-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Features Section */
.overlay-features {
  width: 100%;
  max-width: 450px;
  margin-bottom: 50px;
}

.overlay-feature {
  display: flex;
  align-items:center;
  gap: 18px;
  padding: 22px 25px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin-bottom: 18px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.overlay-feature:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(12px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon-overlay {
  font-size: 36px;
  flex-shrink: 0;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
}

.overlay-feature h6 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  color: white;
}

.overlay-feature p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

/* Footer Section */
.overlay-footer {
  display: flex;
  align-items: center;
  gap: 25px;
  width: 100%;
  max-width: 450px;
}

.footer-divider {
  flex: 1;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
}

.footer-tagline {
  font-size: 15px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  white-space: nowrap;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 992px) {
  .modern-auth-left {
    display: none;
  }
}

@media (min-width: 993px) and (max-width: 1200px) {
  .overlay-content {
    padding: 40px 30px;
  }

  .overlay-logo {
    width: 130px;
  }

  .overlay-title {
    font-size: 30px;
  }

  .overlay-subtitle {
    font-size: 16px;
  }

  .overlay-features {
    max-width: 380px;
  }

  .overlay-feature {
    padding: 18px 20px;
  }
}`}
      </style>
    </div>
  );
};

export default ForgotPassword;