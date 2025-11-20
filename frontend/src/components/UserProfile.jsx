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
        city: "",
        state: "",
        district:"",
        address: "",
        pincode: "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch user data
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found!");
            alert("no found token");
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
                // Set initial image preview from existing profile image
                if (response.data.profile_image) {
                    setImagePreview(response.data.profile_image);
                }
            })
            .catch((error) => console.error("Error fetching user data:", error));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Handle file selection with preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                Swal.fire({
                    title: "Invalid File",
                    text: "Please select a valid image file (JPEG, PNG, or GIF)",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                Swal.fire({
                    title: "File Too Large",
                    text: "Image size should be less than 5MB",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }

            setSelectedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(userData.profile_image || null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            Swal.fire("Error", "No access token found!", "error");
            return;
        }

        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
            if (key !== 'profile_image') {
                formData.append(key, userData[key]);
            }
        });

        if (selectedImage) {
            formData.append("profile_image", selectedImage);
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(
                `${API_BASE_URL}api/auth/user/profile/`, 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        
            setUserData(response.data);
            setSelectedImage(null);
            
            // Update preview with new saved image
            if (response.data.profile_image) {
                setImagePreview(response.data.profile_image);
            }

            // Dispatch custom event to notify header to update
            // window.dispatchEvent(new Event('profileUpdated'));
            window.dispatchEvent(new Event('profileUpdated'));


            Swal.fire({
                title: "Profile",
                text: "Profile updated successfully!",
                icon: "success",
                confirmButtonText: "OK",
            });

        } catch (error) {
            Swal.fire({
                title: "Profile",
                text: `Error updating profile: ${error.response?.data?.message || error.message}`,
                icon: "error",
                confirmButtonText: "Retry",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='view-profile-sec'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 view-profile">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">User Profile</h3>
                            </div>
                            <div className="card-body">
                                <form className="row gy-3 needs-validation input-style" onSubmit={handleSubmit} noValidate>
                                    
                                    {/* Profile Image Preview Section */}
                                    <div className="col-12">
                                        <div className="text-center mb-4">
                                            <div className="profile-image-container" style={{ position: 'relative', display: 'inline-block' }}>
                                                {imagePreview ? (
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Profile Preview" 
                                                        style={{
                                                            width: '150px',
                                                            height: '150px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '3px solid #ddd',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                ) : (
                                                    <div 
                                                        style={{
                                                            width: '150px',
                                                            height: '150px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '3px solid #ddd'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '48px', color: '#999' }}>👤</span>
                                                    </div>
                                                )}
                                                
                                                {selectedImage && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0',
                                                            right: '0',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '30px',
                                                            height: '30px',
                                                            cursor: 'pointer',
                                                            fontSize: '18px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                        title="Remove selected image"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                            {selectedImage && (
                                                <p className="text-success mt-2 mb-0">
                                                    <small>✓ New image selected: {selectedImage.name}</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input 
                                            type="text" 
                                            name="first_name" 
                                            className="form-control" 
                                            value={userData.first_name} 
                                            onChange={handleChange}  
                                            placeholder="Enter your first name"
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="last_name" 
                                            className="form-control" 
                                            value={userData.last_name} 
                                            onChange={handleChange} 
                                            placeholder="Enter your last name" 
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Username</label>
                                        <input 
                                            type="text" 
                                            name="username" 
                                            className="form-control" 
                                            value={userData.username} 
                                            disabled 
                                            required 
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="form-control" 
                                            value={userData.email} 
                                            onChange={handleChange} 
                                            disabled  
                                            required 
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            className="form-control"  
                                            value={userData.phone} 
                                            onChange={handleChange} 
                                            disabled 
                                            required 
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Profile Image</label>
                                        <input 
                                            className="form-control" 
                                            type="file" 
                                            name="profile_image" 
                                            onChange={handleFileChange}
                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                        />
                                        <small className="text-muted">Max size: 5MB. Formats: JPG, PNG, GIF</small>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            name="date_of_birth" 
                                            className="form-control" 
                                            value={userData.date_of_birth} 
                                            onChange={handleChange}  
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">D.no & Address</label>
                                        <input 
                                            name="address" 
                                            className="form-control" 
                                            value={userData.address} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Enter your address..." 
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">City</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            className="form-control" 
                                            value={userData.city} 
                                            onChange={handleChange} 
                                            placeholder="Enter your city" 
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">District</label>
                                        <input 
                                            type="text" 
                                            name="district" 
                                            className="form-control" 
                                            value={userData.district} 
                                            onChange={handleChange} 
                                            placeholder="Enter your district"  
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">State</label>
                                        <input 
                                            type="text" 
                                            name="state" 
                                            className="form-control" 
                                            value={userData.state} 
                                            onChange={handleChange} 
                                            placeholder="Enter your state"  
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Pincode</label>
                                        <input 
                                            type="number" 
                                            name="pincode" 
                                            className="form-control" 
                                            value={userData.pincode} 
                                            onChange={handleChange} 
                                            placeholder="Enter your zip/pin code" 
                                        />
                                    </div>

                                    <div className="col-12">
                                        <button 
                                            className="btn btn-primary-600 style2" 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </button>
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