import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../config";

const BrandModels = ({ id, carMakes }) => {
    const [carModel, setCarModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    useEffect(() => {
        const fetchCarModel = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car-models/${id}/`);
                setCarModels(response.data);
                setFilteredModels(response.data);
                console.log('got car-models payload:', response.data);
            } catch (error) {
                console.error('Error fetching car models:', error);
            }
        };

        fetchCarModel();
    }, [id]);

    // Handle search filter - improved to search combined text
    useEffect(() => {
        const results = carModel.filter((model) => {
            const searchLower = searchTerm.toLowerCase();
            
            // Create a combined string with all searchable fields
            const combinedText = `${model.name || ''} ${model.generation || ''} ${model.production_start_date || ''} ${model.production_end_date || ''}`.toLowerCase();
            
            // Also check individual fields
            const nameMatch = model.name?.toLowerCase().includes(searchLower);
            const generationMatch = model.generation?.toLowerCase().includes(searchLower);
            const startYearMatch = model.production_start_date?.toString().includes(searchLower);
            const endYearMatch = model.production_end_date?.toString().includes(searchLower);
            const combinedMatch = combinedText.includes(searchLower);
            
            return nameMatch || generationMatch || startYearMatch || endYearMatch || combinedMatch;
        });
        setFilteredModels(results);
        setCurrentPage(1); // Reset to first page when search changes
    }, [searchTerm, carModel]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredModels.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredModels.length / itemsPerPage);

    const handleModelSelect = (model) => {
        const updated = {
            brand: carMakes.id,                 // brand ID
            brand_name: carMakes.name,          // brand name
            brand_model: model.id,              // model ID
            brand_model_name: model.name,       // model name
        };
        localStorage.setItem("selected_brand", JSON.stringify(updated));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
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
        <div className="category-area-1 pb-100 brand-logo-display mt-5">
            <div className="container-fluid">
                <div className="row align-items-center mb-5">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 text-center order-2 order-lg-2">
                        <h5 className="search-heading mb-0">
    <span className="heading-muted">Search By</span>
    <span className="heading-brand"> {carMakes.name}</span>
    <span className="heading-muted"> Car Model</span>
  </h5>
                    </div>
                    <div className="col-md-3 order-1 order-lg-3">
                        <div className="car-model-page   gap-2">
                            <div className="position-relative bg-white mb-3 mb-lg-0" style={{ width: "100%", maxWidth: "300px" }}>
                                <input
                                    type="text"
                                    className="form-control ps-5 pe-4 bg-white "
                                    placeholder="Search models..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <span className="position-absolute top-50 translate-middle-y ms-3">
                                    <i className="ri-search-line"></i>
                                </span>
                            </div>
                            {searchTerm && (
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={clearSearch}
                                    title="Clear search"
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results counter */}
                {searchTerm && (
                    <div className="mb-3">
                        <small className="text-muted">
                            Showing {filteredModels.length} of {carModel.length} models
                        </small>
                    </div>
                )}

                <div className="row mt-5 brands-sec">
                    {currentItems.length > 0 ? (
                        currentItems.map((model) => (
                            <div key={model.id} className="col-sm-12 col-md-3 col-lg-3 mb-3">
                                <div className="brand-models">
                                    <Link
                                        to={`/models-variant/${model.id}`}
                                        state={{ carModelItem: model, carMakes }}
                                        onClick={() => handleModelSelect(model)}
                                    >
                                        <img
                                            src={model.image}
                                            alt={model.name}
                                            onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/assets/img/brands/default.png`}
                                        />
                                    </Link>
                                    <div className="text-center">
                                        <Link
                                            to={`/models-variant/${model.id}`}
                                            className="text-center brand-name"
                                            onClick={() => handleModelSelect(model)}
                                        >
                                            {model.name} {model.generation} <br />
                                            ({model.production_start_date}-{model.production_end_date})
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <i className="ri-search-line" style={{ fontSize: "48px", opacity: 0.3 }}></i>
                                <p className="text-muted mt-3">
                                    {searchTerm ? "No models found matching your search." : "No models available."}
                                </p>
                                {searchTerm && (
                                    <button className="btn btn-primary mt-2" onClick={clearSearch}>
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredModels.length > itemsPerPage && (
                    <div className="row mt-4">
                        <div className="col-12">
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={handlePrevious}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="ri-arrow-left-s-line"></i> Previous
                                        </button>
                                    </li>
                                    
                                    {getPageNumbers().map((page, index) => (
                                        <li 
                                            key={index} 
                                            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                                        >
                                            {page === '...' ? (
                                                <span className="page-link">...</span>
                                            ) : (
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                    
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={handleNext}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next <i className="ri-arrow-right-s-line"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                            
                            <div className="text-center mt-2">
                                <small className="text-muted">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredModels.length)} of {filteredModels.length} models
                                </small>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandModels;