import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import API_BASE_URL from "../../../config";
import MasterLayout from '../MasterLayout';
import { Link } from "react-router-dom";

const StaffList = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form state for adding staff
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        phone: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Fetch staff list
    const fetchStaffList = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_BASE_URL}api/auth/staff/list/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStaffList(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching staff list:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffList();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        
        if (!formData.username) errors.username = 'Username is required';
        if (!formData.phone) errors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
        
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add staff
    const handleAddStaff = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(
                `${API_BASE_URL}api/auth/staff/add/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                alert('Staff member added successfully!');
                setShowAddModal(false);
                setFormData({
                    email: '',
                    username: '',
                    phone: '',
                    password: '',
                    first_name: '',
                    last_name: ''
                });
                fetchStaffList();
            }
        } catch (error) {
            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to add staff member');
            }
            console.error('Error adding staff:', error);
        }
    };

    // Toggle staff status
    const handleToggleStatus = async (staffId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.patch(
                `${API_BASE_URL}api/auth/staff/toggle-status/${staffId}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                alert(response.data.message);
                fetchStaffList();
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update status');
            console.error('Error toggling status:', error);
        }
    };

    // Delete staff
    const handleDeleteStaff = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(
                `${API_BASE_URL}api/auth/staff/delete/${selectedStaff.id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                alert(response.data.message);
                setShowDeleteModal(false);
                setSelectedStaff(null);
                fetchStaffList();
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete staff member');
            console.error('Error deleting staff:', error);
        }
    };

    // Filter staff based on search
    const filteredStaff = staffList.filter(staff =>
        staff.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone?.includes(searchTerm)
    );

    if (loading) {
        return (
            <MasterLayout>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                <h6 className="fw-semibold mb-0">Staff Management</h6>
                <ul className="d-flex align-items-center gap-2">
                    <li className="fw-medium list-none">
                       <Link
  to="/Dashboard"
  className="d-flex align-items-center gap-1 text-primary text-decoration-none"
>
  <Icon icon="solar:home-smile-angle-outline" className="icon text-lg" />
  Dashboard
</Link>
                    </li>
                    <li className="list-none">-</li>
                    <li className="fw-medium list-none">Staff</li>
                </ul>
            </div>

            <div className="card">
                <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="icon-field">
                            <input
                                type="text"
                                className="form-control form-control-sm w-auto"
                                placeholder="Search Staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="icon">
                                <Icon icon="ion:search-outline" />
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-theme-admin  btn-primary-600 btn-sm justify-content-center d-flex align-items-center "
                        onClick={() => setShowAddModal(true)}
                    >
                        <Icon icon="ic:baseline-plus" className="me-1" />
                        Add Staff
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className='bg-theme-table'>
                                <tr>
                                    <th scope="col" className='bg-theme-color'>S.L</th>
                                    <th scope="col" className='bg-theme-color'>Staff Name</th>
                                    <th scope="col" className='bg-theme-color'>Email</th>
                                    <th scope="col" className='bg-theme-color'>Phone</th>
                                    <th scope="col" className='bg-theme-color'>Status</th>
                                    <th scope="col" className='bg-theme-color'>Joined Date</th>
                                    <th scope="col" className="text-center bg-theme-color">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((staff, index) => (
                                        <tr key={staff.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-md mb-0 fw-medium">
                                                            {staff.username}
                                                        </h6>
                                                        {/* {staff.first_name && staff.last_name && (
                                                            <span className="text-sm text-secondary-light">
                                                                {staff.first_name} {staff.last_name}
                                                            </span>
                                                        )} */}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{staff.email}</td>
                                            <td>{staff.phone || 'N/A'}</td>
                                            <td>
                                                <span className={`badge text-sm fw-semibold ${
                                                    staff.is_active 
                                                        ? 'text-success-600 bg-success-100' 
                                                        : 'text-danger-600 bg-danger-100'
                                                } px-20 py-9 radius-4`}>
                                                    {staff.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(staff.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center gap-2 justify-content-center">
                                                   <button
    type="button"
    className={` ${
        staff.is_active 
            ? 'bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm' 
            : 'bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'
    }`}
    onClick={() => handleToggleStatus(staff.id)}
>
    
    {staff.is_active ? 'Deactivate' : 'Activate'}
</button>
                                                    <button
                                                        type="button"
                                                        className=" w-40-px h-40-px text-danger-600  bg-danger-100 remove-btn bg-hover-danger-600 text-hover-white text-md rounded-circle"
                                                        onClick={() => {
                                                            setSelectedStaff(staff);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        title="Delete"
                                                    >
                                                      <i className="ri-delete-bin-6-line text-lg"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <div className="d-flex flex-column align-items-center gap-2">
                                                <Icon icon="mdi:account-off" className="text-secondary-light" style={{ fontSize: '48px' }} />
                                                <p className="text-secondary-light mb-0">No staff members found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Staff Member</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setFormData({
                                            email: '',
                                            username: '',
                                            phone: '',
                                            password: '',
                                            first_name: '',
                                            last_name: ''
                                        });
                                        setFormErrors({});
                                    }}
                                />
                            </div>
                            <form onSubmit={handleAddStaff}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Username <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                placeholder="Enter username"
                                            />
                                            {formErrors.username && (
                                                <div className="invalid-feedback">{formErrors.username}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Email <span className="text-danger">*</span></label>
                                            <input
                                                type="email"
                                                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter email"
                                            />
                                            {formErrors.email && (
                                                <div className="invalid-feedback">{formErrors.email}</div>
                                            )}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Phone <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Enter phone number"
                                                maxLength="10"
                                            />
                                            {formErrors.phone && (
                                                <div className="invalid-feedback">{formErrors.phone}</div>
                                            )}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Password <span className="text-danger">*</span></label>
                                            <input
                                                type="password"
                                                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter password"
                                            />
                                            {formErrors.password && (
                                                <div className="invalid-feedback">{formErrors.password}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn-theme-admin"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setFormData({
                                                email: '',
                                                username: '',
                                                phone: '',
                                                password: '',
                                                first_name: '',
                                                last_name: ''
                                            });
                                            setFormErrors({});
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-theme-admin">
                                        Add Staff
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedStaff && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger-100">
                                <h5 className="modal-title text-danger-600">Confirm Delete</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedStaff(null);
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-3">
                                    <Icon icon="mdi:alert-circle" className="text-danger" style={{ fontSize: '64px' }} />
                                </div>
                                <p className="text-center mb-0">
                                    Are you sure you want to delete staff member <strong>{selectedStaff.username}</strong>?
                                    <br />
                                    <small className="text-danger">This action cannot be undone.</small>
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedStaff(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDeleteStaff}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MasterLayout>
    );
};

export default StaffList;