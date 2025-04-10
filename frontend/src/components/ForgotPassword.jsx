import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}api/auth/forgotpassword/request-password-reset/`, { email }

            );
            Swal.fire("Success", response.data.message, "success");
            setStep(2);
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Your Entered Email Not match Our Records", "error");
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}api/auth/forgotpassword/verify-otp/`, { email, otp });
            debugger;
            Swal.fire("Success", "OTP Verified! Please set a new password.", "success").then(() => {
                setStep(3);
            });
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Invalid OTP", "error");
        }
    };

        // Handle password change
        const handleChangePassword = async (e) => {
            e.preventDefault();
            debugger;
            if (password === confirmPassword) {
                const response = await axios.post(
                    `${API_BASE_URL}api/auth/forgotpassword/forgot_change_password/`, 
                    {  email: email.toLowerCase(), password },  
                );
        
                if (response.data.success) {
                    Swal.fire("Success", "Set a new password.", "success");
                    navigate("/login");
                } else {
                    Swal.fire("Error", response.data.message || "Invalid OTP", "error");
                }
            } else {
                Swal.fire("Error", "Passwords do not match!", "error");
            }
            
        };

    return (
        <div className="login-screen" style={{ height: "100vh" }}>
            <div className="container">
                <div className="row justify-content-center align-items-center shadow d-flex">
                    <div className="col-sm-12 col-md-12 changepassword-logo pt-5">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`} alt="Login" className="img-fluid" />
                    </div>
                    <div className="col-md-6 pb-4">
                        {step === 1 && (
                            <form onSubmit={handleRequestOtp} className="input-style">
                                <h4 className="text-center mb-2">Forgot Password</h4>
                                <div className="mb-3">
                                    <label className="form-label">Enter your Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-100 btn style2 btn-fw mb-5">Request OTP</button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="input-style">
                                <h4 className="text-center mb-2">Enter OTP</h4>
                                <div className="mb-3">
                                    <label className="form-label">OTP</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-100 btn style2 btn-fw mb-5">Verify OTP</button>
                            </form>
                        )}
                        {step === 3 && (
                            <form onSubmit={handleChangePassword} className="input-style">
                                <h4 className="text-center mb-2">Change Password</h4>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
