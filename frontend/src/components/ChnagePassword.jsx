import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";

const ChangePassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, otp } = location.state || {}; // Get email & OTP from previous screen

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire("Error", "Passwords do not match!", "error");
            return;
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/reset-password/`, { email, otp, password });
            Swal.fire("Success", "Password changed successfully!", "success").then(() => {
                navigate("/login");
            });
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Failed to change password", "error");
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
                        <form onSubmit={handleChangePassword} className="login-form">
                            <h4 className="text-center mb-2">Change Password</h4>

                            {/* New Password Field */}
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
                                        className="btn eye-btn style2 btn-fw"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="mb-3 position-relative">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-group password-input">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn eye-btn style2 btn-fw"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="w-100 btn style2 btn-fw mb-5">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
