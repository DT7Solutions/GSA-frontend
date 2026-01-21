import React, { useState, useEffect } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  // Handle back button click
  const handleBackClick = () => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to homepage for all logged-in users
    } else {
      navigate("/login");
    }
  };

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
        
        // If user was authenticated, redirect to homepage, otherwise to login
        if (isAuthenticated) {
          navigate("/");
        } else {
          navigate("/login");
        }
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
                 
                </div>
              </div>

              <button className="modern-btn-primary" type="submit">
                Update Password
              </button>
            </form>
          )}

          {!isAuthenticated && (
            <p className="signin-text pt-3">
              Remember your password?{" "}
              <Link to="/login" className="signin-link">
                Sign in
              </Link>
            </p>
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