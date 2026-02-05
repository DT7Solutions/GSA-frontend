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
    const [getCarMake, setGetCarBrand] = useState([]);
    const [carModels, setCarModels] = useState([]);
    const [carVariantModel, setCarVariantModel] = useState([]);
    const [showCarVariantModal, setShowCarVariantModal] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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
        fetchCarModelDetails();
    }, []);

    const fetchCarVariants = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_model_varian_list/`, {
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
    const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVariants.slice(indexOfFirstItem, indexOfLastItem);

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
                {/* Mobile Search */}
                <div className="d-lg-none mb-3">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control ps-5"
                            placeholder="Search variants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="position-absolute top-50 translate-middle-y ms-2">
                           
                        </span>
                    </div>
                    {searchTerm && (
                        <small className="text-muted d-block mt-2">
                            Showing {filteredVariants.length} of {carVariants.length} variants
                        </small>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="table-responsive d-none d-lg-block">
                    <table className="table bordered-table mb-0 sm-table">
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
                            {carVariants.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
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
                            ))}
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

                            {/* Mobile Pagination */}
                            {totalPages > 1 && (
                                <div className="mobile-pagination mt-4">
                                    {/* Pagination Info */}
                                    <div className="text-center mb-3">
                                        <small className="text-muted">
                                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredVariants.length)} of {filteredVariants.length} variants
                                        </small>
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                                        {/* Previous Button */}
                                        <button
                                            className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            style={{ minWidth: '44px', minHeight: '44px' }}
                                        >
                                            <Icon icon="mdi:chevron-left" width="20" />
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="d-flex gap-1">
                                            {getPageNumbers().map((page, index) => (
                                                page === '...' ? (
                                                    <span key={`ellipsis-${index}`} className="px-2 d-flex align-items-center">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                        onClick={() => handlePageChange(page)}
                                                        style={{ minWidth: '44px', minHeight: '44px' }}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            ))}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            style={{ minWidth: '44px', minHeight: '44px' }}
                                        >
                                            <Icon icon="mdi:chevron-right" width="20" />
                                        </button>
                                    </div>

                                    {/* Quick Jump (Optional) */}
                                    {totalPages > 5 && (
                                        <div className="text-center mt-3">
                                            <div className="d-inline-flex align-items-center gap-2">
                                                <small className="text-muted">Go to page:</small>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    style={{ width: '70px' }}
                                                    min="1"
                                                    max={totalPages}
                                                    value={currentPage}
                                                    onChange={(e) => {
                                                        const page = parseInt(e.target.value);
                                                        if (page >= 1 && page <= totalPages) {
                                                            handlePageChange(page);
                                                        }
                                                    }}
                                                />
                                                <small className="text-muted">of {totalPages}</small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                >
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
                                        <button type="submit" className="btn-theme-admin w-100">
                                            Update Car Variant
                                        </button>
                                    </div>

                                    {/* Submit Button - Mobile */}
                                    <div className="d-sm-none">
                                        <button type="submit" className="btn-theme-admin w-100 mb-2">
                                            Update Car Variant
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-theme-admin w-100"
                                            onClick={() => setShowCarVariantModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Responsive Styles */}
            <style jsx>{`
                @media (max-width: 991px) {
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

                /* Touch-friendly inputs */
                @media (max-width: 991px) {
                    .btn,
                    .form-control,
                    .form-select {
                        min-height: 44px;
                    }
                }

                /* Search input styling */
                .position-relative input {
                    padding-left: 2.5rem;
                }

                /* Pagination Styles */
                .mobile-pagination .btn-sm {
                    font-size: 0.875rem;
                    padding: 0.5rem;
                }

                .mobile-pagination .btn-primary {
                    background-color: var(--bs-primary);
                    border-color: var(--bs-primary);
                    font-weight: 600;
                }

                .mobile-pagination .btn-outline-secondary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Smooth transitions */
                .card.shadow-sm {
                    transition: all 0.3s ease;
                }

                /* Page number input */
                .mobile-pagination input[type="number"] {
                    text-align: center;
                    min-height: 38px;
                }

                /* Remove number input arrows on mobile */
                .mobile-pagination input[type="number"]::-webkit-inner-spin-button,
                .mobile-pagination input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default CarModelVariants;