import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarModelsDisplay = () => {
    const [carbrands, setCarBrandsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [carMakes, setCarMakes] = useState([]);
    
    // Search and Pagination states
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [carModelData, setCarModelData] = useState({
        car: '',
        modelName: '',
        bodyType: '',
        generation: '',
        MproductionStart: '',
        MproductionEnd: '',
        fuelType: '',
        image: null
    });

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchCarBrandsList();
        fetchCarMakes();
    }, []);

    const fetchCarBrandsList = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarBrandsList(response.data);
        } catch (error) {
            console.error('Error fetching car brands list:', error);
        }
    };

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarMakes(response.data);
        } catch (error) {
            console.error('Error fetching car makes:', error);
        }
    };

    const handleEditClick = (item) => {
        setIsEdit(true);
        const selectedMake = carMakes.find(make => make.name.toLowerCase() === item.car_make_name.toLowerCase());
        setCarModelData({
            id: item.id,
            car: selectedMake?.id || "",
            modelName: item.name,
            bodyType: item.body_type,
            generation: item.generation,
            MproductionStart: item.production_start_date,
            MproductionEnd: item.production_end_date,
            fuelType: item.fuel_type?.toLowerCase(),
            image: null
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setCarModelData({
            car: '',
            modelName: '',
            bodyType: '',
            generation: '',
            MproductionStart: '',
            MproductionEnd: '',
            fuelType: '',
            image: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarModelData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setCarModelData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("car", carModelData.car);
        formData.append("name", carModelData.modelName);
        formData.append("body_type", carModelData.bodyType);
        formData.append("generation", carModelData.generation);
        formData.append("production_start_date", carModelData.MproductionStart);
        formData.append("production_end_date", carModelData.MproductionEnd);
        formData.append("fuel_type", carModelData.fuelType);

        if (carModelData.image) {
            formData.append("image", carModelData.image);
        }

        try {
            await axios.put(
                `${API_BASE_URL}api/home/car_models_update/${carModelData.id}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            Swal.fire("Updated!", "Car model updated successfully.", "success");
            fetchCarBrandsList();
            setShowModal(false);
            setCarModelData({
                id: null,
                car: '',
                modelName: '',
                bodyType: '',
                generation: '',
                MproductionStart: '',
                MproductionEnd: '',
                fuelType: '',
                image: null
            });
            setIsEdit(false);

        } catch (error) {
            console.error('Error updating car model:', error);
            Swal.fire("Error", "Something went wrong while updating.", "error");
        }
    };

    // Filter data based on search term
    const filteredData = carbrands.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.car_make_name?.toLowerCase().includes(searchLower) ||
            item.name?.toLowerCase().includes(searchLower) ||
            item.generation?.toLowerCase().includes(searchLower) ||
            item.body_type?.toLowerCase().includes(searchLower) ||
            item.fuel_type?.toLowerCase().includes(searchLower)
        );
    });

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

    // Generate page numbers for mobile pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 3; // Show max 3 page numbers on mobile
        
        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Show current page and neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Inline Styles
    const styles = {
        mobileCard: {
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.3s ease',
            marginBottom: '1rem'
        },
        mobileCardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 15px',
            background: '#f8f9fa',
            borderBottom: '1px solid #e0e0e0'
        },
        mobileCardImage: {
            width: '100%',
            height: '180px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5'
        },
        mobileCardImageImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        mobileCardBody: {
            padding: '15px'
        },
        mobileCardRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '8px 0',
            borderBottom: '1px solid #f0f0f0'
        },
        mobileCardRowLast: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '8px 0',
            borderBottom: 'none'
        },
        mobileCardLabel: {
            fontWeight: 600,
            color: '#555',
            fontSize: '0.9rem',
            minWidth: '100px'
        },
        mobileCardValue: {
            color: '#333',
            fontSize: '0.9rem',
            textAlign: 'right',
            flex: 1,
            wordBreak: 'break-word'
        },
        pageLinkMobile: {
            padding: '6px 12px',
            fontSize: '0.9rem',
            minWidth: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalOverlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            overflowY: 'auto',
            padding: '15px'
        },
        badge: {
            fontSize: '0.85rem',
            padding: '6px 12px'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            fontWeight: '700',
            lineHeight: '1',
            color: '#000',
            opacity: '0.5',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s ease'
        }
    };

    return (
        <div className="card basic-data-table">
            <div className="card-body">
                {/* Search Bar and Items Per Page */}
                <div className="row mb-3 align-items-center g-2">
                    <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span style={{ whiteSpace: 'nowrap' }}>Show</span>
                            <select 
                                className="form-select form-select-sm" 
                                style={{ width: 'auto', minWidth: '70px' }}
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span style={{ whiteSpace: 'nowrap' }}>entries</span>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="d-flex justify-content-md-end align-items-center gap-2">
                            <span style={{ whiteSpace: 'nowrap' }}>Search:</span>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="car model..."
                                style={{ maxWidth: '250px' }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="table-responsive d-none d-lg-block">
                    <table className="table bordered-table mb-0 sm-table">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Model Image</th>
                                <th>Brand Name</th>
                                <th>Model Name</th>
                                <th>Generation</th>
                                <th>Body Type</th>
                                <th>Production (start-end)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt="part"
                                                    style={{ width: "60px", height: "40px", objectFit: "cover" }}
                                                />
                                            )}
                                        </td>
                                        <td>{item.car_make_name}</td>
                                        <td>{item.name}</td>
                                        <td>{item.generation}</td>
                                        <td>{item.body_type}</td>
                                        <td>{item.production_start_date} - {item.production_end_date}</td>
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
                                    <td colSpan="8" className="text-center">No matching records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="d-lg-none">
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div key={item.id} style={styles.mobileCard}>
                                <div style={styles.mobileCardHeader}>
                                    <span className="badge bg-theme-text" style={styles.badge}>
                                        #{indexOfFirstItem + index + 1}
                                    </span>
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className=" btn-theme-admin gap-2"
                                        title="Edit"
                                        style={{ minHeight: '36px' }}
                                    >
                                        <Icon icon="lucide:edit" /> Edit
                                    </button>
                                </div>
                                
                                {item.image && (
                                    <div style={styles.mobileCardImage}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={styles.mobileCardImageImg}
                                        />
                                    </div>
                                )}
                                
                                <div style={styles.mobileCardBody}>
                                    <div style={styles.mobileCardRow}>
                                        <span style={styles.mobileCardLabel}>Brand:</span>
                                        <span style={styles.mobileCardValue}>{item.car_make_name}</span>
                                    </div>
                                    <div style={styles.mobileCardRow}>
                                        <span style={styles.mobileCardLabel}>Model:</span>
                                        <span style={styles.mobileCardValue}>{item.name}</span>
                                    </div>
                                    <div style={styles.mobileCardRow}>
                                        <span style={styles.mobileCardLabel}>Generation:</span>
                                        <span style={styles.mobileCardValue}>{item.generation || 'N/A'}</span>
                                    </div>
                                    <div style={styles.mobileCardRow}>
                                        <span style={styles.mobileCardLabel}>Body Type:</span>
                                        <span style={styles.mobileCardValue}>{item.body_type}</span>
                                    </div>
                                    <div style={styles.mobileCardRowLast}>
                                        <span style={styles.mobileCardLabel}>Production:</span>
                                        <span style={styles.mobileCardValue}>
                                            {item.production_start_date} - {item.production_end_date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted">No matching records found</p>
                        </div>
                    )}
                </div>

                {/* Pagination Info and Controls */}
                <div className="row mt-3 align-items-center g-2">
                    <div className="col-12 col-md-6">
                        <p className="mb-0 small">
                            Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                            {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                            {searchTerm && ` (filtered from ${carbrands.length} total entries)`}
                        </p>
                    </div>
                    <div className="col-12 col-md-6">
                        {/* Desktop Pagination */}
                        <nav className="d-none d-md-block">
                            <ul className="pagination justify-content-md-end mb-0">
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

                        {/* Mobile Pagination */}
                        <nav className="d-md-none">
                            <ul className="pagination justify-content-center mb-0 flex-wrap" style={{ gap: '4px' }}>
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        style={styles.pageLinkMobile}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <Icon icon="lucide:chevron-left" />
                                    </button>
                                </li>
                                
                                {getPageNumbers().map((pageNum, idx) => (
                                    pageNum === '...' ? (
                                        <li key={`ellipsis-${idx}`} className="page-item disabled">
                                            <span className="page-link" style={styles.pageLinkMobile}>...</span>
                                        </li>
                                    ) : (
                                        <li
                                            key={pageNum}
                                            className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                        >
                                            <button
                                                className="page-link"
                                                style={styles.pageLinkMobile}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        </li>
                                    )
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        style={styles.pageLinkMobile}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <Icon icon="lucide:chevron-right" />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div style={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEdit ? "Edit Car Model" : "Add Car Model"}</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={handleCloseModal}
                                        aria-label="Close"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Icon icon="lucide:x" width="20" height="20" />
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Select Car Brand</label>
                                            <select
                                                name="car"
                                                className="form-control"
                                                value={carModelData.car}
                                                onChange={(e) =>
                                                    setCarModelData({ ...carModelData, car: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">-- Select Brand --</option>
                                                {carMakes.map(make => (
                                                    <option key={make.id} value={make.id}>{make.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Model Name</label>
                                            <input
                                                type="text"
                                                name="modelName"
                                                className="form-control"
                                                value={carModelData.modelName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Body Type</label>
                                            <input
                                                type="text"
                                                name="bodyType"
                                                className="form-control"
                                                value={carModelData.bodyType}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Generation</label>
                                            <input
                                                type="text"
                                                name="generation"
                                                className="form-control"
                                                value={carModelData.generation ?? ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* <div className="mb-3">
                                            <label className="form-label">Fuel Type</label>
                                            <select
                                                name="fuelType"
                                                className="form-control"
                                                value={carModelData.fuelType}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">---Select Fuel--</option>
                                                <option value="petrol">Petrol</option>
                                                <option value="diesel">Diesel</option>
                                                <option value="electric">Electric</option>
                                            </select>
                                        </div> */}

                                        <div className="mb-3">
                                            <label className="form-label">Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </div>

                                        <div className="d-flex gap-2 mt-4">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary flex-fill" 
                                                onClick={handleCloseModal}
                                                style={{ minHeight: '44px' }}
                                            >
                                                <Icon icon="lucide:x" className="me-1" />
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-theme-admin flex-fill" 
                                                style={{ minHeight: '44px' }}
                                            >
                                                <Icon icon={isEdit ? "lucide:check" : "lucide:save"} className="me-1" />
                                                {isEdit ? "Update" : "Save"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Inline CSS for additional responsive adjustments */}
            <style>{`
                @media (max-width: 575.98px) {
                    .modal-dialog {
                        margin: 10px;
                    }
                    .col-12.col-md-6 input[type="text"] {
                        max-width: 100% !important;
                        width: 100%;
                    }
                }
                @media (max-width: 991.98px) {
                    .card-body {
                        padding: 15px;
                    }
                }
                .btn-close:hover {
                    opacity: 1 !important;
                }
                .btn-secondary {
                    background-color: #6c757d;
                    border-color: #6c757d;
                    color: #fff;
                }
                .btn-secondary:hover {
                    background-color: #5a6268;
                    border-color: #545b62;
                }
                .modal-header .btn-close {
                    padding: 0.5rem;
                    margin: -0.5rem -0.5rem -0.5rem auto;
                }
            `}</style>
        </div>
    );
};

export default CarModelsDisplay;