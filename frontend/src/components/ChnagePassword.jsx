import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import { jwtDecode } from "jwt-decode";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const token = localStorage.getItem("accessToken");
    const sendOTP = async (userId) => {
        debugger;
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
        } catch (error) {
            Swal.fire("Error", "fail to send  email", "error");
        }
    };


    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.user_id;  

            if (password === confirmPassword) {
                Swal.fire("Success", "OTP sent to registe email id !.", "success");
                sendOTP(userId); 
            } else {
                Swal.fire("Error", "Passwords do not match!", "error");
            }
        } else {
            Swal.fire("Error", "Authentication token not found!", "error");
        }
    };

    // Step 2: Verify OTP and change passwords 
    const handleVerifyOtp = async (e) => {
 
        e.preventDefault();
        try {
            const decoded = jwtDecode(token);
            let userId = decoded.user_id
            const response = await axios.post(
                `${API_BASE_URL}api/auth/user/verify_otp_change_password/`, 
                { user_id: userId, otp, password },  
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                Swal.fire("Success", "OTP verified! Set a new password.", "success");
                handleLogout()
            } else {
                Swal.fire("Error", response.data.message || "Invalid OTP", "error");
            }
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Invalid OTP", "error");
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        navigate("/login");
      };
    

    return (
        <div className="login-screen" style={{ height: "100vh" }}>
            <div className="container">
                <div className="row justify-content-center align-items-center shadow d-flex">
                    <div className="col-sm-12 col-md-12 changepassword-logo pt-5">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`} alt="Login" className="img-fluid" />
                    </div>
                    <div className="col-md-6 pb-4">
                        {/* Step 1: Enter Email */}

                        {/* Step 3: Reset Password */}
                        {step === 1 && (
                            <form onSubmit={handleChangePassword} className="input-style">
                                <h4 className="text-center mb-2">Change Password</h4>

                                {/* New Password */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label">New Password</label>
                                    <div className="input-group password-input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn eye-btn  btn-fw"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label">Confirm Password</label>
                                    <div className="input-group password-input">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn eye-btn  btn-fw"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="w-100 btn style2 btn-fw mb-5">Change Password</button>
                            </form>
                        )}

                        {/* Step 2: Enter OTP */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="input-style">
                                <h4 className="text-center mb-2">Enter OTP</h4>
                                <p className="text-center">OTP sent to register email id !</p>
                                <div className="mb-3">
                                    <label className="form-label">OTP</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Your OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-100 btn style2 btn-fw mb-5">Verify OTP</button>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
