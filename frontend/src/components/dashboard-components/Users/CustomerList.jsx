import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import API_BASE_URL from "../../../config";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRole, setSelectedRole] = useState("all");
    const [toggleModal, setToggleModal] = useState({ 
        show: false, 
        customerId: null, 
        customerName: "", 
        isActive: false 
    });
    const [deleteModal, setDeleteModal] = useState({ 
        show: false, 
        customerId: null, 
        customerName: "" 
    });
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(
                `${API_BASE_URL}api/auth/all-users/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCustomers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch customers");
            setLoading(false);
            console.error("Error fetching customers:", err);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const endpoint = toggleModal.isActive 
                ? `${API_BASE_URL}api/auth/customers/${toggleModal.customerId}/deactivate/`
                : `${API_BASE_URL}api/auth/customers/${toggleModal.customerId}/activate/`;
            
            const response = await axios.patch(
                endpoint,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            // Update customer status in the list
            setCustomers(customers.map(c => 
                c.id === toggleModal.customerId 
                    ? { ...c, is_active: !toggleModal.isActive }
                    : c
            ));
            
            setToggleModal({ show: false, customerId: null, customerName: "", isActive: false });
            
            // Show success message
            alert(response.data.message || `Customer ${toggleModal.isActive ? 'deactivated' : 'activated'} successfully`);
        } catch (err) {
            console.error("Error toggling customer status:", err);
            alert(err.response?.data?.error || "Failed to update customer status");
        }
    };

    const handleDeleteCustomer = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.delete(
                `${API_BASE_URL}api/auth/customers/${deleteModal.customerId}/delete/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            // Remove customer from list
            setCustomers(customers.filter(c => c.id !== deleteModal.customerId));
            setDeleteModal({ show: false, customerId: null, customerName: "" });
            
            // Show success message
            alert(response.data.message || "Customer deleted successfully");
        } catch (err) {
            console.error("Error deleting customer:", err);
            alert(err.response?.data?.error || "Failed to delete customer");
        }
    };

    // Filter customers based on search term and role
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch = 
            customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.includes(searchTerm) ||
            customer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.role_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = selectedRole === "all" || customer.role_name?.toLowerCase() === selectedRole.toLowerCase();
        
        return matchesSearch && matchesRole;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getRoleBadgeColor = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'admin':
                return 'text-danger-600 bg-danger-100';
            case 'staff':
                return 'text-warning-600 bg-warning-100';
            case 'customer':
                return 'text-success-600 bg-success-100';
            default:
                return 'text-secondary-600 bg-secondary-100';
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <span className="text-md fw-medium text-secondary-light mb-0">
                            Show
                        </span>
                        <select 
                            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                            value={itemsPerPage}
                            disabled
                        >
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                        <span className="text-secondary-light fw-medium">Entries</span>
                        
                        {/* Role Filter */}
                        <div className="d-flex align-items-center gap-2 ms-3">
                            <span className="text-md fw-medium text-secondary-light mb-0">Role:</span>
                            <select 
                                className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                value={selectedRole}
                                onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>
                    </div>
                    <div className="navbar-search">
                        <Icon icon="ion:search-outline" className="icon" />
                        <input
                            type="text"
                            className="bg-base"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="card-body p-24">
                    <div className="table-responsive scroll-sm">
                        <table className="table bordered-table sm-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">City</th>
                                    <th scope="col">State</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Joined Date</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomers.length > 0 ? (
                                    currentCustomers.map((customer, index) => (
                                        <tr key={customer.id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <div className="w-40-px h-40-px rounded-circle bg-primary-50 d-flex align-items-center justify-content-center">
                                                            <span className="text-primary-600 fw-semibold">
                                                                {customer.username?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <span className="text-md mb-0 fw-medium text-secondary-light">
                                                            {customer.username || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{customer.email || "N/A"}</td>
                                            <td>{customer.phone || "N/A"}</td>
                                            <td>{customer.city || "N/A"}</td>
                                            <td>{customer.state || "N/A"}</td>
                                            <td>
                                                <span className="text-sm" title={customer.address}>
                                                    {customer.address
                                                        ? customer.address.length > 30
                                                            ? `${customer.address.substring(0, 30)}...`
                                                            : customer.address
                                                        : "N/A"}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge text-sm fw-semibold ${getRoleBadgeColor(customer.role_name)} px-20 py-9 radius-4`}
                                                >
                                                    {customer.role_name || "N/A"}
                                                </span>
                                            </td>
                                            <td>
                                                {customer.created_at
                                                    ? new Date(customer.created_at).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td className="text-center">
                                                <span
                                                    className={`badge text-sm fw-semibold ${
                                                        customer.is_active
                                                            ? "text-success-600 bg-success-100"
                                                            : "text-danger-600 bg-danger-100"
                                                    } px-20 py-9 radius-4`}
                                                >
                                                    {customer.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    {customer.is_active ? (
                                                        <button
                                                            type="button"
                                                            className="bg-danger-focus text-danger-600 border border-danger-main px-24 py-4 radius-4 fw-medium text-sm d-flex align-items-center gap-1"
                                                            onClick={() => setToggleModal({
                                                                show: true,
                                                                customerId: customer.id,
                                                                customerName: customer.username,
                                                                isActive: true
                                                            })}
                                                        >
                                                            <Icon icon="mdi:account-off-outline" className="text-lg" />
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="badge text-sm fw-semibold bg-primary-600 px-20 py-9 radius-4 text-white d-flex align-items-center gap-1"
                                                            onClick={() => setToggleModal({
                                                                show: true,
                                                                customerId: customer.id,
                                                                customerName: customer.username,
                                                                isActive: false
                                                            })}
                                                        >
                                                            <Icon icon="mdi:account-check-outline" className="text-lg" />
                                                            Activate
                                                        </button>
                                                    )}
                                                    
                                                    {/* Delete Button - Only show for non-admin users */}
                                                    {customer.role_name?.toLowerCase() !== 'admin' && (
                                                        <button
                                                            type="button"
                                                            className="badge text-sm fw-semibold bg-danger-600 px-20 py-9 radius-4 text-white d-flex align-items-center gap-1"
                                                            onClick={() => setDeleteModal({
                                                                show: true,
                                                                customerId: customer.id,
                                                                customerName: customer.username
                                                            })}
                                                        >
                                                            <Icon icon="mdi:delete-outline" className="text-lg" />
                                                           
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center py-4">
                                            <div className="d-flex flex-column align-items-center gap-2">
                                                <Icon
                                                    icon="solar:users-group-rounded-outline"
                                                    className="text-secondary-light"
                                                    style={{ fontSize: "48px" }}
                                                />
                                                <p className="text-secondary-light mb-0">No customers found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredCustomers.length > itemsPerPage && (
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                            <span className="text-secondary-light">
                                Showing {indexOfFirstItem + 1} to{" "}
                                {Math.min(indexOfLastItem, filteredCustomers.length)} of{" "}
                                {filteredCustomers.length} entries
                            </span>
                            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                <li className="page-item">
                                    <button
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <Icon icon="ep:d-arrow-left" />
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className="page-item">
                                        <button
                                            className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px ${
                                                currentPage === i + 1
                                                    ? "bg-primary-600 text-white"
                                                    : "bg-neutral-200 text-secondary-light"
                                            }`}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button
                                        className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <Icon icon="ep:d-arrow-right" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Status Confirmation Modal */}
            {toggleModal.show && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {toggleModal.isActive ? 'Confirm Deactivation' : 'Confirm Activation'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setToggleModal({ show: false, customerId: null, customerName: "", isActive: false })}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="text-center py-3">
                                        <Icon 
                                            icon={toggleModal.isActive ? "mdi:account-off-outline" : "mdi:account-check-outline"}
                                            className={toggleModal.isActive ? "text-warning mb-3" : "text-success mb-3"}
                                            style={{ fontSize: "64px" }}
                                        />
                                        <h6 className="mb-3">
                                            {toggleModal.isActive 
                                                ? 'Are you sure you want to deactivate this user?' 
                                                : 'Are you sure you want to activate this user?'}
                                        </h6>
                                        <p className="text-secondary-light mb-0">
                                            User: <strong>{toggleModal.customerName}</strong>
                                        </p>
                                        <p className={`text-sm mt-2 ${toggleModal.isActive ? 'text-warning' : 'text-success'}`}>
                                            {toggleModal.isActive 
                                                ? 'This user will not be able to login until reactivated.' 
                                                : 'This user will be able to login again.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setToggleModal({ show: false, customerId: null, customerName: "", isActive: false })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${toggleModal.isActive ? 'btn-warning' : 'btn-success'}`}
                                        onClick={handleToggleStatus}
                                    >
                                        {toggleModal.isActive ? 'Deactivate User' : 'Activate User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setDeleteModal({ show: false, customerId: null, customerName: "" })}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="text-center py-3">
                                        <Icon 
                                            icon="mdi:delete-alert-outline" 
                                            className="text-danger mb-3"
                                            style={{ fontSize: "64px" }}
                                        />
                                        <h6 className="mb-3">Are you sure you want to delete this user?</h6>
                                        <p className="text-secondary-light mb-0">
                                            User: <strong>{deleteModal.customerName}</strong>
                                        </p>
                                        <p className="text-danger text-sm mt-2">
                                            <strong>Warning:</strong> This action cannot be undone. All user data will be permanently deleted.
                                        </p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setDeleteModal({ show: false, customerId: null, customerName: "" })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDeleteCustomer}
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default CustomerList;