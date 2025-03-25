import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';

const UserProfile = () => {
    return (
        <section className='view-profile-sec'>
            <div className="container">
                <div className="row ">
                    <div className="col-lg-12 view-profile">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Input Custom Styles</h5>
                            </div>
                            <div className="card-body">
                                <form className="row gy-3 needs-validation" noValidate>
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            required
                                        />
                                        <div className="valid-feedback">Looks good!</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            placeholder="Enter Last Name"
                                            required
                                        />
                                        <div className="valid-feedback">Looks good!</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control"
                                            placeholder="Enter Username"
                                            required
                                        />
                                        <div className="invalid-feedback">Username is required.</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            required
                                        />
                                        <div className="invalid-feedback">Please provide a valid email address.</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <div className="form-mobile-field has-validation">
                                            <select className="form-select" required defaultValue={"IN"}>
                                                <option value="IN">+91 (India)</option>
                                                <option value="US">+1 (USA)</option>
                                                <option value="UK">+44 (UK)</option>
                                                <option value="AU">+61 (Australia)</option>
                                            </select>
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                placeholder="Enter Phone Number"
                                                required
                                            />
                                            <div className="invalid-feedback">Please provide a phone number.</div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Profile Image</label>
                                        <input className="form-control" type="file" name="profile_image" required />
                                        <div className="invalid-feedback">Please choose a profile image.</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            className="form-control"
                                            required
                                        />
                                        <div className="invalid-feedback">Please provide a valid date of birth.</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Pincode</label>
                                        <input
                                            type="number"
                                            name="pincode"
                                            className="form-control"
                                            placeholder="Enter Pincode"
                                            required
                                        />
                                        <div className="invalid-feedback">Please enter a valid pincode.</div>
                                    </div>

                                    <div className="col-md-12">
                                        <label className="form-label">Address</label>
                                        <textarea
                                            name="address"
                                            className="form-control"
                                            placeholder="Enter Address"
                                            rows="3"
                                            required
                                        ></textarea>
                                        <div className="invalid-feedback">Please provide an address.</div>
                                    </div>

                                    <div className="col-12">
                                        <button className="btn btn-primary-600" type="submit">
                                            Submit Form
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