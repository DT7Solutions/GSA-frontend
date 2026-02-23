import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarModelVariants = () => {
    const token = localStorage.getItem("accessToken");
    const [carVariants, setCarVariants] = useState([]);
    const [carMakes, setCarMakes] = useState([]);
    const [getCarMake, setGetCarBrand] = useState({});
    const [carModels, setCarModels] = useState([]);
    const [carVariantModel, setCarVariantModel] = useState([]);
    const [showCarVariantModal, setShowCarVariantModal] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const TRANSMISSION_CHOICES = [
        { value: "MT", label: "Manual Transmission" },
        { value: "AT", label: "Automatic Transmission" },
        { value: "DCT", label: "Dual Clutch Transmission" },
        { value: "CVT", label: "Continuously Variable Transmission" },
        { value: "AMT", label: "Automated Manual Transmission" },
        { value: "IMT", label: "Intelligent Manual Transmission" },
        { value: "EV", label: "Single Speed (Electric)" },
    ];

    const FUEL_TYPE_CHOICES = [
        { value: "Petrol", label: "Petrol" },
        { value: "Diesel", label: "Diesel" },
        { value: "Electric", label: "Electric" },
        { value: "Hybrid", label: "Hybrid" },
        { value: "CNG", label: "CNG" },
    ];

    const [carVariantData, setCarVariantData] = useState({
        carModel: "",
        name: "",
        productionStart: "",
        productionEnd: "",
        chassisType: "",
        engine: "",
        fuelType: "Diesel",
        transmissionType: "MT",
        description: ""
    });

    // Fetch car variant list
    useEffect(() => {
        fetchCarVariants();
        fetchCarMakes();
        fetchCarModels();
    }, []);

    const fetchCarVariants = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_model_variant_list/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarVariants(response.data);
        } catch (error) {
            console.error("Error fetching car variants:", error);
        }
    };

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarMakes(response.data);
        } catch (error) {
            console.error("Error fetching car makes:", error);
        }
    };

    const fetchCarModels = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarModels(response.data);
        } catch (error) {
            console.error("Error fetching car makes:", error);
        }
    };

    // Fetch a single car model's details using ID
    const fetchCarModelDetails = async (carModels_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-model/${carModels_id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGetCarBrand(response.data);
        } catch (error) {
            console.error("Error fetching car model details:", error);
        }
    };

    const handleEdit = async (variant) => {
        setEditingVariantId(variant.id);
        fetchCarModelDetails(variant.car_model)
        setCarVariantData({
            id: variant.id,
            carModel: variant.car_model,
            name: variant.name,
            productionStart: variant.production_start_date,
            productionEnd: variant.production_end_date,
            chassisType: variant.chassis_type,
            engine: variant.engine,
            fuelType: variant.fuel_type || "Diesel",
            transmissionType: variant.transmission_type || "MT",
            description: variant.description || "",
        });

        setShowCarVariantModal(true);
    };

    const handleCarMakeChange = async (e) => {
        const selectedMakeId = e.target.value;

        // Set selected brand temporarily (optional, if needed)
        setGetCarBrand({ car_make: selectedMakeId });

        // Clear selected model first
        setCarVariantData((prevData) => ({
            ...prevData,
            carModel: "", // Clear previous selection
        }));

        // Fetch models for selected brand
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_model_list/${selectedMakeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCarModels(response.data); 
        } catch (error) {
            console.error("Error fetching car models:", error);
            setCarModels([]); 
        }
    };

    const handleUpdateCarVariant = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}api/home/car_model_varian_update/${editingVariantId}/`, {
                car_model: carVariantData.carModel,
                name: carVariantData.name,
                production_start_date: carVariantData.productionStart,
                production_end_date: carVariantData.productionEnd,
                chassis_type: carVariantData.chassisType,
                engine: carVariantData.engine,
                fuel_type: carVariantData.fuelType,
                transmission_type: carVariantData.transmissionType,
                description: carVariantData.description,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire("Updated!", "Car Variant has been updated.", "success");
            setShowCarVariantModal(false);
            fetchCarVariants();
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    const handleDelete = async () => {

        if (!editingVariantId) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This variant will be marked as deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await axios.patch(
                `${API_BASE_URL}api/home/car-model-variant-update-status/${editingVariantId}/status/`,
                { status: "deleted" },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            await Swal.fire({
                title: "Deleted!",
                text: "Variant marked as deleted.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false
            });

            // Close modal
            setShowCarVariantModal(false);
            setEditingVariantId(null);

            // Remove locally + fix pagination safely
                const deletedId = editingVariantId;

                setCarVariants(prev => {
                    const updated = prev.filter(v => v.id !== deletedId);

                const newFiltered = updated.filter(item =>
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.car_model_name?.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const newTotalPages = Math.max(
                    1,
                    Math.ceil(newFiltered.length / itemsPerPage)
                );

                setCurrentPage(prevPage =>
                    prevPage > newTotalPages ? newTotalPages : prevPage
                );

                return updated;
            });

        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    // Filter variants based on search term
    const filteredVariants = carVariants.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.name?.toLowerCase().includes(searchLower) ||
            item.car_model_name?.toLowerCase().includes(searchLower) ||
            item.engine?.toLowerCase().includes(searchLower) ||
            item.fuel_type?.toLowerCase().includes(searchLower) ||
            item.chassis_type?.toLowerCase().includes(searchLower)
        );
    });

    // Pagination calculations
    const totalPages = Math.max(
        1,
        Math.ceil(filteredVariants.length / itemsPerPage)
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVariants.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [filteredVariants.length, itemsPerPage]);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="card basic-data-table">
            <div className="card-body">
                {/* Search Bar and Items Per Page - Desktop and Mobile */}
                <div className="row mb-3 align-items-center">
                    {/* Show Entries */}
                    <div className="col-md-6 col-12 mb-3 mb-md-0">
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-nowrap">Show</span>
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
                            <span className="text-nowrap">entries</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-md-end align-items-center gap-2">
                            <span className="text-nowrap">Search:</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Car Variants..."
                                style={{ maxWidth: '250px' }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="table-responsive d-none d-lg-block">
                    <table className="table table-striped table-hover align-middle bordered-table mb-0 sm-table">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Model Name</th>
                                <th>Variant Name</th>
                                <th>Region</th>
                                <th>Engine</th>
                                <th>Chassis Type</th>
                                <th>Fuel Type</th>
                                <th>Transmission Type</th>
                                <th>Production (start - end)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.car_model_name}</td>
                                        <td>{item.name}</td>
                                        <td>{item.region}</td>
                                        <td>{item.engine}</td>
                                        <td>{item.chassis_type}</td>
                                        <td>{item.fuel_type}</td>
                                        <td>{item.transmission_type}</td>
                                        <td>{item.production_start_date} - {item.production_end_date}</td>
                                        <td>
                                            <button
                                                className="btn-theme-admin py-3"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Icon icon="lucide:edit" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">
                                        No matching records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="d-lg-none">
                    {currentItems.length > 0 ? (
                        <>
                            {currentItems.map((item, index) => (
                                <div key={item.id} className="card mb-3 shadow-sm border">
                                    <div className="card-body p-3">
                                        {/* Header */}
                                        <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                                            <div>
                                                <h6 className="mb-1 fw-bold text-theme">{item.name}</h6>
                                                <small className="text-muted">{item.car_model_name}</small>
                                            </div>
                                            <span className="badge bg-theme text-white">#{indexOfFirstItem + index + 1}</span>
                                        </div>

                                        {/* Specifications Grid */}
                                        <div className="row g-2 mb-3">
                                            {/* Engine */}
                                            <div className="col-6">
                                                <div className="d-flex align-items-start">
                                                    <Icon icon="mdi:engine-outline" className="text-muted mt-1 me-2 flex-shrink-0" />
                                                    <div>
                                                        <small className="text-muted d-block">Engine</small>
                                                        <span className="text-sm fw-medium">{item.engine}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Fuel Type */}
                                            <div className="col-6">
                                                <div className="d-flex align-items-start">
                                                    <Icon icon="mdi:fuel" className="text-muted mt-1 me-2 flex-shrink-0" />
                                                    <div>
                                                        <small className="text-muted d-block">Fuel</small>
                                                        <span className="text-sm fw-medium">{item.fuel_type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Transmission */}
                                            <div className="col-6">
                                                <div className="d-flex align-items-start">
                                                    <Icon icon="mdi:car-shift-pattern" className="text-muted mt-1 me-2 flex-shrink-0" />
                                                    <div>
                                                        <small className="text-muted d-block">Transmission</small>
                                                        <span className="text-sm fw-medium">{item.transmission_type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chassis */}
                                            <div className="col-6">
                                                <div className="d-flex align-items-start">
                                                    <Icon icon="mdi:car-info" className="text-muted mt-1 me-2 flex-shrink-0" />
                                                    <div>
                                                        <small className="text-muted d-block">Chassis</small>
                                                        <span className="text-sm fw-medium">{item.chassis_type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Region */}
                                            {item.region && (
                                                <div className="col-6">
                                                    <div className="d-flex align-items-start">
                                                        <Icon icon="mdi:map-marker-outline" className="text-muted mt-1 me-2 flex-shrink-0" />
                                                        <div>
                                                            <small className="text-muted d-block">Region</small>
                                                            <span className="text-sm fw-medium">{item.region}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Production Period */}
                                            <div className="col-12">
                                                <div className="d-flex align-items-start">
                                                    <Icon icon="mdi:calendar-range" className="text-muted mt-1 me-2 flex-shrink-0" />
                                                    <div>
                                                        <small className="text-muted d-block">Production Period</small>
                                                        <span className="text-sm fw-medium">
                                                            {item.production_start_date} - {item.production_end_date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-2 border-top">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="btn-theme-admin btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-1"
                                            >
                                                <Icon icon="lucide:edit" />
                                                <span>Edit Variant</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <Icon 
                                icon="mdi:car-off" 
                                className="text-secondary-light" 
                                style={{ fontSize: '64px' }} 
                            />
                            <p className="text-secondary-light mt-3 mb-0">
                                {searchTerm ? "No matching variants found" : "No car variants found"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination Info and Controls - All Screens */}
                {totalPages > 0 && (
                    <div className="row mt-3 align-items-center">
                        <div className="col-md-6 col-12 mb-3 mb-md-0">
                            <p className="mb-0">
                                Showing {filteredVariants.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                                {Math.min(indexOfLastItem, filteredVariants.length)} of {filteredVariants.length} entries
                                {searchTerm && ` (filtered from ${carVariants.length} total entries)`}
                            </p>
                        </div>
                        <div className="col-md-6 col-12">
                            <nav>
                                <ul className="pagination justify-content-md-end justify-content-center mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    
                                    {getPageNumbers().map((page, index) => {
                                        if (page === '...') {
                                            return (
                                                <li key={`ellipsis-${index}`} className="page-item disabled d-none d-sm-block">
                                                    <button className="page-link" disabled>...</button>
                                                </li>
                                            );
                                        }
                                        return (
                                            <li
                                                key={page}
                                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        );
                                    })}

                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal - Mobile Optimized */}
            {showCarVariantModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Car Variant</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowCarVariantModal(false)}
                                ><span className="text-xl">X</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateCarVariant} className="input-style">
                                    {/* Car Brand Selection */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">
                                            Select Car Brand <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={getCarMake.car_make}
                                            onChange={handleCarMakeChange}
                                        >
                                            <option value="">-- Select Car Brand --</option>
                                            {carMakes.map((make) => (
                                                <option key={make.id} value={make.id}>{make.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Car Model Selection */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">
                                            Select Car Model <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={carVariantData.carModel}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, carModel: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">-- Select Car Model --</option>
                                            {carModels.map((model) => (
                                                <option key={model.id} value={model.id}>{model.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Variant Name */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">
                                            Variant Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter variant name"
                                            value={carVariantData.name}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Fuel and Transmission */}
                                    <div className="row mb-3">
                                        <div className="col-md-6 col-12 mb-3 mb-md-0">
                                            <label className="form-label fw-medium">
                                                Fuel Type <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-select"
                                                value={carVariantData.fuelType}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, fuelType: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">-- Select Fuel Type --</option>
                                                {FUEL_TYPE_CHOICES.map((fuel) => (
                                                    <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium">
                                                Transmission Type <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className="form-select"
                                                value={carVariantData.transmissionType}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, transmissionType: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">-- Select Transmission --</option>
                                                {TRANSMISSION_CHOICES.map((trans) => (
                                                    <option key={trans.value} value={trans.value}>{trans.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Production Dates */}
                                    <div className="row mb-3">
                                        <div className="col-md-6 col-12 mb-3 mb-md-0">
                                            <label className="form-label fw-medium">
                                                Production Start <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={carVariantData.productionStart}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, productionStart: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium">
                                                Production End <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={carVariantData.productionEnd}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, productionEnd: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Chassis and Engine */}
                                    <div className="row mb-3">
                                        <div className="col-md-6 col-12 mb-3 mb-md-0">
                                            <label className="form-label fw-medium">
                                                Chassis Type <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter chassis type"
                                                value={carVariantData.chassisType}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, chassisType: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium">
                                                Engine <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter engine type"
                                                value={carVariantData.engine}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, engine: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter description..."
                                            rows="3"
                                            value={carVariantData.description}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, description: e.target.value })
                                            }
                                        ></textarea>
                                    </div>

                                    {/* Submit Button - Desktop */}
                                    <div className="d-none d-sm-block">
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-danger w-50"
                                                onClick={handleDelete}
                                            >
                                                {/* <Icon icon="lucide:trash-2" /> */}
                                                Delete
                                            </button>

                                            <button type="submit" className="btn-theme-admin w-50">
                                                Update
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button - Mobile */}
                                    <div className="d-sm-none">
                                        <button
                                            type="button"
                                            className="btn btn-danger w-100 mb-2"
                                            onClick={handleDelete}
                                        >
                                            Delete Variant
                                        </button>

                                        <button type="submit" className="btn-theme-admin w-100 mb-2">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile & Desktop Responsive Styles */}
            <style jsx>{`
                /* Touch-friendly inputs */
                @media (max-width: 991px) {
                    .btn,
                    .form-control,
                    .form-select {
                        min-height: 44px;
                    }

                    .card-body {
                        padding: 16px !important;
                    }
                }

                @media (max-width: 576px) {
                    .modal-dialog {
                        margin: 0.5rem;
                    }

                    .modal-body {
                        max-height: calc(100vh - 120px);
                        overflow-y: auto;
                    }

                    .modal-header h5 {
                        font-size: 1rem;
                    }

                    .card.shadow-sm {
                        transition: transform 0.2s ease;
                    }

                    .card.shadow-sm:active {
                        transform: scale(0.98);
                    }
                }

                /* Pagination Styles */
                .pagination {
                    flex-wrap: wrap;
                }

                .pagination .page-link {
                    min-width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 2px;
                    border-radius: 4px;
                }

                .pagination .page-item.active .page-link {
                    background-color: var(--bs-primary);
                    border-color: var(--bs-primary);
                    font-weight: 600;
                }

                .pagination .page-item.disabled .page-link {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @media (max-width: 576px) {
                    .pagination .page-link {
                        min-width: 36px;
                        height: 36px;
                        font-size: 0.875rem;
                        padding: 0.375rem 0.5rem;
                    }
                }

                /* Smooth transitions */
                .card.shadow-sm {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default CarModelVariants;