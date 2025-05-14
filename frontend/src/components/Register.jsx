import React, { useEffect, useState } from "react";
import { Link,useNavigate  } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import API_BASE_URL from "../config";

const Register =  () => {
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
        debugger;
        const response = await axios.post(`${API_BASE_URL}api/auth/register/`, {
            username,
            email: email.toLowerCase(), 
            phone: phoneNumber,
            password,
            role_id: 2
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
        <div className="mt-3 space-extra-bottom login-screen" style={{ height: "125vh" }}>
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center py-4 shadow ">
                    <div className="col-md-5">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-1.png`} alt="Login" className="img-fluid" />
                    </div>
                    <div className="col-md-5">
                        <div className="">
                            <h2 className="text-center mb-4 my-5">Sign Up</h2>
                            <form onSubmit={handleSubmit} className="input-style">

                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="please enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="please enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="please enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 10) {
                                                setPhoneNumber(value);
                                            }
                                        }}
                                        maxLength={10}
                                        minLength={10}
                                        required
                                    />
                                </div>
                                <div className="mb-3 position-relative">
                                    <label className="form-label">Password</label>
                                    <div className="input-group password-input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="please enter you password"
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
                                            type={showPassword2 ? "text" : "password"}
                                            className="form-control"
                                            placeholder="please enter confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                          
                                            className="btn eye-btn  btn-fw"
                                            onClick={() => setShowPassword2(!showPassword2)}
                                        >
                                            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>


                                <button type="submit" className="w-100 btn style2 btn-fw">
                                    Sign Up
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <p className="text-center mt-3">
                                You are a member? <Link to="/login">Sign in</Link>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;
