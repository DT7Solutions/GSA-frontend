import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import "../assets/css/Auth.css";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTags, FaTruck, FaStar, FaHeadset } from "react-icons/fa";


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if passwords match
  if (phoneNumber.length < 10) {
    Swal.fire({
      title: "Invalid Phone Number",
      text: "Phone number must be exactly 10 digits.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  // 🔐 Password match check
  if (password !== confirmPassword) {
    Swal.fire({
      title: "Error",
      text: "Passwords do not match!",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }


        try {
            const response = await axios.post(`${API_BASE_URL}api/auth/register/`, {
                username,
                email: email.toLowerCase(),
                phone: phoneNumber,
                password,
                role_id: 3
            });

            console.log("Registration Successful:", response.data);
            navigate("/Dashboard");

        } catch (error) {
            console.error("Registration Failed:", error.response ? error.response.data : error.message);

            Swal.fire({
                title: "Registration Failed",
                text: error.response?.data?.message || "Something went wrong. Please try again.",
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    return (
        <div className="modern-auth-container">
            {/* Left Side - Image with Overlay and Content */}
           <div className="modern-auth-left">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/service/register-page-img.webp`}
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
        <h5 className="overlay-title">Join Our Family</h5>
        <p className="overlay-subtitle">Create your account & unlock exclusive benefits</p>
    </div>

    {/* Features Section */}
    <div className="overlay-features">
        <div className="overlay-feature">
            <div className="feature-icon-overlay">
                <FaCheckCircle />
            </div>
            <div>
                <h6>100% Genuine Parts</h6>
                <p>Authentic car spare parts you can trust</p>
            </div>
        </div>

        <div className="overlay-feature">
            <div className="feature-icon-overlay">
                <FaTags />
            </div>
            <div>
                <h6>Best Prices in Guntur</h6>
                <p>Competitive pricing with unmatched quality</p>
            </div>
        </div>

        <div className="overlay-feature">
            <div className="feature-icon-overlay">
                <FaTruck />
            </div>
            <div>
                <h6>Fast & Reliable Delivery</h6>
                <p>Quick delivery right to your doorstep</p>
            </div>
        </div>

       

        <div className="overlay-feature">
            <div className="feature-icon-overlay">
                <FaHeadset />
            </div>
            <div>
                <h6>Expert Support</h6>
                <p>Professional guidance when you need it</p>
            </div>
        </div>
    </div>

    {/* Footer Section */}
    <div className="overlay-footer">
        <div className="footer-divider"></div>
        <div className="footer-tagline">Trusted Since 1985 </div>
        <div className="footer-divider"></div>
    </div>
</div>
        </div>
      </div>

            {/* Right Side - Registration Form */}
            <div className="modern-auth-right">
                <div className="modern-auth-form-wrapper">
                    {/* Logo */}
                    <div className="modern-auth-logo">
                        <div className="logo-cubes">
                            <div className="logo-cube" />
                            <div className="logo-cube" />
                            <div className="logo-cube logo-cube-bottom" />
                            <div className="logo-cube logo-cube-bottom" />
                        </div>
                       
                    </div>

                    {/* Welcome text */}
                    <div className="modern-auth-header">
                        <h1>Create Account</h1>
                        <p>Sign up to get started</p>
                    </div>

                    {/* Form */}
                    <div className="modern-auth-form compact">
                        {/* Username */}
                        <div className="form-group-modern">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                className="modern-input"
                            />
                        </div>

                        {/* Email */}
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

                        {/* Phone Number */}
                        <div className="form-group-modern">
                            <label>Phone Number</label>
                            <div className="phone-input-group">
                                <span className="phone-prefix">+91</span>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) {
                                            setPhoneNumber(value);
                                        }
                                    }}
                                    placeholder="Enter phone number"
                                    maxLength={10}
                                    required
                                    className="modern-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
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

                        {/* Confirm Password */}
                        <div className="form-group-modern">
                            <label>Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    className="modern-input"
                                />
                                
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            onClick={handleSubmit}
                            className="modern-btn-primary"
                        >
                            Sign Up
                        </button>

                        {/* Sign In Link */}
                        <p className="signin-text">
                            Already have an account?{' '}
                            <Link to="/login" className="signin-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
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
  padding: 40px 30px;
  color: white;
}

/* Logo Section */
.overlay-logo-section {
  text-align: center;
  margin-bottom: 35px;
}

.overlay-logo-container {
  background: white;
  border-radius: 10px;
  padding: 5px;
  display: inline-block;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.overlay-logo-container:hover {
  transform: translateY(-8px) scale(1.02);
}

.overlay-logo {
  width: 140px;
  height: auto;
  display: block;
}

.overlay-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.overlay-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Features Section */
.overlay-features {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 0 10px;
}

.overlay-feature {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 18px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.25);
  margin-bottom: 0;
}

.overlay-feature:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon-overlay {
  font-size: 28px;
  flex-shrink: 0;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  color: white;
}

.overlay-feature h6 {
  font-size: 14px !important;
  font-weight: 600;
  margin-bottom: 4px;
  color: white;
  line-height: 1.3;
}

.overlay-feature p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  margin: 0;
}

/* Footer Section */
.overlay-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  padding: 0 20px;
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
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
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
    width: 120px;
  }
  
  .overlay-title {
    font-size: 36px;
  }
  
  .overlay-subtitle {
    font-size: 18px;
  }
  
  .overlay-logo-section {
    margin-bottom: 45px;
  }
  
  .overlay-features {
    gap: 20px;
    padding: 0 20px;
  }
  
  .overlay-feature {
    padding: 18px 22px;
    gap: 18px;
  }
  
  .feature-icon-overlay {
    font-size: 32px;
  }
  
  .overlay-feature h6 {
    font-size: 15px !important;
    margin-bottom: 6px;
  }
  
  .overlay-feature p {
    font-size: 13px;
  }
  
  .footer-tagline {
    font-size: 14px;
  }
}

/* Medium screens (993px to 1199px) */
@media (min-width: 993px) and (max-width: 1199px) {
  .overlay-content {
    padding: 35px 25px;
  }

  .overlay-logo {
    width: 80px;
  }

  .overlay-title {
    font-size: 28px;
  }

  .overlay-subtitle {
    font-size: 15px;
  }
  
  .overlay-logo-section {
    margin-bottom: 30px;
  }

  .overlay-features {
    gap: 12px;
    padding: 0 5px;
  }

  .overlay-feature {
    padding: 12px 14px;
    gap: 12px;
  }
  
  .feature-icon-overlay {
    font-size: 24px;
  }
  
  .overlay-feature h6 {
    font-size: 13px !important;
    margin-bottom: 3px;
  }
  
  .overlay-feature p {
    font-size: 11px;
  }
  
  .overlay-footer {
    gap: 15px;
    padding: 0 10px;
  }
  
  .footer-tagline {
    font-size: 11px;
    letter-spacing: 1.5px;
  }
}

/* Larger medium screens (1200px to 1399px) */
@media (min-width: 1200px) and (max-width: 1399px) {
  .overlay-content {
    padding: 45px 35px;
  }
  
  .overlay-logo {
    width: 145px;
  }
  
  .overlay-title {
    font-size: 33px;
  }
  
  .overlay-subtitle {
    font-size: 17px;
  }
  
  .overlay-logo-section {
    margin-bottom: 38px;
  }
  
  .overlay-features {
    gap: 16px;
    padding: 0 15px;
  }
  
  .overlay-feature {
    padding: 16px 20px;
    gap: 16px;
  }
  
  .feature-icon-overlay {
    font-size: 30px;
  }
  
  .overlay-feature h6 {
    font-size: 14px !important;
    margin-bottom: 5px;
  }
  
  .overlay-feature p {
    font-size: 12px;
  }
  
  .footer-tagline {
    font-size: 13px;
  }
}
`}
</style>
        </div>
    );
};

export default Register;