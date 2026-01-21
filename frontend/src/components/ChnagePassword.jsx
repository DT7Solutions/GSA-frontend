import React, { useState, useEffect } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const token = localStorage.getItem("accessToken");

  // Check if user is authenticated on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    setIsAuthenticated(!!accessToken);
  }, []);

  // Handle back button click based on authentication status
  const handleBackClick = () => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to homepage for logged-in users
    } else {
      navigate("/login"); // Redirect to login for non-authenticated users
    }
  };

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
          src={`${process.env.PUBLIC_URL}/assets/img/service/forgot-password-banner-image.jpg`}
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
        <h5 className="overlay-title">Forgot Your Password?</h5>
        <p className="overlay-subtitle">Don't worry, we've got you covered</p>
    </div>

    {/* Features Section */}
    <div className="overlay-features-list">
        <div className="overlay-feature-item">
            <div className="feature-checkmark">✓</div>
            <div className="feature-text">
                <p>Quick & secure password recovery</p>
            </div>
        </div>

        
        <div className="overlay-feature-item">
            <div className="feature-checkmark">✓</div>
            <div className="feature-text">
                <p>24/7 account support</p>
            </div>
        </div>

        <div className="overlay-feature-item">
            <div className="feature-checkmark">✓</div>
            <div className="feature-text">
                <p>Your data is always safe with us</p>
            </div>
        </div>
    </div>

    {/* Footer Section */}
    <div className="overlay-footer">
        <div className="footer-divider"></div>
        <div className="footer-tagline">Trusted Since 1985</div>
        <div className="footer-divider"></div>
    </div>
</div>
        </div>
      </div>

      {/* Right Form */}
      <div className="modern-auth-right">
        <div className="modern-auth-form-wrapper">

          <button className="back-button" onClick={handleBackClick}>
            ← Back to {isAuthenticated ? "home" : "login"}
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
      className="modern-input password-input-field"
      placeholder="Enter new password"
      required
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

<div className="form-group-modern">
  <label>Confirm Password</label>
  <div className="password-input-wrapper">
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="modern-input password-input-field"
      placeholder="Confirm new password"
      required
    />
    {confirmPassword && (
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        tabIndex="-1"
      >
        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    )}
  </div>
</div>
              <button type="submit" className="modern-btn-primary text-center">
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

              <button type="submit" className="modern-btn-primary t">
                Verify & Update Password
              </button>

              <p className="signin-text">
                Didn't receive OTP?{" "}
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
    background: linear-gradient(135deg, hsl(202 100% 32% / 0.9), hsl(202 100% 15% / 0.95));
    backdrop-filter: blur(2px);
    z-index: 2;
}

.overlay-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 40px;
  color: white;
}

/* Logo Section */
.overlay-logo-section {
  text-align: center;
  margin-bottom: 50px;
}

.overlay-logo-container {
  background: white;
  border-radius: 7px;
  padding: 15px;
  display: inline-block;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.overlay-logo-container:hover {
  transform: translateY(-8px) scale(1.02);
}

.overlay-logo {
  width: 120px;
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

/* Features List Section */
.overlay-features-list {
  width: 100%;
  max-width: 500px;
  margin-bottom: 50px;
}

.overlay-feature-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 25px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 4px solid rgba(255, 255, 255, 0.6);
}

.overlay-feature-item:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateX(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-left-color: white;
}

.feature-checkmark {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(219, 230, 223, 0.2);
  border-radius: 50%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.feature-text p {
  font-size: 16px;
  color: white;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
}

/* Footer Section */
.overlay-footer {
  display: flex;
  align-items: center;
  gap: 25px;
  width: 100%;
  max-width: 500px;
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

/* Large screens */
@media (min-width: 1400px) {
  .overlay-content {
    padding: 60px 50px;
  }
  
  .overlay-logo {
    width: 100px;
  }
  
  .overlay-title {
    font-size: 40px;
  }
  
  .overlay-subtitle {
    font-size: 19px;
  }
  
  .overlay-features-list {
    max-width: 550px;
  }
  
  .overlay-feature-item {
    padding: 20px 28px;
    gap: 22px;
  }
  
  .feature-text p {
    font-size: 17px;
  }
  
  .feature-checkmark {
    font-size: 30px;
    width: 40px;
    height: 40px;
  }
}

/* Medium screens (993px to 1199px) */
@media (min-width: 993px) and (max-width: 1199px) {
  .overlay-content {
    padding: 35px 30px;
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
  
  .overlay-logo-section {
    margin-bottom: 35px;
  }

  .overlay-features-list {
    max-width: 420px;
    margin-bottom: 35px;
  }

  .overlay-feature-item {
    padding: 14px 20px;
    gap: 16px;
    margin-bottom: 12px;
  }
  
  .feature-checkmark {
    font-size: 24px;
    width: 32px;
    height: 32px;
  }
  
  .feature-text p {
    font-size: 14px;
  }
  
  .overlay-footer {
    max-width: 420px;
    gap: 20px;
  }
  
  .footer-tagline {
    font-size: 13px;
    letter-spacing: 2px;
  }
}

/* Larger medium screens (1200px to 1399px) */
@media (min-width: 1200px) and (max-width: 1399px) {
  .overlay-content {
    padding: 45px 40px;
  }
  
  .overlay-logo {
    width: 120px;
  }
  
  .overlay-title {
    font-size: 34px;
  }
  
  .overlay-subtitle {
    font-size: 17px;
  }
  
  .overlay-logo-section {
    margin-bottom: 45px;
  }
  
  .overlay-features-list {
    max-width: 480px;
    margin-bottom: 45px;
  }
  
  .overlay-feature-item {
    padding: 16px 24px;
    gap: 18px;
    margin-bottom: 14px;
  }
  
  .feature-checkmark {
    font-size: 26px;
    width: 34px;
    height: 34px;
  }
  
  .feature-text p {
    font-size: 15px;
  }
  
  .footer-tagline {
    font-size: 14px;
  }
}
`}
</style>
    </div>
  );
  
};

export default ForgotPassword;