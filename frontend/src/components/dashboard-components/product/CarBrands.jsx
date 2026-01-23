import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarBrandDisplay = () => {
    const [carbrands, setCarBrandsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    
    // Search and Pagination states
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [carBrandData, setCarBrandData] = useState({
        id: null,
        brandname: "",
        image: null
    });

    const token = localStorage.getItem("accessToken");

    // Fetch car brands
    const fetchCarBrandsList = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarBrandsList(response.data);
        } catch (error) {
            console.error('Error fetching car brands list:', error);
            Swal.fire("Error", "Failed to fetch car brands.", "error");
        }
    };

    useEffect(() => {
        fetchCarBrandsList();
    }, []);

    const handleAddCar = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", carBrandData.brandname);
        
        // Only append image if it's a new file (not null)
        if (carBrandData.image instanceof File) {
            formData.append("image", carBrandData.image);
        }

        try {
            await axios.put(`${API_BASE_URL}api/home/car_makes_update/${carBrandData.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            Swal.fire("Updated!", "Car brand updated successfully.", "success");

            fetchCarBrandsList(); // Refresh list
            setShowModal(false);  // Close modal
            setCarBrandData({ id: null, brandname: "", image: null }); // Reset form
            setIsEdit(false);     // Reset edit mode

        } catch (error) {
            console.error('Error updating car brand:', error);
            Swal.fire("Error", error.response?.data?.message || "Something went wrong while updating.", "error");
        }
    };

    const handleEditClick = (brand) => {
        setIsEdit(true);
        setCarBrandData({ id: brand.id, brandname: brand.name, image: null });
        setShowModal(true);
    };

    const handleAddClick = () => {
        setIsEdit(false);
        setCarBrandData({ id: null, brandname: "", image: null });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setCarBrandData({ id: null, brandname: "", image: null });
    };

    // Filter data based on search term
    const filteredData = carbrands.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="card basic-data-table">
            <div className="card-body">
                {/* Search Bar and Items Per Page */}
                <div className="row mb-3 align-items-center">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2">
                            <span>Show</span>
                            <select 
                                className="form-select" 
                                style={{ width: 'auto' }}
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>entries</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                            <span>Search:</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Car Brands..."
                                style={{ maxWidth: '250px' }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table bordered-table mb-0 sm-table">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Brand Name</th>
                                <th>Brand Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt="part"
                                                    style={{ width: "60px", height: "40px", objectFit: "cover" }}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="btn-theme-admin py-3"
                                                title="Edit"
                                            >
                                                <Icon icon="lucide:edit" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No matching records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Info and Controls */}
                <div className="row mt-3 align-items-center">
                    <div className="col-md-6">
                        <p className="mb-0">
                            Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                            {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                            {searchTerm && ` (filtered from ${carbrands.length} total entries)`}
                        </p>
                    </div>
                    <div className="col-md-6">
                        <nav>
                            <ul className="pagination justify-content-end mb-0 m-2">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <li
                                                key={pageNumber}
                                                className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return (
                                            <li key={pageNumber} className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Modal for Add/Edit */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEdit ? "Update Car Brand" : "Add New Car Brand"}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}>X</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleAddCar} className="input-style">
                                        <div className="mb-3">
                                            <label className="form-label">Car Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={carBrandData.brandname}
                                                onChange={(e) =>
                                                    setCarBrandData({ ...carBrandData, brandname: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Upload Car Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) =>
                                                    setCarBrandData({ ...carBrandData, image: e.target.files[0] })
                                                }
                                                accept="image/*"
                                                required={!isEdit}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary style2">
                                            {isEdit ? "Update Car" : "Save Car"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarBrandDisplay;