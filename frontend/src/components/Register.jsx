import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import "../assets/css/Auth.css";

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
            {/* Left Side - Image */}
            <div className="modern-auth-left">
                <img 
                    src={`${process.env.PUBLIC_URL}/assets/img/normal/register-page-form.png`}
                    alt="Register Illustration" 
                    className="auth-side-image"
                />
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
        </div>
    );
};

export default Register;