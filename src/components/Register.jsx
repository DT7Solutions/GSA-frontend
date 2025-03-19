import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
    const [isOtpLogin, setIsOtpLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isOtpLogin) {
            console.log("Phone Number:", phoneNumber);
            alert(phoneNumber)
        } else {
            console.log("Username:", username, "Password:", password, "Remember Me:", rememberMe);
            alert(username)
        }
    };
    return (
        <div className="mt-3 space-extra-bottom login-screen ">
            <div className="container">
                <div className="row justify-content-center align-items-center py-4  shadow d-flex">
                    {/* Left Column - Image */}
                    <div className="col-md-5">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-1.png`} alt="Login" className="img-fluid" />
                    </div>

                    {/* Right Column - Login Form */}
                    <div className="col-md-5">
                        <div className="">
                            <h2 className="text-center mb-4 my-5">Sign Up</h2>
                            <form onSubmit={handleSubmit} className="login-form">

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
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="please enter your phone number"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                                            className="btn eye-btn style2 btn-fw"
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
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            placeholder="please enter confirm password"
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
