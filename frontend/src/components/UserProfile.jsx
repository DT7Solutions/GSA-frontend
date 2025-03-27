import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";


const UserProfile = () => {
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone: "",
        profile_image: "",
        date_of_birth: "",
        pincode: "",
        address: "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

    // Fetch user data
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found!");
            alert("no found token")
            return;
        }

        axios
        .get(`${API_BASE_URL}api/auth/user/profile/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => console.error("Error fetching user data:", error));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
            formData.append(key, userData[key]);
        });

        if (selectedImage) {
            formData.append("profile_image", selectedImage);
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(`${API_BASE_URL}api/auth/user/profile/`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        
            setUserData(response.data);
            Swal.fire({
                title: "Login Success",
                text: "Profile updated successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });

        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <section className='view-profile-sec'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 view-profile">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">User Profile</h5>
                            </div>
                            <div className="card-body">
                                <form className="row gy-3 needs-validation" onSubmit={handleSubmit} noValidate>
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input type="text" name="first_name" className="form-control" value={userData.first_name} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" name="last_name" className="form-control" value={userData.last_name} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Username</label>
                                        <input type="text" name="username" className="form-control" value={userData.username} disabled required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input type="email" name="email" className="form-control" value={userData.email} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input type="text" name="phone" className="form-control" value={userData.phone} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Profile Image</label>
                                        <input className="form-control" type="file" name="profile_image" onChange={handleFileChange} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" name="date_of_birth" className="form-control" value={userData.date_of_birth} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Pincode</label>
                                        <input type="number" name="pincode" className="form-control" value={userData.pincode} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Address</label>
                                        <textarea name="address" className="form-control" value={userData.address} onChange={handleChange} rows="3" required></textarea>
                                    </div>

                                    <div className="col-12">
                                        <button className="btn btn-primary-600" type="submit">Update Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
