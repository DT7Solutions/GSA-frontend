import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Step 1: Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/request-password-reset/`, { email });
            Swal.fire("Success", response.data.message, "success");
            setStep(2); // Move to OTP screen
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, { email, otp });
            Swal.fire("Success", "OTP Verified! Please set a new password.", "success").then(() => {
                navigate("/change-password", { state: { email, otp } });
            });
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Invalid OTP", "error");
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
                            <form onSubmit={handleVerifyOtp}>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
